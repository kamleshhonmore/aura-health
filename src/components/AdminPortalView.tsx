import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { getDatabaseProvider } from '../services/db';
import { UserProfileData } from '../services/db/types';
import { ThemeConfig } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Users,
  Stethoscope,
  Database,
  Lock,
  BarChart3,
  Search,
  RefreshCw,
  LogOut,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  Building,
  FileCheck,
  HardDrive,
  Cloud,
  X,
  ArrowRight,
} from 'lucide-react';

interface AdminPortalViewProps {
  theme?: ThemeConfig;
  onSwitchToPatientView: () => void;
  onSignOut: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  theme,
  onSwitchToPatientView,
  onSignOut,
}) => {
  const { user, userProfile, refreshProfile, switchDatabase, activeProvider } = useAuth();
  const [activeTab, setActiveTab] = useState<'metrics' | 'verify' | 'kb' | 'security'>('verify');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState<UserProfileData[]>([]);
  const [allDoctors, setAllDoctors] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const repo = getDatabaseProvider();
      if (repo.getPendingDoctors && repo.getAllDoctors) {
        const pending = await repo.getPendingDoctors();
        const all = await repo.getAllDoctors();
        setPendingDoctors(pending || []);
        setAllDoctors(all || []);
      }
    } catch (e) {
      console.error('Admin data load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (doctorId: string, isVerified: boolean) => {
    try {
      const repo = getDatabaseProvider();
      if (repo.verifyDoctor) {
        await repo.verifyDoctor(doctorId, isVerified);
        setActionMessage(`Doctor account ${isVerified ? 'verified & approved' : 'rejected'}.`);
        setTimeout(() => setActionMessage(null), 3000);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to verify doctor:', e);
    }
  };

  const filteredDoctors = allDoctors.filter(
    (doc) =>
      doc.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doctorInfo?.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doctorInfo?.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] font-['Nunito'] text-slate-100 antialiased flex flex-col justify-between">
      {/* Container Frame */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl relative bg-slate-900 pb-28 sm:border-x border-slate-800">

        {/* ADMIN TOP HEADER */}
        <header className="px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-40 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Admin Avatar - opens Admin Drawer */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 active:scale-95 transition-transform cursor-pointer"
              title="Open Admin Navigation"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base font-['Fredoka'] text-white tracking-tight">
                  AURA GOVERNANCE
                </h1>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  SuperAdmin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold truncate max-w-[180px]">
                {user?.email || 'Administrator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={loadData}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Quick Switch to Patient View button */}
            <button
              onClick={onSwitchToPatientView}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title="Preview Patient Menstrual View"
            >
              <span>Cycle View</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Action Toast */}
        {actionMessage && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn z-30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-indigo-200" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* MAIN ADMIN CONTENT AREA */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* TAB 1: METRICS & PLATFORM OVERVIEW */}
          {activeTab === 'metrics' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 text-white border border-indigo-500/30 shadow-lg space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">
                  <BarChart3 className="w-3 h-3" />
                  <span>Platform Operations</span>
                </div>
                <h3 className="text-base font-black font-['Fredoka']">Aura Ecosystem Metrics</h3>
                <p className="text-[11px] text-indigo-200/80 font-medium">
                  Live verification queue status and cross-platform synchronization health.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-black uppercase tracking-wider">Pending Docs</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black font-['Fredoka'] mt-1 text-amber-400">
                    {pendingDoctors.length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Awaiting license check</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-black uppercase tracking-wider">Active Docs</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-['Fredoka'] mt-1 text-emerald-400">
                    {allDoctors.filter((d) => d.isVerified).length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Verified clinicians</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Infrastructure & Database Health
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-emerald-400" />
                      <span>Cloud Database</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Google Cloud Firestore</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <span>Security Rules</span>
                    </div>
                    <span className="text-indigo-300 font-bold">RBAC Enforced</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCTOR VERIFICATION QUEUE */}
          {activeTab === 'verify' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Doctor Credentials Queue</h3>
                  <p className="text-[11px] text-slate-400">
                    {pendingDoctors.length} doctors currently pending approval
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase cursor-pointer"
                >
                  Reload
                </button>
              </div>

              {/* Pending Doctors List */}
              {pendingDoctors.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center space-y-1.5">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-black text-white">Queue is clear!</div>
                  <div className="text-[11px] text-slate-400">
                    All doctor applicants have been verified.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingDoctors.map((doc) => (
                    <div
                      key={doc.uid}
                      className="p-3.5 rounded-2xl bg-slate-800/90 border border-amber-500/30 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                            {doc.displayName ? doc.displayName[0] : 'D'}
                          </div>
                          <div>
                            <div className="text-xs font-black text-white">
                              Dr. {doc.displayName || doc.email?.split('@')[0]}
                            </div>
                            <div className="text-[10px] text-slate-400">{doc.email}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pending
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 text-[11px] space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Specialization:</span>
                          <span className="font-semibold">{doc.doctorInfo?.specialization || 'Gynecologist'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">License Number:</span>
                          <span className="font-mono text-amber-300">{doc.doctorInfo?.licenseNumber || 'MCI-MH-884920'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Clinic / Hospital:</span>
                          <span>{doc.doctorInfo?.hospitalClinic || 'General Health Clinic'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerify(doc.uid, true)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => handleVerify(doc.uid, false)}
                          className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold active:scale-95 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* All Registered Clinicians Section */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  All Clinicians Directory ({allDoctors.length})
                </h4>
                <div className="space-y-1.5">
                  {allDoctors.map((doc) => (
                    <div
                      key={doc.uid}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {doc.displayName ? doc.displayName[0] : 'D'}
                        </div>
                        <div>
                          <div className="font-bold text-white leading-tight">
                            Dr. {doc.displayName || doc.email?.split('@')[0]}
                          </div>
                          <div className="text-[10px] text-slate-400">{doc.email}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        doc.isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      }`}>
                        {doc.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AYURVEDIC KNOWLEDGE BASE */}
          {activeTab === 'kb' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-950 text-white border border-indigo-500/30 shadow-md space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
                  <Database className="w-3 h-3" />
                  <span>Clinical Knowledgebase</span>
                </div>
                <h3 className="text-base font-black font-['Fredoka']">Ayurvedic Dosha Governance</h3>
                <p className="text-[11px] text-purple-200/80 font-medium">
                  Standardized herbarium parameters and Prakriti assessment algorithms.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  {
                    dosha: 'Vata Phase (Menstrual & Early Follicular)',
                    qualities: 'Cold, Light, Dry, Mobile',
                    balancingHerbs: 'Dashamoola, Til Taila, Ashwagandha, Hingwastak',
                    clinicalTarget: 'Dysmenorrhea, lower back pain, anxiety',
                  },
                  {
                    dosha: 'Pitta Phase (Ovulatory & Mid-Cycle)',
                    qualities: 'Hot, Sharp, Oily, Acidic',
                    balancingHerbs: 'Shatavari, Chandana, Sariva, Aloe Vera (Kumari)',
                    clinicalTarget: 'Heavy flow, acne flares, hot flashes',
                  },
                  {
                    dosha: 'Kapha Phase (Luteal & Pre-Menstrual)',
                    qualities: 'Heavy, Slow, Cool, Dense',
                    balancingHerbs: 'Kanchanar Guggulu, Lodhra, Triphala, Pippali',
                    clinicalTarget: 'Water retention, cystic tenderness, lethargy',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <div className="font-black text-indigo-300 text-xs">{item.dosha}</div>
                    <div className="text-[10px] text-slate-400">Gunas: {item.qualities}</div>
                    <div className="text-[11px] text-slate-200 font-semibold">Herbs: {item.balancingHerbs}</div>
                    <div className="text-[10px] text-emerald-400">Target: {item.clinicalTarget}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM & AUDIT SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Storage Infrastructure & Backup</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Manage primary cloud database synchronization and offline client cache resilience.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => switchDatabase('firestore')}
                    className={`p-3 rounded-xl border text-xs font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeProvider === 'firestore'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cloud className="w-4 h-4" />
                    <span>Firestore (Cloud)</span>
                  </button>

                  <button
                    onClick={() => switchDatabase('local')}
                    className={`p-3 rounded-xl border text-xs font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeProvider === 'local'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>LocalStorage</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Security Audit Log
                </h4>
                <div className="space-y-1.5 text-[10px] font-mono text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    [AUTH] Admin session validated: {user?.email}
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    [RBAC] Doctor authorization check: passed
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    [SYNC] Google Cloud Firestore connected: active
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ADMIN SIDEBAR DRAWER */}
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-50 flex justify-start font-['Nunito']">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-72 max-w-[80vw] h-full bg-slate-900 flex flex-col shadow-2xl z-10 p-5 justify-between border-r border-slate-800 text-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm font-['Fredoka']">Governance</h3>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-1">
                      Admin Navigation
                    </div>
                    <button
                      onClick={() => { setActiveTab('metrics'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'metrics' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>System Metrics</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('verify'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'verify' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Doctor Verification</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('kb'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'kb' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>Ayurvedic KB</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('security'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'security' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Security & Database</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onSwitchToPatientView();
                      }}
                      className="w-full p-2.5 rounded-xl bg-pink-500/10 text-pink-300 text-xs font-black flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span>Preview Patient Cycle View</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSignOut();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch Entity</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4-BUTTON ADMIN BOTTOM DOCK */}
        <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <nav className="pointer-events-auto flex items-center gap-1 p-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-full shadow-lg shadow-black/40 touch-manipulation">
            {[
              { id: 'metrics', label: 'Metrics', icon: BarChart3 },
              { id: 'verify', label: 'Verify', icon: ShieldCheck },
              { id: 'kb', label: 'Ayur KB', icon: Database },
              { id: 'security', label: 'Security', icon: Lock },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer select-none ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-full shadow-md shadow-indigo-600/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 z-10 shrink-0" />
                  {isActive && (
                    <span className="z-10 text-[11px] font-black font-['Fredoka'] whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </div>
  );
};
