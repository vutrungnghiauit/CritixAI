import React, { useState } from 'react';
import { AppSettings } from '../types';
import {
  Settings,
  Palette,
  Type,
  WifiOff,
  Bell,
  Cloud,
  Download,
  Upload,
  X,
  Check,
  Smartphone
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onExportBackupJson: () => void;
  onImportBackupJson: (file: File) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportBackupJson,
  onImportBackupJson
}) => {
  const [notificationMsg, setNotificationMsg] = useState('');

  if (!isOpen) return null;

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('CritixAI — Lời nhắc học tập', {
          body: 'Đã bật thông báo nhắc nhở rèn luyện tư duy phản biện hàng ngày!',
          icon: '/favicon.ico'
        });
        setNotificationMsg('Đã cấp quyền thông báo thành công!');
      } else {
        setNotificationMsg('Trình duyệt chưa cho phép quyền thông báo.');
      }
    } else {
      setNotificationMsg('Trình duyệt của bạn không hỗ trợ Notifications API.');
    }
  };

  const themes = [
    { id: 'theme-light', name: 'Sáng Thanh Lịch', preview: 'bg-slate-100 text-slate-900 border-slate-300' },
    { id: 'theme-dark', name: 'Tối Chuyên Sâu', preview: 'bg-slate-950 text-slate-100 border-slate-700' },
    { id: 'theme-sepia', name: 'Giấy Đọc Ấm Áp', preview: 'bg-[#faf6ee] text-[#2c251d] border-[#dfceb8]' },
    { id: 'theme-slate', name: 'Xanh Học Viện', preview: 'bg-slate-900 text-blue-100 border-slate-600' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base">Cài Đặt Hệ Thống & Trải Nghiệm</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Themes */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" /> Chế Độ Hiển Thị & Giao Diện
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ ...settings, theme: t.id as any })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${t.preview} ${
                  settings.theme === t.id ? 'ring-2 ring-blue-500 shadow-sm' : 'opacity-80'
                }`}
              >
                <span>{t.name}</span>
                {settings.theme === t.id && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Fluid Typography Font Scaling */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" /> Kích Thước Chữ (Fluid Typography)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'font-scale-small', label: 'Nhỏ (90%)' },
              { id: 'font-scale-normal', label: 'Chuẩn (100%)' },
              { id: 'font-scale-large', label: 'Lớn (115%)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ ...settings, fontScale: f.id as any })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  settings.fontScale === f.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Offline Mode */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold">
              <WifiOff className="w-4 h-4 text-amber-500" />
              <span>Chế Độ Ngoại Tuyến (Offline Mode)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Sử dụng động cơ chẩn đoán Logic Heuristic nội bộ, tiếp tục rèn luyện khi không có mạng.
            </p>
          </div>
          <button
            onClick={() => onUpdateSettings({ ...settings, isOffline: !settings.isOffline })}
            className={`w-12 h-6 rounded-full transition relative p-0.5 ${
              settings.isOffline ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition transform ${
              settings.isOffline ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* 4. Daily Schedule Reminder */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" /> Nhắc Nhở Lịch Trình Hàng Ngày
          </label>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Khung giờ nhắc nhở mỗi tối:</span>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => onUpdateSettings({ ...settings, reminderTime: e.target.value })}
                className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
              <span className="text-slate-500">Thông báo trình duyệt:</span>
              <button
                onClick={handleRequestNotification}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition"
              >
                Kiểm Tra & Cho Phép
              </button>
            </div>
            {notificationMsg && (
              <p className="text-[11px] text-emerald-600">{notificationMsg}</p>
            )}
          </div>
        </div>

        {/* 5. Cloud Sync & Backup Data */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-500" /> Đồng Bộ Hóa Đám Mây & Sao Lưu
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={onExportBackupJson}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 font-semibold transition"
            >
              <Download className="w-4 h-4 text-blue-600" />
              Xuất File Backup (.json)
            </button>

            <label className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 font-semibold transition cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Nhập File Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImportBackupJson(f);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
          >
            Đóng Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
