import { useState } from 'react';
import {
  ThumbsUp,
  MapPin,
  Wrench,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { STATUS_ORDER, TECHNICIANS } from '../data/store';
import { MaintenanceTicket, Priority, TicketStatus, UserRole } from '../types';

interface TicketCardProps {
  ticket: MaintenanceTicket;
  role: UserRole;
  onUpvote: (id: string) => void;
  onAssign: (id: string, technician: string) => void;
  onUpdateStatus: (id: string, status: TicketStatus, note: string) => void;
}

const PRIORITY_BADGE: Record<Priority, string> = {
  Urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  High: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Medium: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Low: 'bg-slate-600/25 text-slate-300 border-slate-600/40',
};

const STATUS_BADGE: Record<TicketStatus, string> = {
  Submitted: 'bg-slate-700/50 text-slate-200 border-slate-600',
  Assigned: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export function TicketCard({
  ticket,
  role,
  onUpvote,
  onAssign,
  onUpdateStatus,
}: TicketCardProps) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [repairNote, setRepairNote] = useState('');
  const [nextStatus, setNextStatus] = useState<TicketStatus>(
    ticket.status === 'Submitted'
      ? 'In Progress'
      : ticket.status === 'Assigned'
      ? 'In Progress'
      : 'Resolved'
  );

  const stepIndex = STATUS_ORDER.indexOf(ticket.status);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition p-4 sm:p-5 space-y-4">
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[ticket.status]}`}>
              {ticket.status}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${PRIORITY_BADGE[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {ticket.category}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white">{ticket.title}</h3>
          <p className="text-sm text-slate-400">{ticket.description}</p>
        </div>

        {role === 'STUDENT' && (
          <button
            onClick={() => onUpvote(ticket.id)}
            title="Confirm this issue also affects you"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-500 text-xs font-medium text-slate-200"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            Same issue ({ticket.upvotes})
          </button>
        )}
      </div>

      {ticket.photoDataUrl && (
        <img
          src={ticket.photoDataUrl}
          alt={ticket.title}
          className="h-36 w-full sm:w-64 object-cover rounded-xl border border-slate-800"
        />
      )}

      {/* 4-Step Visual Progress Tracker */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {STATUS_ORDER.map((step, idx) => {
          const done = idx <= stepIndex;
          return (
            <div key={step} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  done
                    ? ticket.status === 'Resolved'
                      ? 'bg-emerald-400'
                      : 'bg-sky-400'
                    : 'bg-slate-800'
                }`}
              />
              <div className={`text-[11px] flex items-center gap-1 ${done ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                {done && idx === 3 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Location, Reporter, Technician */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {ticket.block} · Room {ticket.room}
          </span>
          <span className="inline-flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-sky-400" />
            {ticket.assignedTo ? ticket.assignedTo : 'Unassigned'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Reported by {ticket.reportedBy}
          </span>
        </div>

        <button
          onClick={() => setShowTimeline((v) => !v)}
          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
        >
          Updates ({ticket.timeline.length})
          {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Warden Controls */}
      {role === 'WARDEN' && ticket.status !== 'Resolved' && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">Assign technician:</span>
          <select
            value={ticket.assignedTo ?? ''}
            onChange={(e) => {
              if (e.target.value) onAssign(ticket.id, e.target.value);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
          >
            <option value="">Select staff...</option>
            {TECHNICIANS.map((tech) => (
              <option key={tech.id} value={tech.name}>
                {tech.name} ({tech.specialty})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Technician Controls */}
      {role === 'TECHNICIAN' && ticket.status !== 'Resolved' && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <select
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value as TicketStatus)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
          >
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <input
            value={repairNote}
            onChange={(e) => setRepairNote(e.target.value)}
            placeholder="Add repair note (e.g. replaced tap washer)..."
            className="flex-1 min-w-[200px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
          />
          <button
            onClick={() => {
              onUpdateStatus(ticket.id, nextStatus, repairNote);
              setRepairNote('');
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
          >
            Save Update
          </button>
        </div>
      )}

      {/* Maintenance Timeline */}
      {showTimeline && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          {ticket.timeline.map((item, i) => (
            <div key={i} className="text-xs flex flex-wrap justify-between gap-2 bg-slate-950/70 px-3 py-2 rounded-lg">
              <div>
                <span className="font-semibold text-slate-200">{item.actor}:</span>{' '}
                <span className="text-slate-300">{item.note}</span>
              </div>
              <span className="text-slate-500 font-mono">{new Date(item.at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
