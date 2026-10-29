import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Stethoscope,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Building,
  Award,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { UserRole, DoctorInfo } from '../services/db/types';

interface RoleGatewayScreenProps {
  onContinueGuest: () => void;
}

export const RoleGatewayScreen: React.FC<RoleGatewayScreenProps> = ({ onContinueGuest }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    loginDemoUser,
    loading,
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [authMode, setAuthMode] = useState<'cards' | 'signin' | 'signup'>('cards');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState<DoctorInfo['specialization']>('Gynecologist');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hospitalClinic, setHospitalClinic] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAuth = (role: UserRole, mode: 'signin' | 'signup') => {
    setSelectedRole(role);
    setAuthMode(mode);
    setErrorMsg(null);
    if (role === 'doctor') {
      setEmail('demo.doctor@aurahealth.com');
      setPassword('AuraDoctor2026!');
    } else if (role === 'admin') {
      setEmail('demo.admin@aurahealth.com');
      setPassword('AuraAdmin2026!');
    } else {
      setEmail('demo.patient@aurahealth.com');
      setPassword('patient123');
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginDemoUser(role);
    } catch (err: any) {
      console.error('Quick demo failed:', err);
      setErrorMsg(err.message || 'Quick login failed. Please try again or use Guest mode.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      if (authMode === 'signup') {
        const docDetails: DoctorInfo | undefined = selectedRole === 'doctor' ? {
          specialization,
          licenseNumber: licenseNumber.trim() || 'REG-PENDING',
          hospitalClinic: hospitalClinic.trim() || 'General Clinic',
        } : undefined;

        await signUpWithEmail(email, password, selectedRole, docDetails);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Authentication failed:', err);
      let msg = err.message || 'Authentication error';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid credentials. You may create a new account or use Quick Demo.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email already has an account. Please switch to Sign In.';
      }
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFF9FA] to-[#F0F4FF] text-[#1A1A24] font-['Nunito'] flex flex-col justify-between p-4 sm:p-6 antialiased">
      <div className="max-w-md w-full mx-auto space-y-6 pt-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-gradient-to-tr from-[#FF5376] to-[#FF758C] text-white shadow-xl shadow-[#FF5376]/25 p-3 mx-auto">
            <Heart className="w-9 h-9 fill-white drop-shadow-sm animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-200/80 text-[10px] font-black uppercase tracking-widest text-[#FF5376]">
              <Sparkles className="w-3 h-3" />
              <span>Multi-Role Health Platform</span>
            </div>
            <h1 className="text-3xl font-black font-['Fredoka'] tracking-tight text-[#1A1A24]">
              AURA HEALTH
            </h1>
            <p className="text-xs text-[#646478] font-semibold max-w-xs mx-auto leading-relaxed">
              Clinical Menstrual Intelligence, Ayurvedic Dosha Harmony & Physician Network
            </p>
          </div>
        </div>

        {/* Dynamic View: Role Selection Cards vs Form */}
        <AnimatePresence mode="wait">
          {authMode === 'cards' ? (
            <motion.div
              key="role-cards"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-3.5"
            >
              <div className="text-center pb-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#8C8CA1]">
                  Select Your Role to Continue
                </span>
              </div>

              {/* 1. PATIENT PORTAL CARD */}
              <div className="p-4 rounded-[26px] bg-white border-2 border-rose-100 hover:border-[#FF5376] shadow-lg shadow-rose-500/5 transition-all group">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm font-['Fredoka'] text-[#1A1A24]">
                        Patient & Menstrual Cycle
                      </h3>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        Wellness
                      </span>
                    </div>
                    <p className="text-[11px] text-[#646478] font-medium leading-snug mt-1">
                      Cycle prediction, score wheel, Ayurvedic Dosha harmony, symptom logging & doctor bookings.
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleOpenAuth('patient', 'signin')}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#FF5376] hover:bg-[#E04365] text-white text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer text-center"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleQuickDemo('patient')}
                        disabled={isSubmitting}
                        className="py-2 px-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#FF5376] text-xs font-black transition-all border border-pink-200/80 active:scale-95 cursor-pointer flex items-center gap-1"
                        title="Quick 1-click test as Patient"
                      >
                        <Zap className="w-3 h-3 text-[#FF5376]" />
                        <span>Demo</span>
                      </button>
                      <button
                        onClick={onContinueGuest}
                        className="py-2 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#646478] hover:text-[#1A1A24] text-xs font-black transition-all border border-rose-200/80 active:scale-95 cursor-pointer"
                        title="Explore menstrual features directly without login"
                      >
                        Guest
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. DOCTOR CLINICAL PORTAL CARD */}
              <div className="p-4 rounded-[26px] bg-white border-2 border-teal-100 hover:border-teal-500 shadow-lg shadow-teal-500/5 transition-all group">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm font-['Fredoka'] text-[#1A1A24]">
                        Doctor & Practitioner Portal
                      </h3>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        Clinical
                      </span>
                    </div>
                    <p className="text-[11px] text-[#646478] font-medium leading-snug mt-1">
                      Patient roster, cycle analysis, Prakriti diagnostics, teleconsultations & Ayurvedic care plans.
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleOpenAuth('doctor', 'signin')}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer text-center"
                      >
                        Doctor Login
                      </button>
                      <button
                        onClick={() => handleQuickDemo('doctor')}
                        disabled={isSubmitting}
                        className="py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-black transition-all border border-teal-200/80 active:scale-95 cursor-pointer flex items-center gap-1"
                        title="Quick 1-click test as Doctor"
                      >
                        <Zap className="w-3 h-3 text-teal-600" />
                        <span>Quick Demo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. ADMIN GOVERNANCE PORTAL CARD */}
              <div className="p-4 rounded-[26px] bg-white border-2 border-indigo-100 hover:border-indigo-600 shadow-lg shadow-indigo-500/5 transition-all group">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-indigo-900/20 group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm font-['Fredoka'] text-[#1A1A24]">
                        Admin & Governance Board
                      </h3>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        Security
                      </span>
                    </div>
                    <p className="text-[11px] text-[#646478] font-medium leading-snug mt-1">
                      Doctor medical license verification, Ayurvedic knowledge base management & system audit logs.
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleOpenAuth('admin', 'signin')}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer text-center"
                      >
                        Admin Login
                      </button>
                      <button
                        onClick={() => handleQuickDemo('admin')}
                        disabled={isSubmitting}
                        className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition-all border border-indigo-200/80 active:scale-95 cursor-pointer flex items-center gap-1"
                        title="Quick 1-click test as Admin"
                      >
                        <Zap className="w-3 h-3 text-indigo-600" />
                        <span>Quick Demo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-xl space-y-4"
            >
              {/* Back to cards & Role Selector Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setAuthMode('cards')}
                  className="text-xs font-black text-[#646478] hover:text-[#1A1A24] flex items-center gap-1 cursor-pointer"
                >
                  ← All Roles
                </button>
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      authMode === 'signin' ? 'bg-white shadow text-[#1A1A24]' : 'text-slate-500'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      authMode === 'signup' ? 'bg-white shadow text-[#1A1A24]' : 'text-slate-500'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('patient');
                    setEmail('demo.patient@aurahealth.com');
                    setPassword('patient123');
                    setErrorMsg(null);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedRole === 'patient'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-3 h-3" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('doctor');
                    setEmail('demo.doctor@aurahealth.com');
                    setPassword('AuraDoctor2026!');
                    setErrorMsg(null);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedRole === 'doctor'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-3 h-3" />
                  <span>Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setEmail('demo.admin@aurahealth.com');
                    setPassword('AuraAdmin2026!');
                    setErrorMsg(null);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmitAuth} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@mail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-[#FF5376] focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-[#FF5376] focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Additional Doctor Fields on Sign Up */}
                {authMode === 'signup' && selectedRole === 'doctor' && (
                  <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor Credentials</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">Specialization</label>
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-teal-200 bg-white"
                      >
                        <option value="Gynecologist">Gynecologist & Obstetrician</option>
                        <option value="Ayurvedic Practitioner">Ayurvedic Practitioner (BAMS/MD)</option>
                        <option value="Endocrinologist">Endocrinologist (PCOS Specialist)</option>
                        <option value="Fertility Specialist">Fertility & Reproductive Health</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">Medical License Number</label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="e.g. MED-REG-10492"
                        className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-teal-200 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">Hospital or Clinic Name</label>
                      <input
                        type="text"
                        value={hospitalClinic}
                        onChange={(e) => setHospitalClinic(e.target.value)}
                        placeholder="e.g. Apollo Healthcare / AyurCare Clinic"
                        className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-teal-200 bg-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full py-2.5 rounded-xl text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 mt-2 ${
                    selectedRole === 'doctor'
                      ? 'bg-teal-600 hover:bg-teal-700'
                      : selectedRole === 'admin'
                      ? 'bg-slate-900 hover:bg-slate-800'
                      : 'bg-[#FF5376] hover:bg-[#E04365]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span>
                      {authMode === 'signin'
                        ? `Sign In as ${selectedRole.toUpperCase()}`
                        : `Register New ${selectedRole.toUpperCase()}`}
                    </span>
                  )}
                </button>
              </form>

              {/* Quick Demo Preset Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">Test directly with 1 click:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo(selectedRole)}
                  disabled={isSubmitting}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>Instant {selectedRole} Demo</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Badges Footer */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="p-2 rounded-2xl bg-white/60 border border-rose-100 backdrop-blur-xs">
            <span className="text-xs">🔒</span>
            <div className="text-[10px] font-black text-[#1A1A24]">Private & Encrypted</div>
            <div className="text-[8px] text-[#646478]">HIPAA Compliant</div>
          </div>
          <div className="p-2 rounded-2xl bg-white/60 border border-teal-100 backdrop-blur-xs">
            <span className="text-xs">🌿</span>
            <div className="text-[10px] font-black text-[#1A1A24]">Ayurvedic Prakriti</div>
            <div className="text-[8px] text-[#646478]">Tri-Dosha Balance</div>
          </div>
          <div className="p-2 rounded-2xl bg-white/60 border border-indigo-100 backdrop-blur-xs">
            <span className="text-xs">🩺</span>
            <div className="text-[10px] font-black text-[#1A1A24]">Verified Doctors</div>
            <div className="text-[8px] text-[#646478]">Clinical Review</div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-[10px] text-slate-400 font-semibold">
        Aura Health Systems • Cross-Platform Mobile & Web • Version 2.4
      </div>
    </div>
  );
};
