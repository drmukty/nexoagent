'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '@/store/app';

const icon = { info: Info, error: AlertCircle, success: CheckCircle2 };
const tone = { info: 'text-nexo-blue', error: 'text-nexo-red', success: 'text-nexo-green' };

export function ToastProvider() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icon[t.tone];
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 bg-[#111318]/90 p-3 text-sm shadow-xl">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone[t.tone]}`} />
              <span className="flex-1">{t.text}</span>
              <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
