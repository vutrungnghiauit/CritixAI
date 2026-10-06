import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { Lock, User, Shield, CheckCircle, Eye, EyeOff, X, GraduationCap, School } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onLoginStudent: (student: Student) => void;
  onLoginAdmin: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  students,
  onLoginStudent,
  onLoginAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [adminRole, setAdminRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const id = studentIdInput.trim();
    const pwd = passwordInput.trim();

    if (!id) {
      setErrorMsg('Vui lòng nhập Mã sinh viên!');
      return;
    }

    // Direct admin login support from student tab
    if (id.toLowerCase() === 'admin') {
      if (!pwd || pwd === 'admin') {
        onLoginAdmin('admin');
        onClose();
        return;
      } else {
        setErrorMsg('Mật khẩu quản trị không chính xác! (Mặc định: admin)');
        return;
      }
    }

    // Match student
    const matched = students.find(s => s.studentId === id);
    if (!matched) {
      setErrorMsg(`Không tìm thấy sinh viên có mã "${id}". Hãy kiểm tra danh sách hoặc chọn từ danh sách mẫu.`);
      return;
    }

    if (matched.status === 'locked') {
      setErrorMsg('Tài khoản sinh viên này hiện đang bị tạm khóa. Vui lòng liên hệ Admin.');
      return;
    }

    const expectedPwd = matched.password || matched.studentId;
    if (pwd && pwd !== expectedPwd) {
      setErrorMsg('Mật khẩu không chính xác! (Gợi ý: Mật khẩu mặc định là chính Mã sinh viên)');
      return;
    }

    onLoginStudent(matched);
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (adminUsername.trim().toLowerCase() === 'admin' && adminPassword.trim() === 'admin') {
      onLoginAdmin(adminRole);
      onClose();
    } else {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu quản trị không đúng! (Mặc định: admin / admin)');
    }
  };

  const handleQuickAdminLogin = () => {
    onLoginAdmin('admin');
    onClose();
  };

  const handleQuickSelectStudent = (student: Student) => {
    setStudentIdInput(student.studentId);
    setPasswordInput(student.studentId);
    setErrorMsg('');
  };

  // Quick pick samples from top students
  const sampleStudents = students.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cổng Đăng Nhập Học Thuật</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Nền tảng Rèn luyện Tư duy Phản biện CritixAI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex p-2 bg-slate-100 dark:bg-slate-800/60 m-6 mb-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === 'student'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Sinh Viên
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Quản Trị Viên / Giảng Viên
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 text-xs rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {errorMsg}
          </div>
        )}

        <div className="p-6 pt-3 space-y-5">
          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mã sinh viên (Student ID)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="Ví dụ: 2500011076 hoặc 2500017850"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mật khẩu
                  </label>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400">
                    Mặc định là Mã SV
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu (Mặc định là Mã SV)"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-900/10 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <School className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Hệ thống đã tích hợp <strong>114 sinh viên</strong> Đại học Nguyễn Tất Thành (NTTU). Tên đăng nhập và mật khẩu khởi tạo đều là Mã số sinh viên.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Đăng Nhập Sinh Viên
              </button>

              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Đăng Nhập Quản Trị Viên (admin / admin)
              </button>

              {/* Quick 1-click select list */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Chọn nhanh tài khoản kiểm thử (1-click):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleStudents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleQuickSelectStudent(s)}
                      className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition text-xs"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{s.studentId} • {s.className}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tài khoản Quản trị
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Vai trò phân quyền
                </label>
                <select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Quản trị viên Hệ thống (System Admin)</option>
                  <option value="lecturer">Giảng viên bộ môn (Lecturer)</option>
                  <option value="staff">Nhân viên hỗ trợ học thuật (Support Staff)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                Tài khoản quản trị viên mặc định: Tên đăng nhập: <strong>admin</strong> • Mật khẩu: <strong>admin</strong>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition cursor-pointer"
                >
                  Đăng Nhập Quản Trị (admin / admin)
                </button>
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-xl text-xs transition cursor-pointer border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  Đăng Nhập 1-Click Với Quyền Admin Tối Cao
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
