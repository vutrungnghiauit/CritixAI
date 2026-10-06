import React, { useState } from 'react';
import { CaseStudy, RubricEvaluation, Student } from '../types';
import { evaluateArgument } from '../services/aiLogicEngine';
import { generateCaseStudyWithAI, PRESET_CASE_TOPICS, CasePresetTopic } from '../services/aiCaseStudyGenerator';
import { RadarChart } from './RadarChart';
import {
  FileText,
  Users,
  Compass,
  CheckSquare,
  Sparkles,
  Trophy,
  AlertCircle,
  HelpCircle,
  Send,
  RotateCcw,
  Plus,
  X,
  Loader2,
  BookOpen,
  GraduationCap,
  Flame,
  Globe,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface CaseStudyAnalysisProps {
  cases: CaseStudy[];
  currentStudent: Student | null;
  isOffline: boolean;
  onCompleteCase: (rubric: RubricEvaluation, xpEarned: number) => void;
  onAddCase?: (newCase: CaseStudy) => void;
}

export const CaseStudyAnalysis: React.FC<CaseStudyAnalysisProps> = ({
  cases,
  currentStudent,
  isOffline,
  onCompleteCase,
  onAddCase
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(cases[0] || {
    id: 'case-default',
    title: 'Khủng hoảng Thuật toán Tuyển dụng Tự động tại NovaTech Solutions',
    industry: 'Công nghệ & Quản trị Nhân sự',
    context: 'Tập đoàn NovaTech triển khai hệ thống AI sàng lọc hồ sơ CV của 200,000 ứng viên...',
    stakeholders: [],
    ethicalDilemma: 'Nên tạm dừng toàn bộ hệ thống hay vá lỗi dần dần?',
    guidingQuestions: ['1. Trách nhiệm đạo đức thuộc về ai?'],
    suggestedBiases: ['Thiên kiến xác nhận']
  });
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [solutionText, setSolutionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(null);

  // AI Generator Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'academic' | 'student_life' | 'current_affairs' | 'custom'>('academic');
  const [customTopicPrompt, setCustomTopicPrompt] = useState('');
  const [customIndustry, setCustomIndustry] = useState('Giáo Dục & Xã Hội');
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const toggleBias = (bias: string) => {
    if (selectedBiases.includes(bias)) {
      setSelectedBiases(selectedBiases.filter(b => b !== bias));
    } else {
      setSelectedBiases([...selectedBiases, bias]);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionText.trim()) return;

    setIsSubmitting(true);
    const fullAnalysis = `[Tình huống]: ${selectedCase.title}\n[Thiên kiến nhận diện]: ${selectedBiases.join(', ')}\n[Giải pháp đề xuất]: ${solutionText}`;
    const rubric = await evaluateArgument(fullAnalysis, selectedCase.title, 'Independent', isOffline);
    setEvaluation(rubric);
    setIsSubmitting(false);
    onCompleteCase(rubric, 180);
    showToast('Đã chấm điểm bài phân tích tình huống thành công! (+180 XP)', 'success');
  };

  const handleReset = () => {
    setSolutionText('');
    setSelectedBiases([]);
    setEvaluation(null);
  };

  // 1-Click Apply from Preset
  const handleApplyPresetCase = (preset: CasePresetTopic) => {
    const existing = cases.find(c => c.id === preset.defaultCase.id || c.title === preset.defaultCase.title);
    if (existing) {
      setSelectedCase(existing);
    } else {
      if (onAddCase) {
        onAddCase(preset.defaultCase);
      }
      setSelectedCase(preset.defaultCase);
    }
    handleReset();
    setShowAiModal(false);
    showToast(`Đã tải thành công tình huống: "${preset.title}"`, 'success');
  };

  // Quick Random Case Selection
  const handleQuickRandomCase = () => {
    const unselected = PRESET_CASE_TOPICS.filter(p => p.defaultCase.id !== selectedCase.id);
    const chosen = unselected[Math.floor(Math.random() * unselected.length)] || PRESET_CASE_TOPICS[0];
    handleApplyPresetCase(chosen);
  };

  // Generate Case via Gemini AI or Synthesizer
  const handleGenerateCustomCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopicPrompt.trim() && activeCategoryTab === 'custom') return;

    setIsGeneratingCase(true);
    try {
      const topic = customTopicPrompt.trim() || 'Xung đột học thuật và liêm chính nghiên cứu sinh viên';
      const newCase = await generateCaseStudyWithAI(topic, customIndustry, isOffline);

      if (onAddCase) {
        onAddCase(newCase);
      }
      setSelectedCase(newCase);
      handleReset();
      setShowAiModal(false);
      setCustomTopicPrompt('');
      showToast(`AI đã tạo thành công tình huống mới: "${newCase.title}"!`, 'success');
    } catch (err: any) {
      showToast('Có lỗi khi tạo tình huống: ' + (err?.message || 'Không thể tạo'), 'info');
    } finally {
      setIsGeneratingCase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-lg text-xs md:text-sm animate-in fade-in transition ${
          notification.type === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
            : 'bg-purple-600 text-white shadow-purple-500/20'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/20 rounded-lg text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Selector & AI Generator Button */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              Harvard Case Method
            </span>
            <span className="text-xs text-slate-500 font-medium">{selectedCase.industry}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {selectedCase.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Dropdown Case Study Selection */}
          <select
            value={selectedCase.id}
            onChange={(e) => {
              const c = cases.find(item => item.id === e.target.value);
              if (c) {
                setSelectedCase(c);
                handleReset();
              }
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 max-w-[260px] truncate"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          {/* Targeted Action Button: AI Case Study Generator */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 transition cursor-pointer shrink-0"
            title="Tạo Case Study mới bằng Trí Tuệ Nhân Tạo (Gemini AI)"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Tạo Case Bằng AI</span>
          </button>

          {/* Secondary Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Làm mới bài làm tình huống"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context & Stakeholder Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Context box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Bối Cảnh Thực Tiễn
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
              {selectedCase.context}
            </p>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              <strong>Mâu thuẫn đạo đức cốt lõi: </strong>{selectedCase.ethicalDilemma}
            </div>
          </div>

          {/* Stakeholder Matrix */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Bản Đồ Các Bên Liên Quan (Stakeholder Matrix)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedCase.stakeholders.map((sh, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-slate-100">{sh.group}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      sh.powerLevel === 'Cao' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60'
                    }`}>
                      Quyền lực: {sh.powerLevel}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Lợi ích:</span> {sh.interest}
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 text-[11px]">
                    <span className="font-medium">Mối lo ngại:</span> {sh.concern}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Bias Detector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500" /> Bộ Lọc Thiên Kiến Nhận Thức (Cognitive Bias Checklist)
            </h3>
            <p className="text-xs text-slate-500">
              Hãy đánh dấu các thiên kiến nhận thức bạn nhận thấy các bên đang mắc phải trong tình huống này:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Thiên kiến xác nhận (Confirmation Bias)',
                'Ngụy biện chi phí chìm (Sunk Cost Fallacy)',
                'Ngụy biện Nhị nguyên giả (False Dilemma)',
                'Hiệu ứng đám đông (Bandwagon Effect)',
                'Thiên kiến vị kỷ nhóm (In-group Bias)',
                'Hiệu ứng hào quang kỹ thuật (Technological Halo Effect)'
              ].map((bias, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleBias(bias)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    selectedBiases.includes(bias)
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {selectedBiases.includes(bias) ? '✓ ' : '+ '} {bias}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Input */}
          <form onSubmit={handleSubmitSolution} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Đề Xuất Giải Pháp & Biện Minh Luận Điểm
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {solutionText.trim().split(/\s+/).filter(Boolean).length} từ
              </span>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <strong>Câu hỏi định hướng:</strong>
              {selectedCase.guidingQuestions.map((q, i) => (
                <div key={i} className="text-slate-600 dark:text-slate-400">{q}</div>
              ))}
            </div>

            <textarea
              rows={5}
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              placeholder="Trình bày giải pháp toàn diện: Làm thế nào để cân bằng lợi ích các bên, loại bỏ thiên kiến và thiết lập lộ trình thực thi bền vững..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              required
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !solutionText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-purple-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'AI Đang Đánh Giá...' : 'Nộp Bài Phân Tích Case (+180 XP)'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Rubric Evaluation */}
        <div className="space-y-4">
          {evaluation ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Điểm Phân Tích Case</h3>
                </div>
                <span className="text-xl font-bold font-mono text-purple-600">
                  {evaluation.overallScore}/100
                </span>
              </div>

              <RadarChart scores={evaluation.dimensionScores} size={240} />

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">Tầm nhìn Đa chiều:</span>
                    <span className="font-mono text-purple-600">{evaluation.dimensionScores.multiPerspective}/100</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{evaluation.dimensionFeedback.multiPerspective}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">Logic & Tính Thực Tiễn:</span>
                    <span className="font-mono text-purple-600">{evaluation.dimensionScores.logic}/100</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{evaluation.dimensionFeedback.logic}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300">Phản biện từ Luật sư của quỷ:</span>
                <p className="text-slate-700 dark:text-slate-300 italic">{evaluation.devilsAdvocateChallenge}</p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Phân Tích Tình Huống Tiếp Theo
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> Hướng Dẫn Phương Pháp Harvard
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Phương pháp tình huống đòi hỏi sinh viên không chỉ tìm kiếm một câu trả lời duy nhất &quot;đúng hoặc sai&quot;, mà phải biết đặt mình vào vị thế của người ra quyết định (Decision-maker) trong điều kiện thông tin bất hoàn hảo và áp lực thời gian.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-500 space-y-1">
                <div>• Nhận diện mâu thuẫn cốt lõi</div>
                <div>• Cân bằng quyền lực các bên liên quan</div>
                <div>• Loại trừ các thiên kiến nhận thức</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: AI CASE STUDY GENERATOR (GEMINI 3.8 FLASH) */}
      {/* ======================================================== */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                    Tạo Case Study Thực Tế Bằng Trí Tuệ Nhân Tạo
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold">
                      Gemini 3.8 Flash
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mô hình ngôn ngữ lớn kiến tạo các tình huống thời sự & đời sống học đường chuẩn Harvard Case Method
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickRandomCase}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs transition cursor-pointer"
                  title="Tự động chọn ngẫu nhiên một tình huống thực tế để nạp ngay"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>🎲 AI Chọn Nhanh Ngẫu Nhiên</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-1.5 my-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveCategoryTab('academic')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                  activeCategoryTab === 'academic'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Học Tập & Liêm Chính Học Thuật</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategoryTab('student_life')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                  activeCategoryTab === 'student_life'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Đời Sống Sinh Viên & Giới Trẻ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategoryTab('current_affairs')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                  activeCategoryTab === 'current_affairs'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Thời Sự & Xã Hội Hiện Tại (2025-2026)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategoryTab('custom')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                  activeCategoryTab === 'custom'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tùy Biến Theo Đề Tài Riêng</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 space-y-4">
              {activeCategoryTab !== 'custom' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Chọn 1 tình huống được tuyển chọn sẵn để nạp vào hệ thống:</span>
                    <span className="font-semibold text-purple-600">Chuẩn Harvard Case Method</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PRESET_CASE_TOPICS
                      .filter(p => p.category === activeCategoryTab)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-700 transition flex flex-col justify-between space-y-2.5"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                                {p.industry}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm mt-1.5 leading-snug">
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {p.brief}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApplyPresetCase(p)}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 dark:hover:bg-purple-600 text-purple-600 dark:text-purple-300 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <span>Chọn Tình Huống Này</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}

              {/* Custom Prompt Form */}
              {activeCategoryTab === 'custom' && (
                <form onSubmit={handleGenerateCustomCase} className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/30 dark:bg-purple-950/20 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Nhập Đề Tài / Vấn Đề Thời Sự Bạn Muốn AI Xây Dựng Tình Huống:
                    </label>
                    <textarea
                      rows={3}
                      value={customTopicPrompt}
                      onChange={(e) => setCustomTopicPrompt(e.target.value)}
                      placeholder="Ví dụ: Áp lực tăng học phí đại học công lập tự chủ, Trào lưu chữa lành của sinh viên, Khủng hoảng phòng trọ giá cao, Cháy xe máy điện trong hầm trường học..."
                      className="w-full p-3 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      💡 Mẹo: Bạn có thể nhập bất kỳ sự kiện thời sự nào trên báo chí hoặc vấn đề nhức nhối trong trường học. AI sẽ tự động phân tích và tạo đầy đủ 4 bên liên quan (Stakeholder Matrix), mâu thuẫn đạo đức và câu hỏi định hướng.
                    </p>

                    <div className="mt-2.5 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Chủ đề thời sự & đời sống sinh viên 2026 gợi ý nhanh (Nhấn để chọn):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Áp lực tăng học phí đại học công lập tự chủ',
                          'Deepfake giả mạo giảng viên lừa đảo chuyển khoản',
                          'Làn sóng cắt giảm việc làm IT do AI & định hướng Gen Z',
                          'Khủng hoảng giá phòng trọ và ký túc xá đại học',
                          'Cam kết Net-Zero & Cấm xe máy xăng trong trường',
                          'Sinh viên kiệt sức vì chạy Grab đêm kiếm sống',
                          'Camera AI điểm danh & chấm điểm cảm xúc sinh viên',
                          'AI viết 70% khóa luận tốt nghiệp: Đạo văn hay sáng tạo?'
                        ].map((promptChip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCustomTopicPrompt(promptChip)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700 hover:border-purple-300 text-slate-700 dark:text-slate-300 transition text-left cursor-pointer"
                          >
                            💡 {promptChip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ngành đào tạo trọng tâm
                      </label>
                      <select
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Giáo Dục & Xã Hội">Giáo Dục & Xã Hội</option>
                        <option value="Công Nghệ Thông Tin & AI">Công Nghệ Thông Tin & AI</option>
                        <option value="Kinh Tế & Quản Trị Kinh Doanh">Kinh Tế & Quản Trị Kinh Doanh</option>
                        <option value="Luật Pháp & Chính Sách Công">Luật Pháp & Chính Sách Công</option>
                        <option value="Y Dược & Sức Khỏe Cộng Đồng">Y Dược & Sức Khỏe Cộng Đồng</option>
                        <option value="Môi Trường & Phát Triển Bền Vững">Môi Trường & Phát Triển Bền Vững</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isGeneratingCase || !customTopicPrompt.trim()}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingCase ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI Đang Soạn Case...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Kích Hoạt Gemini AI Tạo Case</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Hỗ trợ cả môi trường Ngoại Tuyến (Offline Synthesis) & Trực Tuyến với Gemini AI.</span>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="font-semibold text-slate-600 dark:text-slate-400 hover:underline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

