import { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { BLOCKS, CATEGORIES, PRIORITIES, VISIT_SLOTS } from '../data/store';
import { HostelBlock, PresetCategory, Priority } from '../types';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (input: {
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
  }) => void;
}

export function ReportModal({ onClose, onSubmit }: ReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PresetCategory>('Lights & Electrical');
  const [customCategory, setCustomCategory] = useState('');
  const [block, setBlock] = useState<HostelBlock>('Block A');
  const [room, setRoom] = useState('A-204');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [reportedBy, setReportedBy] = useState('Muhammad Bukar');
  const [studentId, setStudentId] = useState('STU-2026-014');
  const [phone, setPhone] = useState('011-2345-6789');
  const [preferredTime, setPreferredTime] = useState(VISIT_SLOTS[0]);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

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
    if (!title.trim() || !room.trim()) {
      setError('Please enter both the issue title and room number.');
      return;
    }
    if (category === 'Other' && !customCategory.trim()) {
      setError('Please write your custom issue type in the box below.');
      return;
    }

    const finalCategory = category === 'Other' ? customCategory.trim() : category;
    onSubmit({
      title,
      description,
      category: finalCategory,
      block,
      room,
      priority,
      reportedBy,
      studentId,
      phone,
      preferredTime,
      photoDataUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#132238]/60 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-[#E5E3DC] rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-[#132238] text-white">
          <div>
            <h3 className="font-bold text-base">Submit Maintenance Request</h3>
            <p className="text-xs text-slate-300">Fill in your room and issue details below</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">
              What is the problem? *
            </label>
            <input
              required
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g. Bathroom tap won't stop dripping or ceiling fan stopped working"
              className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3.5 py-2.5 text-sm text-[#132238] focus:outline-none focus:border-[#D95D39] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as PresetCategory);
                  setError('');
                }}
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2.5 text-sm text-[#132238] focus:outline-none focus:border-[#D95D39]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Other' ? 'Other (write your own)' : c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Urgency Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2.5 text-sm text-[#132238] focus:outline-none focus:border-[#D95D39]"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dedicated space when user's issue is not in the preset list */}
          {category === 'Other' && (
            <div className="p-3.5 rounded-xl bg-[#FDF6F0] border border-[#F2C9B6]">
              <label className="block text-xs font-semibold text-[#9A3412] mb-1">
                Specify your issue type *
              </label>
              <input
                required
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Leaking roof, Washing machine, Pest control, Broken window..."
                className="w-full bg-white border border-[#E6B39A] rounded-lg px-3 py-2 text-sm text-[#132238] focus:outline-none focus:border-[#D95D39]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Hostel Block</label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value as HostelBlock)}
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2.5 text-sm text-[#132238]"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Room / Area *</label>
              <input
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. A-204 or Level 2 Laundry"
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2.5 text-sm text-[#132238]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give the technician a clear idea of what needs fixing..."
              className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3.5 py-2.5 text-sm text-[#132238] focus:outline-none focus:border-[#D95D39] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Student Name</label>
              <input
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2 text-sm text-[#132238]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Matric / Student ID</label>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2 text-sm text-[#132238]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">Phone / WhatsApp</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01X-XXXX-XXXX"
                className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2 text-sm text-[#132238]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">Preferred Technician Visit Time</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#D8D5CC] rounded-lg px-3 py-2.5 text-sm text-[#132238]"
            >
              {VISIT_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">Attach Photo (optional)</label>
            <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-dashed border-[#C7C3B8] bg-[#FAF9F6] text-xs text-[#475569] cursor-pointer hover:border-[#D95D39]">
              <Upload className="w-4 h-4 text-[#D95D39]" />
              <span>{photoDataUrl ? 'Photo attached (click to replace)' : 'Click to upload a photo of the problem'}</span>
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            {photoDataUrl && (
              <img
                src={photoDataUrl}
                alt="Issue preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-[#E5E3DC]"
              />
            )}
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-[#ECEAE2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[#D8D5CC] text-[#475569] hover:bg-[#F3F1EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#D95D39] hover:bg-[#C14B29] text-white shadow-sm"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
