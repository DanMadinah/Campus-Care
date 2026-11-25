import { useState } from 'react';
import { Home, Mail, User, Lock, GraduationCap, UserCheck, Wrench, AlertCircle, Hash } from 'lucide-react';
import { UserRole } from '../types';
import { MaintenanceBackdrop } from './MaintenanceBackdrop';
import { firebaseEmailAuth, isFirebaseAuthEnabled } from '../data/firebaseAuth';

export interface SessionUser {
  name: string;
  email: string;
  role: UserRole;
  matricNumber?: string;
  idToken?: string;
  isDemoAuth: boolean;
}

interface LoginScreenProps {
  onLogin: (user: SessionUser) => void;
}

// Demo-only prototype codes (used ONLY when Firebase Auth is not configured)
const DEMO_STAFF_CODES: Record<Exclude<UserRole, 'STUDENT'>, string> = {
  WARDEN: 'warden123',
  TECHNICIAN: 'tech123',
};

const ROLE_OPTIONS: Array<{ id: UserRole; label: string; icon: typeof GraduationCap }> = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap },
  { id: 'WARDEN', label: 'Warden', icon: UserCheck },
  { id: 'TECHNICIAN', label: 'Technician', icon: Wrench },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Real Firebase Auth path when VITE_FIREBASE_API_KEY + VITE_FIREBASE_DB_URL are configured
    if (isFirebaseAuthEnabled) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await firebaseEmailAuth(authMode, cleanEmail, password);
        onLogin({
          name: cleanName,
          email: res.email,
          role: res.role,
          matricNumber: res.role === 'STUDENT' && cleanMatric ? cleanMatric : undefined,
          idToken: res.idToken,
          isDemoAuth: false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Demo-only prototype path
    if (role === 'STUDENT' && cleanMatric.length < 3) {
      setError('Please enter your matric number.');
      return;
    }
    if (role !== 'STUDENT' && staffCode.trim() !== DEMO_STAFF_CODES[role]) {
      setError(`Invalid ${role === 'WARDEN' ? 'Warden' : 'Technician'} demo code.`);
      return;
    }

    onLogin({
      name: cleanName,
      email: cleanEmail,
      role,
      matricNumber: role === 'STUDENT' ? cleanMatric : undefined,
      isDemoAuth: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] dark:bg-[#0E1624] text-[#132238] dark:text-slate-100 relative flex items-center justify-center p-4 overflow-hidden">
      <MaintenanceBackdrop />

      <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-[#162133]/95 border border-[#E5E3DC] dark:border-[#26354D] rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#132238] text-white px-6 py-6 border-b-4 border-[#D95D39]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D95D39] flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Campus Care</h1>
              <p className="text-xs text-slate-300">
                {isFirebaseAuthEnabled
                  ? 'Hostel Maintenance Portal · Firebase Auth'
                  : 'Hostel Maintenance Portal · Demo Access (Prototype)'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isFirebaseAuthEnabled ? (
            <div className="grid grid-cols-2 gap-2">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setAuthMode(m);
                    setError('');
                  }}
                  className={`py-2 rounded-xl border text-xs font-bold transition ${
                    authMode === m
                      ? 'bg-[#132238] text-white border-[#132238] dark:bg-[#D95D39] dark:border-[#D95D39]'
                      : 'bg-[#FAF9F6] dark:bg-[#0E1624] text-[#475569] dark:text-slate-300 border-[#D8D5CC] dark:border-[#26354D]'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#475569] dark:text-slate-300 mb-2">
                Choose demo role
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
          )}

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

          {isFirebaseAuthEnabled ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white focus:outline-none focus:border-[#D95D39]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
                  Matric Number (Students)
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="e.g. 2024012345"
                    className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white uppercase focus:outline-none focus:border-[#D95D39]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {role === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-semibold text-[#132238] dark:text-slate-200 mb-1">
                    Matric Number
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
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
                    {role === 'WARDEN' ? 'Warden Demo Code' : 'Technician Demo Code'}
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
                      placeholder="Enter demo code"
                      className="w-full bg-[#FAF9F6] dark:bg-[#0E1624] border border-[#D8D5CC] dark:border-[#26354D] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#132238] dark:text-white focus:outline-none focus:border-[#D95D39]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
                    Prototype demo code: <code className="font-mono font-semibold">{DEMO_STAFF_CODES[role]}</code>
                  </p>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C14B29] disabled:opacity-60 text-white text-sm font-bold shadow-sm transition"
          >
            {loading ? 'Signing in...' : 'Continue to Campus Care'}
          </button>

          <p className="text-[11px] text-center text-[#94A3B8] pt-1">
            {isFirebaseAuthEnabled
              ? 'Authenticated via Firebase Auth. Roles are enforced by Firebase Security Rules.'
              : 'Demo mode only (client-side). Configure VITE_FIREBASE_API_KEY for real backend auth.'}
          </p>
        </form>
      </div>
    </div>
  );
}
