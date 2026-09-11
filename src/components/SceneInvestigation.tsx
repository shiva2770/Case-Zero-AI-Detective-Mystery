import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Eye, 
  Pin, 
  MessageSquare, 
  AlertTriangle, 
  Sparkles,
  Loader2,
  Filter
} from 'lucide-react';
import { CaseFile, Clue, InvestigationLocation } from '../types';
import { appendJournalEntry } from '../lib/journal';
import { soundFx } from '../lib/audio';
import { InvestigationThinkingSkeleton, FloatingDetectiveThinking } from './DetectiveThinking';

interface SceneInvestigationProps {
  caseFile: CaseFile;
  onUpdateCaseFile: (updated: CaseFile) => void;
  onPinClueToCorkboard: (clue: Clue) => void;
  onNavigateToInterrogateWithClue?: (clueId: string) => void;
}

export const SceneInvestigation: React.FC<SceneInvestigationProps> = ({
  caseFile,
  onUpdateCaseFile,
  onPinClueToCorkboard,
  onNavigateToInterrogateWithClue
}) => {
  const [selectedLocation, setSelectedLocation] = useState<InvestigationLocation | null>(
    caseFile.locations[0] || null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchNarrative, setSearchNarrative] = useState<string | null>(null);
  const [selectedClueModal, setSelectedClueModal] = useState<Clue | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const discoveredClues = caseFile.clues.filter(c => c.isDiscovered);
  const filteredClues = discoveredClues.filter(c => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  const handleSearchLocation = async (location: InvestigationLocation) => {
    setIsSearching(true);
    setSearchNarrative(null);

    try {
      const response = await fetch('/api/investigate-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseFile, locationId: location.id })
      });
      const data = await response.json();

      if (data.success) {
        setSearchNarrative(data.narration);

        // Unlock clues
        const updatedClues = caseFile.clues.map(clue => {
          if (data.unlockedClueIds.includes(clue.id) || location.clueIds.includes(clue.id)) {
            return { ...clue, isDiscovered: true };
          }
          return clue;
        });

        const updatedLocations = caseFile.locations.map(loc => {
          if (loc.id === location.id) {
            return { ...loc, isSearched: true };
          }
          return loc;
        });

        let updatedCase: CaseFile = {
          ...caseFile,
          clues: updatedClues,
          locations: updatedLocations
        };

        // Auto-log location search event
        updatedCase = appendJournalEntry(updatedCase, {
          type: 'location',
          title: `Searched Location: ${location.name}`,
          description: data.narration || location.description,
          categoryTag: 'LOCATION SEARCH',
          refId: location.id
        });

        // Auto-log newly unlocked evidence clues
        const newlyDiscovered = updatedClues.filter(
          c => c.isDiscovered && !caseFile.clues.find(orig => orig.id === c.id && orig.isDiscovered)
        );

        if (newlyDiscovered.length > 0) {
          soundFx.playClueDiscoveredSting();
        } else {
          soundFx.playFootstep();
        }

        newlyDiscovered.forEach(clue => {
          updatedCase = appendJournalEntry(updatedCase, {
            type: 'discovery',
            title: `Uncovered Evidence: ${clue.title}`,
            description: `${clue.description} (Discovered at ${location.name})`,
            categoryTag: 'EVIDENCE UNCOVERED',
            refId: clue.id
          });
        });

        onUpdateCaseFile(updatedCase);
        setSelectedLocation({ ...location, isSearched: true });
      }
    } catch (e) {
      console.error('Failed to search location:', e);
      setSearchNarrative(`You examine ${location.name} thoroughly and uncover key evidence.`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Top Title & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
            Crime Scene & Location Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            FORENSIC INSPECTION DECK
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-black/60 px-3 py-1.5 rounded-sm border border-white/10 text-[#d1d1d1]">
            Locations Searched: <span className="text-amber-500 font-bold">{caseFile.locations.filter(l => l.isSearched).length} / {caseFile.locations.length}</span>
          </div>
          <div className="bg-black/60 px-3 py-1.5 rounded-sm border border-white/10 text-[#d1d1d1]">
            Clues Discovered: <span className="text-amber-500 font-bold">{discoveredClues.length} / {caseFile.clues.length}</span>
          </div>
        </div>
      </div>

      {/* Floating / Fading Detective Thinking Feedback */}
      <FloatingDetectiveThinking
        isVisible={isSearching}
        context="investigation"
        targetName={selectedLocation?.name}
      />

      {/* Grid: Locations Selector + Location Detail / Inspection Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations Navigation List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold px-1">
            Investigation Sites
          </h3>
          <div className="space-y-2.5">
            {caseFile.locations.map(loc => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setSearchNarrative(null);
                  }}
                  className={`w-full text-left p-4 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-white/20 shadow-lg text-white'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#d1d1d1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm flex items-center gap-2 truncate">
                      <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-500' : 'text-[#777]'}`} />
                      <span className="truncate">{loc.name}</span>
                    </span>
                    {loc.isSearched ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-green-900/40 text-green-400 border border-green-800/60 flex items-center gap-1 uppercase font-bold shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Searched
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-white/5 text-[#777] uppercase font-bold shrink-0">
                        Unsearched
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#999] line-clamp-2">{loc.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Location Viewer & Search Trigger */}
        <div className="lg:col-span-2 bg-[#0c0c0d] border border-white/10 rounded-sm p-6 shadow-xl space-y-6">
          {selectedLocation ? (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold block">
                    Active Inspection Site
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {selectedLocation.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleSearchLocation(selectedLocation)}
                  disabled={isSearching}
                  className="px-5 py-2.5 rounded-sm bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-red-500 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning Scene...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{selectedLocation.isSearched ? 'Re-examine Area' : 'Conduct Search'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Location Ambiance Box */}
              <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-[#777] uppercase block">Ambiance & Atmosphere</span>
                <p className="text-xs sm:text-sm text-[#d1d1d1] italic leading-relaxed">
                  "{selectedLocation.ambiance}"
                </p>
                <p className="text-xs text-[#999] pt-1">
                  {selectedLocation.description}
                </p>
              </div>

              {/* Detective Thinking & Forensic Search Skeleton */}
              {isSearching && (
                <InvestigationThinkingSkeleton locationName={selectedLocation.name} />
              )}

              {/* Live Search Narration Output */}
              {!isSearching && searchNarrative && (
                <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-2 animate-fade-in">
                  <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Forensic Discovery Log
                  </span>
                  <p className="text-xs sm:text-sm text-[#d1d1d1] leading-relaxed">
                    {searchNarrative}
                  </p>
                </div>
              )}

              {/* Unlocked Clues in this location */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
                  Clues Found at This Location
                </h4>
                {caseFile.clues.filter(c => c.isDiscovered && selectedLocation.clueIds.includes(c.id)).length === 0 ? (
                  <p className="text-xs text-[#777] italic font-mono bg-black/60 p-3 rounded-sm border border-white/10">
                    No physical evidence logged here yet. Click "Conduct Search" above to inspect the area.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {caseFile.clues.filter(c => c.isDiscovered && selectedLocation.clueIds.includes(c.id)).map(clue => (
                      <div 
                        key={clue.id} 
                        onClick={() => setSelectedClueModal(clue)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm p-3 cursor-pointer transition-all space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-amber-500/20 text-amber-400 uppercase font-bold border border-amber-500/40">
                            {clue.type}
                          </span>
                          <Eye className="w-3.5 h-3.5 text-[#777] group-hover:text-amber-500 transition-colors" />
                        </div>
                        <h5 className="font-bold text-sm text-white group-hover:text-amber-400">
                          {clue.title}
                        </h5>
                        <p className="text-xs text-[#999] line-clamp-2">{clue.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#777] font-mono text-sm">
              Select an investigation site from the left pane.
            </div>
          )}
        </div>
      </div>

      {/* Discovered Clues Catalog & Inspection Deck */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              EVIDENCE & CLUE VAULT ({discoveredClues.length})
            </h3>
            <p className="text-xs text-[#777] font-mono">
              Click any evidence item to inspect details or pin it directly onto the Corkboard.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-sm border border-white/10 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-[#777] ml-2 mr-1" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-xs cursor-pointer transition-colors ${
                filterType === 'all' ? 'bg-white/10 text-white font-bold border border-white/20' : 'text-[#777] hover:text-[#d1d1d1]'
              }`}
            >
              All ({discoveredClues.length})
            </button>
            <button
              onClick={() => setFilterType('physical')}
              className={`px-2.5 py-1 rounded-xs cursor-pointer transition-colors ${
                filterType === 'physical' ? 'bg-white/10 text-white font-bold border border-white/20' : 'text-[#777] hover:text-[#d1d1d1]'
              }`}
            >
              Physical
            </button>
            <button
              onClick={() => setFilterType('testimonial')}
              className={`px-2.5 py-1 rounded-xs cursor-pointer transition-colors ${
                filterType === 'testimonial' ? 'bg-white/10 text-white font-bold border border-white/20' : 'text-[#777] hover:text-[#d1d1d1]'
              }`}
            >
              Testimonial
            </button>
          </div>
        </div>

        {/* Clues Cards Grid */}
        {filteredClues.length === 0 ? (
          <div className="text-center py-8 text-[#777] font-mono text-xs">
            No clues matching this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClues.map(clue => (
              <div 
                key={clue.id}
                className="bg-white/5 border border-white/10 hover:border-amber-500/50 rounded-sm p-4 shadow-lg flex flex-col justify-between space-y-3 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase font-bold">
                      {clue.type}
                    </span>
                    <span className="text-[10px] font-mono text-[#777]">
                      {clue.locationFound}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                    {clue.title}
                  </h4>

                  <p className="text-xs text-[#d1d1d1] leading-relaxed">
                    {clue.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClueModal(clue)}
                    className="text-xs font-mono text-[#777] hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => onPinClueToCorkboard(clue)}
                    className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-white/15 text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer uppercase"
                  >
                    <Pin className="w-3 h-3" />
                    <span>Pin to Board</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clue Inspector Modal */}
      {selectedClueModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0c0d] border border-white/20 rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase text-amber-500 font-bold flex items-center gap-1.5 tracking-widest">
                <FileText className="w-4 h-4" /> Evidence File Detail
              </span>
              <button
                onClick={() => setSelectedClueModal(null)}
                className="text-[#777] hover:text-white text-lg font-bold font-mono px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white">
                  {selectedClueModal.title}
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase font-bold shrink-0">
                  {selectedClueModal.type}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-[#777] uppercase block">Found At</span>
                <span className="text-xs font-mono text-[#d1d1d1]">{selectedClueModal.locationFound}</span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-[#777] uppercase block">Physical Description</span>
                <p className="text-xs sm:text-sm text-[#d1d1d1] leading-relaxed bg-white/5 p-3 rounded-sm border border-white/10">
                  {selectedClueModal.description}
                </p>
              </div>

              {selectedClueModal.detailedAnalysis && (
                <div>
                  <span className="text-[9px] font-mono text-amber-500 uppercase block font-bold">Forensic Analysis</span>
                  <p className="text-xs text-amber-400 font-mono bg-black/60 p-3 rounded-sm border border-white/10">
                    {selectedClueModal.detailedAnalysis}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
              {onNavigateToInterrogateWithClue && (
                <button
                  onClick={() => {
                    const cid = selectedClueModal.id;
                    setSelectedClueModal(null);
                    onNavigateToInterrogateWithClue(cid);
                  }}
                  className="px-3.5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>Present in Interrogation</span>
                </button>
              )}

              <button
                onClick={() => {
                  onPinClueToCorkboard(selectedClueModal);
                  setSelectedClueModal(null);
                }}
                className="px-4 py-2 rounded-sm bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-red-500"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>Pin to Corkboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
