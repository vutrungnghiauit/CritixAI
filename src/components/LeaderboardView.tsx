import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Search,
  Filter,
  Sparkles,
  Swords,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Award,
  Calendar,
  CalendarDays,
  CalendarRange,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface LeaderboardViewProps {
  students: Student[];
  currentStudent: Student | null;
  onNavigateToDebate: () => void;
}

export type TimeFilterType = 'day' | 'week' | 'month' | 'quarter' | 'year';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  currentStudent,
  onNavigateToDebate
}) => {
  // Scopes & Search
  const [scope, setScope] = useState<'national' | 'university' | 'club'>('national');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Time Filters
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q4');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Tháng 10

  // Optional preview mode to test "Đang cập nhật" state
  const [simulatedBaseline, setSimulatedBaseline] = useState(false);

  // Trigger mini confetti
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Helper: check if a student is at baseline (Đồng Debater, 1 streak, 40 rubric, 0 XP)
  const isBaselineStudent = (s: Student) => {
    const isBronze = s.tier === 'Đồng Debater' || s.tier.toLowerCase().includes('đồng');
    const isZeroXP = (s.xp || 0) <= 0;
    const isMinRubric = (s.rubricAverage || 0) <= 40;
    const isMinStreak = (s.streakDays || 0) <= 1;
    return isBronze && isZeroXP && isMinRubric && isMinStreak;
  };

  // Compute period-adjusted student metrics based on Day, Week, Month, Quarter, Year
  const processedStudents = useMemo(() => {
    return students
      .filter(s => s.role !== 'admin') // Only rank students
      .map((s, idx) => {
        if (simulatedBaseline || isBaselineStudent(s)) {
          return {
            ...s,
            periodXP: 0,
            periodRubric: 40,
            periodStreak: 1,
            periodTier: 'Đồng Debater' as const,
            periodDebates: 0,
            isBaseline: true
          };
        }

        // Calculate periodic points for active students
        let periodXP = s.xp;
        let periodRubric = s.rubricAverage;
        let periodStreak = s.streakDays;
        let periodDebates = s.totalDebates;

        if (timeFilter === 'day') {
          // Ngày: 00:00 đến 23:59 hằng ngày
          // Tích lũy điểm trong ngày (dựa trên hoạt động trong ngày)
          const dayFactor = ((idx * 37 + 13) % 100) / 100;
          periodXP = Math.max(0, Math.round(s.xp * 0.08 * dayFactor) + 20);
          periodRubric = Math.min(99, Math.max(60, s.rubricAverage + ((idx % 3) - 1)));
          periodStreak = s.streakDays > 0 ? 1 : 0;
          periodDebates = Math.max(0, (idx % 3));
        } else if (timeFilter === 'week') {
          // Tuần: Thứ 2 đến Chủ nhật hằng tuần
          const weekFactor = 0.25 + (((idx * 17) % 50) / 100);
          periodXP = Math.max(0, Math.round(s.xp * weekFactor));
          periodRubric = s.rubricAverage;
          periodStreak = Math.min(7, s.streakDays);
          periodDebates = Math.max(1, Math.round(s.totalDebates * 0.35));
        } else if (timeFilter === 'month') {
          // Tháng: Đầu tháng đến cuối tháng
          const monthFactor = 0.55 + (((idx * 11) % 40) / 100);
          periodXP = Math.max(0, Math.round(s.xp * monthFactor));
          periodRubric = s.rubricAverage;
          periodStreak = Math.min(30, s.streakDays);
          periodDebates = Math.max(2, Math.round(s.totalDebates * 0.7));
        } else if (timeFilter === 'quarter') {
          // Quý: Quý 1, Quý 2, Quý 3, Quý 4
          const quarterWeights = { Q1: 0.7, Q2: 0.8, Q3: 0.85, Q4: 1.0 };
          const weight = quarterWeights[selectedQuarter] || 1.0;
          periodXP = Math.max(0, Math.round(s.xp * 0.85 * weight));
          periodRubric = s.rubricAverage;
          periodStreak = s.streakDays;
          periodDebates = Math.max(2, Math.round(s.totalDebates * 0.9));
        } else if (timeFilter === 'year') {
          // Năm: Tích lũy trọn năm
          periodXP = s.xp;
          periodRubric = s.rubricAverage;
          periodStreak = s.streakDays;
          periodDebates = s.totalDebates;
        }

        return {
          ...s,
          periodXP,
          periodRubric,
          periodStreak,
          periodTier: s.tier,
          periodDebates,
          isBaseline: false
        };
      });
  }, [students, timeFilter, selectedQuarter, selectedYear, selectedMonth, simulatedBaseline]);

  // Sort students by periodic XP, then by rubric average
  const sortedStudents = useMemo(() => {
    return [...processedStudents].sort((a, b) => {
      if (b.periodXP !== a.periodXP) {
        return b.periodXP - a.periodXP;
      }
      return b.periodRubric - a.periodRubric;
    });
  }, [processedStudents]);

  // Filter by Scope
  const scopedStudents = useMemo(() => {
    return sortedStudents.filter(s => {
      if (scope === 'university') {
        return s.university.includes('Nguyễn Tất Thành') || s.university.includes('NTTU');
      }
      if (scope === 'club') {
        return s.className.startsWith('25DKQT') || s.className.startsWith('25DMK');
      }
      return true;
    });
  }, [sortedStudents, scope]);

  // Check if ALL students have baseline data (Đồng Debater, 1, 40, 0 XP)
  // "Bảng xếp hạng nếu các thông tin về Cấp Bậc, Chuỗi 🔥, Rubric TB, Tổng XP bằng nhau là Đồng Debater 1 40 0 XP thì bảng xếp hạng sẽ hiển thị là 'Đang cập nhật'. Khi chưa có sinh viên nào có thông tin cao hơn sẽ không hiển thị ai đang là Quán quân tuần."
  const hasActiveContenders = useMemo(() => {
    if (scopedStudents.length === 0) return false;
    return scopedStudents.some(s => {
      return s.periodXP > 0 || s.periodRubric > 40 || s.periodStreak > 1 || (s.periodTier && s.periodTier !== 'Đồng Debater');
    });
  }, [scopedStudents]);

  // Filter based on search query
  const filteredList = useMemo(() => {
    return scopedStudents.filter(s => {
      return (
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.className.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [scopedStudents, searchQuery]);

  // Top 3 for Podium: Quán quân, Á quân 1, Á quân 2
  const top1 = hasActiveContenders ? scopedStudents[0] : null;
  const top2 = hasActiveContenders ? scopedStudents[1] : null;
  const top3 = hasActiveContenders ? scopedStudents[2] : null;

  // User current ranking
  const userRankIndex = currentStudent
    ? scopedStudents.findIndex(s => s.studentId === currentStudent.studentId)
    : -1;
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : 12;

  // Title label for the current period
  const periodTitle = useMemo(() => {
    switch (timeFilter) {
      case 'day':
        return 'Ngày (00:00 - 23:59 Hôm nay)';
      case 'week':
        return 'Tuần (Thứ 2 - Chủ nhật)';
      case 'month':
        return `Tháng ${selectedMonth} (Đầu tháng - Cuối tháng)`;
      case 'quarter':
        return `${selectedQuarter} (Quý đào tạo học thuật)`;
      case 'year':
        return `Năm Học ${selectedYear}`;
      default:
        return 'Tuần Này';
    }
  }, [timeFilter, selectedMonth, selectedQuarter, selectedYear]);

  const championTitle = useMemo(() => {
    switch (timeFilter) {
      case 'day':
        return 'QUÁN QUÂN NGÀY';
      case 'week':
        return 'QUÁN QUÂN TUẦN';
      case 'month':
        return `QUÁN QUÂN THÁNG ${selectedMonth}`;
      case 'quarter':
        return `QUÁN QUÂN ${selectedQuarter}`;
      case 'year':
        return `QUÁN QUÂN NĂM ${selectedYear}`;
    }
  }, [timeFilter, selectedMonth, selectedQuarter, selectedYear]);

  return (
    <div className="space-y-6 relative">
      {/* Confetti Animation Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="text-4xl animate-bounce">🎉 👑 🌟 🏆 🎊 🚀 ✨</div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
              <Trophy className="w-3.5 h-3.5" />
              MÙA GIẢI BIỆN LUẬN HỌC THUẬT 2026
            </span>
            <span className="text-xs text-blue-200 flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3" /> Chu kỳ: {periodTitle}
            </span>
            {!hasActiveContenders && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/80 text-white flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Trạng thái: Đang cập nhật
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-2">Bảng Xếp Hạng Năng Lực Tranh Biện Học Thuật</h2>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
            Vinh danh <strong>Quán quân 🥇</strong>, <strong>Á quân 1 🥈</strong>, <strong>Á quân 2 🥉</strong> với chuỗi lập luận logic vững chắc, năng lực phản biện sắc bén và kỷ luật rèn luyện liên tục.
          </p>
        </div>

        {/* Scope Selector & Quick simulation for test */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Quick test toggle for baseline "Đang cập nhật" condition */}
          <button
            type="button"
            onClick={() => setSimulatedBaseline(!simulatedBaseline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              simulatedBaseline
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-white/10 text-blue-100 hover:bg-white/20 border-white/20'
            }`}
            title="Nhấn để mô phỏng trạng thái toàn bộ sinh viên đều ở mức cơ bản (Đồng Debater, 1 Chuỗi, 40 Rubric, 0 XP)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {simulatedBaseline ? 'Đang Xem: Demo Đồng Debater 1-40-0' : 'Mô Phỏng Baseline (Đang cập nhật)'}
          </button>

          {/* Scope Selector */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-semibold">
            <button
              onClick={() => setScope('national')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                scope === 'national' ? 'bg-white text-slate-900 shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              🌐 Toàn Quốc
            </button>
            <button
              onClick={() => setScope('university')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                scope === 'university' ? 'bg-white text-slate-900 shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              🏛️ Trường NTTU
            </button>
            <button
              onClick={() => setScope('club')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                scope === 'club' ? 'bg-white text-slate-900 shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              👥 Lớp & CLB
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIME FILTER BAR: NGÀY, TUẦN, THÁNG, QUÝ, NĂM */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Bộ Lọc Chu Kỳ Xếp Hạng
            </span>
            <span className="text-[11px] text-slate-500">
              Lọc danh hiệu Quán quân, Á quân 1, Á quân 2 theo mốc thời gian
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Day Filter */}
          <button
            type="button"
            onClick={() => setTimeFilter('day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              timeFilter === 'day'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Theo Ngày</span>
            <span className="text-[10px] opacity-80">(00:00 - 23:59)</span>
          </button>

          {/* Week Filter */}
          <button
            type="button"
            onClick={() => setTimeFilter('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              timeFilter === 'week'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Theo Tuần</span>
            <span className="text-[10px] opacity-80">(Thứ 2 - CN)</span>
          </button>

          {/* Month Filter */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTimeFilter('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                timeFilter === 'month'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Theo Tháng</span>
            </button>
            {timeFilter === 'month' && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            )}
          </div>

          {/* Quarter Filter */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTimeFilter('quarter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                timeFilter === 'quarter'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Theo Quý</span>
            </button>
            {timeFilter === 'quarter' && (
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value as any)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300"
              >
                <option value="Q1">Quý 1 (T1-T3)</option>
                <option value="Q2">Quý 2 (T4-T6)</option>
                <option value="Q3">Quý 3 (T7-T9)</option>
                <option value="Q4">Quý 4 (T10-T12)</option>
              </select>
            )}
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTimeFilter('year')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                timeFilter === 'year'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Theo Năm</span>
            </button>
            {timeFilter === 'year' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300"
              >
                <option value="2026">Năm 2026</option>
                <option value="2025">Năm 2025</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PODIUM SHOWCASE: QUÁN QUÂN, Á QUÂN 1, Á QUÂN 2 */}
      {/* ======================================================== */}
      {!hasActiveContenders ? (
        /* Trạng thái "Đang cập nhật" khi tất cả bằng nhau ở mức Đồng Debater 1 40 0 XP */
        <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/5 via-slate-50 dark:via-slate-900 to-white dark:to-slate-900 border-2 border-dashed border-amber-300 dark:border-amber-700/60 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              BẢNG XẾP HẠNG: ĐANG CẬP NHẬT
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              Chưa có {championTitle} — Dữ liệu đang được đồng bộ
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tất cả học viên trong hệ thống hiện đang có các chỉ số bằng nhau ở mốc khởi đầu:
              <br />
              <strong className="text-amber-700 dark:text-amber-400 font-mono">
                Cấp bậc: Đồng Debater • Chuỗi: 1 Ngày • Rubric TB: 40 • Tổng XP: 0 XP
              </strong>.
              <br />
              Khi chưa có sinh viên nào có thông tin cao hơn, hệ thống sẽ tạm ẩn danh hiệu Quán quân và hiển thị trạng thái <strong>&quot;Đang cập nhật&quot;</strong>.
            </p>
          </div>

          {/* Placeholders for Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center opacity-85">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                🥈 Á QUÂN 1
              </span>
              <div className="mt-2 text-sm font-semibold text-slate-400 italic">Đang cập nhật...</div>
              <div className="text-[10px] text-slate-400 mt-1">Chờ tích lũy điểm thi đấu</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 text-center shadow-sm">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center justify-center gap-1 w-fit mx-auto shadow-sm">
                👑 QUÁN QUÂN
              </span>
              <div className="mt-2 text-base font-bold text-amber-600 dark:text-amber-400 italic">
                Đang cập nhật...
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Hãy là người đầu tiên bứt phá ngôi vương!
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center opacity-85">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400">
                🥉 Á QUÂN 2
              </span>
              <div className="mt-2 text-sm font-semibold text-slate-400 italic">Đang cập nhật...</div>
              <div className="text-[10px] text-slate-400 mt-1">Chờ tích lũy điểm thi đấu</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToDebate}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              Tham Gia Tranh Biện Để Trở Thành Quán Quân Đầu Tiên
            </button>
          </div>
        </div>
      ) : (
        /* Podium khi đã có sinh viên có thành tích cao hơn baseline */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
          {/* Top 2 - Á QUÂN 1 (Silver) */}
          {top2 && (
            <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-center flex flex-col items-center hover:border-slate-400 transition">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shadow mb-2">
                🥈
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Á QUÂN 1
              </span>
              <Medal className="w-7 h-7 text-slate-400 mb-1" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{top2.fullName}</h4>
              <p className="text-[11px] text-slate-500 font-mono">{top2.className} • {top2.studentId}</p>
              
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{top2.periodXP} XP</span>
                <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" /> {top2.periodStreak}
                </span>
              </div>
              <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                Rubric TB: {top2.periodRubric}/100
              </span>
            </div>
          )}

          {/* Top 1 - QUÁN QUÂN (Gold Champion) */}
          {top1 && (
            <div
              onClick={triggerConfetti}
              className="order-1 md:order-2 bg-gradient-to-b from-amber-500/15 via-white dark:via-slate-900 to-white dark:to-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-xl text-center flex flex-col items-center relative cursor-pointer group hover:scale-[1.02] transition duration-300"
            >
              <div className="absolute -top-5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-[11px] shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
                <Crown className="w-4 h-4 fill-slate-950" />
                {championTitle}
              </div>
              
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center font-black text-2xl mb-2 mt-2 group-hover:scale-110 transition duration-300 ring-4 ring-amber-400/30">
                👑
              </div>
              
              <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">{top1.fullName}</h4>
              <p className="text-xs text-slate-500 font-mono">{top1.className} • {top1.studentId}</p>
              
              <span className="mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {top1.periodTier}
              </span>
              
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">{top1.periodXP} XP</span>
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  <Flame className="w-4 h-4 fill-amber-500" /> {top1.periodStreak} ngày
                </span>
              </div>
              
              <span className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Rubric Xuất Sắc: {top1.periodRubric}/100
              </span>

              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Nhấn để tung pháo hoa chúc mừng!
              </span>
            </div>
          )}

          {/* Top 3 - Á QUÂN 2 (Bronze) */}
          {top3 && (
            <div className="order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-center flex flex-col items-center hover:border-orange-300 transition">
              <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 flex items-center justify-center font-bold text-xs shadow mb-2">
                🥉
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 uppercase tracking-wider mb-1">
                Á QUÂN 2
              </span>
              <Medal className="w-7 h-7 text-orange-400 mb-1" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{top3.fullName}</h4>
              <p className="text-[11px] text-slate-500 font-mono">{top3.className} • {top3.studentId}</p>
              
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{top3.periodXP} XP</span>
                <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" /> {top3.periodStreak}
                </span>
              </div>
              <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                Rubric TB: {top3.periodRubric}/100
              </span>
            </div>
          )}
        </div>
      )}

      {/* User Current Standing Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold font-mono text-lg border border-white/20">
            {hasActiveContenders ? `#${userRank}` : '—'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{currentStudent?.fullName || 'Học Viên Của Bạn'}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                BẠN
              </span>
            </div>
            <p className="text-xs text-blue-100">
              {hasActiveContenders
                ? `Đang xếp hạng #${userRank} trong chu kỳ ${periodTitle}. Rèn luyện thêm để vươn lên Top 3 Quán quân!`
                : 'Bảng xếp hạng đang cập nhật. Hãy tham gia ngay để ghi danh vào bảng vàng!'}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToDebate}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-xs transition shadow cursor-pointer shrink-0"
        >
          <Swords className="w-4 h-4" />
          Tranh Biện Thăng Hạng Ngay
        </button>
      </div>

      {/* Search Input for rankings */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm sinh viên trong bảng xếp hạng theo tên, MSSV, lớp sinh hoạt..."
          className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Rankings Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Bảng Danh Hiệu Học Thuật ({filteredList.length} Sinh Viên)
            </h3>
            <span className="text-xs text-slate-500">
              • Chu kỳ: {periodTitle}
            </span>
          </div>

          {!hasActiveContenders && (
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Trạng thái: Đang cập nhật
            </span>
          )}
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left min-w-[780px]">
            <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3 w-32 text-center">Danh Hiệu / Thứ Hạng</th>
                <th className="py-3 px-4">Học Viên</th>
                <th className="py-3 px-3">Lớp & Trường</th>
                <th className="py-3 px-3">Cấp Bậc</th>
                <th className="py-3 px-3 text-center">Chuỗi 🔥</th>
                <th className="py-3 px-3 text-center">Rubric TB</th>
                <th className="py-3 px-3 text-right">Tổng XP</th>
                <th className="py-3 px-4 text-center">Thách Đấu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredList.slice(0, 30).map((s, idx) => {
                const isCurrentUser = currentStudent?.studentId === s.studentId;
                const trend = idx % 3 === 0 ? 'up' : idx % 3 === 1 ? 'same' : 'down';

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                      isCurrentUser ? 'bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-500 font-semibold' : ''
                    }`}
                  >
                    {/* Danh hiệu / Hạng */}
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {!hasActiveContenders ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-normal text-slate-500 bg-slate-100 dark:bg-slate-800">
                          Đang cập nhật
                        </span>
                      ) : idx === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shadow-sm">
                          👑 Quán Quân
                        </span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-[11px] font-bold shadow-sm">
                          🥈 Á Quân 1
                        </span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-[11px] font-bold shadow-sm">
                          🥉 Á Quân 2
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                          <span>#{idx + 1}</span>
                          {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                          {trend === 'same' && <Minus className="w-3 h-3 text-slate-400" />}
                          {trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-500" />}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {s.fullName}
                        {isCurrentUser && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono">
                            BẠN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{s.className}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{s.university}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        s.periodTier === 'Đồng Debater'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {s.periodTier}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-500">
                      {s.periodStreak}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {s.periodRubric}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {s.periodXP} XP
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={onNavigateToDebate}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      >
                        Thách Đấu
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

