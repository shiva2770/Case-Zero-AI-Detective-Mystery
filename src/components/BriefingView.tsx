import React from 'react';
import { 
  FileText, 
  MapPin, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  User, 
  CheckCircle2, 
  Search, 
  Building,
  HelpCircle
} from 'lucide-react';
import { CaseFile } from '../types';
import { CASE_PACKS, RECURRING_NPCS } from '../data/casePacks';

interface BriefingViewProps {
  caseFile: CaseFile;
  onNavigateToTab: (tab: string) => void;
  onOpenHowToPlay?: () => void;
}

export const BriefingView: React.FC<BriefingViewProps> = ({ caseFile, onNavigateToTab, onOpenHowToPlay }) => {
  const pack = CASE_PACKS[caseFile.theme] || CASE_PACKS.noir_1940s;
  const victim = caseFile.victim;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Noir Header Banner */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
          <FileText className="w-64 h-64 text-amber-500" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
              Official Police Case Record • Confidential
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {caseFile.title.toUpperCase()}
            </h2>
            <p className="text-xs text-[#999] font-mono mt-1">
              Setting: {pack.title} ({pack.era}) • Difficulty: <span className="uppercase text-amber-500 font-bold">{caseFile.difficulty}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHowToPlay && (
              <button
                onClick={onOpenHowToPlay}
                className="px-3 py-2.5 rounded-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>How to Play</span>
              </button>
            )}

            <button
              onClick={() => onNavigateToTab('investigation')}
              className="px-5 py-2.5 rounded-sm bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-red-500 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Crime Scene</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[#d1d1d1] text-xs sm:text-sm leading-relaxed font-sans italic border-l-2 border-amber-500 pl-4 py-1.5 bg-white/5 rounded-r-sm">
          "{pack.description}"
        </p>
      </div>

      {/* Main Grid: Victim Dossier & Incident Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Victim Card */}
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl relative space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-500" />
              Victim Dossier
            </h3>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-red-900/40 text-red-400 border border-red-800/60 uppercase font-bold">
              DECEASED
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs sm:text-sm">
            <div>
              <span className="text-[#777] font-mono text-[10px] uppercase block">Full Name</span>
              <span className="text-white font-bold text-base">{victim.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[#777] font-mono text-[10px] uppercase block">Occupation</span>
                <span className="text-[#d1d1d1] font-medium">{victim.occupation}</span>
              </div>
              <div>
                <span className="text-[#777] font-mono text-[10px] uppercase block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" /> Time of Death
                </span>
                <span className="text-amber-500 font-mono font-bold">{victim.timeOfDeath}</span>
              </div>
            </div>

            <div>
              <span className="text-[#777] font-mono text-[10px] uppercase block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" /> Primary Location
              </span>
              <span className="text-[#d1d1d1] font-medium">{victim.locationFound}</span>
            </div>

            <div>
              <span className="text-[#777] font-mono text-[10px] uppercase block">Cause of Death</span>
              <span className="text-red-400 font-medium bg-red-950/40 px-2.5 py-1 rounded-sm border border-red-800/40 inline-block w-full text-xs">
                {victim.causeOfDeath}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-[#777] font-mono text-[10px] uppercase block mb-1">Background Bio</span>
              <p className="text-[#999] text-xs leading-relaxed italic bg-white/5 p-3 rounded-sm border border-white/10">
                {victim.briefBio}
              </p>
            </div>
          </div>
        </div>

        {/* Incident & Police Log */}
        <div className="md:col-span-2 space-y-6">
          {/* Incident Overview Card */}
          <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold flex items-center gap-2 border-b border-white/10 pb-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Incident Overview
            </h3>
            <p className="text-[#d1d1d1] text-xs sm:text-sm leading-relaxed bg-white/5 p-4 rounded-sm border border-white/10">
              {caseFile.incidentOverview}
            </p>

            <div className="pt-2">
              <h4 className="text-[10px] font-mono uppercase text-[#777] font-bold mb-1">Initial Police Forensic Log</h4>
              <p className="text-xs text-amber-400/90 font-mono bg-black/60 p-3 rounded-sm border border-white/10">
                {caseFile.policeReportSummary}
              </p>
            </div>
          </div>

          {/* Captain Hayes Memo */}
          <div className="bg-white/5 border border-white/10 rounded-sm p-4 shadow-lg flex items-start gap-3">
            <div className="w-9 h-9 rounded-sm bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{RECURRING_NPCS.captainHayes.name}</span>
                <span className="text-[10px] font-mono text-amber-500 uppercase">({RECURRING_NPCS.captainHayes.title})</span>
              </div>
              <p className="text-[#999] italic">
                "{RECURRING_NPCS.captainHayes.quotes[0]} Remember, questioning suspects blindly gets you nowhere. Cross-examine their alibis against physical clues on the Deduction Board before locking in your indictment."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suspects Overview Preview */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-500" />
              Prime Suspects under Surveillance ({caseFile.suspects.length})
            </h3>
            <p className="text-xs text-[#777] font-mono">
              Interrogate each suspect in the Interrogation Room to uncover secrets and test their alibis.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('interrogation')}
            className="text-xs font-mono text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
          >
            <span>Open Interrogation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {caseFile.suspects.map((suspect) => (
            <div 
              key={suspect.id}
              className="bg-white/5 border border-white/10 hover:border-amber-500/50 rounded-sm p-3.5 space-y-2 transition-all group cursor-pointer"
              onClick={() => onNavigateToTab('interrogation')}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-14 rounded-xs border border-amber-500/40 bg-black overflow-hidden shrink-0 group-hover:border-amber-400 transition-colors">
                  {suspect.imageUrl ? (
                    <img
                      src={suspect.imageUrl}
                      alt={suspect.name}
                      className="w-full h-full object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center font-bold text-sm text-white">
                      {suspect.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] font-mono text-amber-400 font-bold text-center tracking-tighter uppercase py-0.5 border-t border-amber-500/30">
                    NOIR PORTRAIT
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors truncate">
                    {suspect.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#777] truncate">{suspect.title}</p>
                </div>
              </div>

              <div className="text-xs text-[#d1d1d1] pt-2 border-t border-white/10 space-y-1">
                <span className="text-[9px] font-mono text-[#777] uppercase block">Claimed Alibi</span>
                <p className="line-clamp-2 text-[#999] text-[11px] italic">"{suspect.publicAlibi}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locations preview */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-amber-500" />
              Locations Available for Forensic Inspection
            </h3>
            <p className="text-xs text-[#777] font-mono">
              Search locations to unearth physical clues and testimonial evidence.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('investigation')}
            className="text-xs font-mono text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
          >
            <span>Search Locations</span>
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {caseFile.locations.map((loc) => (
            <div 
              key={loc.id}
              className="bg-white/5 border border-white/10 rounded-sm p-3.5 space-y-2 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => onNavigateToTab('investigation')}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{loc.name}</span>
                </h4>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
