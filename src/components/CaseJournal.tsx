import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Star, 
  Trash2, 
  Pin, 
  Compass, 
  MessageSquare, 
  FileText, 
  CheckCircle2,
  Calendar,
  Filter,
  X
} from 'lucide-react';
import { CaseFile, JournalEntry } from '../types';
import { 
  appendJournalEntry, 
  toggleStarJournalEntry, 
  deleteJournalEntry,
  createInitialJournalEntries 
} from '../lib/journal';

interface CaseJournalProps {
  caseFile: CaseFile;
  onUpdateCaseFile: (updated: CaseFile) => void;
  onPinToCorkboard?: (title: string, content: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const CaseJournal: React.FC<CaseJournalProps> = ({
  caseFile,
  onUpdateCaseFile,
  onPinToCorkboard,
  onNavigateToTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Ensure journal entries exist
  const entries: JournalEntry[] = (caseFile.journalEntries && caseFile.journalEntries.length > 0)
    ? caseFile.journalEntries
    : createInitialJournalEntries(caseFile);

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const updated = appendJournalEntry(caseFile, {
      type: 'note',
      title: noteTitle.trim(),
      description: noteContent.trim(),
      categoryTag: 'FIELD NOTE',
      isCustomNote: true
    });

    onUpdateCaseFile(updated);
    setNoteTitle('');
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleToggleStar = (entryId: string) => {
    const updated = toggleStarJournalEntry(caseFile, entryId);
    onUpdateCaseFile(updated);
  };

  const handleDeleteEntry = (entryId: string) => {
    const updated = deleteJournalEntry(caseFile, entryId);
    onUpdateCaseFile(updated);
  };

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.categoryTag && entry.categoryTag.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'starred') return entry.starred;
    if (filterType === 'discovery') return entry.type === 'discovery';
    if (filterType === 'interrogation') return entry.type === 'interrogation';
    if (filterType === 'location') return entry.type === 'location';
    if (filterType === 'note') return entry.type === 'note' || entry.isCustomNote;

    return true;
  });

  // Calculate stats
  const totalEntries = entries.length;
  const totalDiscoveries = entries.filter((e) => e.type === 'discovery').length;
  const totalInterrogations = entries.filter((e) => e.type === 'interrogation').length;
  const totalNotes = entries.filter((e) => e.isCustomNote || e.type === 'note').length;

  const getTypeStyle = (type: JournalEntry['type']) => {
    switch (type) {
      case 'discovery':
        return {
          border: 'border-l-amber-500',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <FileText className="w-4 h-4 text-amber-500" />
        };
      case 'interrogation':
        return {
          border: 'border-l-sky-500',
          badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          icon: <MessageSquare className="w-4 h-4 text-sky-400" />
        };
      case 'location':
        return {
          border: 'border-l-emerald-500',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <Compass className="w-4 h-4 text-emerald-400" />
        };
      case 'note':
        return {
          border: 'border-l-purple-500',
          badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: <BookOpen className="w-4 h-4 text-purple-400" />
        };
      default:
        return {
          border: 'border-l-red-500',
          badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
          icon: <Calendar className="w-4 h-4 text-red-500" />
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-2 sm:p-4">
      {/* Top Banner & Header */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-black/80 border border-amber-500/40 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              Automated Field Journal & Investigation Ledger
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              CASE LOGBOOK & DISCOVERIES
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="px-4 py-2 rounded-sm bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider border border-red-500 shadow-xl flex items-center gap-2 cursor-pointer transition-all"
        >
          {isAddingNote ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAddingNote ? 'Close Note Form' : '+ Add Field Note'}</span>
        </button>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-3.5 text-center">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Total Events Logged</span>
          <p className="text-xl font-bold text-white mt-0.5">{totalEntries}</p>
        </div>
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-3.5 text-center">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Evidence Uncovered</span>
          <p className="text-xl font-bold text-amber-500 mt-0.5">{totalDiscoveries}</p>
        </div>
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-3.5 text-center">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Interrogations</span>
          <p className="text-xl font-bold text-sky-400 mt-0.5">{totalInterrogations}</p>
        </div>
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-3.5 text-center">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Detective Notes</span>
          <p className="text-xl font-bold text-purple-400 mt-0.5">{totalNotes}</p>
        </div>
      </div>

      {/* Add Custom Field Note Form Modal/Collapsible */}
      {isAddingNote && (
        <form 
          onSubmit={handleAddCustomNote} 
          className="bg-[#0c0c0d] border border-amber-500/40 rounded-sm p-5 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-mono uppercase font-bold text-amber-500 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Log Custom Detective Observation
            </h3>
            <span className="text-[10px] font-mono text-[#777]">Saves automatically to active case file</span>
          </div>

          <div className="space-y-3 font-sans">
            <div>
              <label className="text-[10px] font-mono text-[#777] uppercase block mb-1">Title / Lead Heading</label>
              <input
                type="text"
                placeholder="e.g. Suspicious smudge on library mantlepiece..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#777] uppercase block mb-1">Observation Details</label>
              <textarea
                placeholder="Write your deduction, hypothesis, or note here..."
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-sm p-3 text-xs text-[#d1d1d1] focus:outline-none focus:border-amber-500 resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-[#777] text-xs font-mono uppercase font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#777] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search journal log entries, evidence, statements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-sm pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white/30 font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-sm cursor-pointer transition-colors border uppercase text-[10px] font-bold ${
              filterType === 'all'
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/5 text-[#777] border-white/10 hover:text-white'
            }`}
          >
            All ({entries.length})
          </button>

          <button
            onClick={() => setFilterType('discovery')}
            className={`px-3 py-1 rounded-sm cursor-pointer transition-colors border uppercase text-[10px] font-bold ${
              filterType === 'discovery'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-white/5 text-[#777] border-white/10 hover:text-white'
            }`}
          >
            Evidence ({totalDiscoveries})
          </button>

          <button
            onClick={() => setFilterType('interrogation')}
            className={`px-3 py-1 rounded-sm cursor-pointer transition-colors border uppercase text-[10px] font-bold ${
              filterType === 'interrogation'
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'bg-white/5 text-[#777] border-white/10 hover:text-white'
            }`}
          >
            Interrogation ({totalInterrogations})
          </button>

          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1 rounded-sm cursor-pointer transition-colors border uppercase text-[10px] font-bold ${
              filterType === 'note'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-white/5 text-[#777] border-white/10 hover:text-white'
            }`}
          >
            Notes ({totalNotes})
          </button>

          <button
            onClick={() => setFilterType('starred')}
            className={`px-3 py-1 rounded-sm cursor-pointer transition-colors border uppercase text-[10px] font-bold flex items-center gap-1 ${
              filterType === 'starred'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-[#777] border-white/10 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Starred
          </button>
        </div>
      </div>

      {/* Journal Entry Timeline Feed */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-8 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-[#555] mx-auto" />
            <p className="text-xs text-[#777] font-mono">No matching journal log entries found.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const style = getTypeStyle(entry.type);

            return (
              <div
                key={entry.id}
                className={`bg-[#0c0c0d] border border-white/10 border-l-4 ${style.border} rounded-sm p-4 shadow-lg transition-all hover:bg-white/[0.02] space-y-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Tag */}
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${style.badgeBg} flex items-center gap-1`}>
                      {style.icon}
                      {entry.categoryTag || entry.type.toUpperCase()}
                    </span>

                    {/* Timestamp */}
                    <span className="text-[10px] font-mono text-[#777] bg-black/60 border border-white/5 px-2 py-0.5 rounded-xs">
                      {entry.timestamp}
                    </span>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {/* Star toggle */}
                    <button
                      onClick={() => handleToggleStar(entry.id)}
                      className={`p-1 rounded-xs hover:bg-white/10 transition-colors cursor-pointer ${
                        entry.starred ? 'text-amber-400' : 'text-[#555] hover:text-[#d1d1d1]'
                      }`}
                      title={entry.starred ? 'Unstar Entry' : 'Star Entry'}
                    >
                      <Star className={`w-4 h-4 ${entry.starred ? 'fill-amber-400' : ''}`} />
                    </button>

                    {/* Pin to Corkboard */}
                    {onPinToCorkboard && (
                      <button
                        onClick={() => onPinToCorkboard(entry.title, entry.description)}
                        className="p-1 rounded-xs text-[#777] hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Pin this journal note to Corkboard / Deduction Board"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete entry if custom note */}
                    {entry.isCustomNote && (
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 rounded-xs text-[#555] hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{entry.title}</h4>
                  <p className="text-xs text-[#d1d1d1] font-sans leading-relaxed mt-1 whitespace-pre-line bg-black/40 p-3 rounded-sm border border-white/5">
                    {entry.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
