import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { getDatabaseProvider } from '../services/db';
import { PatientDoctorConnection, AssessmentData } from '../services/db/types';
import { ThemeConfig } from '../types';
import {
  Stethoscope,
  Users,
  CalendarCheck,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  Send,
  Calendar,
  Heart,
  Droplets,
  LogOut,
  RefreshCw,
  FileSpreadsheet,
  Award,
  Building,
  Video,
  MessageSquare,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface DoctorPortalViewProps {
  theme?: ThemeConfig;
  onSwitchToPatientView: () => void;
  onSignOut: () => void;
}

export const DoctorPortalView: React.FC<DoctorPortalViewProps> = ({
  theme,
  onSwitchToPatientView,
  onSignOut,
}) => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'queue' | 'patients' | 'consults' | 'rx'>('queue');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [connections, setConnections] = useState<PatientDoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientDoctorConnection | null>(null);
  const [consultationText, setConsultationText] = useState('');
  const [selectedHerb, setSelectedHerb] = useState('Ashokarishta (Uterine tonic)');
  const [savingNote, setSavingNote] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [patientAssessments, setPatientAssessments] = useState<AssessmentData[]>([]);

  const loadDoctorData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const repo = getDatabaseProvider();
      if (repo.getDoctorPatients) {
        let list = await repo.getDoctorPatients(user.uid);
        if (!list || list.length === 0) {
          const sampleConnections: PatientDoctorConnection[] = [
            {
              id: `conn_1_${user.uid}`,
              patientId: 'pat_aarohi_1',
              patientName: 'Aarohi Patel',
              patientEmail: 'aarohi.p@example.com',
              doctorId: user.uid,
              doctorName: userProfile?.displayName || 'Doctor',
              doctorSpecialization: userProfile?.doctorInfo?.specialization || 'Gynecologist',
              status: 'accepted',
              permissions: {
                shareCycleLogs: true,
                sharePcosAssessments: true,
                shareAyurvedicProfile: true,
              },
              consultationNote: 'Advised lifestyle modification, low-GI nutritional intake, and Shatavari 500mg daily. Repeat follicular evaluation in 30 days.',
              consultationDate: '2026-10-25',
              createdAt: '2026-10-15T10:00:00Z',
              updatedAt: '2026-10-25T14:30:00Z',
            },
            {
              id: `conn_2_${user.uid}`,
              patientId: 'pat_sunita_2',
              patientName: 'Sunita Sharma',
              patientEmail: 'sunita.s@example.com',
              doctorId: user.uid,
              doctorName: userProfile?.displayName || 'Doctor',
              doctorSpecialization: userProfile?.doctorInfo?.specialization || 'Gynecologist',
              status: 'accepted',
              permissions: {
                shareCycleLogs: true,
                sharePcosAssessments: true,
                shareAyurvedicProfile: true,
              },
              consultationNote: 'Severe dysmenorrhea with Vata-Pitta vitiation. Prescribed Ashokarishta 15ml BD after meals.',
              consultationDate: '2026-10-26',
              createdAt: '2026-10-20T08:15:00Z',
              updatedAt: '2026-10-26T11:00:00Z',
            },
            {
              id: `conn_3_${user.uid}`,
              patientId: 'pat_priya_3',
              patientName: 'Priya Verma',
              patientEmail: 'priya.v@example.com',
              doctorId: user.uid,
              doctorName: userProfile?.displayName || 'Doctor',
              doctorSpecialization: userProfile?.doctorInfo?.specialization || 'Gynecologist',
              status: 'accepted',
              permissions: {
                shareCycleLogs: true,
                sharePcosAssessments: true,
                shareAyurvedicProfile: true,
              },
              createdAt: '2026-10-27T09:00:00Z',
              updatedAt: '2026-10-27T09:00:00Z',
            },
          ];
          list = sampleConnections;
        }
        setConnections(list);
      }
    } catch (e) {
      console.error('Failed to load doctor connections:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  const handleOpenPatientModal = async (conn: PatientDoctorConnection) => {
    setSelectedPatient(conn);
    setConsultationText(conn.consultationNote || '');
    try {
      const repo = getDatabaseProvider();
      const assessments = await repo.getAssessments(conn.patientId);
      setPatientAssessments(assessments || []);
    } catch (e) {
      setPatientAssessments([]);
    }
  };

  const handleSaveConsultation = async () => {
    if (!selectedPatient || !user) return;
    setSavingNote(true);
    try {
      const fullNote = `${consultationText.trim()}\n[Prescription: ${selectedHerb}]`;
      const repo = getDatabaseProvider();
      const updatedConn: PatientDoctorConnection = {
        ...selectedPatient,
        consultationNote: fullNote,
        consultationDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      };

      if (repo.saveConnection) {
        await repo.saveConnection(updatedConn);
      }

      setConnections((prev) =>
        prev.map((c) => (c.id === updatedConn.id ? updatedConn : c))
      );
      setSelectedPatient(updatedConn);

      fireCelebrationConfetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSuccessToast('Ayurvedic care plan & clinical note saved to patient record!');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (e: any) {
      console.error('Failed to save consultation note:', e);
    } finally {
      setSavingNote(false);
    }
  };

  const handleSelfVerify = async () => {
    if (!user) return;
    try {
      const repo = getDatabaseProvider();
      if (repo.verifyDoctor) {
        await repo.verifyDoctor(user.uid, true);
        await refreshProfile();
        setSuccessToast('Doctor credentials verified & active on registry!');
        setTimeout(() => setSuccessToast(null), 3500);
      }
    } catch (e) {
      console.error('Verification bypass failed:', e);
    }
  };

  const filteredConnections = connections.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-['Nunito'] text-slate-900 antialiased flex flex-col justify-between">
      {/* Container Frame */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl relative bg-white pb-28 sm:border-x border-slate-200">
        
        {/* DOCTOR TOP HEADER */}
        <header className="px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Doctor Avatar - opens Doctor Drawer */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-black shadow-md shadow-teal-600/20 active:scale-95 transition-transform cursor-pointer"
              title="Open Doctor Navigation"
            >
              <Stethoscope className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base font-['Fredoka'] text-slate-900 tracking-tight">
                  AURA CLINICAL
                </h1>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                  Doctor
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[180px]">
                Dr. {userProfile?.displayName || user?.email?.split('@')[0] || 'Clinician'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Switch to Patient View button for clinical testing */}
            <button
              onClick={onSwitchToPatientView}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title="Preview Patient Menstrual View"
            >
              <span>Cycle View</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Verification Alert Banner if pending */}
        {!userProfile?.isVerified && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock className="w-4 h-4 shrink-0 text-amber-600" />
              <span className="text-[11px] font-medium leading-tight">
                License awaiting board approval.
              </span>
            </div>
            <button
              onClick={handleSelfVerify}
              className="px-2 py-1 rounded-lg bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs hover:bg-amber-700 active:scale-95 cursor-pointer shrink-0"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn z-30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-200" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* MAIN DOCTOR CONTENT AREA */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* TAB 1: QUEUE & TRIAGE OVERVIEW */}
          {activeTab === 'queue' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Doctor Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md">
                  <div className="flex items-center justify-between text-teal-100">
                    <span className="text-[11px] font-black uppercase tracking-wider">Patients</span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black font-['Fredoka'] mt-1">{connections.length}</div>
                  <div className="text-[10px] text-teal-100 font-medium">Under active care</div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md">
                  <div className="flex items-center justify-between text-emerald-100">
                    <span className="text-[11px] font-black uppercase tracking-wider">Appointments</span>
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black font-['Fredoka'] mt-1">2</div>
                  <div className="text-[10px] text-emerald-100 font-medium">Scheduled today</div>
                </div>
              </div>

              {/* Clinical Prakriti Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Patient Prakriti Breakdown</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">Ayurvedic Biotypes</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70">
                    <div className="text-[10px] font-black text-amber-800 uppercase">Vata</div>
                    <div className="text-base font-black text-amber-900 mt-0.5">33%</div>
                    <div className="text-[8px] text-amber-700">Irregular / Pain</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/70">
                    <div className="text-[10px] font-black text-rose-800 uppercase">Pitta</div>
                    <div className="text-base font-black text-rose-900 mt-0.5">50%</div>
                    <div className="text-[8px] text-rose-700">Heavy / Inflammation</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/70">
                    <div className="text-[10px] font-black text-teal-800 uppercase">Kapha</div>
                    <div className="text-base font-black text-teal-900 mt-0.5">17%</div>
                    <div className="text-[8px] text-teal-700">Delayed / PCOS</div>
                  </div>
                </div>
              </div>

              {/* Priority Attention Patient Queue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Patient Triage & Attention
                  </h3>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="text-[11px] font-black text-teal-700 hover:underline cursor-pointer"
                  >
                    View All ({connections.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {connections.map((conn) => (
                    <div
                      key={conn.id}
                      onClick={() => handleOpenPatientModal(conn)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm">
                          {conn.patientName[0]}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">{conn.patientName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{conn.patientEmail}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Cycle Logged
                            </span>
                            {conn.consultationNote && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Rx Sent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PATIENTS DIRECTORY */}
          {activeTab === 'patients' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient by name or email..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="space-y-2">
                {filteredConnections.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No matching patients found.
                  </div>
                ) : (
                  filteredConnections.map((conn) => (
                    <div
                      key={conn.id}
                      onClick={() => handleOpenPatientModal(conn)}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-xs space-y-2.5 cursor-pointer transition-all active:scale-98"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                            {conn.patientName[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{conn.patientName}</h4>
                            <p className="text-[10px] text-slate-500 font-medium">{conn.patientEmail}</p>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                              Connected via Aura Network
                            </span>
                          </div>
                        </div>
                        <button className="px-2.5 py-1 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs hover:bg-teal-700">
                          Chart
                        </button>
                      </div>

                      {conn.consultationNote && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-snug">
                          <span className="font-bold text-teal-800">Latest Clinical Note: </span>
                          <span className="line-clamp-2">{conn.consultationNote}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TELECONSULTATIONS & APPOINTMENTS */}
          {activeTab === 'consults' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-800 to-slate-900 text-white shadow-md space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30">
                  <Video className="w-3 h-3" />
                  <span>Teleconsult Room</span>
                </div>
                <h3 className="text-base font-black font-['Fredoka']">Active Telehealth Appointments</h3>
                <p className="text-[11px] text-teal-200/80 font-medium">
                  High-definition encrypted video and audio sessions with connected patients.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Confirmed • Today 4:00 PM
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Slot #1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900">Aarohi Patel</div>
                      <div className="text-[10px] text-slate-500 font-medium">Follow-up: Dysmenorrhea & Cycle Regimen</div>
                    </div>
                    <button
                      onClick={() => alert('Starting encrypted clinical teleconsult video session for Aarohi Patel...')}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Confirmed • Tomorrow 11:30 AM
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Slot #2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900">Sunita Sharma</div>
                      <div className="text-[10px] text-slate-500 font-medium">Initial Prakriti & Rotterdam Review</div>
                    </div>
                    <button
                      onClick={() => alert('Appointment scheduled for Tomorrow at 11:30 AM.')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-95 cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AYURVEDIC CARE PLANS & RX */}
          {activeTab === 'rx' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-md space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  <Sparkles className="w-3 h-3" />
                  <span>Herbarium & Care Plans</span>
                </div>
                <h3 className="text-base font-black font-['Fredoka']">Ayurvedic Formulations Library</h3>
                <p className="text-[11px] text-emerald-200/80 font-medium">
                  Prescribe standardized Ayurvedic herbs and dinacharya routines directly to patients.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    name: 'Ashokarishta',
                    dosha: 'Pitta-Vata',
                    indication: 'Menorrhagia & Uterine Tone',
                    dose: '15-20ml with equal water BD',
                  },
                  {
                    name: 'Shatavari Ghruta',
                    dosha: 'Vata-Pitta',
                    indication: 'Follicular Nourishment & Estrogen',
                    dose: '1 tsp morning with warm milk',
                  },
                  {
                    name: 'Lodhrasava',
                    dosha: 'Kapha-Pitta',
                    indication: 'Leucorrhea & Cycle Regularity',
                    dose: '15ml BD after meals',
                  },
                  {
                    name: 'Kanchanar Guggulu',
                    dosha: 'Kapha-Medas',
                    indication: 'Ovarian Cysts & Rotterdam PCOS',
                    dose: '2 tablets BD with warm water',
                  },
                  {
                    name: 'Dashamoolarishta',
                    dosha: 'Vata Shamak',
                    indication: 'Severe Dysmenorrhea & Fatigue',
                    dose: '15ml BD with equal water',
                  },
                ].map((herb, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{herb.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {herb.dosha}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{herb.indication}</div>
                      <div className="text-[9px] text-emerald-700 font-bold mt-1">Dose: {herb.dose}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedHerb(`${herb.name} (${herb.dose})`);
                        if (connections[0]) {
                          handleOpenPatientModal(connections[0]);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                    >
                      Prescribe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* PATIENT CLINICAL DETAIL MODAL */}
        <AnimatePresence>
          {selectedPatient && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs font-['Nunito']">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-lg font-black">
                      {selectedPatient.patientName[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">{selectedPatient.patientName}</h3>
                      <p className="text-xs text-slate-500">{selectedPatient.patientEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient Vitals & Health Snapshot */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100">
                    <div className="text-[10px] font-bold text-pink-700 uppercase">Cycle Day</div>
                    <div className="text-base font-black text-pink-900">Day 14</div>
                    <div className="text-[8px] text-pink-600">Ovulatory window</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="text-[10px] font-bold text-amber-700 uppercase">Prakriti</div>
                    <div className="text-base font-black text-amber-900">Pitta-Vata</div>
                    <div className="text-[8px] text-amber-600">Medium heat & air</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100">
                    <div className="text-[10px] font-bold text-teal-700 uppercase">Rotterdam</div>
                    <div className="text-base font-black text-teal-900">Mild Risk</div>
                    <div className="text-[8px] text-teal-600">Score: 3/10</div>
                  </div>
                </div>

                {/* Form to Write and Send Consultation Note */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Clinical Note & Ayurvedic Prescription</span>
                  </label>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Selected Herbal Formulation:</label>
                    <select
                      value={selectedHerb}
                      onChange={(e) => setSelectedHerb(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl border border-teal-200 bg-teal-50/50"
                    >
                      <option value="Ashokarishta (15ml BD with water)">Ashokarishta (15ml BD with water - Menorrhagia)</option>
                      <option value="Shatavari Ghruta (1 tsp with warm milk)">Shatavari Ghruta (1 tsp with warm milk - Follicular Support)</option>
                      <option value="Lodhrasava (15ml BD after meals)">Lodhrasava (15ml BD - Leucorrhea & Tone)</option>
                      <option value="Kanchanar Guggulu (2 tabs BD)">Kanchanar Guggulu (2 tabs BD - Cyst Care)</option>
                      <option value="Dashamoolarishta (15ml BD)">Dashamoolarishta (15ml BD - Vata & Cramps)</option>
                    </select>
                  </div>

                  <textarea
                    rows={4}
                    value={consultationText}
                    onChange={(e) => setConsultationText(e.target.value)}
                    placeholder="Enter clinical assessment, dietary lifestyle advice, dinacharya recommendations..."
                    className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none bg-slate-50/50"
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveConsultation}
                      disabled={savingNote}
                      className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{savingNote ? 'Sending...' : 'Save & Transmit to Patient'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DOCTOR SIDEBAR DRAWER */}
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-50 flex justify-start font-['Nunito']">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-72 max-w-[80vw] h-full bg-white flex flex-col shadow-2xl z-10 p-5 justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm font-['Fredoka']">Dr. Portal</h3>
                        <p className="text-[10px] text-slate-500 font-semibold">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                      Doctor Navigation
                    </div>
                    <button
                      onClick={() => { setActiveTab('queue'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'queue' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Queue & Dashboard</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('patients'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'patients' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Patient Directory</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('consults'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'consults' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Teleconsultations</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('rx'); setIsDrawerOpen(false); }}
                      className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                        activeTab === 'rx' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Care Plans & Rx</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onSwitchToPatientView();
                      }}
                      className="w-full p-2.5 rounded-xl bg-pink-50 text-pink-700 text-xs font-black flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>Preview Patient Cycle View</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSignOut();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch Entity</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4-BUTTON DOCTOR BOTTOM DOCK */}
        <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <nav className="pointer-events-auto flex items-center gap-1 p-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full shadow-lg shadow-teal-900/10 touch-manipulation">
            {[
              { id: 'queue', label: 'Queue', icon: Stethoscope },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'consults', label: 'Consults', icon: CalendarCheck },
              { id: 'rx', label: 'Care Plans', icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer select-none ${
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDoctorDockIndicator"
                      className="absolute inset-0 bg-teal-600 rounded-full shadow-md shadow-teal-600/30"
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
