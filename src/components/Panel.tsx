'use client';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/store/app';

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  const setPanel = useApp((s) => s.setPanel);
  return (
    <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setPanel(null)}>
      <motion.aside role="dialog" aria-label={title} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.22 }} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0D0F13] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button className="tap" onClick={() => setPanel(null)} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </motion.aside>
    </motion.div>
  );
}
