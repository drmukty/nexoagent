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
export interface ChatMeta { id: string; title: string; ts: number; }

interface State {
  booted: boolean;
  me: MeDTO | null;
  notifications: NotificationDTO[];
  unread: number;
  bets: Record<string, BetDTO>;
  messages: Msg[];
  currentChatId: string | null;
  recentChats: ChatMeta[];
  panel: PanelName;
  toasts: Toast[];
  setPanel: (p: PanelName) => void;
  toast: (text: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
  refresh: () => Promise<void>;
  reset: () => Promise<void>;
  startNewChat: () => void;
  loadRecentChat: (id: string) => void;
  deleteRecentChat: (id: string) => void;
  run: (command: CommandName, query: string) => Promise<void>;
  bet: (analysisId: string, choice: 'AGREE' | 'DISAGREE') => Promise<void>;
  markRead: (id?: string) => Promise<void>;
}

const uid = () => Math.random().toString(36).slice(2);
const chatKey = (addr: string, id: string) => `nexoai:chat:${addr}:${id}`;

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      booted: false,
      me: null,
      notifications: [],
      unread: 0,
      bets: {},
      messages: [],
      currentChatId: null,
      recentChats: [],
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
          set({
            booted: true,
            me: d.me,
            notifications: d.notifications,
            unread: d.unread,
            bets: Object.fromEntries(d.bets.map((b) => [b.analysisId, b])),
          });
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) set({ booted: true, me: null, messages: [], currentChatId: null, recentChats: [] });
          else set({ booted: true });
        }
      },

      reset: async () => {
        try {
          // Wait for the backend to delete the HTTP-only cookie
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch { /* ignore */ }
        
        set({ me: null, notifications: [], unread: 0, bets: {}, messages: [], currentChatId: null, recentChats: [], panel: null });
        localStorage.removeItem('nexoai-auth-storage');
        
        // Hard reload to wipe all memory
        window.location.href = '/'; 
      },

      startNewChat: () => {
        set({ messages: [], currentChatId: null });
      },

      loadRecentChat: (id) => {
        const { me } = get();
        if (!me) return;
        try {
          const raw = localStorage.getItem(chatKey(me.address, id));
          if (raw) set({ messages: JSON.parse(raw), currentChatId: id });
        } catch { /* ignore */ }
      },

      deleteRecentChat: (id) => {
        const { me } = get();
        if (!me) return;
        localStorage.removeItem(chatKey(me.address, id));
        set((s) => ({ recentChats: s.recentChats.filter((c) => c.id !== id) }));
      },

      run: async (command, query) => {
        let { currentChatId, recentChats, me } = get();
        if (!me) return;

        // If no active chat, create a new one
        if (!currentChatId) {
          currentChatId = uid();
          recentChats = [{ id: currentChatId, title: `/${command} ${query}`, ts: Date.now() }, ...recentChats];
          set({ currentChatId, recentChats });
        }

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
        
        // Save to local storage
        try {
          localStorage.setItem(chatKey(me.address, currentChatId), JSON.stringify(get().messages.filter(m => !m.pending)));
        } catch { /* ignore */ }
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
      // Only persist the user and recent chats list (not the active messages, so we always land on welcome screen)
      partialize: (state) => ({ me: state.me, recentChats: state.recentChats }), 
    }
  )
);
