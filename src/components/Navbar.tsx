import React from 'react';
import { Student, UserRole } from '../types';
import {
  Swords,
  BookOpen,
  Users,
  Trophy,
  GitFork,
  GraduationCap,
  Settings,
  Flame,
  WifiOff,
  Wifi,
  FileText,
  User,
  LogOut,
  Shield,
  ShieldAlert,
  ChevronDown,
  Bell
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'debate' | 'case' | 'group' | 'leaderboard' | 'roadmap' | 'admin';
  onChangeTab: (tab: 'debate' | 'case' | 'group' | 'leaderboard' | 'roadmap' | 'admin') => void;
  currentStudent: Student | null;
  currentRole: UserRole;
  isOffline: boolean;
  unreadNotificationCount: number;
  onToggleOffline: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenTranscript: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  currentStudent,
  currentRole,
  isOffline,
  unreadNotificationCount,
  onToggleOffline,
  onOpenNotifications,
  onOpenSettings,
  onOpenTranscript,
  onOpenLogin,
  onLogout
}) => {
  const navItems = [
    { id: 'debate', label: 'Sàn Đấu Tranh Biện', icon: Swords },
    { id: 'case', label: 'Phân Tích Case Study', icon: BookOpen },
    { id: 'group', label: 'Hội Đồng Nhóm', icon: Users },
    { id: 'leaderboard', label: 'Bảng Xếp Hạng', icon: Trophy },
    { id: 'roadmap', label: 'Lộ Trình Kỹ Năng', icon: GitFork },
    { id: 'admin', label: 'Quản Trị Học Thuật', icon: GraduationCap }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Critix<span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
                  v3.8
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block truncate max-w-[200px]">
                Tư Duy Phản Biện & Tranh Biện Học Thuật
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-2">
            {/* Offline Mode indicator */}
            <button
              onClick={onToggleOffline}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title={isOffline ? 'Đang bật chế độ Ngoại Tuyến (Heuristic)' : 'Đang kết nối Online'}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
              <span className="hidden xl:inline">{isOffline ? 'Ngoại tuyến' : 'Trực tuyến'}</span>
            </button>

            {/* Streak flame badge */}
            {currentStudent && (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono"
                title={`Chuỗi kỷ luật: ${currentStudent.streakDays} ngày liên tục`}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse-slow" />
                <span>{currentStudent.streakDays}</span>
              </div>
            )}

            {/* Official Academic Transcript Button */}
            {currentStudent && (
              <button
                onClick={onOpenTranscript}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition cursor-pointer"
                title="Xem Bảng điểm năng lực học thuật chính thức"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Bảng Điểm</span>
              </button>
            )}

            {/* Notification Center button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative"
              title="Trung tâm thông báo & Lời nhắc lịch học"
            >
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Cài đặt giao diện & thông báo"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile / Login Button */}
            {currentStudent ? (
              <div className="flex items-center gap-2 pl-1">
                <button
                  onClick={onOpenLogin}
                  className={`flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border transition text-left cursor-pointer ${
                    currentRole === 'admin'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 hover:bg-amber-100'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                  title="Nhấn để đổi tài khoản sinh viên / quản trị"
                >
                  <div className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center ${
                    currentRole === 'admin' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {currentRole === 'admin' ? <Shield className="w-4 h-4 text-white" /> : currentStudent.firstName.slice(0, 1)}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px] flex items-center gap-1">
                      {currentStudent.fullName}
                      {currentRole === 'admin' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-white font-bold">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono leading-none">
                      {currentStudent.studentId}
                    </div>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  title="Đăng nhập tài khoản sinh viên hoặc quản trị (admin / admin)"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Pill Navigation Carousel */}
        <div className="lg:hidden pb-3 pt-1 overflow-x-auto no-scrollbar flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
