import * as XLSX from 'xlsx';
import { Student, University, Faculty, ClassItem } from '../types';

/**
 * Downloads a workbook as an .xlsx file in the browser
 */
function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

// ==========================================
// 1. STUDENTS EXCEL MANAGEMENT
// ==========================================

export function exportStudentsToExcel(students: Student[], filename = 'Danh_Sach_Sinh_Vien_CritixAI.xlsx') {
  const data = students.map((s, idx) => ({
    'STT': idx + 1,
    'Mã sinh viên': s.studentId,
    'Họ đệm': s.lastName,
    'Tên': s.firstName,
    'Họ và tên': s.fullName,
    'Giới tính': s.gender,
    'Ngày sinh': s.birthDate,
    'Lớp học': s.className,
    'Khoa': s.faculty,
    'Trường': s.university,
    'Cấp bậc thi đua': s.tier,
    'Điểm Rubric TB': s.rubricAverage,
    'Điểm XP': s.xp,
    'Chuỗi ngày (Flame)': s.streakDays,
    'Tổng lượt tranh biện': s.totalDebates,
    'Trạng thái': s.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa',
    'Mật khẩu truy cập': s.password || s.studentId
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã SV
    { wch: 16 }, // Họ đệm
    { wch: 12 }, // Tên
    { wch: 22 }, // Họ và tên
    { wch: 10 }, // Giới tính
    { wch: 14 }, // Ngày sinh
    { wch: 14 }, // Lớp học
    { wch: 28 }, // Khoa
    { wch: 38 }, // Trường
    { wch: 20 }, // Cấp bậc
    { wch: 15 }, // Điểm TB
    { wch: 12 }, // XP
    { wch: 14 }, // Chuỗi ngày
    { wch: 18 }, // Lượt tranh biện
    { wch: 16 }, // Trạng thái
    { wch: 16 }  // Mật khẩu
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SinhVien');
  downloadWorkbook(workbook, filename);
}

export function generateStudentTemplateExcel() {
  const sampleData = [
    {
      'STT': 1,
      'Mã sinh viên': '2500099001',
      'Họ đệm': 'Nguyễn Văn',
      'Tên': 'An',
      'Họ và tên': 'Nguyễn Văn An',
      'Giới tính': 'Nam',
      'Ngày sinh': '15/08/2007',
      'Lớp học': '25DKQT1A',
      'Khoa': 'Khoa Quản trị kinh doanh',
      'Trường': 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      'Cấp bậc thi đua': 'Vàng Scholar',
      'Điểm Rubric TB': 78,
      'Điểm XP': 1250,
      'Chuỗi ngày (Flame)': 7,
      'Tổng lượt tranh biện': 12,
      'Trạng thái': 'Đang hoạt động',
      'Mật khẩu truy cập': '2500099001'
    },
    {
      'STT': 2,
      'Mã sinh viên': '2500099002',
      'Họ đệm': 'Trần Thị Thu',
      'Tên': 'Hà',
      'Họ và tên': 'Trần Thị Thu Hà',
      'Giới tính': 'Nữ',
      'Ngày sinh': '20/11/2007',
      'Lớp học': '25DMK2B',
      'Khoa': 'Khoa Quản trị kinh doanh',
      'Trường': 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      'Cấp bậc thi đua': 'Bạch Kim Rhetor',
      'Điểm Rubric TB': 84,
      'Điểm XP': 2100,
      'Chuỗi ngày (Flame)': 14,
      'Tổng lượt tranh biện': 18,
      'Trạng thái': 'Đang hoạt động',
      'Mật khẩu truy cập': '2500099002'
    },
    {
      'STT': 3,
      'Mã sinh viên': '2500099003',
      'Họ đệm': 'Lê Hoàng',
      'Tên': 'Phúc',
      'Họ và tên': 'Lê Hoàng Phúc',
      'Giới tính': 'Nam',
      'Ngày sinh': '05/03/2007',
      'Lớp học': '25DKQT1B',
      'Khoa': 'Khoa Quản trị kinh doanh',
      'Trường': 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      'Cấp bậc thi đua': 'Đồng Debater',
      'Điểm Rubric TB': 72,
      'Điểm XP': 450,
      'Chuỗi ngày (Flame)': 3,
      'Tổng lượt tranh biện': 5,
      'Trạng thái': 'Đang hoạt động',
      'Mật khẩu truy cập': '2500099003'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã SV
    { wch: 16 }, // Họ đệm
    { wch: 12 }, // Tên
    { wch: 22 }, // Họ và tên
    { wch: 10 }, // Giới tính
    { wch: 14 }, // Ngày sinh
    { wch: 14 }, // Lớp học
    { wch: 28 }, // Khoa
    { wch: 38 }, // Trường
    { wch: 20 }, // Cấp bậc
    { wch: 15 }, // Điểm TB
    { wch: 12 }, // XP
    { wch: 14 }, // Chuỗi ngày
    { wch: 18 }, // Lượt tranh biện
    { wch: 16 }, // Trạng thái
    { wch: 16 }  // Mật khẩu
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SinhVien');
  downloadWorkbook(workbook, 'Mau_Danh_Sach_Sinh_Vien_CritixAI.xlsx');
}

export async function importStudentsFromExcel(file: File): Promise<{
  success: boolean;
  students: Student[];
  message: string;
  count: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

        if (!rawJson || rawJson.length === 0) {
          resolve({
            success: false,
            students: [],
            message: 'File Excel không có dữ liệu hoặc định dạng không đúng.',
            count: 0
          });
          return;
        }

        const parsedStudents: Student[] = [];

        rawJson.forEach((row, index) => {
          // Normalize column names
          const studentId = String(row['Mã sinh viên'] || row['Mã SV'] || row['MSSV'] || row['studentId'] || row['Student ID'] || '').trim();
          if (!studentId) return;

          const lastName = String(row['Họ đệm'] || row['Họ'] || row['lastName'] || '').trim();
          const firstName = String(row['Tên'] || row['firstName'] || '').trim();
          let fullName = String(row['Họ và tên'] || row['Họ tên'] || row['fullName'] || '').trim();
          if (!fullName && (lastName || firstName)) {
            fullName = `${lastName} ${firstName}`.trim();
          }

          const genderStr = String(row['Giới tính'] || row['gender'] || 'Nam').trim();
          const gender: 'Nam' | 'Nữ' = genderStr.toLowerCase().includes('nữ') || genderStr.toLowerCase() === 'female' ? 'Nữ' : 'Nam';

          const birthDate = String(row['Ngày sinh'] || row['birthDate'] || '01/01/2007').trim();
          const className = String(row['Lớp học'] || row['Lớp'] || row['className'] || '25DKQT1A').trim();
          const faculty = String(row['Khoa'] || row['Khoa/Viện'] || row['faculty'] || 'Khoa Quản trị kinh doanh').trim();
          const university = String(row['Trường'] || row['Trường Đại học'] || row['university'] || 'Trường Đại học Nguyễn Tất Thành (NTTU)').trim();
          const password = String(row['Mật khẩu truy cập'] || row['Mật khẩu'] || row['password'] || studentId).trim();

          const xp = Number(row['Điểm XP'] || row['xp']) || 500;
          const rubricAverage = Number(row['Điểm Rubric TB'] || row['rubricAverage']) || 75;
          const streakDays = Number(row['Chuỗi ngày (Flame)'] || row['streakDays']) || 1;
          const totalDebates = Number(row['Tổng lượt tranh biện'] || row['totalDebates']) || 0;

          parsedStudents.push({
            id: `student-imported-${Date.now()}-${index}`,
            studentId,
            lastName,
            firstName,
            fullName: fullName || `${lastName} ${firstName}`,
            gender,
            birthDate,
            className,
            faculty,
            university,
            password,
            status: 'active',
            role: 'student',
            tier: rubricAverage >= 90 ? 'Bậc Thầy Socrates' : rubricAverage >= 82 ? 'Bạch Kim Rhetor' : rubricAverage >= 75 ? 'Vàng Scholar' : 'Bạc Dialectic',
            xp,
            streakDays,
            rubricAverage,
            totalDebates,
            casesAnalyzed: 0,
            rubricScores: {
              logic: rubricAverage,
              evidence: Math.max(60, rubricAverage - 2),
              rebuttal: Math.max(60, rubricAverage + 1),
              toulmin: rubricAverage,
              multiPerspective: Math.max(60, rubricAverage - 1)
            }
          });
        });

        resolve({
          success: true,
          students: parsedStudents,
          message: `Đã đọc và nhập thành công ${parsedStudents.length} sinh viên từ file Excel.`,
          count: parsedStudents.length
        });
      } catch (err: any) {
        resolve({
          success: false,
          students: [],
          message: `Lỗi đọc file Excel: ${err?.message || 'Định dạng file không hỗ trợ'}`,
          count: 0
        });
      }
    };

    reader.onerror = () => {
      reject(new Error('Không thể đọc file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

// ==========================================
// 2. UNIVERSITIES EXCEL MANAGEMENT
// ==========================================

export function exportUniversitiesToExcel(universities: University[], filename = 'Danh_Sach_Truong_Dai_Hoc_CritixAI.xlsx') {
  const data = universities.map((u, idx) => ({
    'STT': idx + 1,
    'Mã trường': u.code,
    'Tên trường': u.name,
    'Tên viết tắt': u.shortName,
    'Địa chỉ': u.address || '',
    'Số lượng sinh viên': u.totalStudents || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 38 },
    { wch: 16 },
    { wch: 45 },
    { wch: 20 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TruongDaiHoc');
  downloadWorkbook(workbook, filename);
}

export function generateUniversityTemplateExcel() {
  const sampleData = [
    {
      'STT': 1,
      'Mã trường': 'NTTU',
      'Tên trường': 'Trường Đại học Nguyễn Tất Thành',
      'Tên viết tắt': 'NTTU',
      'Địa chỉ': '300A Nguyễn Tất Thành, P.13, Q.4, TP. Hồ Chí Minh'
    },
    {
      'STT': 2,
      'Mã trường': 'VNUHCM',
      'Tên trường': 'Đại học Quốc gia TP. Hồ Chí Minh',
      'Tên viết tắt': 'ĐHQG-HCM',
      'Địa chỉ': 'Khu phố 6, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 38 }, { wch: 16 }, { wch: 45 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhap_Truong');
  downloadWorkbook(workbook, 'Mau_Danh_Sach_Truong_CritixAI.xlsx');
}

export async function importUniversitiesFromExcel(file: File): Promise<{
  success: boolean;
  universities: University[];
  message: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

        const list: University[] = [];
        rows.forEach((r, idx) => {
          const code = String(r['Mã trường'] || r['code'] || '').trim();
          const name = String(r['Tên trường'] || r['name'] || '').trim();
          if (!name) return;

          list.push({
            id: `uni-imported-${Date.now()}-${idx}`,
            code: code || `UNI-${idx + 1}`,
            name,
            shortName: String(r['Tên viết tắt'] || r['shortName'] || code || name).trim(),
            address: String(r['Địa chỉ'] || r['address'] || '').trim(),
            totalStudents: Number(r['Số lượng sinh viên'] || 0)
          });
        });

        resolve({
          success: true,
          universities: list,
          message: `Đã nhập ${list.length} trường đại học thành công.`
        });
      } catch (err: any) {
        resolve({
          success: false,
          universities: [],
          message: `Lỗi đọc file trường học: ${err?.message || 'Lỗi không xác định'}`
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ==========================================
// 3. FACULTIES EXCEL MANAGEMENT
// ==========================================

export function exportFacultiesToExcel(faculties: Faculty[], filename = 'Danh_Sach_Khoa_Vien_CritixAI.xlsx') {
  const data = faculties.map((f, idx) => ({
    'STT': idx + 1,
    'Mã khoa/viện': f.code,
    'Tên khoa/viện': f.name,
    'Mã trường': f.universityCode,
    'Trưởng khoa/Viện trưởng': f.deanName || '',
    'Số lượng lớp': f.totalClasses || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [{ wch: 6 }, { wch: 16 }, { wch: 32 }, { wch: 14 }, { wch: 26 }, { wch: 16 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KhoaVien');
  downloadWorkbook(workbook, filename);
}

export function generateFacultyTemplateExcel() {
  const sampleData = [
    {
      'STT': 1,
      'Mã khoa/viện': 'FBA',
      'Tên khoa/viện': 'Khoa Quản trị kinh doanh',
      'Mã trường': 'NTTU',
      'Trưởng khoa/Viện trưởng': 'TS. Nguyễn Văn Hùng'
    },
    {
      'STT': 2,
      'Mã khoa/viện': 'FIT',
      'Tên khoa/viện': 'Khoa Công nghệ thông tin',
      'Mã trường': 'NTTU',
      'Trưởng khoa/Viện trưởng': 'PGS. TS. Trần Minh Tuấn'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [{ wch: 6 }, { wch: 16 }, { wch: 32 }, { wch: 14 }, { wch: 26 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhap_Khoa_Vien');
  downloadWorkbook(workbook, 'Mau_Danh_Sach_Khoa_Vien_CritixAI.xlsx');
}

export async function importFacultiesFromExcel(file: File): Promise<{
  success: boolean;
  faculties: Faculty[];
  message: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

        const list: Faculty[] = [];
        rows.forEach((r, idx) => {
          const code = String(r['Mã khoa/viện'] || r['code'] || '').trim();
          const name = String(r['Tên khoa/viện'] || r['name'] || '').trim();
          if (!name) return;

          list.push({
            id: `fac-imported-${Date.now()}-${idx}`,
            code: code || `FAC-${idx + 1}`,
            name,
            universityCode: String(r['Mã trường'] || r['universityCode'] || 'NTTU').trim(),
            deanName: String(r['Trưởng khoa/Viện trưởng'] || r['deanName'] || '').trim(),
            totalClasses: Number(r['Số lượng lớp'] || 0)
          });
        });

        resolve({
          success: true,
          faculties: list,
          message: `Đã nhập ${list.length} khoa/viện thành công.`
        });
      } catch (err: any) {
        resolve({
          success: false,
          faculties: [],
          message: `Lỗi đọc file khoa/viện: ${err?.message || 'Lỗi không xác định'}`
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ==========================================
// 4. CLASSES EXCEL MANAGEMENT
// ==========================================

export function exportClassesToExcel(classes: ClassItem[], filename = 'Danh_Sach_Lop_Hoc_CritixAI.xlsx') {
  const data = classes.map((c, idx) => ({
    'STT': idx + 1,
    'Mã lớp': c.code,
    'Tên lớp': c.name,
    'Mã khoa': c.facultyCode,
    'Mã trường': c.universityCode,
    'Niên khóa': c.academicYear,
    'Số lượng sinh viên': c.totalStudents || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 20 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'LopHoc');
  downloadWorkbook(workbook, filename);
}

export function generateClassTemplateExcel() {
  const sampleData = [
    {
      'STT': 1,
      'Mã lớp': '25DKQT1A',
      'Tên lớp': 'Quản trị kinh doanh 25A',
      'Mã khoa': 'FBA',
      'Mã trường': 'NTTU',
      'Niên khóa': '2024-2028'
    },
    {
      'STT': 2,
      'Mã lớp': '25DMK2B',
      'Tên lớp': 'Marketing 25B',
      'Mã khoa': 'FBA',
      'Mã trường': 'NTTU',
      'Niên khóa': '2024-2028'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 16 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhap_Lop_Hoc');
  downloadWorkbook(workbook, 'Mau_Danh_Sach_Lop_CritixAI.xlsx');
}

export async function importClassesFromExcel(file: File): Promise<{
  success: boolean;
  classes: ClassItem[];
  message: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

        const list: ClassItem[] = [];
        rows.forEach((r, idx) => {
          const code = String(r['Mã lớp'] || r['code'] || '').trim();
          const name = String(r['Tên lớp'] || r['name'] || code).trim();
          if (!code) return;

          list.push({
            id: `cls-imported-${Date.now()}-${idx}`,
            code,
            name,
            facultyCode: String(r['Mã khoa'] || r['facultyCode'] || 'FBA').trim(),
            universityCode: String(r['Mã trường'] || r['universityCode'] || 'NTTU').trim(),
            academicYear: String(r['Niên khóa'] || r['academicYear'] || '2024-2028').trim(),
            totalStudents: Number(r['Số lượng sinh viên'] || 0)
          });
        });

        resolve({
          success: true,
          classes: list,
          message: `Đã nhập ${list.length} lớp học thành công.`
        });
      } catch (err: any) {
        resolve({
          success: false,
          classes: [],
          message: `Lỗi đọc file lớp học: ${err?.message || 'Lỗi không xác định'}`
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
