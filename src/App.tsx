import { useEffect, useMemo, useState } from 'react';
import {
  Home,
  Plus,
  Download,
  RotateCcw,
  Search,
  UserCheck,
  Wrench,
  GraduationCap,
  Sun,
  Moon,
} from 'lucide-react';
import {
  BLOCKS,
  STATUS_ORDER,
  assignTechnician,
  computeMetrics,
  createInitialTickets,
  createTicket,
  loadTickets,
  rateTicket,
  reopenTicket,
  saveTickets,
  ticketsToCsv,
  updateTicketStatus,
  upvoteTicket,
} from './data/store';
import { HostelBlock, MaintenanceTicket, Priority, TicketStatus, UserRole } from './types';
import { ReportModal } from './components/ReportModal';
import { TicketCard } from './components/TicketCard';
import { AdminAnalytics } from './components/AdminAnalytics';
import { MaintenanceBackdrop } from './components/MaintenanceBackdrop';

const ROLE_META: Array<{ id: UserRole; label: string; icon: typeof GraduationCap }> = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap },
  { id: 'WARDEN', label: 'Warden', icon: UserCheck },
  { id: 'TECHNICIAN', label: 'Technician', icon: Wrench },
];

export default function App() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => loadTickets());
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('campuscare_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('campuscare_theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((curr) => (curr === msg ? null : curr)), 2600);
  };

  const metrics = useMemo(() => computeMetrics(tickets), [tickets]);

  const allCategories = useMemo(() => {
    const set = new Set<string>(tickets.map((t) => t.category));
    return Array.from(set).sort();
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (blockFilter !== 'ALL' && t.block !== blockFilter) return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (q) {
        const hay = `${t.id} ${t.title} ${t.description} ${t.room} ${t.block} ${t.category} ${t.reportedBy}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tickets, search, blockFilter, categoryFilter, statusFilter]);

  const handleCreate = (input: {
    title: string;
    description: string;
    category: string;
    block: HostelBlock;
    room: string;
    priority: Priority;
    reportedBy: string;
    studentId: string;
    phone: string;
    preferredTime: string;
    photoDataUrl?: string;
  }) => {
    setTickets((prev) => createTicket(prev, input));
    notify('Maintenance request submitted');
  };

  const handleUpvote = (id: string) => {
    setTickets((prev) => upvoteTicket(prev, id));
    notify(`Confirmed ${id} affects your room/block`);
  };

  const handleAssign = (id: string, technician: string) => {
    setTickets((prev) => assignTechnician(prev, id, technician));
    notify(`Assigned ${id} to ${technician}`);
  };

  const handleUpdateStatus = (id: string, status: TicketStatus, note: string) => {
    const target = tickets.find((t) => t.id === id);
    const actor = target?.assignedTo ?? 'Maintenance Staff';
    setTickets((prev) => updateTicketStatus(prev, id, status, note, actor));
    notify(`Updated ${id} to ${status}`);
  };

  const handleRate = (id: string, rating: number, feedback: string) => {
    setTickets((prev) => rateTicket(prev, id, rating, feedback));
    notify(`Thanks for rating ${id} (${rating}/5)`);
  };

  const handleReopen = (id: string, reason: string) => {
    setTickets((prev) => reopenTicket(prev, id, reason));
    notify(`Reopened ${id} for follow-up`);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id).catch(() => {});
    notify(`Copied reference ${id}`);
  };

  const handleExportCsv = () => {
    const csv = ticketsToCsv(tickets);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-care-maintenance-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setTickets(createInitialTickets());
    notify('Sample hostel records restored');
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] dark:bg-[#0E1624] text-[#132238] dark:text-slate-100 relative overflow-x-hidden transition-colors">
      <MaintenanceBackdrop />

      {/* Architectural Deep-Navy Top Banner */}
      <header className="relative z-10 bg-[#132238] dark:bg-[#0A101B] text-white border-b-4 border-[#D95D39]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D95D39] flex items-center justify-center text-white shadow-sm">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight leading-tight">Campus Care</h1>
              <p className="text-xs text-slate-300">Hostel Maintenance Desk · Muhammad Abdullahi Bukar</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-[#1D314F] p-1 border border-white/10">
              {ROLE_META.map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      active ? 'bg-white text-[#132238] shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {r.label}
                  </button>
                );
              })}
            </div>

            {role === 'STUDENT' && (
              <button
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D95D39] hover:bg-[#C14B29] text-xs font-bold text-white shadow-sm"
              >
                <Plus className="w-4 h-4" /> Report an Issue
              </button>
            )}

            {role === 'WARDEN' && (
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B6B5A] hover:bg-[#145446] text-xs font-semibold text-white"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            )}

            <button
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#1D314F] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-300" />}
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset sample records"
              className="p-2 rounded-xl bg-[#1D314F] text-slate-300 hover:text-white border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Role Context Strip */}
        <div className="rounded-xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] px-4 py-3 text-xs text-[#475569] dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>
            {role === 'STUDENT' && (
              <>
                <b className="text-[#132238] dark:text-white">Student Portal:</b> Report faulty lights, leaking taps, broken fans, Wi-Fi issues, or write your own custom issue under <b>Other</b>.
              </>
            )}
            {role === 'WARDEN' && (
              <>
                <b className="text-[#132238] dark:text-white">Warden Office:</b> Monitor open repairs across Blocks A–D, assign technicians, and download CSV logs.
              </>
            )}
            {role === 'TECHNICIAN' && (
              <>
                <b className="text-[#132238] dark:text-white">Maintenance Staff:</b> Update job progress and post repair notes directly to the student&apos;s ticket.
              </>
            )}
          </span>
          <span className="text-[#94A3B8] dark:text-slate-500">Saved locally in your browser</span>
        </div>

        {/* Stat Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] p-4 border-l-4 border-l-[#132238] dark:border-l-sky-400">
            <div className="text-xs font-medium text-[#64748B] dark:text-slate-400">Open Reports</div>
            <div className="text-2xl font-extrabold text-[#132238] dark:text-white mt-1">{metrics.open}</div>
          </div>
          <div className="rounded-2xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] p-4 border-l-4 border-l-rose-600">
            <div className="text-xs font-medium text-[#64748B] dark:text-slate-400">Urgent Open</div>
            <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">{metrics.urgent}</div>
          </div>
          <div className="rounded-2xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] p-4 border-l-4 border-l-[#D95D39]">
            <div className="text-xs font-medium text-[#64748B] dark:text-slate-400">In Progress</div>
            <div className="text-2xl font-extrabold text-[#D95D39] dark:text-[#F07A57] mt-1">{metrics.inProgress}</div>
          </div>
          <div className="rounded-2xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] p-4 border-l-4 border-l-[#1B6B5A] dark:border-l-emerald-400">
            <div className="text-xs font-medium text-[#64748B] dark:text-slate-400">Resolved</div>
            <div className="text-2xl font-extrabold text-[#1B6B5A] dark:text-emerald-400 mt-1">{metrics.resolved}</div>
          </div>
        </div>

        {/* Warden Block & Category Charts */}
        {role === 'WARDEN' && (
          <AdminAnalytics byBlock={metrics.byBlock} byCategory={metrics.byCategory} total={metrics.total} />
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-2.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room, ticket ID (e.g. CC-104), issue, or student..."
              className="w-full bg-white/95 dark:bg-[#162133] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-10 pr-3 py-2 text-sm text-[#132238] dark:text-white focus:outline-none focus:border-[#D95D39]"
            />
          </div>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="bg-white/95 dark:bg-[#162133] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl px-3 py-2 text-xs font-semibold text-[#132238] dark:text-slate-100"
          >
            <option value="ALL">All Blocks</option>
            {BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/95 dark:bg-[#162133] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl px-3 py-2 text-xs font-semibold text-[#132238] dark:text-slate-100"
          >
            <option value="ALL">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/95 dark:bg-[#162133] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl px-3 py-2 text-xs font-semibold text-[#132238] dark:text-slate-100"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket Feed */}
        <div className="space-y-3.5">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              role={role}
              onUpvote={handleUpvote}
              onAssign={handleAssign}
              onUpdateStatus={handleUpdateStatus}
              onRate={handleRate}
              onReopen={handleReopen}
              onCopyId={handleCopyId}
            />
          ))}

          {filteredTickets.length === 0 && (
            <div className="rounded-2xl bg-white border border-dashed border-[#CFCBC0] p-10 text-center text-sm text-[#64748B]">
              No maintenance reports match your current filters.
            </div>
          )}
        </div>
      </main>

      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} onSubmit={handleCreate} />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#132238] text-white text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
