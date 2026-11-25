import { ThumbsUp, MapPin, Wrench, CheckCircle2 } from 'lucide-react';
import { STATUS_ORDER } from '../data/store';
import { MaintenanceTicket, Priority, TicketStatus } from '../types';

interface SharedIssueCardProps {
  ticket: MaintenanceTicket;
  onUpvote: (id: string) => void;
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

/**
 * Redacts explicit room codes (e.g. A-204, B-108) from public shared descriptions
 * so other students never see private room details.
 */
function redactRoomCodes(text: string): string {
  return text.replace(/\b[A-D]-\d{2,4}\b/gi, '[room hidden]');
}

/**
 * Dedicated anonymised card for Shared Block Issues.
 * Structurally omits reporter name, email, matric number, room number, phone,
 * photo attachments, and private complaint history.
 */
export function SharedIssueCard({ ticket, onUpvote }: SharedIssueCardProps) {
  const stepIndex = STATUS_ORDER.indexOf(ticket.status);

  return (
    <article className="rounded-2xl bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] shadow-[0_2px_10px_rgba(19,34,56,0.04)] p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold font-mono text-[#132238] dark:text-slate-100 bg-[#F3F1EA] dark:bg-[#0E1624] px-2 py-0.5 rounded-md">
              {ticket.id}
            </span>
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
          <h3 className="text-base font-bold text-[#132238] dark:text-white">
            {redactRoomCodes(ticket.title)}
          </h3>
          <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
            {redactRoomCodes(ticket.description)}
          </p>
        </div>

        <button
          onClick={() => onUpvote(ticket.id)}
          title="Confirm this issue also affects your block"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] hover:border-[#D95D39] text-xs font-semibold text-[#132238] dark:text-slate-100"
        >
          <ThumbsUp className="w-3.5 h-3.5 text-[#D95D39]" />
          Same issue ({ticket.upvotes})
        </button>
      </div>

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
                    : 'bg-[#ECEAE2] dark:bg-[#0E1624]'
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

      {/* Anonymised Footer (Block + Maintenance Status Only) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] dark:text-slate-400 pt-3 border-t border-[#F0EFEA] dark:border-[#26354D]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1 font-semibold text-[#132238] dark:text-slate-100">
            <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
            {ticket.block} · Shared / Anonymised Report
          </span>
          <span className="inline-flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-[#1B6B5A] dark:text-emerald-400" />
            {ticket.assignedTo ? 'Technician assigned' : 'Waiting for assignment'}
          </span>
        </div>
        <span className="text-[11px] text-[#94A3B8]">Personal details hidden</span>
      </div>
    </article>
  );
}
