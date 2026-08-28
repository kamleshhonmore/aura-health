import React from 'react';
import { X, Sparkles, Bell, Calendar, Droplets, Heart } from 'lucide-react';

interface NotificationModalProps {
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const alerts = [
    {
      id: '1',
      title: 'Fertile Window Forecast',
      desc: 'Your fertile window begins in 2 days (Oct 16). Peak LH surge anticipated on Oct 20.',
      time: '1h ago',
      icon: Sparkles,
      color: 'text-[#E5C388] bg-[#E5C388]/15 border-[#E5C388]/30'
    },
    {
      id: '2',
      title: 'Dermatological Scan Reminder',
      desc: 'Follicular phase is ideal for logging your skin baseline before ovulation.',
      time: '6h ago',
      icon: Heart,
      color: 'text-[#E29587] bg-[#E29587]/15 border-[#E29587]/30'
    },
    {
      id: '3',
      title: 'Cycle Regularity High',
      desc: 'Your past 5 cycles show 94% regularity with average length of 28.2 days.',
      time: '1d ago',
      icon: Calendar,
      color: 'text-[#9CAF88] bg-[#9CAF88]/15 border-[#9CAF88]/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181B24] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#E29587]" />
            <h2 className="text-sm font-bold text-white">Clinical Alerts & Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#202430] hover:bg-[#2A3040] text-[#7E8799] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {alerts.map((a) => {
            const IconComponent = a.icon;
            return (
              <div
                key={a.id}
                className="p-3.5 rounded-2xl bg-[#12141C] border border-white/5 flex items-start gap-3"
              >
                <div className={`p-2 rounded-xl border shrink-0 ${a.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{a.title}</span>
                    <span className="text-[10px] text-[#7E8799]">{a.time}</span>
                  </div>
                  <p className="text-xs text-[#8E97A8] mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#202430] hover:bg-[#2A3040] text-xs font-semibold text-white transition-colors"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
};
