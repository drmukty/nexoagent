'use client';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({ title, onClose, children, dismissable = true }: { title: string; onClose: () => void; children: React.ReactNode; dismissable?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && dismissable && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, dismissable]);
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={(e) => e.target === e.currentTarget && dismissable && onClose()}>
      <motion.div role="dialog" aria-modal="true" aria-label={title} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass max-h-[92vh] w-full max-w-md overflow-y-auto rounded-b-none bg-[#0F1116] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-b-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {dismissable && <button onClick={onClose} className="tap -mr-2" aria-label="Close"><X className="h-5 w-5" /></button>}
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
