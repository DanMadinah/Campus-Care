import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { BLOCKS, CATEGORIES, PRIORITIES } from '../data/store';
import { HostelBlock, IssueCategory, Priority } from '../types';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    description: string;
    category: IssueCategory;
    block: HostelBlock;
    room: string;
    priority: Priority;
    reportedBy: string;
    studentId: string;
    photoDataUrl?: string;
  }) => void;
}

export function ReportModal({ onClose, onSubmit }: ReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Lights & Electrical');
  const [block, setBlock] = useState<HostelBlock>('Block A');
  const [room, setRoom] = useState('A-204');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [reportedBy, setReportedBy] = useState('Muhammad Bukar');
  const [studentId, setStudentId] = useState('STU-2026-014');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !room.trim()) return;
    onSubmit({
      title,
      description,
      category,
      block,
      room,
      priority,
      reportedBy,
      studentId,
      photoDataUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Report a Hostel Issue</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Issue title</label>
            <input
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bathroom tap leaking or broken ceiling fan"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Urgency</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hostel Block</label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value as HostelBlock)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Room / Location</label>
              <input
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. A-204 or Level 2 Toilet"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Details</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is broken and when it started..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your name</label>
              <input
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student ID</label>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Photo (optional)</label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-700 bg-slate-950 text-xs text-slate-300 cursor-pointer hover:border-emerald-500">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{photoDataUrl ? 'Photo attached (click to change)' : 'Attach a photo of the problem'}</span>
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            {photoDataUrl && (
              <img
                src={photoDataUrl}
                alt="Issue preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-slate-800"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
