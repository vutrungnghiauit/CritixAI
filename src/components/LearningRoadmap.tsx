import React, { useState } from 'react';
import { Student, DailyQuest } from '../types';
import {
  GitFork,
  CheckCircle,
  Lock,
  Sparkles,
  Flame,
  Shield,
  Award,
  BookOpen,
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';

interface LearningRoadmapProps {
  currentStudent: Student | null;
  quests: DailyQuest[];
  onCompleteQuest: (questId: string) => void;
  onUseStreakFreeze: () => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  currentStudent,
  quests,
  onCompleteQuest,
  onUseStreakFreeze
}) => {
  const [streakFreezesCount, setStreakFreezesCount] = useState(2);
  const [freezeActive, setFreezeActive] = useState(false);

  const handleActivateFreeze = () => {
    if (streakFreezesCount > 0 && !freezeActive) {
      setStreakFreezesCount(prev => prev - 1);
      setFreezeActive(true);
      onUseStreakFreeze();
    }
  };

  const currentXp = currentStudent?.xp || 750;
  const streak = currentStudent?.streakDays || 5;

  const milestones = [
    {
      level: 1,
      title: 'Nhập Môn: Cấu Trúc Tiền Đề & Luận Điểm Claim',
      desc: 'Nắm vững kỹ thuật đặt tên luận điểm, phân biệt sự kiện thực tế vs ý kiến chủ quan.',
      minXp: 0,
      unlocked: true,
      completed: true
    },
    {
      level: 2,
      title: 'Trung Cấp: Dẫn Chứng Thực Nghiệm & Mô Hình Toulmin',
      desc: 'Áp dụng bộ 5 thành tố Toulmin (Claim, Grounds, Warrant, Backing, Rebuttal) vào lập luận.',
      minXp: 1000,
      unlocked: currentXp >= 1000,
      completed: currentXp >= 1600
    },
    {
      level: 3,
      title: 'Nâng Cao: Bẻ Gãy Phản Biện & Bóc Tách Ngụy Biện',
      desc: 'Nhận diện và hóa giải 12 lỗi ngụy biện logic kinh điển (Ad Hominem, Straw Man, Slippery Slope...).',
      minXp: 2200,
      unlocked: currentXp >= 2200,
      completed: currentXp >= 3200
    },
    {
      level: 4,
      title: 'Bậc Thầy: Biện Luận WUDC & Phân Tích Đa Chiều',
      desc: 'Làm chủ phòng tranh biện quốc tế WUDC, kiến tạo giải pháp bên thứ ba cho các đại khủng hoảng.',
      minXp: 3500,
      unlocked: currentXp >= 3500,
      completed: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Daily Streak & Freeze Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-black font-mono">{streak} Ngày</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                CHUỖI KỶ LUẬT
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-1">
              Duy trì việc luyện tập phản biện hàng ngày để củng cố các liên kết thần kinh tư duy logic.
            </p>
          </div>
        </div>

        {/* Streak Freeze Card */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-4 text-xs">
          <Shield className="w-8 h-8 text-cyan-200 shrink-0" />
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>Khiên Bảo Vệ Chuỗi (Streak Freeze)</span>
              <span className="px-2 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-bold font-mono text-[10px]">
                {streakFreezesCount} Còn lại
              </span>
            </div>
            <p className="text-[11px] text-amber-100 mt-0.5">
              Tự động bảo vệ chuỗi ngày nếu bạn bận rộn không thể làm bài trong 24 giờ tới.
            </p>
          </div>

          <button
            onClick={handleActivateFreeze}
            disabled={streakFreezesCount <= 0 || freezeActive}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
              freezeActive
                ? 'bg-emerald-400 text-slate-950'
                : streakFreezesCount > 0
                ? 'bg-white text-orange-600 hover:bg-orange-50 shadow'
                : 'bg-white/30 text-white/60 cursor-not-allowed'
            }`}
          >
            {freezeActive ? '✓ Đã Bật' : 'Kích Hoạt'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 4 Tiers Skill Tree */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <GitFork className="w-5 h-5 text-blue-600" /> Cây Kỹ Năng Tư Duy Phản Biện (4 Nấc Thang)
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {milestones.map((m) => (
                <div key={m.level} className="relative flex items-start gap-4">
                  {/* Status dot */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow z-10 ${
                    m.completed
                      ? 'bg-emerald-500 text-white'
                      : m.unlocked
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {m.completed ? <Check className="w-5 h-5" /> : m.unlocked ? m.level : <Lock className="w-4 h-4" />}
                  </div>

                  <div className={`flex-1 p-4 rounded-2xl border ${
                    m.unlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.title}</h4>
                      <span className="font-mono text-xs text-slate-400">Yêu cầu {m.minXp} XP</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className={`font-semibold ${
                        m.completed ? 'text-emerald-600' : m.unlocked ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {m.completed ? '✓ Đã Hoàn Thành' : m.unlocked ? 'Đang Thực Hiện' : 'Chưa Mở Khóa'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Academic Advisor & Daily Quests */}
        <div className="space-y-4">
          {/* AI Advisor Box */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <h3 className="font-bold text-sm">Cố Vấn Học Thuật AI (7-Day Plan)</h3>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Dựa trên kết quả phân tích lịch sử làm bài của bạn, điểm mạnh là <strong>Cấu trúc Toulmin</strong> (88/100). Tuy nhiên, bạn thường mắc phải <strong>Ngụy biện Khái quát hóa vội vã</strong> khi đối đầu với các đề tài kinh tế vĩ mô.
            </p>
            <div className="p-3 bg-white/10 rounded-xl text-xs space-y-1">
              <strong>Kế hoạch 7 ngày tới:</strong>
              <div>• Luyện 2 case study về chính sách thuế CBAM</div>
              <div>• Bổ sung ít nhất 2 số liệu định lượng cho mỗi luận cứ</div>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Nhiệm Vụ Hàng Ngày
            </h3>

            <div className="space-y-2 text-xs">
              {quests.map(q => (
                <div
                  key={q.id}
                  onClick={() => onCompleteQuest(q.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    q.completed
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      q.completed ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}>
                      {q.completed && '✓'}
                    </div>
                    <span className={q.completed ? 'line-through opacity-80' : 'font-medium'}>{q.title}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    +{q.rewardXp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
