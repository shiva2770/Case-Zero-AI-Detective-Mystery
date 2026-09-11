import { useEffect, useState, useCallback } from 'react';
import { audioManager } from '../lib/AudioManager';

export interface ShortcutItem {
  keyCombo: string;
  description: string;
  actionName: string;
  category: 'navigation' | 'investigation' | 'system';
}

export const SHORTCUTS_LIST: ShortcutItem[] = [
  { keyCombo: 'Ctrl + K / ⌘K', description: 'Open Case Journal & Field Notes', actionName: 'Case Journal', category: 'navigation' },
  { keyCombo: 'Ctrl + I / ⌘I', description: 'Open Scene Investigation Deck', actionName: 'Scene Investigation', category: 'navigation' },
  { keyCombo: 'Ctrl + D / ⌘D', description: 'Open Deduction Corkboard', actionName: 'Deduction Corkboard', category: 'navigation' },
  { keyCombo: 'Ctrl + B / ⌘B', description: 'Open Case Briefing & Dossier', actionName: 'Case Briefing', category: 'navigation' },
  { keyCombo: 'Ctrl + Q / ⌘Q', description: 'Open Suspect Interrogation Room', actionName: 'Interrogation Room', category: 'navigation' },
  { keyCombo: 'Ctrl + U / ⌘U', description: 'Open Detective Bureau & Career', actionName: 'Detective Bureau', category: 'navigation' },
  { keyCombo: 'Ctrl + Shift + A', description: 'Open Accusation Tribunal', actionName: 'Make Accusation', category: 'investigation' },
  { keyCombo: 'Ctrl + M / ⌘M', description: 'Toggle Noir Ambient Rain / City Sounds', actionName: 'Toggle Ambient Audio', category: 'system' },
  { keyCombo: '?', description: 'View Detective Keyboard Shortcuts Guide', actionName: 'Shortcuts Guide', category: 'system' },
  { keyCombo: 'Escape', description: 'Dismiss active dialog or inspection modal', actionName: 'Close Modal', category: 'system' }
];

interface UseKeyboardShortcutsOptions {
  onNavigateTab: (tab: string) => void;
  onOpenAccuseModal?: () => void;
  onOpenHowToPlayModal?: () => void;
  onCloseModals?: () => void;
  hasActiveCase: boolean;
}

export function useKeyboardShortcuts({
  onNavigateTab,
  onOpenAccuseModal,
  onOpenHowToPlayModal,
  onCloseModals,
  hasActiveCase
}: UseKeyboardShortcutsOptions) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState<boolean>(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCtrlOrMeta = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInputElement = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Escape key closes modals or dialogs
      if (e.key === 'Escape') {
        if (isShortcutsHelpOpen) {
          e.preventDefault();
          setIsShortcutsHelpOpen(false);
          return;
        }
        if (onCloseModals) {
          onCloseModals();
        }
        return;
      }

      // Help Dialog Trigger (?) when not inside text input
      if (e.key === '?' && !isInputElement && !isCtrlOrMeta) {
        e.preventDefault();
        setIsShortcutsHelpOpen(prev => !prev);
        audioManager.playPaperRustle();
        return;
      }

      // Modifier key combos
      if (isCtrlOrMeta) {
        const key = e.key.toLowerCase();

        // Ctrl + K -> Journal
        if (key === 'k') {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playTabTransition('journal');
          onNavigateTab('journal');
          showToast('Case Journal [Ctrl+K]');
          return;
        }

        // Ctrl + I -> Scene Investigation
        if (key === 'i' && !e.shiftKey) {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playTabTransition('investigation');
          onNavigateTab('investigation');
          showToast('Scene Investigation [Ctrl+I]');
          return;
        }

        // Ctrl + D -> Deduction Corkboard
        if (key === 'd') {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playTabTransition('deduction');
          onNavigateTab('deduction');
          showToast('Deduction Corkboard [Ctrl+D]');
          return;
        }

        // Ctrl + B -> Briefing
        if (key === 'b') {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playTabTransition('briefing');
          onNavigateTab('briefing');
          showToast('Case Briefing [Ctrl+B]');
          return;
        }

        // Ctrl + Q or Ctrl+T -> Interrogation
        if (key === 'q' || (key === 't' && !isInputElement)) {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playTabTransition('interrogation');
          onNavigateTab('interrogation');
          showToast('Interrogation Room [Ctrl+Q]');
          return;
        }

        // Ctrl + U -> Detective Career Bureau
        if (key === 'u') {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playTabTransition('career');
          onNavigateTab('career');
          showToast('Detective Bureau [Ctrl+U]');
          return;
        }

        // Ctrl + Shift + A -> Make Accusation
        if (key === 'a' && e.shiftKey && hasActiveCase && onOpenAccuseModal) {
          e.preventDefault();
          if (target && isInputElement) target.blur();
          audioManager.playGavelImpact();
          onOpenAccuseModal();
          showToast('Accusation Tribunal [Ctrl+Shift+A]');
          return;
        }

        // Ctrl + M -> Toggle Noir Ambient Rain
        if (key === 'm') {
          e.preventDefault();
          const active = audioManager.toggleAmbientNoir();
          showToast(active ? 'Ambient Rain Enabled [Ctrl+M]' : 'Ambient Rain Muted [Ctrl+M]');
          return;
        }

        // Ctrl + / -> Toggle Shortcuts Help
        if (e.key === '/' || key === '/') {
          e.preventDefault();
          setIsShortcutsHelpOpen(prev => !prev);
          audioManager.playPaperRustle();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateTab, onOpenAccuseModal, onCloseModals, hasActiveCase, isShortcutsHelpOpen, showToast]);

  return {
    toastMessage,
    isShortcutsHelpOpen,
    setIsShortcutsHelpOpen
  };
}
