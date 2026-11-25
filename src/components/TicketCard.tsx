import { useState } from 'react';
import {
  ThumbsUp,
  MapPin,
  Wrench,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Star,
  Phone,
  RotateCcw,
} from 'lucide-react';
import { STATUS_ORDER, TECHNICIANS } from '../data/store';
import { MaintenanceTicket, Priority, TicketStatus, UserRole } from '../types';

interface TicketCardProps {
  ticket: MaintenanceTicket;
  role: UserRole;
  anonymized?: boolean;
  onUpvote: (id: string) => void;
  onAssign: (id: string, technician: string) => void;
  onUpdateStatus: (id: string, status: TicketStatus, note: string) => void;
  onRate: (id: string, rating: number, feedback: string) => void;
  onReopen: (id: string, reason: string) => void;
  onCopyId: (id: string) => void;
}

const PRIORITY_BADGE: Record<Priority, string> = {
  Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  High: 'bg-amber-50 text-amber-800 border-amber-200',
  Medium: 'bg-sky-50 text-sky-800 border-sky-200',
  Low: 'bg-stone-100 text-stone-600 border-stone-200',
};

const STATUS_BADGE: Record<TicketStatus, string> = {
  Submitted: 'bg-stone-100 text-stone-700 border-stone-200',
  Assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'In Progress': 'bg-amber-50 text-amber-800 border-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export function TicketCard({
  ticket,
  role,
  anonymized = false,
  onUpvote,
  onAssign,
  onUpdateStatus,
  onRate,
  onReopen,
  onCopyId,
}: TicketCardProps) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [repairNote, setRepairNote] = useState('');
  const [nextStatus, setNextStatus] = useState<TicketStatus>(
    ticket.status === 'In Progress' ? 'Resolved' : 'In Progress'
  );
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showReopen, setShowReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const stepIndex = STATUS_ORDER.indexOf(ticket.status);

  return (
    <article className="rounded-2xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] shadow-[0_2px_10px_rgba(19,34,56,0.04)] hover:border-[#CFCBC0] dark:hover:border-slate-500 transition p-5 space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onCopyId(ticket.id)}
              title="Copy reference number"
              className="inline-flex items-center gap-1 text-xs font-bold font-mono text-[#132238] dark:text-slate-100 bg-[#F3F1EA] dark:bg-[#0E1624] hover:bg-[#E8E4D8] dark:hover:bg-slate-800 px-2 py-0.5 rounded-md"
            >
              {ticket.id} <Copy className="w-3 h-3 text-[#64748B]" />
            </button>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[ticket.status]}`}>
              {ticket.status}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${PRIORITY_BADGE[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FDF6F0] dark:bg-[#2B1D17] text-[#9A3412] dark:text-[#F4A286] border border-[#F5D0BE] dark:border-[#5E3021]">
              {ticket.category}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#132238] dark:text-white">{ticket.title}</h3>
          <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">{ticket.description}</p>
        </div>

        {role === 'STUDENT' && ticket.status !== 'Resolved' && (
          <button
            onClick={() => onUpvote(ticket.id)}
            title="Confirm this issue also affects you"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] hover:border-[#D95D39] text-xs font-semibold text-[#132238] dark:text-slate-100"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-[#D95D39]" />
            Same issue ({ticket.upvotes})
          </button>
        )}
      </div>

      {!anonymized && ticket.photoDataUrl && (
        <img
          src={ticket.photoDataUrl}
          alt={ticket.title}
          className="h-36 w-full sm:w-64 object-cover rounded-xl border border-[#E5E3DC]"
        />
      )}

      {/* 4-Step Progress Bar */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {STATUS_ORDER.map((step, idx) => {
          const done = idx <= stepIndex;
          return (
            <div key={step} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all ${
                  done
                    ? ticket.status === 'Resolved'
                      ? 'bg-[#1B6B5A]'
                      : 'bg-[#D95D39]'
                    : 'bg-[#ECEAE2]'
                }`}
              />
              <div className={`text-[11px] flex items-center gap-1 ${done ? 'text-[#132238] dark:text-slate-100 font-semibold' : 'text-[#94A3B8] dark:text-slate-500'}`}>
                {done && idx === 3 && <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6B5A] dark:text-emerald-400" />}
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] dark:text-slate-400 pt-3 border-t border-[#F0EFEA] dark:border-[#26354D]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-1 font-semibold text-[#132238] dark:text-slate-100">
            <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
            {anonymized ? `${ticket.block} · Shared / Another Room` : `${ticket.block} · Room ${ticket.room}`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-[#1B6B5A] dark:text-emerald-400" />
            {ticket.assignedTo ? ticket.assignedTo : 'Waiting for assignment'}
          </span>
          {!anonymized && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {ticket.preferredTime}
            </span>
          )}
          {role !== 'STUDENT' && (
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {ticket.reportedBy} ({ticket.phone})
            </span>
          )}
        </div>

        {!anonymized && (
          <button
            onClick={() => setShowTimeline((v) => !v)}
            className="inline-flex items-center gap-1 text-[#132238] dark:text-slate-200 hover:text-[#D95D39] font-semibold"
          >
            History ({ticket.timeline.length})
            {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Student Rating / Reopen when Resolved (own tickets only) */}
      {role === 'STUDENT' && !anonymized && ticket.status === 'Resolved' && (
        <div className="pt-3 border-t border-[#F0EFEA]">
          {ticket.rating ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-[#F2F8F6] border border-[#CDE6DF] rounded-xl px-3.5 py-2.5 text-[#1B6B5A]">
              <span className="font-semibold">
                Your rating: {'★'.repeat(ticket.rating)}{'☆'.repeat(5 - ticket.rating)} ({ticket.rating}/5)
                {ticket.feedback ? ` — "${ticket.feedback}"` : ''}
              </span>
              <button
                onClick={() => setShowReopen((v) => !v)}
                className="inline-flex items-center gap-1 text-[#9A3412] hover:underline font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Still not fixed?
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl p-3">
              <span className="text-xs font-semibold text-[#132238]">Rate this repair:</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    className={`p-0.5 ${n <= stars ? 'text-amber-500' : 'text-stone-300'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
              <input
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Optional note (e.g. works well now)"
                className="flex-1 min-w-[160px] bg-white border border-[#D8D5CC] rounded-lg px-2.5 py-1.5 text-xs text-[#132238]"
              />
              <button
                onClick={() => {
                  onRate(ticket.id, stars, feedback);
                  setFeedback('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1B6B5A] hover:bg-[#145446] text-xs font-semibold text-white"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowReopen((v) => !v)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D8D5CC] text-xs font-medium text-[#9A3412] hover:bg-rose-50"
              >
                Reopen
              </button>
            </div>
          )}

          {showReopen && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Explain why it still needs attention..."
                className="flex-1 min-w-[200px] bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs text-[#132238]"
              />
              <button
                onClick={() => {
                  onReopen(ticket.id, reopenReason);
                  setReopenReason('');
                  setShowReopen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#D95D39] text-white text-xs font-semibold"
              >
                Confirm Reopen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Warden Assignment Controls */}
      {role === 'WARDEN' && ticket.status !== 'Resolved' && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F0EFEA]">
          <span className="text-xs font-semibold text-[#132238]">Assign staff:</span>
          <select
            value={ticket.assignedTo ?? ''}
            onChange={(e) => {
              if (e.target.value) onAssign(ticket.id, e.target.value);
            }}
            className="bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs font-medium text-[#132238]"
          >
            <option value="">Choose technician...</option>
            {TECHNICIANS.map((tech) => (
              <option key={tech.id} value={tech.name}>
                {tech.name} ({tech.specialty})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Technician Status Controls */}
      {role === 'TECHNICIAN' && ticket.status !== 'Resolved' && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F0EFEA]">
          <select
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value as TicketStatus)}
            className="bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#132238]"
          >
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <input
            value={repairNote}
            onChange={(e) => setRepairNote(e.target.value)}
            placeholder="Write what was checked or replaced..."
            className="flex-1 min-w-[200px] bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs text-[#132238]"
          />
          <button
            onClick={() => {
              onUpdateStatus(ticket.id, nextStatus, repairNote);
              setRepairNote('');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#1B6B5A] hover:bg-[#145446] text-xs font-semibold text-white"
          >
            Save Update
          </button>
        </div>
      )}

      {/* Timeline */}
      {showTimeline && (
        <div className="pt-3 border-t border-[#F0EFEA] dark:border-[#26354D] space-y-2">
          {ticket.timeline.map((item, i) => (
            <div key={i} className="text-xs flex flex-wrap justify-between gap-2 bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#ECEAE2] dark:border-[#26354D] px-3 py-2 rounded-lg">
              <div>
                <span className="font-bold text-[#132238] dark:text-slate-100">{item.actor}:</span>{' '}
                <span className="text-[#475569] dark:text-slate-300">{item.note}</span>
              </div>
              <span className="text-[#94A3B8] dark:text-slate-500 font-mono">{new Date(item.at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
