import React, { useState, useRef, useEffect } from 'react';
import { GroupRoom, GroupMemberSubmission, Student, GroupChatMessage, ChatMessageType, BrainstormNote } from '../types';
import {
  Users,
  Copy,
  Check,
  Crown,
  Printer,
  Sparkles,
  GitMerge,
  Filter,
  Plus,
  ShieldAlert,
  Send,
  Award,
  MessageSquare,
  Lightbulb,
  Zap,
  HelpCircle,
  BookOpen,
  Pin,
  Smile,
  PinOff,
  ThumbsUp,
  Flame,
  Target,
  X,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface GroupDebateCouncilProps {
  rooms: GroupRoom[];
  currentStudent: Student | null;
  onUpdateRooms: (rooms: GroupRoom[]) => void;
}

export const GroupDebateCouncil: React.FC<GroupDebateCouncilProps> = ({
  rooms,
  currentStudent,
  onUpdateRooms
}) => {
  const [selectedRoom, setSelectedRoom] = useState<GroupRoom>(rooms[0] || {
    id: 'room-default',
    code: 'CTX-7842',
    title: 'Phản Biện Đạo Đức AI Trong Học Thuật Đại Học',
    topicType: 'debate',
    format: 'Parliamentary WUDC',
    createdAt: 'Hôm nay',
    status: 'active',
    members: []
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [filterSide, setFilterSide] = useState<'All' | 'Pro' | 'Con' | 'Independent'>('All');
  const [newSpeech, setNewSpeech] = useState('');
  const [memberRole, setMemberRole] = useState('Thành viên phản biện');
  const [memberSide, setMemberSide] = useState<'Pro' | 'Con' | 'Independent'>('Pro');
  const [activeTab, setActiveTab] = useState<'chat' | 'synthesis' | 'submissions' | 'notes'>('chat');

  // Create Room Modal States
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState<'debate' | 'case_study'>('debate');
  const [newRoomFormat, setNewRoomFormat] = useState('Parliamentary WUDC');
  const [newRoomCode, setNewRoomCode] = useState(`CTX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Join Room by Code Modal States
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Real-time Chat States
  const [chatInput, setChatInput] = useState('');
  const [selectedChatType, setSelectedChatType] = useState<ChatMessageType>('idea');
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize sample chat messages if room doesn't have any
  const [chatMessages, setChatMessages] = useState<GroupChatMessage[]>(() => {
    return selectedRoom.chatMessages || [
      {
        id: 'msg-1',
        roomId: selectedRoom.id,
        studentId: '2500011076',
        studentName: 'Lữ Quỳnh Anh',
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: 'Pro',
        roleInTeam: 'Chủ tọa mở màn',
        messageType: 'idea',
        content: 'Chào cả nhóm! Mình đề xuất phe Ủng hộ nên tập trung vào quyền sở hữu trí tuệ phái sinh có thời hạn (5 năm). Ý này vừa khuyến khích sáng tạo vừa tránh bị coi là độc quyền.',
        timestamp: '14:32',
        reactions: { '💡': 3, '👍': 4 },
        isPinned: true
      },
      {
        id: 'msg-2',
        roomId: selectedRoom.id,
        studentId: '2500017850',
        studentName: 'Cao Hữu Bảo',
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: 'Con',
        roleInTeam: 'Lãnh đạo đối lập',
        messageType: 'counter',
        content: 'Khoan đã Quỳnh Anh, nếu cấp bản quyền 5 năm thì các công ty công nghệ lớn có hàng triệu GPU sẽ chiếm lĩnh toàn bộ bản quyền thiết kế đồ họa trong tuần đầu tiên!',
        timestamp: '14:35',
        reactions: { '⚡': 2, '🔥': 3 }
      },
      {
        id: 'msg-3',
        roomId: selectedRoom.id,
        studentId: '2500010598',
        studentName: 'Trần Duy Các',
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: 'Independent',
        roleInTeam: 'Hội đồng độc lập',
        messageType: 'evidence',
        content: 'Mọi người xem án lệ Burrow-Giles Lithographic Co. v. Sarony (1884) của Tòa án Tối cao Mỹ nhé: Hồi đó người ta cũng từng phản đối máy ảnh vì cho rằng máy móc tự chụp, nhưng tòa xác định con người vẫn giữ quyền tác giả qua việc chọn góc máy và ánh sáng!',
        timestamp: '14:38',
        reactions: { '📚': 5, '🎯': 2 },
        isPinned: true
      }
    ];
  });

  // Brainstorm Notes
  const [brainstormNotes, setBrainstormNotes] = useState<BrainstormNote[]>(() => {
    return selectedRoom.brainstormNotes || [
      {
        id: 'note-1',
        title: 'Áp dụng Mô hình Sui Generis Châu Âu',
        content: 'Tạo cơ chế bản quyền đặc thù 5 năm, bắt buộc trích nộp 10% doanh thu vào Quỹ Tái tạo Nghệ thuật.',
        authorName: 'Trần Duy Các',
        side: 'Independent',
        category: 'idea',
        votes: 6,
        createdAt: '14:40'
      },
      {
        id: 'note-2',
        title: 'Dẫn chứng Án Lệ Nhiếp Ảnh 1884',
        content: 'Tiền lệ pháp lý khẳng định công cụ cơ học vẫn thuộc phạm vi sáng tạo nếu có ý niệm con người can thiệp.',
        authorName: 'Lữ Quỳnh Anh',
        side: 'Pro',
        category: 'evidence',
        votes: 5,
        createdAt: '14:42'
      }
    ];
  });

  // Scroll to bottom on new chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedRoom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Send Chat Message with Simulated Peer Interaction
  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const userMessage: GroupChatMessage = {
      id: `chat-${Date.now()}`,
      roomId: selectedRoom.id,
      studentId: currentStudent?.studentId || '2500019999',
      studentName: currentStudent?.fullName || 'Sinh Viên Đại Học NTTU',
      university: currentStudent?.university || 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      side: memberSide,
      roleInTeam: memberRole,
      messageType: selectedChatType,
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };

    const updated = [...chatMessages, userMessage];
    setChatMessages(updated);
    setChatInput('');

    // Trigger simulated peer response after 1.5 seconds for engaging real-time feel
    setIsPeerTyping(true);
    setTimeout(() => {
      setIsPeerTyping(false);
      const peerReplies = [
        {
          name: 'Cao Hữu Bảo',
          role: 'Phe Đối lập',
          side: 'Con' as const,
          type: 'counter' as const,
          content: `Ý kiến của ${currentStudent?.firstName || 'bạn'} rất đáng suy ngẫm, tuy nhiên chúng ta cần đưa thêm bằng chứng định lượng để phản bác nguy cơ độc quyền dữ liệu.`
        },
        {
          name: 'Lữ Quỳnh Anh',
          role: 'Chủ tọa Pro',
          side: 'Pro' as const,
          type: 'idea' as const,
          content: `Đồng ý với góc nhìn này! Mình sẽ đưa điểm này vào phần tóm tắt Hiệp 3 của phe Ủng hộ.`
        },
        {
          name: 'Trần Duy Các',
          role: 'Hội đồng Độc lập',
          side: 'Independent' as const,
          type: 'evidence' as const,
          content: `Điểm chạm rất tốt! Mình vừa thêm vào Bảng Não Công Nhóm để tổng hợp vào Master Argument của nhóm.`
        }
      ];

      const chosen = peerReplies[Math.floor(Math.random() * peerReplies.length)];
      const peerMsg: GroupChatMessage = {
        id: `chat-peer-${Date.now()}`,
        roomId: selectedRoom.id,
        studentId: 'peer-' + Date.now(),
        studentName: chosen.name,
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: chosen.side,
        roleInTeam: chosen.role,
        messageType: chosen.type,
        content: chosen.content,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        reactions: { '👏': 2 }
      };

      setChatMessages(prev => [...prev, peerMsg]);
    }, 1600);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setChatMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const count = m.reactions[emoji] || 0;
      return {
        ...m,
        reactions: {
          ...m.reactions,
          [emoji]: count + 1
        }
      };
    }));
  };

  const handleTogglePin = (msg: GroupChatMessage) => {
    const isNowPinned = !msg.isPinned;
    setChatMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isPinned: isNowPinned } : m));

    if (isNowPinned) {
      // Add to Brainstorm notes
      const newNote: BrainstormNote = {
        id: `note-${Date.now()}`,
        title: `Ý tưởng từ ${msg.studentName}`,
        content: msg.content,
        authorName: msg.studentName,
        side: msg.side,
        category: msg.messageType === 'evidence' ? 'evidence' : msg.messageType === 'counter' ? 'rebuttal' : 'idea',
        votes: 1,
        createdAt: msg.timestamp
      };
      setBrainstormNotes(prev => [newNote, ...prev]);
    }
  };

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeech.trim()) return;

    const newSub: GroupMemberSubmission = {
      id: `sub-${Date.now()}`,
      studentId: currentStudent?.studentId || '2500019999',
      studentName: currentStudent?.fullName || 'Sinh Viên Đại Học NTTU',
      university: currentStudent?.university || 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      side: memberSide,
      roleInTeam: memberRole,
      speechContent: newSpeech.trim(),
      wordCount: newSpeech.trim().split(/\s+/).filter(Boolean).length,
      submittedAt: new Date().toISOString()
    };

    const updatedRoom: GroupRoom = {
      ...selectedRoom,
      members: [...selectedRoom.members, newSub]
    };

    const updatedList = rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r);
    onUpdateRooms(updatedList);
    setSelectedRoom(updatedRoom);
    setNewSpeech('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    const code = newRoomCode.trim().toUpperCase() || `CTX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom: GroupRoom = {
      id: `room-${Date.now()}`,
      code,
      title: newRoomTitle.trim(),
      topicType: newRoomType,
      format: newRoomFormat,
      createdAt: 'Vừa xong',
      status: 'active',
      members: currentStudent ? [
        {
          id: `member-${Date.now()}`,
          studentId: currentStudent.studentId,
          studentName: currentStudent.fullName,
          university: currentStudent.university,
          side: 'Pro',
          roleInTeam: 'Chủ tọa / Trưởng phòng',
          speechContent: '',
          wordCount: 0,
          submittedAt: 'Vừa tham gia'
        }
      ] : [],
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          roomId: `room-${Date.now()}`,
          studentId: currentStudent?.studentId || '2500011076',
          studentName: currentStudent?.fullName || 'Chủ Tọa Phòng',
          university: currentStudent?.university || 'Trường Đại học Nguyễn Tất Thành (NTTU)',
          side: 'Pro',
          roleInTeam: 'Chủ tọa',
          messageType: 'idea',
          content: `Chào mừng các bạn tham gia phòng thảo luận "${newRoomTitle.trim()}"! Hãy cùng chia sẻ luận điểm và não công.`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          reactions: { '👏': 1 },
          isPinned: true
        }
      ],
      brainstormNotes: []
    };

    onUpdateRooms([newRoom, ...rooms]);
    setSelectedRoom(newRoom);
    setChatMessages(newRoom.chatMessages || []);
    setBrainstormNotes([]);
    setShowCreateRoomModal(false);
    setNewRoomTitle('');
    setNewRoomCode(`CTX-${Math.floor(1000 + Math.random() * 9000)}`);
    setNotification({ message: `Đã tạo thành công phòng hội đồng mới: "${newRoom.title}" (Mã: ${newRoom.code})`, type: 'success' });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleJoinRoomByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    const targetRoom = rooms.find(r => r.code.toUpperCase() === cleanCode);
    if (targetRoom) {
      setSelectedRoom(targetRoom);
      setChatMessages(targetRoom.chatMessages || []);
      setBrainstormNotes(targetRoom.brainstormNotes || []);
      setShowJoinModal(false);
      setJoinCodeInput('');
      setNotification({ message: `Đã kết nối thành công vào phòng: "${targetRoom.title}"!`, type: 'success' });
    } else {
      setNotification({ message: `Không tìm thấy phòng với mã "${cleanCode}". Vui lòng thử lại!`, type: 'info' });
    }
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredMembers = selectedRoom.members.filter(m => {
    if (filterSide === 'All') return true;
    return m.side === filterSide;
  });

  const synthesis = selectedRoom.comparativeSynthesis;

  const handlePrint = () => {
    window.print();
  };

  const quickBrainstormStarters = [
    { text: '💡 Đề xuất phương án trung lập (Sui Generis)', type: 'idea' as const },
    { text: '⚡ Bẻ gãy tiền đề độc quyền dữ liệu', type: 'counter' as const },
    { text: '❓ POI: Chi phí tuân thủ cho doanh nghiệp nhỏ là bao nhiêu?', type: 'poi' as const },
    { text: '📚 Trích dẫn Án lệ Bản quyền Nhiếp ảnh năm 1884', type: 'evidence' as const }
  ];

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

      {/* Room Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {selectedRoom.format}
            </span>
            <span className="text-xs text-slate-500 font-medium">Hội Đồng Tranh Biện & Case Study</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedRoom.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{selectedRoom.members.length} thành viên trực tuyến</span>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
              Mã phòng: {selectedRoom.code}
              <button
                onClick={handleCopyCode}
                className="hover:text-blue-800 transition cursor-pointer"
                title="Sao chép mã phòng"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Room Switcher */}
          <select
            value={selectedRoom.id}
            onChange={(e) => {
              const r = rooms.find(item => item.id === e.target.value);
              if (r) {
                setSelectedRoom(r);
                setChatMessages(r.chatMessages || []);
                setBrainstormNotes(r.brainstormNotes || []);
              }
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 max-w-[200px] truncate"
          >
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>

          {/* Create Room Button */}
          <button
            type="button"
            onClick={() => {
              setNewRoomCode(`CTX-${Math.floor(1000 + Math.random() * 9000)}`);
              setShowCreateRoomModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0"
            title="Tạo phòng tranh biện / case study nhóm mới"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Phòng Mới</span>
          </button>

          {/* Join Room by Code Button */}
          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0"
            title="Nhập mã phòng CTX-XXXX để tham gia phòng có sẵn"
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Tham Gia Bằng Mã</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            In Báo Cáo
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Kênh Thảo Luận & Não Công ({chatMessages.length})
        </button>

        <button
          onClick={() => setActiveTab('synthesis')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'synthesis'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Đối Chiếu & Hợp Nhất AI
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Luận Điểm Thành Viên ({selectedRoom.members.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Pin className="w-4 h-4" />
          Bảng Ý Tưởng Nhóm ({brainstormNotes.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DEDICATED REAL-TIME CHAT & BRAINSTORMING */}
      {/* ======================================================== */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Stream */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* Chat Room Banner */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Phòng Não Công Trực Tuyến: {selectedRoom.code}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (Trao đổi luận cứ, phản biện chéo và chuẩn bị giải pháp)
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {selectedRoom.members.length} học viên tham gia
              </div>
            </div>

            {/* Quick Starters Carousel */}
            <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500" /> Gợi ý nhanh:
              </span>
              {quickBrainstormStarters.map((qs, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setChatInput(qs.text.replace(/^[^\s]+\s/, ''));
                    setSelectedChatType(qs.type);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition cursor-pointer"
                >
                  {qs.text}
                </button>
              ))}
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {chatMessages.map(msg => {
                const isMe = currentStudent?.studentId === msg.studentId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {msg.studentName} {isMe && '(Bạn)'}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        msg.side === 'Pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        msg.side === 'Con' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {msg.side}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm relative group leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                    }`}>
                      {/* Message type tag */}
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isMe ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {msg.messageType === 'idea' && <Lightbulb className="w-2.5 h-2.5 text-amber-300" />}
                          {msg.messageType === 'counter' && <Zap className="w-2.5 h-2.5 text-rose-300" />}
                          {msg.messageType === 'poi' && <HelpCircle className="w-2.5 h-2.5 text-yellow-300" />}
                          {msg.messageType === 'evidence' && <BookOpen className="w-2.5 h-2.5 text-emerald-300" />}
                          {msg.messageType === 'idea' ? 'Ý tưởng mới' :
                           msg.messageType === 'counter' ? 'Phản biện bẻ gãy' :
                           msg.messageType === 'poi' ? 'Chất vấn POI' :
                           msg.messageType === 'evidence' ? 'Dẫn chứng án lệ' : 'Thảo luận'}
                        </span>

                        {/* Pin button */}
                        <button
                          type="button"
                          onClick={() => handleTogglePin(msg)}
                          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition ${
                            msg.isPinned ? 'text-amber-400 opacity-100' : isMe ? 'text-blue-200' : 'text-slate-400'
                          }`}
                          title={msg.isPinned ? 'Bỏ ghim khỏi bảng não công' : 'Ghim vào Bảng Não Công Nhóm'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Reactions bar */}
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                              isMe ? 'bg-blue-700/80 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{count}</span>
                          </button>
                        ))}

                        {/* Add reaction trigger */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition ml-1">
                          {['👍', '🔥', '💡', '👏', '🎯'].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="text-xs hover:scale-125 transition p-0.5"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isPeerTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                  </div>
                  <span>Thành viên trong phòng đang phản hồi...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium text-[11px]">Loại tin nhắn:</span>
                  {(['idea', 'counter', 'poi', 'evidence'] as ChatMessageType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedChatType(t)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        selectedChatType === t
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t === 'idea' && '💡 Ý tưởng'}
                      {t === 'counter' && '⚡ Phản biện'}
                      {t === 'poi' && '❓ Chất vấn POI'}
                      {t === 'evidence' && '📚 Dẫn chứng'}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">
                  {currentStudent?.fullName || 'Khách'} ({memberSide})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Gửi ý kiến thảo luận, phản biện luận điểm hoặc câu hỏi chất vấn chéo..."
                  className="flex-1 px-4 py-2.5 text-xs md:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-2xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Pinned Brainstorm Notes & Role Assignment */}
          <div className="space-y-4">
            {/* Pinned Brainstorm Notes Board */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-amber-500" /> Bảng Não Công Đã Ghim ({brainstormNotes.length})
                </h4>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                {brainstormNotes.map(note => (
                  <div
                    key={note.id}
                    className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white font-semibold truncate text-[11px]">
                        {note.title}
                      </strong>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                        👍 {note.votes}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {note.content}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>bởi {note.authorName}</span>
                      <span className="font-semibold text-blue-600">{note.side}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Role & Side Selector */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Thiết Lập Vai Trò Của Bạn</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Phe tham gia:</label>
                  <select
                    value={memberSide}
                    onChange={(e) => setMemberSide(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Pro">Phe Ủng Hộ (Proposition)</option>
                    <option value="Con">Phe Phản Đối (Opposition)</option>
                    <option value="Independent">Hội Đồng Độc Lập (Independent)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Vai trò trong nhóm:</label>
                  <input
                    type="text"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COMPARATIVE SYNTHESIS (AI HỢP NHẤT) */}
      {/* ======================================================== */}
      {activeTab === 'synthesis' && synthesis && (
        <div className="space-y-6">
          {/* Member Rankings Podium */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              Bảng Xếp Hạng Năng Lực Lập Luận Nhóm
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {synthesis.rankings.map((rk, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border relative flex flex-col justify-between ${
                    idx === 0
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {rk.score}/100
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rk.studentName}</h4>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                      {rk.badge}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {rk.highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Dimensional Rubric Comparison Matrix */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Ma Trận Đối Chiếu 5 Chiều Rubric Trực Quan
            </h3>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left min-w-[600px]">
                <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Tiêu chí Rubric</th>
                    {selectedRoom.members.map(m => (
                      <th key={m.id} className="py-3 px-3 text-center">{m.studentName}</th>
                    ))}
                    <th className="py-3 px-3">Học giả Dẫn đầu & Nhận xét</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {synthesis.rubricMatrix.map((item, idx) => {
                    const bestMember = selectedRoom.members.find(m => m.studentId === item.bestStudentId);
                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {item.category}
                        </td>
                        {selectedRoom.members.map(m => {
                          const score = item.scores[m.studentId] || 80;
                          const isBest = m.studentId === item.bestStudentId;
                          return (
                            <td key={m.id} className="py-3 px-3 text-center font-mono font-bold">
                              <span className={`px-2 py-0.5 rounded ${
                                isBest ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-400' : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {isBest && '👑 '} {score}
                              </span>
                            </td>
                          );
                        })}
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          <strong className="text-amber-600">{bestMember?.studentName}:</strong> {item.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consensus vs Divergence Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" /> Bản Đồ Điểm Đồng Thuận (Consensus)
              </h4>
              <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-300">
                {synthesis.consensusPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/20 p-5 rounded-3xl border border-rose-200 dark:border-rose-900/40 space-y-3">
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Điểm Bất Đồng Cốt Lõi (Divergence)
              </h4>
              <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-300">
                {synthesis.divergencePoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Master Synthesis Blueprint */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-blue-300" />
              <h4 className="font-bold text-base">Chiến Lược Hợp Nhất Luận Điểm Toàn Bích (Master Argument)</h4>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-blue-100 whitespace-pre-line">
              {synthesis.masterSynthesis}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SIDE-BY-SIDE MEMBER SUBMISSIONS */}
      {/* ======================================================== */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc phe:
            </span>
            {(['All', 'Pro', 'Con', 'Independent'] as const).map(side => (
              <button
                key={side}
                onClick={() => setFilterSide(side)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  filterSide === side
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {side === 'All' ? 'Tất cả phe' : side === 'Pro' ? 'Phe Ủng Hộ' : side === 'Con' ? 'Phe Phản Đối' : 'Độc Lập'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.side === 'Pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60' : m.side === 'Con' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60' : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60'
                    }`}>
                      {m.side === 'Pro' ? 'Ủng Hộ' : m.side === 'Con' ? 'Phản Đối' : 'Hội Đồng Độc Lập'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.wordCount} từ</span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.studentName}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{m.roleInTeam} • {m.university}</p>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    "{m.speechContent}"
                  </p>
                </div>

                {m.rubricScore && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Điểm Rubric:</span>
                    <span className="font-mono font-bold text-blue-600">{m.rubricScore.overallScore}/100</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSubmission} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Đóng Góp Bài Phát Biểu / Luận Điểm Của Bạn
            </h4>

            <textarea
              rows={3}
              value={newSpeech}
              onChange={(e) => setNewSpeech(e.target.value)}
              placeholder="Nhập nội dung bài phát biểu / luận cứ chính của bạn..."
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Nộp Luận Điểm Vào Hội Đồng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: BRAINSTORM NOTES BOARD */}
      {/* ======================================================== */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-500" /> Bảng Não Công & Ý Tưởng Cốt Lõi Của Nhóm
              </h3>
              <p className="text-xs text-slate-500">
                Các luận cứ, án lệ và giải pháp xuất sắc được trích xuất từ cuộc thảo luận
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brainstormNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      {note.category === 'idea' ? '💡 Ý tưởng' : note.category === 'evidence' ? '📚 Dẫn chứng' : '⚡ Bác bỏ'}
                    </span>
                    <button
                      onClick={() => setBrainstormNotes(prev => prev.map(n => n.id === note.id ? { ...n, votes: n.votes + 1 } : n))}
                      className="flex items-center gap-1 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 hover:scale-110 transition"
                      title="Ủng hộ ý tưởng này"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{note.votes}</span>
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{note.title}</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{note.content}</p>
                </div>

                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>bởi <strong>{note.authorName}</strong></span>
                  <span className="font-mono">{note.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TẠO PHÒNG HỘI ĐỒNG TRANH BIỆN & CASE STUDY MỚI */}
      {/* ======================================================== */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Tạo Phòng Hội Đồng Tranh Biện Mới
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khởi tạo không gian thảo luận nhóm, não công và tổng hợp luận điểm AI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateRoomModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Phòng / Chủ Đề Thảo Luận *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hội đồng Phản biện về Thuế Carbon Biên giới CBAM..."
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs md:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Gợi ý đề tài nóng 2026 (Nhấn để điền):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Hội đồng Phản biện Deepfake & Lừa đảo Trực tuyến 2026',
                      'Tranh biện Trách nhiệm Net-Zero & Phí Chuyển đổi Xanh',
                      'Tọa đàm Khủng hoảng Giá phòng trọ & Ký túc xá Sinh viên',
                      'Phản biện Ứng dụng AI viết Khóa luận Tốt nghiệp',
                      'Chiến lược Hướng nghiệp Gen Z Trước Làn sóng Sa thải AI'
                    ].map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewRoomTitle(sug)}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-left"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hình Thức Thảo Luận
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => {
                      const val = e.target.value as 'debate' | 'case_study';
                      setNewRoomType(val);
                      setNewRoomFormat(val === 'debate' ? 'Parliamentary WUDC' : 'Harvard Case Method');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="debate">Tranh Biện Đối Kháng</option>
                    <option value="case_study">Phân Tích Case Study</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Thể Thức Học Thuật
                  </label>
                  <select
                    value={newRoomFormat}
                    onChange={(e) => setNewRoomFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {newRoomType === 'debate' ? (
                      <>
                        <option value="Parliamentary WUDC">Parliamentary WUDC</option>
                        <option value="Oxford Debate">Oxford Debate</option>
                        <option value="Karl Popper">Karl Popper</option>
                      </>
                    ) : (
                      <>
                        <option value="Harvard Case Method">Harvard Case Method</option>
                        <option value="Ma Trận 4 Bên Liên Quan">Ma Trận 4 Bên Liên Quan</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mã Phòng Truy Cập Nhanh
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    placeholder="CTX-XXXX"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 font-mono font-bold uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setNewRoomCode(`CTX-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 text-xs transition cursor-pointer"
                  >
                    Đổi Mã
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Các thành viên khác có thể dùng mã này để tìm và tham gia phòng tức thì.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  Xác Nhận Tạo Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: THAM GIA PHÒNG BẰNG MÃ TRUY CẬP (CTX-XXXX) */}
      {/* ======================================================== */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Tham Gia Phòng Bằng Mã
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nhập mã phòng (CTX-XXXX) do chủ tọa hoặc giảng viên cung cấp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinRoomByCode} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhập Mã Phòng (Ví dụ: {rooms[0]?.code || 'CTX-7842'}) *
                </label>
                <input
                  type="text"
                  placeholder="CTX-XXXX"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 font-mono font-bold text-sm tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Các phòng đang trực tuyến:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {rooms.slice(0, 4).map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setJoinCodeInput(r.code)}
                      className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-blue-600 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      {r.code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!joinCodeInput.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  Kết Nối Vào Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
