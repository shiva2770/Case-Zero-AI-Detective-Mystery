import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Check, 
  FileText, 
  Loader2, 
  AlertCircle,
  X
} from 'lucide-react';
import { CaseFile, AccusationInput, AccusationResult, Suspect, Clue } from '../types';
import { soundFx } from '../lib/audio';

interface AccusationModalProps {
  caseFile: CaseFile;
  onClose: () => void;
  onAdjudicated: (result: AccusationResult) => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  caseFile,
  onClose,
  onAdjudicated
}) => {
  const [selectedCulpritId, setSelectedCulpritId] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<string>('');
  const [motiveText, setMotiveText] = useState<string>('');
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [reasoningText, setReasoningText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const discoveredClues = caseFile.clues.filter(c => c.isDiscovered);

  const toggleClue = (id: string) => {
    if (selectedClueIds.includes(id)) {
      setSelectedClueIds(selectedClueIds.filter(i => i !== id));
    } else {
      setSelectedClueIds([...selectedClueIds, id]);
    }
  };

  const isFormValid = selectedCulpritId && selectedWeapon.trim() && motiveText.trim() && reasoningText.trim();

  const handleExecuteAccusation = async () => {
    if (!isFormValid || isSubmitting) return;

    soundFx.playGavelImpact();
    setIsSubmitting(true);

    const accusationInput: AccusationInput = {
      culpritId: selectedCulpritId,
      weapon: selectedWeapon.trim(),
      motive: motiveText.trim(),
      citedClueIds: selectedClueIds,
      playerReasoning: reasoningText.trim()
    };

    try {
      const response = await fetch('/api/accuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseFile,
          accusation: accusationInput
        })
      });

      const data = await response.json();

      if (data.success && data.result) {
        onAdjudicated(data.result);
      }
    } catch (err) {
      console.error('Failed to submit accusation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm max-w-2xl w-full p-6 shadow-2xl space-y-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-red-900/40 border border-red-800/60 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
                Grand Jury Indictment Chamber
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                FORMAL CASE ACCUSATION
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#777] hover:text-white p-2 font-mono text-lg font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Indictment Builder */}
        <div className="space-y-5 font-sans">
          {/* Step 1: Select Culprit */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              1. Name the Prime Suspect (The Culprit) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {caseFile.suspects.map(suspect => {
                const isSelected = suspect.id === selectedCulpritId;
                return (
                  <button
                    key={suspect.id}
                    type="button"
                    onClick={() => setSelectedCulpritId(suspect.id)}
                    className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-900/40 border-red-800/60 text-white font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-[#d1d1d1] hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-9 h-11 rounded-xs border border-amber-500/40 bg-black overflow-hidden shrink-0">
                        {suspect.imageUrl ? (
                          <img
                            src={suspect.imageUrl}
                            alt={suspect.name}
                            className="w-full h-full object-cover filter contrast-125"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center font-bold text-xs text-white">
                            {suspect.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">{suspect.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-red-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] font-mono text-[#777] block truncate">{suspect.title}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Weapon */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              2. Specify the Murder Weapon *
            </label>
            <input
              type="text"
              value={selectedWeapon}
              onChange={(e) => setSelectedWeapon(e.target.value)}
              placeholder="e.g. Snub-nosed .38 Revolver, Laced Brandy Decanter, Damascus Blade..."
              className="w-full bg-black/60 border border-white/10 focus:border-amber-500 rounded-sm p-3 text-xs text-white placeholder-[#777] focus:outline-none"
            />
          </div>

          {/* Step 3: Specify Motive */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              3. State the Primary Motive *
            </label>
            <textarea
              rows={2}
              value={motiveText}
              onChange={(e) => setMotiveText(e.target.value)}
              placeholder="Describe why the culprit committed the crime (e.g. Blackmail debts, disinherited inheritance, revenge)..."
              className="w-full bg-black/60 border border-white/10 focus:border-amber-500 rounded-sm p-3 text-xs text-white placeholder-[#777] focus:outline-none"
            />
          </div>

          {/* Step 4: Attach Supporting Evidence */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              4. Attach Supporting Evidence Pins ({selectedClueIds.length} attached)
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-black/60 rounded-sm border border-white/10">
              {discoveredClues.map(clue => {
                const isAttached = selectedClueIds.includes(clue.id);
                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => toggleClue(clue.id)}
                    className={`w-full text-left p-2 rounded-xs text-xs flex items-center justify-between border cursor-pointer ${
                      isAttached
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold'
                        : 'bg-white/5 border-white/10 text-[#777] hover:text-[#d1d1d1]'
                    }`}
                  >
                    <span>{clue.title} ({clue.type})</span>
                    {isAttached && <Check className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Detective's Reasoning */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              5. Detective's Final Reasoning Statement *
            </label>
            <textarea
              rows={3}
              value={reasoningText}
              onChange={(e) => setReasoningText(e.target.value)}
              placeholder="Summarize how the physical evidence and testimonial contradictions prove the culprit's guilt beyond a reasonable doubt..."
              className="w-full bg-black/60 border border-white/10 focus:border-amber-500 rounded-sm p-3 text-xs text-white placeholder-[#777] focus:outline-none"
            />
          </div>
        </div>

        {/* Confirmation or Submit Action */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 text-xs font-mono uppercase font-bold cursor-pointer"
          >
            Cancel
          </button>

          {!showConfirm ? (
            <button
              disabled={!isFormValid}
              onClick={() => setShowConfirm(true)}
              className="px-6 py-2.5 rounded-sm bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider border border-red-500 shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>Submit Indictment</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-400 font-mono">Are you certain? The GM will render judgment.</span>
              <button
                disabled={isSubmitting}
                onClick={handleExecuteAccusation}
                className="px-6 py-2.5 rounded-sm bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider border border-red-500 shadow-2xl flex items-center gap-2 cursor-pointer animate-bounce"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adjudicating...</span>
                  </>
                ) : (
                  <span>CONFIRM INDICTMENT</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
