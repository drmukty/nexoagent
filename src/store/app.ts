'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, ApiError } from '@/lib/client/api';
import type { BetDTO, CommandName, MeDTO, NotificationDTO, Result } from '@/types';

export interface Msg {
  id: string;
  role: 'user' | 'result';
  text?: string;
  result?: Result;
  pending?: boolean;
  command?: CommandName;
  query?: string;
  ts: number;
}
export type PanelName = 'profile' | 'rank' | 'bell' | 'menu' | null;
export interface Toast { id: string; text: string; tone: 'info' | 'error' | 'success' }

interface State {
  booted: boolean;
  me: MeDTO | null;
  notifications: NotificationDTO[];
  unread: number;
  bets: Record<string, BetDTO>;
  messages: Msg[];
  panel: PanelName;
  toasts: Toast[];
  setPanel: (p: PanelName) => void;
  toast: (text: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
  refresh: () => Promise<void>;
  reset: () => void;
  run: (command: CommandName, query: string) => Promise<void>;
  bet: (analysisId: string, choice: 'AGREE' | 'DISAGREE') => Promise<void>;
  markRead: (id?: string) => Promise<void>;
}

const uid = () => Math.random().toString(36).slice(2);
const chatKey = (a: string) => `nexoai:chat:${a}`;

function persistChat(address: string | undefined, messages: Msg[]) {
  if (!address) return;
  try { localStorage.setItem(chatKey(address), JSON.stringify(messages.filter((m) => !m.pending).slice(-60))); } catch { /* storage may be full or blocked */ }
}
function loadChat(address: string): Msg[] {
  try { return JSON.parse(localStorage.getItem(chatKey(address)) ?? '[]'); } catch { return []; }
}

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      booted: false,
      me: null,
      notifications: [],
      unread: 0,
      bets: {},
      messages: [],
      panel: null,
      toasts: [],

      setPanel: (panel) => set({ panel }),
      toast: (text, tone = 'info') => {
        const id = uid();
        set((s) => ({ toasts: [...s.toasts, { id, text, tone }] }));
        setTimeout(() => get().dismissToast(id), 4500);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      refresh: async () => {
        try {
          const d = await api<{ me: MeDTO; notifications: NotificationDTO[]; unread: number; bets: BetDTO[] }>('/api/state');
          const prev = get();
          const known = new Set(prev.notifications.map((n) => n.id));
          d.notifications.filter((n) => !n.isRead && !known.has(n.id) && prev.me).forEach((n) => get().toast(`Bet resolved: ${n.message}`, 'success'));
          const first = !prev.me;
          set({
            booted: true,
            me: d.me,
            notifications: d.notifications,
            unread: d.unread,
            bets: Object.fromEntries(d.bets.map((b) => [b.analysisId, b])),
            messages: first ? loadChat(d.me.address) : prev.messages,
          });
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) set({ booted: true, me: null, messages: [] });
          else set({ booted: true });
        }
      },

      reset: () => {
        const addr = get().me?.address;
        try { if (addr) localStorage.removeItem(chatKey(addr)); } catch { /* ignore */ }
        set({ me: null, notifications: [], unread: 0, bets: {}, messages: [], panel: null });
      },

      run: async (command, query) => {
        const userMsg: Msg = { id: uid(), role: 'user', text: `/${command} ${query}`, ts: Date.now() };
        const pending: Msg = { id: uid(), role: 'result', pending: true, command, query, ts: Date.now() };
        set((s) => ({ messages: [...s.messages, userMsg, pending] }));
        let result: Result;
        try {
          result = await api<Result>('/api/command', { body: { command, query } });
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : 'Request failed.';
          if (e instanceof ApiError && e.status === 0) get().toast(msg, 'error');
          result = { kind: 'error', message: msg, retryable: true, command, query };
        }
        set((s) => ({ messages: s.messages.map((m) => (m.id === pending.id ? { ...m, pending: false, result } : m)) }));
        persistChat(get().me?.address, get().messages);
      },

      bet: async (analysisId, choice) => {
        try {
          const b = await api<BetDTO>('/api/bets', { body: { analysisId, choice } });
          set((s) => ({ bets: { ...s.bets, [analysisId]: b } }));
        } catch (e) {
          get().toast(e instanceof ApiError ? e.message : 'Could not place bet.', 'error');
          void get().refresh();
        }
      },

      markRead: async (id) => {
        set((s) => {
          const notifications = s.notifications.map((n) => (!id || n.id === id ? { ...n, isRead: true } : n));
          return { notifications, unread: notifications.filter((n) => !n.isRead).length };
        });
        try { await api('/api/notifications/read', { body: id ? { id } : { all: true } }); } catch { void get().refresh(); }
      },
    }),
    {
      name: 'nexoai-auth-storage',
      partialize: (state) => ({ me: state.me }), // Persists the logged-in user state
    }
  )
);
