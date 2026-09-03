import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ThemeConfig, CycleRecord, DayLog } from '../types';
import { symptomList, moodList } from '../data';
import {
  TrendingUp,
  Activity,
  Scale,
  Thermometer,
  Calendar,
  Sparkles,
  PieChart,
  BarChart2,
  Download,
} from 'lucide-react';

interface ChartsViewProps {
  theme: ThemeConfig;
  cycles: CycleRecord[];
  logs: Record<string, DayLog>;
  tempUnit: 'F' | 'C';
  weightUnit: 'kg' | 'lbs';
}

export const ChartsView: React.FC<ChartsViewProps> = ({
  theme,
  cycles,
  logs,
  tempUnit,
  weightUnit,
}) => {
  const [activeTab, setActiveTab] = useState<'cycles' | 'temperature' | 'weight' | 'symptoms'>('cycles');

  // Stats calculation
  const totalCycles = cycles.length;
  const avgCycleLength = Math.round(
    cycles.reduce((acc, c) => acc + c.cycleLength, 0) / (totalCycles || 1)
  );
  const avgPeriodLength = Math.round(
    cycles.reduce((acc, c) => acc + c.periodLength, 0) / (totalCycles || 1)
  );

  // BBT data points
  const bbtData = [
    { day: 1, temp: 97.4, phase: 'period' },
    { day: 3, temp: 97.3, phase: 'period' },
    { day: 5, temp: 97.5, phase: 'follicular' },
    { day: 8, temp: 97.4, phase: 'follicular' },
    { day: 11, temp: 97.5, phase: 'follicular' },
    { day: 13, temp: 97.2, phase: 'ovulation_dip' },
    { day: 14, temp: 97.8, phase: 'ovulation' },
    { day: 16, temp: 98.1, phase: 'luteal' },
    { day: 19, temp: 98.3, phase: 'luteal' },
    { day: 22, temp: 98.4, phase: 'luteal' },
    { day: 25, temp: 98.3, phase: 'luteal' },
    { day: 28, temp: 97.6, phase: 'pre_period' },
  ];

  // Weight data points
  const weightData = [
    { label: 'May', weight: 59.0, bmi: 21.6 },
    { label: 'Jun', weight: 58.6, bmi: 21.5 },
    { label: 'Jul', weight: 58.2, bmi: 21.3 },
    { label: 'Aug', weight: 57.9, bmi: 21.2 },
    { label: 'Current', weight: 58.1, bmi: 21.3 },
  ];

  // Top symptoms count from logs
  const symptomCounts: Record<string, number> = {};
  const moodCounts: Record<string, number> = {};

  Object.values(logs).forEach((log) => {
    log.symptoms?.forEach((sId) => {
      symptomCounts[sId] = (symptomCounts[sId] || 0) + 1;
    });
    log.moods?.forEach((mId) => {
      moodCounts[mId] = (moodCounts[mId] || 0) + 1;
    });
  });

  const sortedSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const sortedMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Cycle & Health Report', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Recorded Cycles: ${totalCycles}`, 20, 35);
    doc.text(`Average Cycle Length: ${avgCycleLength} days`, 20, 45);
    doc.text(`Average Period Length: ${avgPeriodLength} days`, 20, 55);

    let yPos = 70;
    doc.setFont('helvetica', 'bold');
    doc.text('Top Symptoms:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    if (sortedSymptoms.length === 0) {
      doc.text('No symptoms logged.', 25, yPos);
      yPos += 10;
    } else {
      sortedSymptoms.forEach(([sId, count]) => {
        const sym = symptomList.find((s) => s.id === sId);
        const name = sym ? sym.name : sId;
        doc.text(`- ${name}: logged ${count} times`, 25, yPos);
        yPos += 10;
      });
    }

    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Dominant Moods:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    if (sortedMoods.length === 0) {
      doc.text('No moods logged.', 25, yPos);
      yPos += 10;
    } else {
      sortedMoods.forEach(([mId, count]) => {
        const m = moodList.find((item) => item.id === mId);
        const name = m ? m.name : mId;
        doc.text(`- ${name}: logged ${count} times`, 25, yPos);
        yPos += 10;
      });
    }

    doc.save('cycle_report.pdf');
  };

  return (
    <div className="space-y-4">
      {/* Top Header with Export Button */}
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-black font-['Fredoka'] ${theme.textPrimary}`}>
          Health Insights
        </h2>
        <button
          onClick={handleExportPDF}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${theme.bannerBg} shadow-sm active:scale-95 transition-all`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Top Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-pink-100 shadow-xs overflow-x-auto">
        {[
          { id: 'cycles', label: 'Cycle History', icon: Calendar },
          { id: 'temperature', label: 'BBT Curve', icon: Thermometer },
          { id: 'weight', label: 'Weight & BMI', icon: Scale },
          { id: 'symptoms', label: 'Symptoms', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black font-['Fredoka'] flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#FF6B8B] text-white shadow-xs'
                  : 'text-[#875C66] hover:bg-pink-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cycle History & Stats */}
      {activeTab === 'cycles' && (
        <div className="space-y-4">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md`}>
              <span className="text-[11px] font-bold text-[#875C66] uppercase">Average Cycle</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-['Fredoka'] text-[#FF6B8B]">
                  {avgCycleLength}
                </span>
                <span className="text-xs font-bold text-[#875C66]">Days</span>
              </div>
              <p className="text-[10px] text-[#A88B93] mt-0.5">Regular (28-29 days)</p>
            </div>

            <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md`}>
              <span className="text-[11px] font-bold text-[#875C66] uppercase">Average Period</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-['Fredoka'] text-[#FF5376]">
                  {avgPeriodLength}
                </span>
                <span className="text-xs font-bold text-[#875C66]">Days</span>
              </div>
              <p className="text-[10px] text-[#A88B93] mt-0.5">Normal duration (4-5 days)</p>
            </div>
          </div>

          {/* Cycle Bars Chart */}
          <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
                Past 5 Recorded Cycles
              </h3>
              <span className="text-[10px] font-bold text-[#FF6B8B] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                Avg: {avgCycleLength}d
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {cycles.map((c, i) => {
                const percent = Math.min(100, (c.cycleLength / 35) * 100);
                const periodPercent = (c.periodLength / c.cycleLength) * 100;
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#5C454B]">
                      <span>{c.startDate}</span>
                      <span className="font-['Fredoka'] text-[#FF6B8B]">
                        {c.cycleLength} Days ({c.periodLength}d period)
                      </span>
                    </div>

                    {/* Stacked bar */}
                    <div className="w-full h-4 rounded-full bg-pink-100 overflow-hidden flex relative">
                      {/* Period segment */}
                      <div
                        style={{ width: `${(c.periodLength / 35) * 100}%` }}
                        className="h-full bg-[#FF5376] rounded-l-full"
                        title={`Period: ${c.periodLength} days`}
                      />
                      {/* Follicular & Luteal segment */}
                      <div
                        style={{ width: `${((c.cycleLength - c.periodLength) / 35) * 100}%` }}
                        className="h-full bg-gradient-to-r from-[#FFB300]/60 to-[#81C784]/70"
                        title={`Cycle: ${c.cycleLength} days`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Basal Body Temp (BBT) Chart */}
      {activeTab === 'temperature' && (
        <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
                BBT Biphasic Thermal Curve
              </h3>
              <p className="text-[10px] text-[#875C66]">
                Noticeable shift after Day 14 ovulation (+0.5°F ~ +1.0°F)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
              Ovulation Confirmed
            </span>
          </div>

          {/* SVG Thermal Curve */}
          <div className="h-44 w-full bg-[#FFFDFE] rounded-2xl border border-pink-50 p-2 relative flex flex-col justify-between">
            {/* Ovulation Vertical Divider */}
            <div className="absolute top-2 bottom-6 left-[50%] border-l-2 border-dashed border-[#FFB300] z-0 flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#FFB300] bg-[#FFF8E1] px-1 rounded -mt-2">
                Ovulation Day 14
              </span>
            </div>

            {/* SVG Line */}
            <svg className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF708F" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF708F" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Under Curve */}
              <polygon
                points={`
                  0,90 
                  ${bbtData
                    .map((d, i) => {
                      const x = (i / (bbtData.length - 1)) * 100;
                      // map 97.0 -> 99.0
                      const y = 90 - ((d.temp - 97.0) / 1.6) * 75;
                      return `${x}%,${y}`;
                    })
                    .join(' ')} 
                  100%,90
                `}
                fill="url(#tempGradient)"
              />

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#FF6B8B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={bbtData
                  .map((d, i) => {
                    const x = (i / (bbtData.length - 1)) * 100;
                    const y = 90 - ((d.temp - 97.0) / 1.6) * 75;
                    return `${x}%,${y}`;
                  })
                  .join(' ')}
              />

              {/* Data points */}
              {bbtData.map((d, i) => {
                const x = `${(i / (bbtData.length - 1)) * 100}%`;
                const y = 90 - ((d.temp - 97.0) / 1.6) * 75;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-white stroke-[#FF6B8B] stroke-2 hover:r-6 cursor-pointer transition-all"
                  />
                );
              })}
            </svg>

            {/* X-axis Cycle Days */}
            <div className="flex justify-between text-[9px] font-bold text-[#A88B93] pt-2 border-t border-gray-100">
              <span>Day 1 (Period)</span>
              <span>Day 7</span>
              <span>Day 14 (Ovulation)</span>
              <span>Day 21</span>
              <span>Day 28 (Luteal)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#FFF9FA] border border-pink-100">
              <span className="text-[10px] font-bold text-[#875C66]">Follicular Baseline</span>
              <p className="font-black font-['Fredoka'] text-[#FF6B8B]">97.4 °F (Lower)</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF9FA] border border-pink-100">
              <span className="text-[10px] font-bold text-[#875C66]">Luteal Shift</span>
              <p className="font-black font-['Fredoka'] text-[#E91E63]">98.3 °F (+0.9°F)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Weight & BMI */}
      {activeTab === 'weight' && (
        <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
              Weight Progression & BMI
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E1F5FE] text-[#0288D1]">
              Healthy BMI: 21.3
            </span>
          </div>

          <div className="space-y-2">
            {weightData.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#FF708F]" />
                  <span className="text-xs font-bold text-[#4A2E35]">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#875C66]">BMI {item.bmi}</span>
                  <span className="text-sm font-black font-['Fredoka'] text-[#FF6B8B]">
                    {item.weight} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Symptoms & Mood Frequency */}
      {activeTab === 'symptoms' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-3`}>
            <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
              Most Frequent Symptoms
            </h3>

            {sortedSymptoms.length === 0 ? (
              <p className="text-xs text-[#875C66] italic py-2">No symptoms logged yet.</p>
            ) : (
              <div className="space-y-2">
                {sortedSymptoms.map(([sId, count]) => {
                  const sym = symptomList.find((s) => s.id === sId);
                  const barPercent = Math.min(100, (count / 6) * 100);
                  return (
                    <div key={sId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-[#4A2E35]">
                        <span className="flex items-center gap-1.5">
                          <span>{sym?.emoji}</span>
                          <span>{sym?.name || sId}</span>
                        </span>
                        <span className="font-['Fredoka'] text-[#FF6B8B]">{count} times</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-pink-100 overflow-hidden">
                        <div
                          style={{ width: `${barPercent}%` }}
                          className="h-full bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-3`}>
            <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
              Dominant Moods This Cycle
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortedMoods.map(([mId, count]) => {
                const m = moodList.find((item) => item.id === mId);
                return (
                  <div
                    key={mId}
                    className="px-3 py-1.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex items-center gap-1.5 text-xs font-bold text-[#4A2E35]"
                  >
                    <span>{m?.emoji}</span>
                    <span>{m?.name || mId}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#FF6B8B] text-white text-[10px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
