import React from 'react';
import { Student } from '../types';
import { RadarChart } from './RadarChart';
import { Printer, X, GraduationCap, Award, ShieldCheck } from 'lucide-react';

interface AcademicTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const AcademicTranscriptModal: React.FC<AcademicTranscriptModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6 md:p-8">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>HỒ SƠ NĂNG LỰC HỌC THUẬT CHÍNH THỨC</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              In Bảng Điểm / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Certificate */}
        <div className="pt-6 space-y-6">
          {/* Header Organization */}
          <div className="text-center space-y-1 border-b pb-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-slate-500">
              {student.university.toUpperCase()}
            </h4>
            <h5 className="text-xs font-medium text-slate-600">{student.faculty}</h5>
            <h2 className="text-lg md:text-xl font-black text-slate-950 mt-2 uppercase tracking-wide">
              BẢNG ĐIỂM ĐÁNH GIÁ NĂNG LỰC TƯ DUY PHẢN BIỆN & TRANH BIỆN
            </h2>
            <p className="text-[11px] text-slate-500 italic">
              (Hệ thống Chuẩn Hóa Theo Khung Rubric 5 Chiều WUDC & Harvard Case Method)
            </p>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Họ và tên sinh viên:</span>
              <span className="font-bold text-sm text-slate-900">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Mã số sinh viên:</span>
              <span className="font-mono font-bold text-sm text-blue-600">{student.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Lớp sinh hoạt:</span>
              <span className="font-semibold text-slate-800">{student.className}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ngày sinh:</span>
              <span className="font-mono text-slate-800">{student.birthDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cấp bậc thi đua học thuật:</span>
              <span className="font-bold text-amber-600">{student.tier}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Điểm Rubric Trung bình:</span>
              <span className="font-mono font-extrabold text-base text-blue-600">
                {student.rubricAverage}/100
              </span>
            </div>
          </div>

          {/* Radar Chart Visual */}
          <div className="py-2 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
              Ma Trận 5 Chiều Năng Lực Lập Luận
            </h4>
            <RadarChart scores={student.rubricScores} size={250} />
          </div>

          {/* 5-Dimension Score Table */}
          <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Tiêu Chí Đánh Giá</th>
                <th className="py-2.5 px-3 text-center">Thang Điểm</th>
                <th className="py-2.5 px-3 text-center">Điểm Đạt</th>
                <th className="py-2.5 px-3">Xếp Loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-medium">1. Logic & Tính Vững Chắc Của Tiền Đề</td>
                <td className="py-2 px-3 text-center font-mono">100</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-blue-600">{student.rubricScores.logic}</td>
                <td className="py-2 px-3">{student.rubricScores.logic >= 85 ? 'Xuất sắc' : 'Giỏi'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">2. Chất Lượng Dẫn Chứng & Dữ Liệu Thực Tiễn</td>
                <td className="py-2 px-3 text-center font-mono">100</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-blue-600">{student.rubricScores.evidence}</td>
                <td className="py-2 px-3">{student.rubricScores.evidence >= 85 ? 'Xuất sắc' : 'Khá'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">3. Năng Lực Bẻ Gãy Phản Biện (Rebuttal)</td>
                <td className="py-2 px-3 text-center font-mono">100</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-blue-600">{student.rubricScores.rebuttal}</td>
                <td className="py-2 px-3">{student.rubricScores.rebuttal >= 85 ? 'Xuất sắc' : 'Giỏi'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">4. Cấu Trúc Mạch Lạc & Mô Hình Toulmin</td>
                <td className="py-2 px-3 text-center font-mono">100</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-blue-600">{student.rubricScores.toulmin}</td>
                <td className="py-2 px-3">{student.rubricScores.toulmin >= 85 ? 'Xuất sắc' : 'Giỏi'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">5. Tầm Nhìn Đa Chiều & Nhận Diện Thiên Kiến</td>
                <td className="py-2 px-3 text-center font-mono">100</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-blue-600">{student.rubricScores.multiPerspective}</td>
                <td className="py-2 px-3">{student.rubricScores.multiPerspective >= 85 ? 'Xuất sắc' : 'Giỏi'}</td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-600">
            <div>
              <p className="font-semibold">HỘI ĐỒNG KHOA HỌC CRITIXAI</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-900">Ban Kiểm Định Độc Lập</p>
            </div>
            <div>
              <p className="font-semibold">GIẢNG VIÊN PHỤ TRÁCH BỘ MÔN</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-900">TS. Nguyễn Văn Hùng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
