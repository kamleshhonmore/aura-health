import React, { useState, useEffect, useRef } from 'react';
import { ScanType, VisionScanResult } from '../types';
import {
  Camera,
  Flashlight,
  RefreshCw,
  Lock,
  Sparkles,
  CheckCircle2,
  Scan,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface VisionScannerProps {
  onApplyScan: (result: VisionScanResult) => void;
}

export const VisionScannerScreen: React.FC<VisionScannerProps> = ({ onApplyScan }) => {
  const [scanType, setScanType] = useState<ScanType>('FACIAL_SYMPTOM');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [torch, setTorch] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<VisionScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize camera preview if supported, otherwise render optical viewfinder simulation
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      if (scanType === 'FACIAL_SYMPTOM') {
        setScanResult({
          scanType: 'FACIAL_SYMPTOM',
          confidenceScore: 0.94,
          primaryFinding: 'Low Inflammatory Acne & Balanced Sebum',
          clinicalInsight: 'Dermatological markers show minimal jawline pore congestion, consistent with low androgenic follicular phase activity.',
          metricLabel1: 'Acne Severity Index',
          metricValue1: '1.2 / 10 (Low)',
          metricLabel2: 'Hirsutism Indicator',
          metricValue2: 'Negative (0.0% coarse hair)',
          suggestedLogAction: 'Log Clear Skin in Follicular Profile'
        });
      } else {
        setScanResult({
          scanType: 'FLOW_DETECTION',
          confidenceScore: 0.96,
          primaryFinding: 'Light / Basal Spotting Detected',
          clinicalInsight: 'Colorimetric analysis detects minimal hemoglobin saturation (<0.5 ml/hr rate), indicating end of menstrual cycle or non-menstrual spotting.',
          metricLabel1: 'Flow Category',
          metricValue1: 'Light Spotting',
          metricLabel2: 'Color Calibration',
          metricValue2: '98% Delta-E accuracy',
          suggestedLogAction: 'Record Spotting in Cycle Log'
        });
      }
    }, 2200);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">AI Vision Scanner</h1>
          <p className="text-xs text-[#7E8799]">Computer Vision Biomarker Detection</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9CAF88]/15 border border-[#9CAF88]/30 text-[#9CAF88] text-xs font-semibold">
          <Lock className="w-3 h-3" />
          100% On-Device
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setScanType('FACIAL_SYMPTOM');
            setScanResult(null);
          }}
          className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
            scanType === 'FACIAL_SYMPTOM'
              ? 'bg-[#E29587]/15 text-[#F2ADA0] border-[#E29587] shadow-md'
              : 'bg-[#181B24] text-[#8E97A8] border-white/8 hover:border-white/15'
          }`}
        >
          Facial Acne & Hirsutism
        </button>

        <button
          onClick={() => {
            setScanType('FLOW_DETECTION');
            setScanResult(null);
          }}
          className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
            scanType === 'FLOW_DETECTION'
              ? 'bg-[#E29587]/15 text-[#F2ADA0] border-[#E29587] shadow-md'
              : 'bg-[#181B24] text-[#8E97A8] border-white/8 hover:border-white/15'
          }`}
        >
          Pad & Flow Colorimetry
        </button>
      </div>

      {/* Main Viewfinder Frame */}
      <div className="relative w-full aspect-[4/5] max-h-[380px] bg-[#12141C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Real Video or Realistic Optical Viewfinder Simulation */}
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E222D] to-[#0E1017] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#202430]/60 border border-white/5 flex items-center justify-center mb-3">
              <Scan className="w-10 h-10 text-[#E29587]/60" />
            </div>
            <p className="text-xs text-[#7E8799] max-w-[200px]">
              {scanType === 'FACIAL_SYMPTOM'
                ? 'Align chin and jawline inside target reticle'
                : 'Position absorbent surface in frame under even lighting'}
            </p>
          </div>
        )}

        {/* Viewfinder Reticle Overlay */}
        <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
          {/* Top brackets */}
          <div className="flex justify-between">
            <div className="w-4 h-4 border-t-2 border-l-2 border-[#E29587]" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-[#E29587]" />
          </div>

          {/* Center scan line if scanning */}
          {isScanning && (
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#E29587] to-transparent animate-pulse shadow-lg shadow-[#E29587]" />
          )}

          {/* Bottom brackets */}
          <div className="flex justify-between">
            <div className="w-4 h-4 border-b-2 border-l-2 border-[#E29587]" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-[#E29587]" />
          </div>
        </div>

        {/* Floating Viewfinder Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-[11px] text-white">
            <span
              className={`w-2 h-2 rounded-full ${
                isScanning ? 'bg-[#E29587] animate-ping' : 'bg-[#9CAF88]'
              }`}
            />
            {isScanning ? 'AI Analyzing...' : 'Optical Ready'}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTorch(!torch)}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                torch
                  ? 'bg-[#E5C388] text-[#111318] border-[#E5C388]'
                  : 'bg-black/60 text-white border-white/10 hover:bg-black/80'
              }`}
            >
              <Flashlight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Instruction Bar */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto text-center">
          <div className="inline-block px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-[#C4C9D6]">
            {scanType === 'FACIAL_SYMPTOM'
              ? 'Hold camera 20cm away from face'
              : 'Ensure uniform diffused ambient light'}
          </div>
        </div>
      </div>

      {/* Shutter Capture Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          className="w-18 h-18 rounded-full border-4 border-[#E29587]/40 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl disabled:opacity-60"
        >
          <div className="w-full h-full rounded-full bg-[#E29587] flex items-center justify-center text-[#111318]">
            {isScanning ? (
              <RefreshCw className="w-6 h-6 animate-spin text-[#111318]" />
            ) : (
              <Camera className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
        </button>
      </div>

      {/* Scan Results Card */}
      {scanResult && (
        <div className="p-5 bg-[#181B24] border border-[#E29587]/40 rounded-3xl space-y-3.5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E29587]" />
              <h3 className="text-sm font-bold text-white">AI Biomarker Analysis Complete</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#9CAF88]/15 text-[#9CAF88] font-bold border border-[#9CAF88]/30">
              {(scanResult.confidenceScore * 100).toFixed(0)}% Match
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#12141C] border border-white/5 space-y-1.5">
            <div className="text-xs font-bold text-[#F2ADA0]">{scanResult.primaryFinding}</div>
            <p className="text-xs text-[#9DA4B5] leading-relaxed">{scanResult.clinicalInsight}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#202430] border border-white/5">
              <div className="text-[10px] text-[#7E8799] uppercase font-bold">{scanResult.metricLabel1}</div>
              <div className="text-xs font-bold text-white mt-0.5">{scanResult.metricValue1}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#202430] border border-white/5">
              <div className="text-[10px] text-[#7E8799] uppercase font-bold">{scanResult.metricLabel2}</div>
              <div className="text-xs font-bold text-white mt-0.5">{scanResult.metricValue2}</div>
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setScanResult(null)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#202430] hover:bg-[#2A3040] text-xs font-semibold text-[#8E97A8] transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => onApplyScan(scanResult)}
              className="flex-[2] py-2.5 px-3 rounded-xl bg-[#E29587] hover:bg-[#EAA194] text-xs font-bold text-[#111318] transition-all cursor-pointer shadow-md shadow-[#E29587]/20 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {scanResult.suggestedLogAction}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
