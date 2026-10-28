import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { UserProfileData } from '../services/db/types';
import { getDatabaseProvider } from '../services/db';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  UserCheck,
  Stethoscope,
  Building,
  FileCheck,
  Users,
  Award,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';

interface AdminPortalProps {
  theme: ThemeConfig;
  onClose?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ theme, onClose }) => {
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
        setPendingDoctors(pending);
        setAllDoctors(all);
      }
    } catch (e) {
      console.error('Failed to load admin verification queue:', e);
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
        setActionMessage(`Doctor account successfully ${isVerified ? 'approved' : 'rejected'}.`);
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
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn font-['Nunito'] text-slate-900 pb-24">
      {/* Header Banner */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-500/20">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Governance Portal</span>
          </div>
          <h1 className="text-2xl font-black font-['Fredoka'] tracking-tight">
            Medical Verification & Credentials Queue
          </h1>
          <p className="text-xs text-indigo-200/80 font-medium max-w-xl leading-relaxed">
            Verify doctor licenses, review medical qualifications, and approve healthcare provider access to patient rosters.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-['Fredoka'] text-slate-900">
              {pendingDoctors.length}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Doctor Approvals
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-['Fredoka'] text-slate-900">
              {allDoctors.filter((d) => d.isVerified).length}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verified Doctors
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-['Fredoka'] text-slate-900">
              {allDoctors.length}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Doctors Registered
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="p-6 rounded-[28px] bg-white border-2 border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              !
            </div>
            <div>
              <h2 className="text-base font-black font-['Fredoka'] text-slate-900">
                Action Required: Pending Verification Queue
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Doctors awaiting medical license verification before accessing patient data.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
            {pendingDoctors.length} Pending
          </span>
        </div>

        {pendingDoctors.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
            <p className="text-xs font-bold text-slate-700">All pending doctor licenses have been processed!</p>
            <p className="text-[11px]">New doctor registrations will automatically appear here for verification.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDoctors.map((doc) => (
              <div
                key={doc.uid}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">
                      Dr. {doc.displayName || doc.email.split('@')[0]}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
                      {doc.doctorInfo?.specialization || 'Gynecologist'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                      License: <strong className="font-bold text-slate-900">{doc.doctorInfo?.licenseNumber || 'N/A'}</strong>
                    </span>
                    {doc.doctorInfo?.hospitalClinic && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {doc.doctorInfo.hospitalClinic}
                      </span>
                    )}
                    <span className="text-slate-400">{doc.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerify(doc.uid, true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Doctor
                  </button>
                  <button
                    onClick={() => handleVerify(doc.uid, false)}
                    className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-black text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Directory of All Doctors */}
      <div className="p-6 rounded-[28px] bg-white border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black font-['Fredoka'] text-slate-900">
              Registered Doctors Directory
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Search and manage healthcare provider status across the platform.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredDoctors.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 font-semibold">
              No doctors found matching "{searchQuery}".
            </div>
          ) : (
            filteredDoctors.map((doc) => (
              <div
                key={doc.uid}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-black flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 truncate">
                      Dr. {doc.displayName || doc.email}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate">
                      {doc.doctorInfo?.specialization || 'General'} • License: {doc.doctorInfo?.licenseNumber || 'None'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      doc.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.isVerified ? 'Verified' : 'Pending'}
                  </span>

                  <button
                    onClick={() => handleVerify(doc.uid, !doc.isVerified)}
                    className="text-[11px] font-black text-indigo-600 hover:underline cursor-pointer"
                  >
                    {doc.isVerified ? 'Revoke Approval' : 'Approve Now'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
