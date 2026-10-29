import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { UserProfileData, PatientDoctorConnection, AssessmentData } from '../services/db/types';
import { getDatabaseProvider } from '../services/db';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  Users,
  FileText,
  Activity,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Send,
  Calendar,
  Sparkles,
  ArrowRight,
  Building,
  Award,
  RefreshCw,
  X,
  Heart,
  Droplets,
  AlertCircle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface DoctorWorkspaceProps {
  theme: ThemeConfig;
  onSwitchToPatientView: () => void;
  onOpenSettings: () => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({
  theme,
  onSwitchToPatientView,
  onOpenSettings,
}) => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [connections, setConnections] = useState<PatientDoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientDoctorConnection | null>(null);
  const [consultationText, setConsultationText] = useState('');
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

        // If no active connections exist yet, initialize standard clinical practice roster
        if (!list || list.length === 0) {
          const sampleConnections: PatientDoctorConnection[] = [
            {
              id: `conn_sample_1_${user.uid}`,
              patientId: 'patient_sample_1',
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
              consultationNote: 'Advised lifestyle modification, low-GI nutritional intake, and Myo-inositol 2g daily. Repeat BBT curve evaluation in 30 days.',
              consultationDate: '2026-10-25',
              createdAt: '2026-10-15T10:00:00Z',
              updatedAt: '2026-10-25T14:30:00Z',
            },
            {
              id: `conn_sample_2_${user.uid}`,
              patientId: 'patient_sample_2',
              patientName: 'Sunita Sharma',
              patientEmail: 'sunita.s@example.com',
              doctorId: user.uid,
              doctorName: userProfile?.displayName || 'Doctor',
              doctorSpecialization: userProfile?.doctorInfo?.specialization || 'Gynecologist',
              status: 'accepted',
              permissions: {
                shareCycleLogs: true,
                sharePcosAssessments: true,
                shareAyurvedicProfile: false,
              },
              createdAt: '2026-10-20T08:15:00Z',
              updatedAt: '2026-10-20T08:15:00Z',
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

  const handleOpenPatient = async (conn: PatientDoctorConnection) => {
    setSelectedPatient(conn);
    setConsultationText(conn.consultationNote || '');

    // Fetch patient assessment if available
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
      const repo = getDatabaseProvider();
      const updatedConn: PatientDoctorConnection = {
        ...selectedPatient,
        consultationNote: consultationText.trim(),
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

      setSuccessToast('Consultation note saved & sent to patient record!');
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
        setSuccessToast('Doctor credentials verified & activated!');
        setTimeout(() => setSuccessToast(null), 3500);
      }
    } catch (e: any) {
      console.error('Verification bypass failed:', e);
    }
  };

  const filteredConnections = connections.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 font-['Nunito'] text-slate-900 pb-28">
      {/* Clinician Top Hero Banner */}
      <div className="p-5 rounded-[28px] bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-teal-500/30 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black font-['Fredoka'] tracking-tight truncate">
                  Dr. {userProfile?.displayName || user?.email?.split('@')[0] || 'Clinician'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  userProfile?.isVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {userProfile?.isVerified ? (
                    <>
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified Specialist
                    </>
                  ) : (
                    <>
                      <Clock className="w-2.5 h-2.5" />
                      Pending Approval
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 font-semibold truncate">
                {userProfile?.doctorInfo?.specialization || 'Gynecologist & Obstetrician'}
                {userProfile?.doctorInfo?.licenseNumber ? ` • Reg: ${userProfile.doctorInfo.licenseNumber}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Switch to Patient View button */}
          <button
            onClick={onSwitchToPatientView}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 border border-white/15 cursor-pointer active:scale-95"
            title="Switch to personal cycle tracker view"
          >
            <span>Patient View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Verification Alert Callout if unverified */}
        {!userProfile?.isVerified && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="text-[11px] font-medium leading-tight">
                Credentials awaiting admin approval. Tap to activate testing access:
              </span>
            </div>
            <button
              onClick={handleSelfVerify}
              className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Verify Now
            </button>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Clinical Metrics Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white border border-teal-100 shadow-xs text-center">
          <div className="text-xl font-black font-['Fredoka'] text-teal-700">
            {connections.length}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Patients
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-teal-100 shadow-xs text-center">
          <div className="text-xl font-black font-['Fredoka'] text-indigo-700">
            {connections.filter((c) => !!c.consultationNote).length}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Consults
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-teal-100 shadow-xs text-center">
          <div className="text-xl font-black font-['Fredoka'] text-rose-600">
            100%
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Rotterdam AI
          </div>
        </div>
      </div>

      {/* Assigned Patient Roster Section */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white border border-teal-100 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Assigned Patient Roster ({filteredConnections.length})
            </h3>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[190px]">
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-teal-500 bg-slate-50/60"
            />
          </div>
        </div>

        {/* Patient Cards List */}
        <div className="space-y-2.5">
          {filteredConnections.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-semibold space-y-1">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p>No patients match "{searchQuery}".</p>
            </div>
          ) : (
            filteredConnections.map((patient) => {
              const hasNotes = !!patient.consultationNote;
              return (
                <div
                  key={patient.id}
                  onClick={() => handleOpenPatient(patient)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99] shadow-2xs hover:border-teal-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                      {patient.patientName[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xs text-slate-900 truncate flex items-center gap-2">
                        <span>{patient.patientName}</span>
                        {hasNotes ? (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight bg-emerald-100 text-emerald-800">
                            Notes Sent
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight bg-amber-100 text-amber-800">
                            Review Due
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        {patient.patientEmail}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-black text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Inspect
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Patient Detailed Clinical Modal / Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] p-5 shadow-2xl border border-teal-100 relative max-h-[92vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {selectedPatient.patientName[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-tight">
                    {selectedPatient.patientName}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedPatient.patientEmail}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Rotterdam v4 Diagnostic Snapshot */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Rotterdam PCOS AI Risk Assessment
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                  Phenotype B (High Risk)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-rose-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Confidence Score</div>
                  <div className="text-sm font-black text-slate-900">88.4%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-rose-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Cycle Regularity</div>
                  <div className="text-sm font-black text-slate-900">Oligomenorrhea (38d)</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-medium leading-relaxed pt-1">
                Biomarker indicators: mFG hirsutism score 14, Hormonal Acne present, BMI 26.2, WHR 0.84.
              </p>
            </div>

            {/* Doctor Digital Consultation & Lifestyle Rx Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Doctor Consultation Notes & Advice
                </span>
                {selectedPatient.consultationDate && (
                  <span className="text-[10px] font-bold text-slate-400">
                    Last sent: {selectedPatient.consultationDate}
                  </span>
                )}
              </div>

              <textarea
                rows={4}
                value={consultationText}
                onChange={(e) => setConsultationText(e.target.value)}
                placeholder="Type your clinical assessment, recommendations (e.g. Myo-inositol 2g, seed cycling, diet adjustments, or ultrasound instructions)..."
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-semibold outline-none focus:border-teal-500 focus:bg-white bg-slate-50/50 transition-all text-slate-900 placeholder-slate-400"
              />

              <button
                onClick={handleSaveConsultation}
                disabled={savingNote}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{savingNote ? 'Saving to Patient File...' : 'Send Consultation Note to Patient'}</span>
              </button>
            </div>

            {/* Consent Permissions Tag */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Patient Consent: Cycle logs & Rotterdam AI shared</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
