import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2d241e] text-stone-100 font-semibold text-xs rounded-2xl px-5 py-3.5 shadow-2xl max-w-md border border-[#4a3d34] text-center flex items-center justify-center space-x-2.5 pointer-events-none"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
