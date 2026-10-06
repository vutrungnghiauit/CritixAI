import React, { useState, useEffect } from 'react';
import { NotificationItem, Student, DailyQuest, AppSettings } from '../types';
import {
  Bell,
  Check,
  CheckCheck,
  Flame,
  Clock,
  Target,
  Users,
  Shield,
  Trash2,
  X,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface NotificationCenterProps {
  currentStudent: Student | null;
  quests: DailyQuest[];
  settings: AppSettings;
  onNavigate: (tab: 'debate' | 'case' | 'group' | 'roadmap' | 'leaderboard' | 'admin') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  currentStudent,
  quests,
  settings,
  onNavigate,
  isOpen,
  onClose
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'streak' | 'schedule' | 'quest' | 'room'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('critix_notifications_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Generate dynamic, intelligent notifications based on user's live status
  useEffect(() => {
    const list: NotificationItem[] = [];
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 1. Streak-based Smart Reminder
    if (currentStudent) {
      list.push({
        id: 'notif-streak-status',
        type: 'streak',
        title: `🔥 Chuỗi ngày kỷ luật: ${currentStudent.streakDays} ngày liên tiếp!`,
        message: currentStudent.streakDays > 1
          ? `Bạn đang duy trì ngọn lửa kỷ luật rất tốt! Hãy hoàn thành 1 hiệp biện luận hôm nay để giữ chuỗi và nhận thưởng huy hiệu.`
          : `Khởi động chuỗi ngày mới ngay hôm nay để kích hoạt nhân đôi điểm XP và mở khóa nấc thang WUDC.`,
        timestamp: 'Vừa xong',
        read: false,
        priority: 'high',
        actionTarget: 'debate'
      });

      list.push({
        id: 'notif-streak-freeze',
        type: 'streak',
        title: '❄️ Khiên Bảo Vệ Chuỗi (Streak Freeze) sẵn sàng',
        message: 'Bạn có sẵn Khiên bảo vệ chuỗi ngày. Nếu có lịch thi hoặc bận rộn, hãy kích hoạt trong Lộ Trình Kỹ Năng để bảo lưu chuỗi.',
        timestamp: '15 phút trước',
        read: false,
        priority: 'medium',
        actionTarget: 'roadmap'
      });
    }

    // 2. Study Schedule Reminder
    if (settings.reminderEnabled) {
      list.push({
        id: 'notif-schedule-alert',
        type: 'schedule',
        title: `⏰ Lời nhắc lịch học cá nhân (${settings.reminderTime})`,
        message: `Đã đến khung giờ rèn luyện tư duy phản biện tối ưu của bạn. 15 phút rèn luyện mỗi ngày giúp tăng 40% khả năng cấu trúc luận cứ Toulmin!`,
        timestamp: 'Hôm nay',
        read: false,
        priority: 'high',
        actionTarget: 'debate'
      });
    }

    // 3. Pending Quests Reminders
    const pendingQuests = quests.filter(q => !q.completed);
    pendingQuests.forEach((q, idx) => {
      list.push({
        id: `notif-quest-${q.id}`,
        type: 'quest',
        title: `🎯 Nhiệm vụ chờ: ${q.title}`,
        message: `Hoàn thành ngay để nhận +${q.rewardXp} XP và tích lũy điểm thăng hạng mùa giải Biện Luận 2026.`,
        timestamp: `${idx + 1} giờ trước`,
        read: false,
        priority: 'medium',
        actionTarget: q.category === 'debate' ? 'debate' : q.category === 'case' ? 'case' : 'roadmap'
      });
    });

    // 4. Social & Group Debate interaction
    list.push({
      id: 'notif-room-activity',
      type: 'room',
      title: '👥 Phòng Hội Đồng CTX-7842 có thảo luận mới',
      message: 'Bạn học Trần Duy Các vừa đề xuất mô hình giải pháp thứ ba và phản biện luận điểm của phe Ủng hộ trong phòng tranh biện Bản quyền AI.',
      timestamp: '25 phút trước',
      read: false,
      priority: 'low',
      actionTarget: 'group'
    });

    setNotifications(prev => {
      // Merge with previous read states
      const readMap = new Map(prev.map(p => [p.id, p.read]));
      return list.map(item => ({
        ...item,
        read: readMap.get(item.id) ?? false
      }));
    });
  }, [currentStudent, quests, settings]);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem('critix_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleActionClick = (n: NotificationItem) => {
    handleMarkAsRead(n.id);
    if (n.actionTarget) {
      onNavigate(n.actionTarget);
      onClose();
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Trung Tâm Thông Báo</h3>
              <p className="text-[11px] text-slate-500">Lời nhắc thông minh & Cập nhật học thuật</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
                title="Đánh dấu tất cả là đã đọc"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Đã đọc hết
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'streak', label: 'Chuỗi ngày 🔥' },
            { id: 'schedule', label: 'Lịch học ⏰' },
            { id: 'quest', label: 'Nhiệm vụ 🎯' },
            { id: 'room', label: 'Phòng nhóm 👥' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold transition text-[11px] ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Check className="w-8 h-8 mx-auto text-emerald-500/80" />
              <p>Bạn đã xem hết tất cả thông báo!</p>
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => handleActionClick(n)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer relative group ${
                  n.read
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon per type */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                    n.type === 'streak'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                      : n.type === 'schedule'
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600'
                      : n.type === 'quest'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'
                  }`}>
                    {n.type === 'streak' && <Flame className="w-4 h-4 fill-amber-500" />}
                    {n.type === 'schedule' && <Clock className="w-4 h-4" />}
                    {n.type === 'quest' && <Target className="w-4 h-4" />}
                    {n.type === 'room' && <Users className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {n.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{n.timestamp}</span>
                      {n.actionTarget && (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 group-hover:underline">
                          Xem ngay <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions on hover */}
                  <button
                    onClick={(e) => handleDeleteNotif(n.id, e)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition"
                    title="Xóa thông báo này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {!n.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-600 group-hover:hidden"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-500">
            Khung giờ nhắc nhở: <strong>{settings.reminderTime}</strong>
          </div>
          <button
            onClick={() => { onNavigate('debate'); onClose(); }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition"
          >
            Luyện Tập Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
