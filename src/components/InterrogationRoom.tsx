import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  User, 
  Send, 
  Flame, 
  ShieldAlert, 
  HeartHandshake, 
  Pin, 
  Loader2, 
  FileText, 
  Sparkles,
  Zap,
  X,
  RefreshCw,
  ZoomIn
} from 'lucide-react';
import { CaseFile, Suspect, InterrogationMessage, InterrogationTechnique, Clue } from '../types';
import { generateSuspectPortraitUrl } from '../lib/portraitGenerator';
import { appendJournalEntry } from '../lib/journal';
import { soundFx } from '../lib/audio';
import { InterrogationThinkingSkeleton, FloatingDetectiveThinking } from './DetectiveThinking';

interface InterrogationRoomProps {
  caseFile: CaseFile;
  activeClueIdToPresent?: string | null;
  onPinStatementToCorkboard: (statement: string, suspectName: string) => void;
  onUpdateCaseFile?: (updated: CaseFile) => void;
}

export const InterrogationRoom: React.FC<InterrogationRoomProps> = ({
  caseFile,
  activeClueIdToPresent,
  onPinStatementToCorkboard,
  onUpdateCaseFile
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(
    caseFile.suspects[0]?.id || ''
  );
  const [technique, setTechnique] = useState<InterrogationTechnique>('standard');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedClueToPresent, setSelectedClueToPresent] = useState<string | null>(
    activeClueIdToPresent || null
  );
  const [viewingMugshot, setViewingMugshot] = useState<boolean>(false);

  // Chat history stored per suspect ID
  const [chatHistories, setChatHistories] = useState<Record<string, InterrogationMessage[]>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedSuspect: Suspect | undefined = caseFile.suspects.find(s => s.id === selectedSuspectId);
  const discoveredClues = caseFile.clues.filter(c => c.isDiscovered);

  // Scroll chat to bottom when updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, selectedSuspectId, isSending]);

  // Initial welcome greeting for each suspect if empty history
  useEffect(() => {
    if (selectedSuspect && (!chatHistories[selectedSuspect.id] || chatHistories[selectedSuspect.id].length === 0)) {
      const initialMsg: InterrogationMessage = {
        id: `msg-${Date.now()}`,
        sender: 'suspect',
        suspectId: selectedSuspect.id,
        text: `"${selectedSuspect.publicAlibi} What do you want from me, Detective?"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistories(prev => ({
        ...prev,
        [selectedSuspect.id]: [initialMsg]
      }));
    }
  }, [selectedSuspectId]);

  const activeHistory = selectedSuspectId ? (chatHistories[selectedSuspectId] || []) : [];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !selectedSuspect || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const playerMsg: InterrogationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'player',
      suspectId: selectedSuspect.id,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      techniqueUsed: technique,
      presentedClueId: selectedClueToPresent || undefined
    };

    const currentHistory = chatHistories[selectedSuspect.id] || [];
    const updatedHistory = [...currentHistory, playerMsg];

    setChatHistories(prev => ({
      ...prev,
      [selectedSuspect.id]: updatedHistory
    }));

    setIsSending(true);
    soundFx.playTypewriterClick();

    try {
      const response = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseFile,
          suspectId: selectedSuspect.id,
          playerMessage: userText,
          chatHistory: updatedHistory,
          technique,
          presentedClueId: selectedClueToPresent
        })
      });

      const data = await response.json();

      if (data.success) {
        const suspectMsg: InterrogationMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'suspect',
          suspectId: selectedSuspect.id,
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tensionChange: data.tensionChange
        };

        setChatHistories(prev => ({
          ...prev,
          [selectedSuspect.id]: [...(prev[selectedSuspect.id] || []), suspectMsg]
        }));

        // Adjust suspect tension locally
        if (selectedSuspect && data.tensionChange) {
          selectedSuspect.tensionLevel = Math.max(0, Math.min(100, (selectedSuspect.tensionLevel || 30) + data.tensionChange));
        }

        // Auto-log interrogation exchange to Case Journal
        if (onUpdateCaseFile && selectedSuspect) {
          const updatedCase = appendJournalEntry(caseFile, {
            type: 'interrogation',
            title: `Interrogated ${selectedSuspect.name} (${technique.toUpperCase()})`,
            description: `Detective asked: "${userText}"\n${selectedSuspect.name} replied: "${data.message}"`,
            categoryTag: 'INTERROGATION STATEMENT',
            refId: selectedSuspect.id
          });
          onUpdateCaseFile(updatedCase);
        }
      }
    } catch (err) {
      console.error('Interrogation request failed', err);
    } finally {
      setIsSending(false);
      setSelectedClueToPresent(null);
    }
  };

  const getTensionBadge = (level: number = 30) => {
    if (level >= 75) {
      return { label: 'PANICKED', color: 'bg-red-900/40 text-red-400 border-red-800/60' };
    } else if (level >= 50) {
      return { label: 'DEFENSIVE', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    } else if (level >= 30) {
      return { label: 'RATTLED', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
    }
    return { label: 'CALM', color: 'bg-green-900/40 text-green-400 border-green-800/60' };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
            Police Interrogation Room #3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            SUSPECT CROSS-EXAMINATION
          </h2>
        </div>
        <p className="text-xs text-[#777] font-mono hidden md:block max-w-md">
          Probe for contradictions between claimed alibis and physical evidence. Watch suspect tension meters closely.
        </p>
      </div>

      {/* Floating / Fading Detective Thinking Feedback */}
      <FloatingDetectiveThinking
        isVisible={isSending}
        context="interrogation"
        targetName={selectedSuspect?.name}
      />

      {/* Main Grid: Suspect List + Interrogation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Suspect Selector Cards (Left Sidebar) */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold px-1">
            Suspects in Custody
          </h3>

          <div className="space-y-2.5">
            {caseFile.suspects.map(suspect => {
              const isSelected = suspect.id === selectedSuspectId;
              const badge = getTensionBadge(suspect.tensionLevel);

              return (
                <button
                  key={suspect.id}
                  onClick={() => setSelectedSuspectId(suspect.id)}
                  className={`w-full text-left p-3.5 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-white/20 shadow-lg text-white'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#d1d1d1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-14 rounded-xs border border-amber-500/30 bg-black overflow-hidden shrink-0">
                      {suspect.imageUrl ? (
                        <img
                          src={suspect.imageUrl}
                          alt={suspect.name}
                          className="w-full h-full object-cover filter contrast-125"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center font-bold text-sm text-white">
                          {suspect.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm truncate">{suspect.name}</h4>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-xs border uppercase font-bold shrink-0 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-[#777] truncate">{suspect.title}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interrogation Center */}
        <div className="lg:col-span-3 space-y-4">
          {selectedSuspect ? (
            <>
              {/* Active Suspect Profile Banner */}
              <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => setViewingMugshot(true)}
                    className="relative w-14 h-16 rounded-xs border border-amber-500/50 bg-black overflow-hidden shrink-0 group hover:border-amber-400 transition-all cursor-pointer shadow-md"
                    title="Click to view full AI Noir Portrait & Prompt"
                  >
                    {selectedSuspect.imageUrl ? (
                      <img
                        src={selectedSuspect.imageUrl}
                        alt={selectedSuspect.name}
                        className="w-full h-full object-cover filter contrast-125 group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center font-bold text-base text-amber-500">
                        {selectedSuspect.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/90 text-[7px] font-mono text-amber-400 font-bold text-center tracking-tighter uppercase py-0.5 border-t border-amber-500/40">
                      MUGSHOT
                    </div>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedSuspect.name}</h3>
                      <span className="text-xs font-mono text-[#777]">({selectedSuspect.relationToVictim})</span>
                      <button
                        onClick={() => setViewingMugshot(true)}
                        className="text-[9px] font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-xs border border-amber-500/30 font-bold uppercase transition-colors"
                      >
                        📷 View Portrait
                      </button>
                    </div>
                    <p className="text-xs font-mono text-amber-500 line-clamp-1 mt-0.5">
                      Alibi: "{selectedSuspect.publicAlibi}"
                    </p>
                  </div>
                </div>

                {/* Tension Meter Bar */}
                <div className="flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-sm border border-white/10">
                  <span className="text-[10px] font-mono text-[#777] uppercase font-bold">Tension:</span>
                  <div className="w-28 bg-white/10 h-2 rounded-xs overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        (selectedSuspect.tensionLevel || 30) >= 75 ? 'bg-red-500' :
                        (selectedSuspect.tensionLevel || 30) >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedSuspect.tensionLevel || 30}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-500">
                    {selectedSuspect.tensionLevel || 30}%
                  </span>
                </div>
              </div>

              {/* Interrogation Strategy & Evidence Presentation Selector */}
              <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-3 shadow-md space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  {/* Technique Buttons */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-sm border border-white/10">
                    <span className="text-[#777] px-2 font-bold uppercase text-[9px]">Strategy:</span>
                    <button
                      onClick={() => setTechnique('standard')}
                      className={`px-3 py-1 rounded-xs cursor-pointer transition-colors flex items-center gap-1 ${
                        technique === 'standard' ? 'bg-white/10 text-white font-bold border border-white/20' : 'text-[#777] hover:text-[#d1d1d1]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Standard
                    </button>
                    <button
                      onClick={() => setTechnique('pressure')}
                      className={`px-3 py-1 rounded-xs cursor-pointer transition-colors flex items-center gap-1 ${
                        technique === 'pressure' ? 'bg-red-900/40 text-red-400 font-bold border border-red-800/60' : 'text-[#777] hover:text-[#d1d1d1]'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-red-400" /> Pressure
                    </button>
                    <button
                      onClick={() => setTechnique('sympathize')}
                      className={`px-3 py-1 rounded-xs cursor-pointer transition-colors flex items-center gap-1 ${
                        technique === 'sympathize' ? 'bg-green-900/40 text-green-400 font-bold border border-green-800/60' : 'text-[#777] hover:text-[#d1d1d1]'
                      }`}
                    >
                      <HeartHandshake className="w-3.5 h-3.5 text-green-400" /> Sympathize
                    </button>
                  </div>

                  {/* Present Clue Dropdown */}
                  {discoveredClues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#777] font-mono text-[10px] uppercase font-bold">Present Evidence:</span>
                      <select
                        value={selectedClueToPresent || ''}
                        onChange={(e) => setSelectedClueToPresent(e.target.value || null)}
                        className="bg-black/60 border border-white/10 rounded-sm px-2.5 py-1 text-amber-400 text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="">-- Select Clue --</option>
                        {discoveredClues.map(clue => (
                          <option key={clue.id} value={clue.id}>
                            {clue.title} ({clue.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {selectedClueToPresent && (
                  <div className="bg-white/5 border border-white/10 rounded-sm p-2 text-xs text-amber-400 font-mono flex items-center justify-between">
                    <span>
                      🎯 Ready to present evidence: <strong className="text-white">{discoveredClues.find(c => c.id === selectedClueToPresent)?.title}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedClueToPresent(null)}
                      className="text-amber-500 hover:text-white font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Chat Message Window */}
              <div className="bg-black/60 border border-white/10 rounded-sm p-4 shadow-inner min-h-[360px] max-h-[440px] overflow-y-auto space-y-4 font-sans">
                {activeHistory.map((msg) => {
                  const isPlayer = msg.sender === 'player';

                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#777]">
                        <span>{isPlayer ? 'Detective' : selectedSuspect.name}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.techniqueUsed && msg.techniqueUsed !== 'standard' && (
                          <span className="uppercase text-amber-500 font-bold">({msg.techniqueUsed})</span>
                        )}
                      </div>

                      <div 
                        className={`max-w-xl p-3.5 rounded-sm text-xs sm:text-sm leading-relaxed shadow-md relative group ${
                          isPlayer
                            ? 'bg-white/10 border border-white/20 text-white'
                            : 'bg-white/5 border border-white/10 text-[#d1d1d1]'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {!isPlayer && (
                          <button
                            onClick={() => onPinStatementToCorkboard(msg.text, selectedSuspect.name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-2 p-1.5 rounded-xs bg-black/80 hover:bg-amber-500 hover:text-black text-amber-400 border border-white/20 text-[9px] font-mono flex items-center gap-1 shadow cursor-pointer uppercase font-bold"
                            title="Pin statement to Corkboard"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isSending && (
                  <InterrogationThinkingSkeleton 
                    suspectName={selectedSuspect.name} 
                    technique={technique}
                  />
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask ${selectedSuspect.name} a question...`}
                  className="flex-1 bg-[#0c0c0d] border border-white/10 focus:border-amber-500 rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-[#777] focus:outline-none font-sans"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="px-5 py-3 rounded-sm bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider border border-red-500 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Question</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 text-[#777] font-mono text-sm">
              Select a suspect from the custody roster on the left.
            </div>
          )}
        </div>
      </div>

      {/* AI Noir Mugshot Dossier Modal */}
      {viewingMugshot && selectedSuspect && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0d] border-2 border-amber-500/80 rounded-sm max-w-xl w-full p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative space-y-4 font-sans">
            <button
              onClick={() => setViewingMugshot(false)}
              className="absolute top-3 right-3 text-[#777] hover:text-white p-1 rounded-xs bg-white/5 border border-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-bold tracking-wider border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI PROCEDURAL NOIR PORTRAIT DOSSIER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* High-Res Portrait Frame */}
              <div className="relative bg-black border border-amber-500/40 rounded-xs overflow-hidden shadow-2xl group h-64 sm:h-auto min-h-[220px]">
                {selectedSuspect.imageUrl ? (
                  <img
                    src={selectedSuspect.imageUrl}
                    alt={selectedSuspect.name}
                    className="w-full h-full object-cover filter contrast-125"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center font-bold text-2xl text-white">
                    {selectedSuspect.name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded-xs border border-white/20 text-[9px] font-mono text-amber-400 font-bold uppercase">
                  MUGSHOT #084
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded-xs border border-white/20 text-[9px] font-mono text-gray-300">
                  3:4 NOIR PROJECTION
                </div>
              </div>

              {/* Suspect Bio & Prompt Metadata */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{selectedSuspect.name}</h3>
                    <p className="text-xs font-mono text-amber-500">{selectedSuspect.title} • Age {selectedSuspect.age}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xs space-y-1 text-xs text-gray-300 font-mono">
                    <span className="text-[9px] text-[#777] uppercase block font-bold">Public Personality:</span>
                    <p className="font-sans italic">{selectedSuspect.personality}</p>
                  </div>

                  {/* AI Image Generation Prompt Box */}
                  <div className="bg-black/80 border border-amber-500/30 p-2.5 rounded-xs space-y-1">
                    <span className="text-[9px] font-mono text-amber-400 uppercase block font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Procedural AI Image Prompt:
                    </span>
                    <p className="text-[11px] font-mono text-gray-300 leading-tight line-clamp-4 italic">
                      "{selectedSuspect.imagePrompt || 'Noir film style portrait'}"
                    </p>
                  </div>
                </div>

                {/* Regenerate Portrait Button */}
                <button
                  onClick={() => {
                    const newSeed = Math.floor(Math.random() * 9999);
                    const newUrl = generateSuspectPortraitUrl(selectedSuspect, caseFile.theme, newSeed);
                    selectedSuspect.imageUrl = newUrl;
                    setViewingMugshot(false);
                    setTimeout(() => setViewingMugshot(true), 100);
                    soundFx.playPaperRustle();
                  }}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xs text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-Generate AI Noir Mugshot</span>
                </button>
              </div>
            </div>

            <div className="text-[9px] font-mono text-center text-[#777] pt-2 border-t border-white/10 uppercase">
              Procedurally bound to case records • Case File AI Detective Engine
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
