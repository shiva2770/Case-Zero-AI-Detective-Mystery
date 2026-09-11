import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BriefingView } from './components/BriefingView';
import { SceneInvestigation } from './components/SceneInvestigation';
import { InterrogationRoom } from './components/InterrogationRoom';
import { DeductionBoard } from './components/DeductionBoard';
import { AccusationModal } from './components/AccusationModal';
import { CaseClosedView } from './components/CaseClosedView';
import { DetectiveCareer } from './components/DetectiveCareer';
import { CaseSetupModal } from './components/CaseSetupModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CaseJournal } from './components/CaseJournal';
import { KeyboardShortcutsModal, ShortcutToast } from './components/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { appendJournalEntry, createInitialJournalEntries } from './lib/journal';
import { 
  CaseFile, 
  DetectiveProfile, 
  CorkNode, 
  CorkConnection, 
  AccusationResult, 
  Clue,
  CasePackTheme,
  CaseDifficulty,
  CaseModifier 
} from './types';
import { ensureSuspectPortraits } from './lib/portraitGenerator';
import { HAND_AUTHORED_TUTORIAL_CASE } from './data/tutorialCase';
import { audioManager } from './lib/AudioManager';
import { 
  getProfile, 
  saveProfile, 
  getActiveCase, 
  saveActiveCase, 
  addXpToProfile 
} from './lib/storage';

export default function App() {
  const [profile, setProfile] = useState<DetectiveProfile>(getProfile());
  const [caseFile, setCaseFile] = useState<CaseFile | null>(getActiveCase());
  const [activeTab, setActiveTab] = useState<string>('briefing');

  // Corkboard State
  const [corkNodes, setCorkNodes] = useState<CorkNode[]>([]);
  const [corkConnections, setCorkConnections] = useState<CorkConnection[]>([]);

  // Modals
  const [isCaseSetupOpen, setIsCaseSetupOpen] = useState<boolean>(false);
  const [isAccuseOpen, setIsAccuseOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState<boolean>(false);

  // Active clue to present in interrogation
  const [activeClueIdToPresent, setActiveClueIdToPresent] = useState<string | null>(null);

  // Accusation Result
  const [caseResult, setCaseResult] = useState<AccusationResult | null>(null);

  // Keyboard Shortcuts Hook
  const { toastMessage, isShortcutsHelpOpen, setIsShortcutsHelpOpen } = useKeyboardShortcuts({
    onNavigateTab: (tab) => setActiveTab(tab),
    onOpenAccuseModal: () => setIsAccuseOpen(true),
    onOpenHowToPlayModal: () => setIsHowToPlayOpen(true),
    onCloseModals: () => {
      setIsCaseSetupOpen(false);
      setIsAccuseOpen(false);
      setIsHowToPlayOpen(false);
    },
    hasActiveCase: !!caseFile
  });

  // Generate initial default case if none exists or ensure suspect portraits exist
  useEffect(() => {
    if (!caseFile) {
      handleGenerateCase('noir_1940s', 'detective', 'none', false);
    } else if (caseFile.suspects && caseFile.suspects.some(s => !s.imageUrl)) {
      const updatedSuspects = ensureSuspectPortraits(caseFile.suspects, caseFile.theme);
      const updatedCase = { ...caseFile, suspects: updatedSuspects };
      setCaseFile(updatedCase);
      saveActiveCase(updatedCase);
    }
  }, []);

  const handleGenerateCase = async (
    theme: CasePackTheme = 'noir_1940s',
    difficulty: CaseDifficulty = 'detective',
    modifier: CaseModifier = 'none',
    isDaily: boolean = false
  ) => {
    setIsGeneratingCase(true);
    setCaseResult(null);

    try {
      const response = await fetch('/api/case/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, difficulty, modifier, isDaily })
      });

      const data = await response.json();

      if (data.success && data.caseFile) {
        const fullCaseWithJournal: CaseFile = {
          ...data.caseFile,
          journalEntries: createInitialJournalEntries(data.caseFile)
        };

        setCaseFile(fullCaseWithJournal);
        saveActiveCase(fullCaseWithJournal);

        // Reset corkboard
        setCorkNodes([]);
        setCorkConnections([]);
        setActiveTab('briefing');
        setIsCaseSetupOpen(false);
      } else {
        throw new Error('Fallback to local case');
      }
    } catch (e) {
      console.warn('Using local fallback tutorial case file:', e);
      const fallbackWithJournal: CaseFile = {
        ...HAND_AUTHORED_TUTORIAL_CASE,
        journalEntries: createInitialJournalEntries(HAND_AUTHORED_TUTORIAL_CASE)
      };
      setCaseFile(fallbackWithJournal);
      saveActiveCase(fallbackWithJournal);
      setCorkNodes([]);
      setCorkConnections([]);
      setActiveTab('briefing');
      setIsCaseSetupOpen(false);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  // Pin Clue to Corkboard
  const handlePinClueToCorkboard = (clue: Clue) => {
    audioManager.playPaperRustle();
    const existing = corkNodes.find(n => n.refId === clue.id);
    if (existing) {
      setActiveTab('deduction');
      return;
    }

    const newNode: CorkNode = {
      id: `node-clue-${clue.id}`,
      type: 'clue',
      title: clue.title,
      subtitle: `${clue.type.toUpperCase()} • ${clue.locationFound}`,
      x: 100 + Math.floor(Math.random() * 250),
      y: 100 + Math.floor(Math.random() * 200),
      color: clue.type === 'physical' ? '#38bdf8' : '#a7f3d0',
      refId: clue.id
    };

    setCorkNodes(prev => [...prev, newNode]);
    setActiveTab('deduction');
  };

  // Pin Suspect Statement to Corkboard
  const handlePinStatementToCorkboard = (statement: string, suspectName: string) => {
    audioManager.playTypewriterClick();
    const newNode: CorkNode = {
      id: `node-statement-${Date.now()}`,
      type: 'note',
      title: `${suspectName}'s Statement`,
      subtitle: `"${statement}"`,
      x: 140 + Math.floor(Math.random() * 200),
      y: 140 + Math.floor(Math.random() * 200),
      color: '#fde047',
      isCustomNote: true
    };

    setCorkNodes(prev => [...prev, newNode]);
    setActiveTab('deduction');
  };

  // Pin Journal Entry to Corkboard
  const handlePinJournalNoteToCorkboard = (title: string, content: string) => {
    audioManager.playPaperRustle();
    const newNode: CorkNode = {
      id: `node-journal-${Date.now()}`,
      type: 'note',
      title: title,
      subtitle: content,
      x: 120 + Math.floor(Math.random() * 220),
      y: 120 + Math.floor(Math.random() * 220),
      color: '#a7f3d0',
      isCustomNote: true
    };

    setCorkNodes(prev => [...prev, newNode]);
    setActiveTab('deduction');
  };

  // Navigate to interrogation with specific clue preselected
  const handleNavigateToInterrogateWithClue = (clueId: string) => {
    setActiveClueIdToPresent(clueId);
    setActiveTab('interrogation');
  };

  // When accusation is adjudicated by GM
  const handleAdjudicated = (result: AccusationResult) => {
    setCaseResult(result);
    setIsAccuseOpen(false);

    if (caseFile) {
      const updatedProfile = addXpToProfile(
        profile,
        result.xpEarned,
        result.isCulpritCorrect,
        result.grade === 'S',
        {
          caseId: caseFile.caseId,
          title: caseFile.title,
          theme: caseFile.theme,
          grade: result.grade,
          accuracy: result.overallAccuracy
        }
      );
      setProfile(updatedProfile);
    }

    setActiveTab('closed');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#d1d1d1] font-sans flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        caseFile={caseFile}
        onOpenNewCaseModal={() => setIsCaseSetupOpen(true)}
        onOpenAccuseModal={() => setIsAccuseOpen(true)}
        onOpenHowToPlayModal={() => setIsHowToPlayOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-2 sm:px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {activeTab === 'briefing' && caseFile && (
              <BriefingView
                caseFile={caseFile}
                onNavigateToTab={setActiveTab}
                onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
              />
            )}

            {activeTab === 'investigation' && caseFile && (
              <SceneInvestigation
                caseFile={caseFile}
                onUpdateCaseFile={(updated) => {
                  setCaseFile(updated);
                  saveActiveCase(updated);
                }}
                onPinClueToCorkboard={handlePinClueToCorkboard}
                onNavigateToInterrogateWithClue={handleNavigateToInterrogateWithClue}
              />
            )}

            {activeTab === 'interrogation' && caseFile && (
              <InterrogationRoom
                caseFile={caseFile}
                activeClueIdToPresent={activeClueIdToPresent}
                onPinStatementToCorkboard={handlePinStatementToCorkboard}
                onUpdateCaseFile={(updated) => {
                  setCaseFile(updated);
                  saveActiveCase(updated);
                }}
              />
            )}

            {activeTab === 'deduction' && caseFile && (
              <DeductionBoard
                caseFile={caseFile}
                corkNodes={corkNodes}
                corkConnections={corkConnections}
                onUpdateNodes={setCorkNodes}
                onUpdateConnections={setCorkConnections}
                onOpenAccuseModal={() => setIsAccuseOpen(true)}
              />
            )}

            {activeTab === 'journal' && caseFile && (
              <CaseJournal
                caseFile={caseFile}
                onUpdateCaseFile={(updated) => {
                  setCaseFile(updated);
                  saveActiveCase(updated);
                }}
                onPinToCorkboard={handlePinJournalNoteToCorkboard}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'career' && (
              <DetectiveCareer
                profile={profile}
                onUpdateProfile={setProfile}
              />
            )}

            {activeTab === 'closed' && caseFile && caseResult && (
              <CaseClosedView
                caseFile={caseFile}
                result={caseResult}
                onStartNewCase={() => setIsCaseSetupOpen(true)}
                onViewCareer={() => setActiveTab('career')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        rankTitle={profile.rankTitle}
      />

      {/* Case Setup Modal */}
      {isCaseSetupOpen && (
        <CaseSetupModal
          onClose={() => setIsCaseSetupOpen(false)}
          onGenerateCase={handleGenerateCase}
          isGenerating={isGeneratingCase}
        />
      )}

      {/* Accusation Modal */}
      {isAccuseOpen && caseFile && (
        <AccusationModal
          caseFile={caseFile}
          onClose={() => setIsAccuseOpen(false)}
          onAdjudicated={handleAdjudicated}
        />
      )}

      {/* Keyboard Shortcuts Reference Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />

      {/* Floating Keyboard Shortcut Activated Toast */}
      <ShortcutToast message={toastMessage} />
    </div>
  );
}
