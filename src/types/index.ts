export type UserRole = 'student' | 'admin' | 'lecturer' | 'staff';

export type DialecticTier = 
  | 'Bậc Thầy Socrates'
  | 'Bạch Kim Rhetor'
  | 'Vàng Scholar'
  | 'Bạc Dialectic'
  | 'Đồng Debater';

export interface Student {
  id: string; // STT or unique ID
  studentId: string; // Mã sinh viên (e.g., 2500011076)
  lastName: string; // Họ đệm
  firstName: string; // Tên
  fullName: string; // Họ và tên
  gender: 'Nam' | 'Nữ'; // Giới tính
  birthDate: string; // Ngày sinh (dd/mm/yyyy)
  className: string; // Lớp học (e.g., 25DKQT1A)
  faculty: string; // Khoa (e.g., Khoa Quản trị kinh doanh)
  university: string; // Trường (e.g., Trường Đại học Nguyễn Tất Thành (NTTU))
  password?: string; // Mật khẩu (mặc định = studentId)
  status: 'active' | 'locked';
  role: UserRole;
  tier: DialecticTier;
  xp: number;
  streakDays: number;
  rubricAverage: number;
  totalDebates: number;
  casesAnalyzed: number;
  rubricScores: {
    logic: number;
    evidence: number;
    rebuttal: number;
    toulmin: number;
    multiPerspective: number;
  };
}

export interface University {
  id: string;
  code: string;
  name: string;
  shortName: string;
  address?: string;
  rector?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  totalStudents?: number;
}

export interface Faculty {
  id: string;
  code: string;
  name: string;
  universityCode: string;
  deanName?: string;
  viceDean?: string;
  email?: string;
  phone?: string;
  office?: string;
  description?: string;
  totalClasses?: number;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  facultyCode: string;
  universityCode: string;
  academicYear: string;
  advisor?: string;
  advisorEmail?: string;
  room?: string;
  totalStudents?: number;
}

export interface RolePermissionItem {
  id: string;
  name: string;
  category: 'Tranh Biện & Tình Huống' | 'Đánh Giá & Báo Cáo' | 'Quản Lý Học Thuật' | 'Hệ Thống & Dữ Liệu';
  description?: string;
  admin: boolean;
  lecturer: boolean;
  staff: boolean;
  student: boolean;
}

export interface FallacyItem {
  name: string;
  viName: string;
  quote: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ToulminUpgrade {
  claim: string;
  grounds: string;
  warrant: string;
  backing: string;
  rebuttal: string;
}

export interface RubricEvaluation {
  overallScore: number;
  dimensionScores: {
    logic: number; // 0-100
    evidence: number; // 0-100
    rebuttal: number; // 0-100
    toulmin: number; // 0-100
    multiPerspective: number; // 0-100
  };
  dimensionFeedback: {
    logic: string;
    evidence: string;
    rebuttal: string;
    toulmin: string;
    multiPerspective: string;
  };
  fallaciesDetected: FallacyItem[];
  toulminRecommendation: ToulminUpgrade;
  devilsAdvocateChallenge: string;
  microExercises: string[];
}

export type DebateFormat = 'Oxford' | 'Karl Popper' | 'Parliamentary WUDC';

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  format: DebateFormat;
  difficulty: 'Nhập môn' | 'Trung cấp' | 'Nâng cao' | 'Bậc thầy';
  category: string;
  round1Prompt: string;
  round2Prompt: string;
  round3Prompt: string;
}

export interface DebateMessage {
  id: string;
  speaker: 'user' | 'ai' | 'judge';
  speakerName: string;
  role: 'Pro' | 'Con' | 'Moderator';
  content: string;
  timestamp: string;
  round: 1 | 2 | 3;
  fallacies?: FallacyItem[];
  poiQuestion?: string; // Point of Information
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  context: string;
  stakeholders: {
    group: string;
    interest: string;
    powerLevel: 'Cao' | 'Trung bình' | 'Thấp';
    concern: string;
  }[];
  ethicalDilemma: string;
  guidingQuestions: string[];
  suggestedBiases: string[];
}

export interface GroupMemberSubmission {
  id: string;
  studentId: string;
  studentName: string;
  university: string;
  side: 'Pro' | 'Con' | 'Independent';
  roleInTeam: string;
  speechContent: string;
  wordCount: number;
  submittedAt: string;
  avatarUrl?: string;
  rubricScore?: RubricEvaluation;
}

export interface GroupRoom {
  id: string;
  code: string; // e.g., CTX-7842
  title: string;
  topicType: 'debate' | 'case_study';
  format: string;
  createdAt: string;
  status: 'active' | 'completed';
  members: GroupMemberSubmission[];
  comparativeSynthesis?: {
    rankings: {
      studentId: string;
      studentName: string;
      score: number;
      badge: string;
      highlight: string;
    }[];
    rubricMatrix: {
      category: string;
      scores: Record<string, number>;
      bestStudentId: string;
      reason: string;
    }[];
    consensusPoints: string[];
    divergencePoints: string[];
    masterSynthesis: string;
  };
}

export interface DailyQuest {
  id: string;
  title: string;
  rewardXp: number;
  completed: boolean;
  category: 'debate' | 'case' | 'fallacy';
}

export type NotificationType = 'streak' | 'schedule' | 'quest' | 'room' | 'achievement' | 'admin';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionTarget?: 'debate' | 'case' | 'group' | 'roadmap' | 'leaderboard' | 'admin';
  actionPayload?: any;
}

export type ChatMessageType = 'text' | 'idea' | 'counter' | 'poi' | 'evidence';

export interface GroupChatMessage {
  id: string;
  roomId: string;
  studentId: string;
  studentName: string;
  university: string;
  side: 'Pro' | 'Con' | 'Independent';
  roleInTeam: string;
  messageType: ChatMessageType;
  content: string;
  timestamp: string;
  reactions: Record<string, number>;
  repliesTo?: string;
  isPinned?: boolean;
}

export interface BrainstormNote {
  id: string;
  title: string;
  content: string;
  authorName: string;
  side: 'Pro' | 'Con' | 'Independent';
  category: 'idea' | 'evidence' | 'rebuttal';
  votes: number;
  createdAt: string;
}

export interface GroupRoom {
  id: string;
  code: string; // e.g., CTX-7842
  title: string;
  topicType: 'debate' | 'case_study';
  format: string;
  createdAt: string;
  status: 'active' | 'completed';
  members: GroupMemberSubmission[];
  chatMessages?: GroupChatMessage[];
  brainstormNotes?: BrainstormNote[];
  comparativeSynthesis?: {
    rankings: {
      studentId: string;
      studentName: string;
      score: number;
      badge: string;
      highlight: string;
    }[];
    rubricMatrix: {
      category: string;
      scores: Record<string, number>;
      bestStudentId: string;
      reason: string;
    }[];
    consensusPoints: string[];
    divergencePoints: string[];
    masterSynthesis: string;
  };
}

export interface AppSettings {
  theme: 'theme-light' | 'theme-dark' | 'theme-sepia' | 'theme-slate';
  fontScale: 'font-scale-small' | 'font-scale-normal' | 'font-scale-large';
  layoutDensity: 'comfortable' | 'compact';
  isOffline: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // e.g., "20:00"
  cloudSyncPlatform: 'critix_vault' | 'google_drive';
  lastSyncedAt?: string;
}
