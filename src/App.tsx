import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Plus,
  Download,
  RotateCcw,
  Search,
  UserCheck,
  Wrench,
  GraduationCap,
} from 'lucide-react';
import {
  BLOCKS,
  CATEGORIES,
  STATUS_ORDER,
  assignTechnician,
  computeMetrics,
  createInitialTickets,
  createTicket,
  loadTickets,
  saveTickets,
  ticketsToCsv,
  updateTicketStatus,
  upvoteTicket,
} from './data/store';
import { HostelBlock, IssueCategory, MaintenanceTicket, Priority, TicketStatus, UserRole } from './types';
import { ReportModal } from './components/ReportModal';
import { TicketCard } from './components/TicketCard';
import { AdminAnalytics } from './components/AdminAnalytics';

const ROLE_META: Array<{ id: UserRole; label: string; icon: typeof GraduationCap }> = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap },
  { id: 'WARDEN', label: 'Warden / Admin', icon: UserCheck },
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

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((curr) => (curr === msg ? null : curr)), 2600);
  };

  const metrics = useMemo(() => computeMetrics(tickets), [tickets]);

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
    category: IssueCategory;
    block: HostelBlock;
    room: string;
    priority: Priority;
    reportedBy: string;
    studentId: string;
    photoDataUrl?: string;
  }) => {
    setTickets((prev) => createTicket(prev, input));
    notify('Maintenance report submitted');
  };

  const handleUpvote = (id: string) => {
    setTickets((prev) => upvoteTicket(prev, id));
    notify(`Confirmed ${id} affects your block/room`);
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

  const handleExportCsv = () => {
    const csv = ticketsToCsv(tickets);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campuscare-maintenance-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setTickets(createInitialTickets());
    notify('Sample hostel data restored');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white leading-tight">Campus Care</h1>
              <p className="text-xs text-slate-400">Hostel Maintenance Portal | Muhammad Abdullahi Bukar</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Role Switcher */}
            <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              {ROLE_META.map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow"
              >
                <Plus className="w-4 h-4" /> Report Issue
              </button>
            )}

            {role === 'WARDEN' && (
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-medium text-slate-200"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            )}

            <button
              onClick={handleReset}
              title="Reset sample data"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Role Helper Banner */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>
            {role === 'STUDENT' && 'Student view: Report faulty lights, leaking taps, broken fans, or Wi-Fi problems and track repair progress.'}
            {role === 'WARDEN' && 'Warden / Admin view: Review open issues across all hostel blocks, assign technicians, and export CSV logs.'}
            {role === 'TECHNICIAN' && 'Technician view: Update job status (In Progress / Resolved) and add repair notes visible to students.'}
          </span>
          <span className="text-slate-500">Data saved in browser storage</span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-xs text-slate-400">Open Issues</div>
            <div className="text-2xl font-bold text-white mt-1">{metrics.open}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-xs text-slate-400">Urgent Open</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{metrics.urgent}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-xs text-slate-400">In Progress</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.inProgress}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="text-xs text-slate-400">Resolved</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.resolved}</div>
          </div>
        </div>

        {/* Warden Block & Category Breakdown */}
        {role === 'WARDEN' && (
          <AdminAnalytics byBlock={metrics.byBlock} byCategory={metrics.byCategory} total={metrics.total} />
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by room, issue, ID, or student..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
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
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket List */}
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              role={role}
              onUpvote={handleUpvote}
              onAssign={handleAssign}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}

          {filteredTickets.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center text-sm text-slate-500">
              No maintenance reports match your current filters.
            </div>
          )}
        </div>
      </main>

      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} onSubmit={handleCreate} />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-sm text-emerald-100 shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
