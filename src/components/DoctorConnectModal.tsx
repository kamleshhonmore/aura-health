import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeConfig } from '../types';
import { UserProfileData, PatientDoctorConnection } from '../services/db/types';
import { getDatabaseProvider } from '../services/db';
import {
  X,
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  RefreshCw,
  Search,
  Key,
  Lock,
  Unlock,
  Building,
  Check,
  Trash2,
  Share2,
  FileText,
  Activity,
  HeartHandshake,
} from 'lucide-react';

interface DoctorConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const DoctorConnectModal: React.FC<DoctorConnectModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const { user, userProfile } = useAuth();
  const [doctors, setDoctors] = useState<UserProfileData[]>([]);
  const [connections, setConnections] = useState<PatientDoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<UserProfileData | null>(null);

  // Consent Toggles
  const [shareCycleLogs, setShareCycleLogs] = useState(true);
  const [sharePcosAssessments, setSharePcosAssessments] = useState(true);
  const [shareAyurvedicProfile, setShareAyurvedicProfile] = useState(true);

  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const repo = getDatabaseProvider();
      if (repo.getAllDoctors) {
        const allDocs = await repo.getAllDoctors();
        // Show only verified doctors to patients
        setDoctors(allDocs.filter((d) => d.isVerified));
      }
      if (repo.getPatientConnections) {
        const userConns = await repo.getPatientConnections(user.uid);
        setConnections(userConns);
      }
    } catch (e) {
      console.error('Failed to load doctor connect data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleConnect = async (doctor: UserProfileData) => {
    if (!user) return;
    try {
      const repo = getDatabaseProvider();
      if (repo.saveConnection) {
        const newConn: PatientDoctorConnection = {
          id: `conn_${user.uid}_${doctor.uid}_${Date.now()}`,
          patientId: user.uid,
          patientName: userProfile?.displayName || user.email?.split('@')[0] || 'Patient',
          patientEmail: user.email || '',
          doctorId: doctor.uid,
          doctorName: doctor.displayName || doctor.email,
          doctorSpecialization: doctor.doctorInfo?.specialization || 'Gynecologist',
          status: 'accepted',
          permissions: {
            shareCycleLogs,
            sharePcosAssessments,
            shareAyurvedicProfile,
          },
          accessCode: Math.floor(100000 + Math.random() * 900000).toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await repo.saveConnection(newConn);
        setMessage(`Connected with Dr. ${doctor.displayName || 'Doctor'} successfully! Permissions saved.`);
        setTimeout(() => setMessage(null), 3500);
        setSelectedDoctor(null);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to create doctor connection:', e);
    }
  };

  const handleRevoke = async (connectionId: string, doctorName: string) => {
    try {
      const repo = getDatabaseProvider();
      if (repo.deleteConnection) {
        await repo.deleteConnection(connectionId);
        setMessage(`Access revoked for Dr. ${doctorName}. Data sharing stopped.`);
        setTimeout(() => setMessage(null), 3500);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to revoke access:', e);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.doctorInfo?.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.doctorInfo?.hospitalClinic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xl animate-fadeIn font-['Nunito'] text-slate-900">
      <div className="w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl border border-rose-100 relative overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/25">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Fredoka'] tracking-tight">
                Doctor Connect & Data Sharing Consent
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Grant or revoke healthcare provider access to your cycle & PCOS logs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Connected Doctors List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Active Doctor Access ({connections.length})
            </h3>
          </div>

          {connections.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              You haven't shared your health data with any doctors yet. Search verified specialists below to initiate connection.
            </div>
          ) : (
            <div className="space-y-2.5">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-black text-slate-900 flex items-center gap-2 text-sm">
                      Dr. {conn.doctorName}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
                        {conn.doctorSpecialization}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-600 flex flex-wrap gap-2 pt-1">
                      <span className={`px-2 py-0.5 rounded-md ${conn.permissions.shareCycleLogs ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Cycle Logs: {conn.permissions.shareCycleLogs ? 'Shared' : 'Off'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md ${conn.permissions.sharePcosAssessments ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Rotterdam PCOS AI: {conn.permissions.sharePcosAssessments ? 'Shared' : 'Off'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md ${conn.permissions.shareAyurvedicProfile ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        Ayurvedic Profile: {conn.permissions.shareAyurvedicProfile ? 'Shared' : 'Off'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevoke(conn.id, conn.doctorName)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-black text-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Revoke Access
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consent Permission Options */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
          <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-rose-500" />
            Granular Data Consent Settings
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Choose what health metrics you consent to share when connecting with a new doctor:
          </p>

          <div className="space-y-2 text-xs font-semibold">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shareCycleLogs}
                onChange={(e) => setShareCycleLogs(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Share Menstrual Cycle Predictions & Symptoms History</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sharePcosAssessments}
                onChange={(e) => setSharePcosAssessments(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Share Rotterdam AI PCOS Machine Learning Screening Scores</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shareAyurvedicProfile}
                onChange={(e) => setShareAyurvedicProfile(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Share Ayurvedic Dosha Assessment (Vata/Pitta/Kapha)</span>
            </label>
          </div>
        </div>

        {/* Directory of Verified Doctors to Connect */}
        <div className="space-y-3 pt-2 border-t border-rose-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Verified Doctor Directory
            </h3>

            <div className="relative">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search specialists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-teal-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {filteredDoctors.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 font-semibold">
                No verified doctors available yet. Once an admin approves doctor licenses, they will appear here.
              </div>
            ) : (
              filteredDoctors.map((doctor) => {
                const isAlreadyConnected = connections.some((c) => c.doctorId === doctor.uid);
                return (
                  <div
                    key={doctor.uid}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-black text-slate-900 flex items-center gap-1.5">
                        Dr. {doctor.displayName || doctor.email}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {doctor.doctorInfo?.specialization || 'Gynecologist'} {doctor.doctorInfo?.hospitalClinic ? `• ${doctor.doctorInfo.hospitalClinic}` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => handleConnect(doctor)}
                      disabled={isAlreadyConnected}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAlreadyConnected
                          ? 'bg-slate-100 text-slate-400 border border-slate-200'
                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-95'
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {isAlreadyConnected ? 'Connected' : 'Grant Access'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
