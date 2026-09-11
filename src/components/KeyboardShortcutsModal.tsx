import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, X, Keyboard, Navigation, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';
import { SHORTCUTS_LIST } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-[#0e1017] border-2 border-amber-500/60 rounded-sm max-w-2xl w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative text-[#ede3c8] font-sans space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777] hover:text-white p-1.5 rounded-xs bg-white/5 border border-white/10 cursor-pointer transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-sm bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold block">
              Detective Quick Navigation
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              KEYBOARD SHORTCUTS REFERENCE
            </h2>
          </div>
        </div>

        {/* Shortcuts List by Category */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-amber-400 font-bold mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>Core Workspace Navigation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SHORTCUTS_LIST.filter(s => s.category === 'navigation').map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-white/10 rounded-sm p-2.5 flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-[#d1d1d1] font-mono">{item.description}</span>
                  <kbd className="px-2 py-1 rounded-xs bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold shrink-0 shadow-sm">
                    {item.keyCombo}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-red-400 font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Investigation & Judicial Actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SHORTCUTS_LIST.filter(s => s.category === 'investigation').map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-white/10 rounded-sm p-2.5 flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-[#d1d1d1] font-mono">{item.description}</span>
                  <kbd className="px-2 py-1 rounded-xs bg-red-950/50 border border-red-800/60 text-red-300 font-mono text-[11px] font-bold shrink-0 shadow-sm">
                    {item.keyCombo}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#999] font-bold mb-2">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Environment & System Controls</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SHORTCUTS_LIST.filter(s => s.category === 'system').map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-white/10 rounded-sm p-2.5 flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-[#d1d1d1] font-mono">{item.description}</span>
                  <kbd className="px-2 py-1 rounded-xs bg-white/10 border border-white/20 text-[#ede3c8] font-mono text-[11px] font-bold shrink-0 shadow-sm">
                    {item.keyCombo}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#777]">
          <span>Tip: Press <kbd className="text-amber-400 bg-white/5 px-1.5 py-0.5 rounded-xs border border-white/10 font-bold">?</kbd> anywhere to open this manual</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 uppercase font-bold text-[10px] tracking-wider transition-colors cursor-pointer"
          >
            Got it (Esc)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface ShortcutToastProps {
  message: string | null;
}

export const ShortcutToast: React.FC<ShortcutToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 pointer-events-none"
        >
          <div className="bg-[#0e1017]/95 border border-amber-500/60 px-4 py-2 rounded-sm shadow-2xl backdrop-blur-md flex items-center gap-2.5 font-mono text-xs text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
