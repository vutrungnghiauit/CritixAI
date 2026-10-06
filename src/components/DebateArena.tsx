import React, { useState, useEffect } from 'react';
import { Student, DebateTopic, DebateMessage, RubricEvaluation } from '../types';
import { evaluateArgument, generateAIOpponentSpeech } from '../services/aiLogicEngine';
import { GoogleGenAI } from '@google/genai';
import { RadarChart } from './RadarChart';
import {
  Swords,
  Clock,
  Sparkles,
  Send,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Trophy,
  ChevronRight,
  ShieldAlert,
  Flame,
  ArrowRight,
  Plus,
  X,
  BookOpen,
  GraduationCap,
  Loader2,
  Play,
  Pause,
  Settings,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface DebateArenaProps {
  topics: DebateTopic[];
  currentStudent: Student | null;
  isOffline: boolean;
  onCompleteDebate: (rubric: RubricEvaluation, xpEarned: number) => void;
  onAddTopic?: (topic: DebateTopic) => void;
}

export const DebateArena: React.FC<DebateArenaProps> = ({
  topics,
  currentStudent,
  isOffline,
  onCompleteDebate,
  onAddTopic
}) => {
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(topics[0]);
  const [userRole, setUserRole] = useState<'Pro' | 'Con'>('Pro');
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [customTotalSeconds, setCustomTotalSeconds] = useState(180);
  const [roundTimeSeconds, setRoundTimeSeconds] = useState(180); // configured speech limit
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerFloatingWidget, setShowTimerFloatingWidget] = useState(false);
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState('3');
  const [customSecondsInput, setCustomSecondsInput] = useState('0');

  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(null);
  const [isDebateFinished, setIsDebateFinished] = useState(false);

  // Check if countdown is in the last 10 seconds (10s, 9s, ... 1s)
  const isLast10Seconds = roundTimeSeconds <= 10 && roundTimeSeconds > 0 && isTimerRunning;

  // AI Topic Generator States
  const [showAiTopicModal, setShowAiTopicModal] = useState(false);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [customFormat, setCustomFormat] = useState<'Oxford' | 'Karl Popper' | 'Parliamentary WUDC'>('Parliamentary WUDC');
  const [customCategory, setCustomCategory] = useState('Đời Sống Sinh Viên & Giáo Dục');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && roundTimeSeconds > 0) {
      interval = setInterval(() => {
        setRoundTimeSeconds(prev => prev - 1);
      }, 1000);
    } else if (roundTimeSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, roundTimeSeconds]);

  const handleStartRound = () => {
    if (roundTimeSeconds === 0) {
      setRoundTimeSeconds(customTotalSeconds);
    }
    setIsTimerRunning(true);
    setShowTimerFloatingWidget(true);
    setIsTimerMinimized(false);
  };

  const handleToggleTimerSettings = () => {
    setShowTimerFloatingWidget(true);
    setIsTimerMinimized(false);
    setIsEditingTime(prev => !prev);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRoundTimeSeconds(customTotalSeconds);
  };

  const handleApplyCustomTime = (totalSec: number) => {
    setCustomTotalSeconds(totalSec);
    setRoundTimeSeconds(totalSec);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    setCustomMinutesInput(m.toString());
    setCustomSecondsInput(s.toString());
    setIsEditingTime(false);
    showToast(`Đã cập nhật thời gian đếm: ${formatTimer(totalSec)}`, 'success');
  };

  const handleStartWithCustomTime = (totalSec?: number) => {
    const targetSec = totalSec !== undefined ? totalSec : customTotalSeconds;
    setCustomTotalSeconds(targetSec);
    setRoundTimeSeconds(targetSec);
    const m = Math.floor(targetSec / 60);
    const s = targetSec % 60;
    setCustomMinutesInput(m.toString());
    setCustomSecondsInput(s.toString());
    setIsTimerRunning(true);
    setShowTimerFloatingWidget(true);
    setIsTimerMinimized(false);
    setIsEditingTime(false);
    showToast(`Đã bắt đầu tính giờ: ${formatTimer(targetSec)}`, 'success');
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = Math.max(0, parseInt(customMinutesInput) || 0);
    const s = Math.max(0, Math.min(59, parseInt(customSecondsInput) || 0));
    const total = m * 60 + s;
    if (total <= 0) {
      showToast('Thời gian tính giờ phải lớn hơn 0 giây!', 'info');
      return;
    }
    handleApplyCustomTime(total);
  };

  const handleResetDebate = () => {
    setCurrentRound(1);
    setRoundTimeSeconds(customTotalSeconds);
    setIsTimerRunning(false);
    setMessages([]);
    setUserInput('');
    setEvaluation(null);
    setIsDebateFinished(false);
  };

  const handleSubmitSpeech = async () => {
    const text = userInput.trim();
    if (!text) return;

    setIsTimerRunning(false);

    // 1. Add user message
    const userMsg: DebateMessage = {
      id: `msg-user-${Date.now()}`,
      speaker: 'user',
      speakerName: currentStudent?.fullName || 'Sinh Viên Biện Luận',
      role: userRole,
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      round: currentRound
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setUserInput('');
    setIsAiThinking(true);

    // 2. Generate AI Opponent Response
    setTimeout(async () => {
      const aiReply = generateAIOpponentSpeech(selectedTopic.title, currentRound, text, userRole);

      const aiMsg: DebateMessage = {
        id: `msg-ai-${Date.now()}`,
        speaker: 'ai',
        speakerName: 'AI Dialectic Opponent (WUDC Standard)',
        role: userRole === 'Pro' ? 'Con' : 'Pro',
        content: aiReply.speech,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        round: currentRound,
        poiQuestion: aiReply.poiQuestion
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      setIsAiThinking(false);

      // Advance round or finish debate
      if (currentRound < 3) {
        setCurrentRound((prev) => (prev + 1) as 2 | 3);
        setRoundTimeSeconds(customTotalSeconds);
      } else {
        // Evaluate full debate after Round 3
        setIsDebateFinished(true);
        const fullDebateTranscript = finalMessages
          .filter(m => m.speaker === 'user')
          .map(m => `[Hiệp ${m.round}]: ${m.content}`)
          .join('\n\n');

        const rubric = await evaluateArgument(fullDebateTranscript, selectedTopic.title, userRole, isOffline);
        setEvaluation(rubric);
        onCompleteDebate(rubric, 150);
      }
    }, 1200);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGenerateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = customTopicInput.trim();
    if (!promptText) return;

    setIsGeneratingTopic(true);
    try {
      let newTopic: DebateTopic;
      const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

      if (!isOffline && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Hãy tạo MỘT chủ đề tranh biện học thuật đại học xuất sắc dựa trên ý tưởng: "${promptText}". Thể loại: ${customCategory}, Thể thức: ${customFormat}.
Trả về DUY NHẤT một chuỗi JSON hợp lệ không có markdown codeblocks:
{
  "title": "Tên chủ đề tranh biện mang tính đối kháng cao",
  "description": "Mô tả bối cảnh và mâu thuẫn cốt lõi khoảng 40-70 từ",
  "difficulty": "Trung cấp",
  "round1Prompt": "Hiệp 1: Thiết lập định nghĩa và luận điểm",
  "round2Prompt": "Hiệp 2: Phản biện trực diện",
  "round3Prompt": "Hiệp 3: So sánh trọng số và chốt hạ"
}`
        });
        const clean = (res.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        newTopic = {
          id: `topic-${Date.now()}`,
          title: parsed.title,
          description: parsed.description,
          format: customFormat,
          difficulty: parsed.difficulty || 'Trung cấp',
          category: customCategory,
          round1Prompt: parsed.round1Prompt || 'Hiệp 1: Khởi đầu & Xây dựng luận điểm',
          round2Prompt: parsed.round2Prompt || 'Hiệp 2: Phản biện & Bẻ gãy luận điểm',
          round3Prompt: parsed.round3Prompt || 'Hiệp 3: Tổng kết & So sánh trọng số'
        };
      } else {
        newTopic = {
          id: `topic-${Date.now()}`,
          title: `Tranh Biện: ${promptText}`,
          description: `Cuộc tranh luận xoay quanh tính khả thi, đạo đức và tác động lâu dài của vấn đề ${promptText} đối với sinh viên và xã hội hiện đại.`,
          format: customFormat,
          difficulty: 'Trung cấp',
          category: customCategory,
          round1Prompt: 'Hiệp 1: Thiết lập tiền đề và xây dựng luận điểm cốt lõi.',
          round2Prompt: 'Hiệp 2: Tấn công trực diện vào tính khả thi và rủi ro ngoại ứng.',
          round3Prompt: 'Hiệp 3: So sánh tương quan lợi ích và kết luận giải pháp tối ưu.'
        };
      }

      if (onAddTopic) {
        onAddTopic(newTopic);
      }
      setSelectedTopic(newTopic);
      handleResetDebate();
      setShowAiTopicModal(false);
      setCustomTopicInput('');
      showToast(`AI đã tạo thành công chủ đề mới: "${newTopic.title}"!`, 'success');
    } catch (err: any) {
      showToast('Có lỗi khi tạo chủ đề: ' + (err?.message || 'Không thể tạo'), 'info');
    } finally {
      setIsGeneratingTopic(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-lg text-xs md:text-sm animate-in fade-in transition ${
          notification.type === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
            : 'bg-blue-600 text-white shadow-blue-500/20'
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

      {/* Topic selection and debate rules header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {selectedTopic.format} Debate
            </span>
            <span className="text-xs text-slate-500 font-medium">{selectedTopic.category}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedTopic.title}
          </h2>
          <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">{selectedTopic.description}</p>
        </div>

        {/* Change topic selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTopic.id}
            onChange={(e) => {
              const found = topics.find(t => t.id === e.target.value);
              if (found) {
                setSelectedTopic(found);
                handleResetDebate();
              }
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 max-w-[220px] truncate"
          >
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          {/* AI Topic Generator Button */}
          <button
            type="button"
            onClick={() => setShowAiTopicModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0"
            title="Tạo chủ đề tranh biện mới bằng Trí Tuệ Nhân Tạo (Gemini AI)"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Tạo Chủ Đề Bằng AI</span>
          </button>

          <button
            onClick={handleResetDebate}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Bắt đầu lại trận đấu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Debate Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Debate Process & Rounds */}
        <div className="lg:col-span-2 space-y-4">
          {/* Round progress bar & Timer */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentRound === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  1
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300">Khởi đầu</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentRound === 2 ? 'bg-blue-600 text-white' : currentRound > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  2
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300">Phản biện & POI</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentRound === 3 ? 'bg-blue-600 text-white' : isDebateFinished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  3
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300">Tổng kết</span>
              </div>
            </div>

            {/* Timer & Role selection */}
            <div className="flex items-center gap-3">
              {/* Inline Countdown Display with 10s Red Flash Warning, Play/Pause, Reset & Settings */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 relative ${
                isLast10Seconds
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/50 ring-2 ring-rose-400 border border-rose-500'
                  : roundTimeSeconds === 0
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${isLast10Seconds ? 'text-white animate-spin' : isTimerRunning ? 'text-blue-600 animate-pulse' : 'text-slate-500'}`} />
                <span>{formatTimer(roundTimeSeconds)}</span>
                {isLast10Seconds && (
                  <span className="text-[10px] bg-white text-rose-600 font-extrabold px-1 rounded animate-bounce">
                    10s!
                  </span>
                )}

                {/* Play / Pause Toggle Button */}
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className="hover:opacity-80 transition cursor-pointer ml-1 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                  title={isTimerRunning ? 'Tạm dừng tính giờ' : 'Tiếp tục tính giờ'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="hover:opacity-80 transition cursor-pointer p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  title={`Đặt lại về ${formatTimer(customTotalSeconds)}`}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                {/* Settings trigger */}
                <button
                  type="button"
                  onClick={handleToggleTimerSettings}
                  className="hover:opacity-75 transition cursor-pointer p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10"
                  title="Thay đổi thời gian đếm ngược tùy thích"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

              {messages.length === 0 && (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setUserRole('Pro')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      userRole === 'Pro' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Ủng hộ (Pro)
                  </button>
                  <button
                    onClick={() => setUserRole('Con')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      userRole === 'Con' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Phản đối (Con)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current Round Directive */}
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong>Chỉ dẫn Hiệp {currentRound}: </strong>
              {currentRound === 1 && selectedTopic.round1Prompt}
              {currentRound === 2 && selectedTopic.round2Prompt}
              {currentRound === 3 && selectedTopic.round3Prompt}
            </div>
          </div>

          {/* Messages Flow */}
          <div className="space-y-4 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Swords className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Sàn đấu đã sẵn sàng! Bạn đang ở phe {userRole === 'Pro' ? 'Ủng Hộ (Proposition)' : 'Phản Đối (Opposition)'}.
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hãy nhập bài phát biểu mở màn Hiệp 1 để thiết lập định nghĩa và chuỗi luận cứ đầu tiên. Bấm nút Bắt đầu tính giờ để rèn luyện áp lực thời gian WUDC.
                </p>
                {!isTimerRunning && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {/* Selector 2: Bắt Đầu Tính Giờ Button */}
                    <button
                      onClick={handleStartRound}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>Bắt Đầu Tính Giờ Hiệp {currentRound} ({formatTimer(customTotalSeconds)})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleTimerSettings}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                      title="Thay đổi thời lượng đếm ngược tùy thích"
                    >
                      <Settings className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tùy Chỉnh Thời Gian ({formatTimer(customTotalSeconds)})</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                    msg.speaker === 'user'
                      ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 ml-4'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.speaker === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white dark:bg-slate-700'
                      }`}>
                        {msg.speaker === 'user' ? 'LƯỢT BẠN' : 'AI OPPONENT'}
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">{msg.speakerName}</span>
                      <span className="text-slate-400 font-mono text-[11px]">(Hiệp {msg.round})</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                    {msg.content}
                  </p>

                  {/* POI Alert if AI challenges */}
                  {msg.poiQuestion && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Câu hỏi chất vấn chéo (Point of Information - POI): </strong>
                        <span>{msg.poiQuestion}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isAiThinking && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
                <span>AI Đối thủ đang phân tích lỗ hổng lập luận và soạn phản biện sắc bén...</span>
              </div>
            )}
          </div>

          {/* Speech Input Box */}
          {!isDebateFinished && (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Soạn bài phát biểu Hiệp {currentRound} ({userRole === 'Pro' ? 'Phe Ủng Hộ' : 'Phe Phản Đối'})
                </span>
                <span className="font-mono">
                  {userInput.trim().split(/\s+/).filter(Boolean).length} từ
                </span>
              </div>

              <textarea
                rows={4}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Trình bày luận điểm, dẫn chứng thực tiễn và giải quyết phản biện của đối phương..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                disabled={isAiThinking}
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {!isTimerRunning && roundTimeSeconds > 0 && (
                    <button
                      type="button"
                      onClick={handleStartRound}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bật Đồng Hồ</span>
                    </button>
                  )}
                  {isOffline && (
                    <span className="text-[11px] text-amber-600 font-medium">
                      (Chế độ Ngoại tuyến: Động cơ Logic Heuristic hoạt động)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitSpeech}
                  disabled={!userInput.trim() || isAiThinking}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi Bài Phát Biểu Hiệp {currentRound}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Feedback & Toulmin / Fallacy Rubric */}
        <div className="space-y-4">
          {evaluation ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Kết Quả Đánh Giá Rubric WUDC</h3>
                </div>
                <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                  {evaluation.overallScore}/100
                </span>
              </div>

              {/* Radar Chart */}
              <div>
                <RadarChart scores={evaluation.dimensionScores} size={240} />
              </div>

              {/* 5-Dimension Feedback Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">1. Logic & Tiền đề:</span>
                    <span className="font-mono text-blue-600">{evaluation.dimensionScores.logic}/100</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{evaluation.dimensionFeedback.logic}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">2. Dẫn chứng & Thực tiễn:</span>
                    <span className="font-mono text-blue-600">{evaluation.dimensionScores.evidence}/100</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{evaluation.dimensionFeedback.evidence}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">3. Phản biện Rebuttal:</span>
                    <span className="font-mono text-blue-600">{evaluation.dimensionScores.rebuttal}/100</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{evaluation.dimensionFeedback.rebuttal}</p>
                </div>
              </div>

              {/* Fallacies detected */}
              {evaluation.fallaciesDetected.length > 0 && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Bộ Lọc Ngụy Biện Cảnh Báo ({evaluation.fallaciesDetected.length})</span>
                  </div>
                  {evaluation.fallaciesDetected.map((fal, idx) => (
                    <div key={idx} className="text-slate-700 dark:text-slate-300">
                      <strong className="text-rose-600">{fal.viName} ({fal.name}):</strong> "{fal.quote}"
                      <p className="text-[11px] text-slate-500 mt-0.5">{fal.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Devil's Advocate Challenge */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> Thách thức từ "Luật sư của quỷ":
                </span>
                <p className="text-slate-700 dark:text-slate-300 italic">{evaluation.devilsAdvocateChallenge}</p>
              </div>

              {/* Toulmin Recommendation */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-purple-800 dark:text-purple-300">Bản Nâng Cấp Toulmin Đề Xuất:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  <li><strong>Claim:</strong> {evaluation.toulminRecommendation.claim}</li>
                  <li><strong>Grounds:</strong> {evaluation.toulminRecommendation.grounds}</li>
                  <li><strong>Warrant:</strong> {evaluation.toulminRecommendation.warrant}</li>
                  <li><strong>Rebuttal:</strong> {evaluation.toulminRecommendation.rebuttal}</li>
                </ul>
              </div>

              <button
                onClick={handleResetDebate}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition"
              >
                Tranh Biện Trận Mới (+150 XP)
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> Tiêu Chí Chấm Điểm WUDC
              </h3>

              <div className="space-y-3 text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200">Mô hình Toulmin:</strong> Xây dựng đầy đủ Luận điểm (Claim), Căn cứ (Grounds) và Cầu nối suy luận (Warrant).
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200">Tránh Ngụy Biện:</strong> Tránh các bẫy ngụy biện phổ biến như Dốc trượt (Slippery Slope) hay Nhị nguyên giả (False Dilemma).
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200">Phản biện Rebuttal:</strong> Tấn công trực diện vào tiền đề cốt lõi của đối thủ thay vì né tránh.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200">Tầm nhìn Đa chiều:</strong> Nhận diện tác động xã hội và các bên liên quan yếu thế.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-slate-500">
                Sau khi hoàn tất cả 3 hiệp thi đấu, hệ thống AI sẽ tự động phân tích và tạo Bảng điểm Rubric 5 chiều cùng nhận xét chi tiết cho bạn!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: AI DEBATE TOPIC GENERATOR (GEMINI 3.8 FLASH) */}
      {/* ======================================================== */}
      {showAiTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                    Tạo Chủ Đề Tranh Biện Học Thuật Bằng AI
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold">
                      Gemini 3.8 Flash
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kiến tạo đề tài tranh biện học thuật đối kháng chuẩn WUDC & Oxford cho sinh viên
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiTopicModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Carousel */}
            <div className="my-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Gợi ý chủ đề nóng & thời sự 2026:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Cấm hoàn toàn việc sử dụng AI trong làm đồ án tốt nghiệp',
                  'Đánh thuế phát thải carbon đối với cơ sở giáo dục đại học',
                  'Áp đặt mức trần giá phòng trọ xung quanh trường đại học',
                  'Bỏ hình thức thi trắc nghiệm chuyển sang tranh biện trực tiếp',
                  'Thu hồi giấy phép các app cho vay trực tuyến nhắm vào sinh viên'
                ].map((presetPrompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCustomTopicInput(presetPrompt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer text-[11px]"
                  >
                    💡 {presetPrompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Generator Form */}
            <form onSubmit={handleGenerateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Ý Tưởng / Vấn Đề Tranh Biện Mong Muốn:
                </label>
                <textarea
                  rows={3}
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="Nhập bất kỳ vấn đề nào trong đời sống sinh viên hoặc thời sự hiện nay..."
                  className="w-full p-3 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lĩnh Vực / Thể Loại
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Đời Sống Sinh Viên & Giáo Dục">Đời Sống Sinh Viên & Giáo Dục</option>
                    <option value="Công Nghệ & Đạo Đức AI">Công Nghệ & Đạo Đức AI</option>
                    <option value="Kinh Tế & An Sinh Xã Hội">Kinh Tế & An Sinh Xã Hội</option>
                    <option value="Môi Trường & Phát Triển Bền Vững">Môi Trường & Phát Triển Bền Vững</option>
                    <option value="Luật Pháp & Quyền Riêng Tư">Luật Pháp & Quyền Riêng Tư</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Thể Thức Tranh Biện
                  </label>
                  <select
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Parliamentary WUDC">Nghị viện WUDC (3 Hiệp Đối Kháng)</option>
                    <option value="Oxford">Oxford Debate</option>
                    <option value="Karl Popper">Karl Popper (Trực diện)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Hệ thống hỗ trợ cả chế độ Trực tuyến với Gemini AI lẫn Ngoại tuyến.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiTopicModal(false)}
                    className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingTopic || !customTopicInput.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingTopic ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI Đang Thiết Kế Đề Tài...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Khởi Tạo Đề Tài AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* FLOATING POPUP COUNTDOWN TIMER WIDGET (LUÔN HIỂN THỊ NỔI) */}
      {/* ======================================================== */}
      {(showTimerFloatingWidget || isTimerRunning) && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[92vw] sm:w-84 select-none">
          {isTimerMinimized ? (
            /* Minimized Capsule View */
            <div
              onClick={() => setIsTimerMinimized(false)}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 border ${
                isLast10Seconds
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/60 ring-4 ring-rose-400 border-rose-400'
                  : roundTimeSeconds === 0
                  ? 'bg-amber-600 text-white shadow-amber-600/30 border-amber-400'
                  : 'bg-slate-900/95 text-white border-slate-700 hover:border-blue-500'
              }`}
              title="Nhấn để phóng to đồng hồ đếm ngược"
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isLast10Seconds ? 'animate-spin' : isTimerRunning ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="font-mono font-black text-base">{formatTimer(roundTimeSeconds)}</span>
                <span className="text-[11px] opacity-80">(Hiệp {currentRound})</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isLast10Seconds && (
                  <span className="text-[10px] bg-white text-rose-600 font-extrabold px-1.5 py-0.5 rounded-full animate-bounce flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-600 animate-spin" />
                    <span>10s!</span>
                  </span>
                )}
                <Maximize2 className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
              </div>
            </div>
          ) : (
            /* Expanded Full Popup View */
            <div
              className={`rounded-3xl shadow-2xl backdrop-blur-md border transition-all duration-300 p-4 flex flex-col gap-3 ${
                isLast10Seconds
                  ? 'bg-gradient-to-b from-rose-600 via-rose-700 to-red-700 text-white shadow-rose-600/60 ring-4 ring-rose-400 border-rose-300 animate-pulse'
                  : roundTimeSeconds === 0
                  ? 'bg-slate-900/95 text-white border-amber-500 shadow-amber-500/20'
                  : 'bg-slate-900/95 text-white border-slate-700 shadow-black/40'
              }`}
            >
              {/* Popup Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isLast10Seconds ? 'bg-amber-300 animate-ping' : isTimerRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                  }`} />
                  <span className="font-bold tracking-wide">
                    Đồng Hồ Biện Luận (Hiệp {currentRound})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsTimerMinimized(true)}
                    className="p-1 hover:bg-white/15 rounded-lg transition cursor-pointer text-slate-300 hover:text-white"
                    title="Thu nhỏ thành thanh nổi"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTimerFloatingWidget(false)}
                    className="p-1 hover:bg-white/15 rounded-lg transition cursor-pointer text-slate-300 hover:text-white"
                    title="Đóng popup đồng hồ (vẫn tính giờ nền)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Big Digital Countdown Display */}
              <div className={`py-3 px-4 rounded-2xl text-center transition-all duration-300 ${
                isLast10Seconds
                  ? 'bg-rose-900/60 border border-rose-300/60'
                  : roundTimeSeconds === 0
                  ? 'bg-amber-950/40 border border-amber-500/40'
                  : 'bg-slate-800/80 border border-slate-700/60'
              }`}>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider drop-shadow-md">
                  {formatTimer(roundTimeSeconds)}
                </div>

                {/* 10s Last Warning Badge */}
                {isLast10Seconds && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-rose-700 font-extrabold text-xs animate-bounce shadow-md">
                    <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" />
                    <span>CẢNH BÁO: CHỈ CÒN {roundTimeSeconds} GIÂY!</span>
                  </div>
                )}

                {/* Finished State Note */}
                {roundTimeSeconds === 0 && (
                  <div className="mt-1 text-xs font-bold text-amber-300">
                    ⏱️ Hết giờ hiệp {currentRound}! Hãy chốt bài phát biểu và gửi phản biện.
                  </div>
                )}
              </div>

              {/* Controls Bar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Tạm Dừng' : roundTimeSeconds === 0 ? 'Bắt Đầu Lại' : 'Tiếp Tục'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title={`Đặt lại về ${formatTimer(customTotalSeconds)}`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingTime(!isEditingTime)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isEditingTime ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/10 hover:bg-white/20 text-white border-transparent'
                  }`}
                  title="Cài đặt thay đổi thời gian đếm ngược ngay tại đây"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Collapsible Duration Customization Panel inside popup */}
              {isEditingTime && (
                <div className="pt-2.5 border-t border-white/10 space-y-2.5 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span>Chọn nhanh thời lượng:</span>
                    <span className="font-mono text-blue-400">{formatTimer(customTotalSeconds)}</span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: '30s', sec: 30 },
                      { label: '1 Phút', sec: 60 },
                      { label: '2 Phút', sec: 120 },
                      { label: '3 Phút (WUDC)', sec: 180 },
                      { label: '5 Phút', sec: 300 },
                      { label: '7 Phút (Oxford)', sec: 420 }
                    ].map(preset => (
                      <button
                        key={preset.sec}
                        type="button"
                        onClick={() => handleApplyCustomTime(preset.sec)}
                        className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition cursor-pointer text-center ${
                          customTotalSeconds === preset.sec
                            ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-300'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Minute & Second Form */}
                  <form onSubmit={handleCustomFormSubmit} className="pt-1.5 space-y-2">
                    <span className="text-[11px] text-slate-300 font-semibold block">
                      Hoặc nhập thời gian tùy thích:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/20">
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={customMinutesInput}
                          onChange={(e) => setCustomMinutesInput(e.target.value)}
                          className="w-10 bg-transparent text-white font-mono font-bold text-center focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-400">phút</span>
                      </div>

                      <div className="flex-1 flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/20">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={customSecondsInput}
                          onChange={(e) => setCustomSecondsInput(e.target.value)}
                          className="w-10 bg-transparent text-white font-mono font-bold text-center focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-400">giây</span>
                      </div>

                      <button
                        type="submit"
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer text-[11px] whitespace-nowrap"
                      >
                        Lưu
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
