import { useState } from 'react';
import { Home, Mail, User, Lock, GraduationCap, UserCheck, Wrench, AlertCircle, IdCard } from 'lucide-react';
import { UserRole } from '../types';
import { MaintenanceBackdrop } from './MaintenanceBackdrop';

export interface SessionUser {
  name: string;
  email: string;
  role: UserRole;
  matricNumber?: string;
}

interface LoginScreenProps {
  onLogin: (user: SessionUser) => void;
}

const STAFF_CODES: Record<Exclude<UserRole, 'STUDENT'>, string> = {
  WARDEN: 'warden123',
  TECHNICIAN: 'tech123',
};

const ROLE_OPTIONS: Array<{ id: UserRole; label: string; icon: typeof GraduationCap }> = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap },
  { id: 'WARDEN', label: 'Warden', icon: UserCheck },
  { id: 'TECHNICIAN', label: 'Technician', icon: Wrench },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanMatric = matricNumber.trim().toUpperCase();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (role === 'STUDENT' && cleanMatric.length < 3) {
      setError('Please enter your matric number.');
      return;
    }
    if (role !== 'STUDENT') {
      if (staffCode.trim() !== STAFF_CODES[role]) {
        setError(`Invalid ${role === 'WARDEN' ? 'Warden' : 'Technician'} access code.`);
        return;
      }
    }

    onLogin({
      name: cleanName,
      email: cleanEmail,
      role,
      matricNumber: role === 'STUDENT' ? cleanMatric : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] dark:bg-[#0E1624] text-[#132238] dark:text-slate-100 relative flex items-center justify-center p-4 overflow-hidden">
      <MaintenanceBackdrop />

      <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Navy Header */}
        <div className="bg-[#132238] text-white px-6 py-6 border-b-4 border-[#D95D39]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D95D39] flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Campus Care</h1>
              <p className="text-xs text-slate-300">Hostel Maintenance Portal · Demo Access (Prototype)</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-2">
              Sign in as
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRole(opt.id);
                      setError('');
                    }}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-semibold transition ${
                      active
                        ? 'bg-[#132238] text-white border-[#132238] dark:bg-[#D95D39] dark:border-[#D95D39]'
                        : 'bg-[#FAF9F6] dark:bg-[#0E1624] text-[#475569] dark:text-slate-300 border-[#D8D5CC] dark:border-[#26354D] hover:border-[#D95D39]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                required
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Muhammad Bukar"
                className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white focus:outline-none focus:border-[#D95D39]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@campus.edu.my"
                className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white focus:outline-none focus:border-[#D95D39]"
              />
            </div>
          </div>

          {role === 'STUDENT' && (
            <div>
              <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
                Matric Number
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  required
                  value={matricNumber}
                  onChange={(e) => {
                    setMatricNumber(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 2024012345"
                  className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white uppercase focus:outline-none focus:border-[#D95D39]"
                />
              </div>
            </div>
          )}

          {role !== 'STUDENT' && (
            <div>
              <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
                {role === 'WARDEN' ? 'Warden Access Code' : 'Technician Access Code'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  required
                  type="password"
                  value={staffCode}
                  onChange={(e) => {
                    setStaffCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter staff code"
                  className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white focus:outline-none focus:border-[#D95D39]"
                />
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
                Demo staff code: <code className="font-mono font-semibold">{STAFF_CODES[role]}</code>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C14B29] text-white text-sm font-bold shadow-sm transition"
          >
            Continue to Campus Care
          </button>

          <p className="text-[11px] text-center text-[#94A3B8] pt-1">
            Prototype demo login (client-side only). Students see only their own reports plus anonymised block issues.
          </p>
        </form>
      </div>
    </div>
  );
}
