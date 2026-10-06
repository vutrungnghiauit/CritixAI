import { Student, University, Faculty, ClassItem, DebateTopic, CaseStudy, GroupRoom, DailyQuest, RolePermissionItem } from '../types';

export const INITIAL_UNIVERSITIES: University[] = [
  {
    id: 'uni-1',
    code: 'NTTU',
    name: 'Trường Đại học Nguyễn Tất Thành',
    shortName: 'NTTU',
    address: '300A Nguyễn Tất Thành, P.13, Q.4, TP. Hồ Chí Minh',
    rector: 'TS. Trần Ái Cầm',
    email: 'tuyensinh@ntt.edu.vn',
    phone: '1900 2039',
    website: 'https://ntt.edu.vn',
    description: 'Trường đại học chuẩn quốc tế đạt 4 sao QS Stars, tiên phong đổi mới sáng tạo và rèn luyện tư duy biện luận học thuật.',
    totalStudents: 114
  },
  {
    id: 'uni-2',
    code: 'VNUHCM',
    name: 'Đại học Quốc gia TP. Hồ Chí Minh',
    shortName: 'ĐHQG-HCM',
    address: 'Khu phố 6, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',
    rector: 'PGS. TS. Vũ Hải Quân',
    email: 'info@vnuhcm.edu.vn',
    phone: '028 3724 2160',
    website: 'https://vnuhcm.edu.vn',
    description: 'Trung tâm đào tạo đại học, sau đại học và nghiên cứu khoa học chất lượng cao hàng đầu Việt Nam.',
    totalStudents: 45
  },
  {
    id: 'uni-3',
    code: 'FTU2',
    name: 'Trường Đại học Ngoại Thương - Cơ sở II',
    shortName: 'FTU2',
    address: 'Số 15 đường D5, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh',
    rector: 'PGS. TS. Bùi Anh Tuấn',
    email: 'qldt.cs2@ftu.edu.vn',
    phone: '028 3512 7254',
    website: 'https://cs2.ftu.edu.vn',
    description: 'Nôi đào tạo chuyên gia kinh tế, tài chính và đàm phán quốc tế với năng lực tranh biện xuất sắc.',
    totalStudents: 32
  },
  {
    id: 'uni-4',
    code: 'HCMUT',
    name: 'Trường Đại học Bách Khoa - ĐHQG HCM',
    shortName: 'HCMUT',
    address: '268 Lý Thường Kiệt, P. 14, Q. 10, TP. Hồ Chí Minh',
    rector: 'GS. TS. Mai Thanh Phong',
    email: 'pdt@hcmut.edu.vn',
    phone: '028 3865 4087',
    website: 'https://hcmut.edu.vn',
    description: 'Trường đại học kỹ thuật công nghệ trọng điểm, phát triển tư duy logic giải quyết vấn đề kỹ thuật phức tạp.',
    totalStudents: 28
  },
  {
    id: 'uni-5',
    code: 'HCMULAW',
    name: 'Trường Đại học Luật TP. Hồ Chí Minh',
    shortName: 'HCMULAW',
    address: '02 Nguyễn Tất Thành, P. 12, Q. 4, TP. Hồ Chí Minh',
    rector: 'TS. Lê Trường Sơn',
    email: 'ulaw@hcmulaw.edu.vn',
    phone: '028 3940 0989',
    website: 'https://hcmulaw.edu.vn',
    description: 'Trường đào tạo luật pháp hàng đầu miền Nam với bề dày thành tích trong các giải tranh biện sinh viên.',
    totalStudents: 30
  }
];

export const INITIAL_FACULTIES: Faculty[] = [
  {
    id: 'fac-1',
    code: 'FBA',
    name: 'Khoa Quản trị kinh doanh',
    universityCode: 'NTTU',
    deanName: 'TS. Nguyễn Văn Hùng',
    viceDean: 'ThS. Lê Thị Mai',
    email: 'fba@ntt.edu.vn',
    phone: '028 3940 0065',
    office: 'Phòng A.302, Cơ sở An Phú Đông, Q.12',
    description: 'Đào tạo cử nhân Quản trị kinh doanh, Marketing, Logistics và Kinh tế số với năng lực phân tích tình huống thực chiến.',
    totalClasses: 18
  },
  {
    id: 'fac-2',
    code: 'FIT',
    name: 'Khoa Công nghệ thông tin',
    universityCode: 'NTTU',
    deanName: 'PGS. TS. Trần Minh Tuấn',
    viceDean: 'TS. Hoàng Kim Long',
    email: 'fit@ntt.edu.vn',
    phone: '028 3940 0066',
    office: 'Phòng L.405, Cơ sở 300A Nguyễn Tất Thành, Q.4',
    description: 'Đào tạo kỹ sư Khoa học máy tính, Kỹ thuật phần mềm và Trí tuệ nhân tạo.',
    totalClasses: 12
  },
  {
    id: 'fac-3',
    code: 'FLAW',
    name: 'Khoa Luật & Quan hệ quốc tế',
    universityCode: 'NTTU',
    deanName: 'TS. Phạm Hoàng Mai',
    viceDean: 'ThS. Đỗ Quốc Huy',
    email: 'flaw@ntt.edu.vn',
    phone: '028 3940 0067',
    office: 'Phòng B.201, Cơ sở 300A Nguyễn Tất Thành, Q.4',
    description: 'Chuyên sâu Luật kinh tế, Luật quốc tế và Tranh tụng phản biện pháp lý.',
    totalClasses: 8
  },
  {
    id: 'fac-4',
    code: 'FPHARM',
    name: 'Khoa Dược & Sức khỏe',
    universityCode: 'NTTU',
    deanName: 'GS. TS. Lê Thùy Dương',
    viceDean: 'TS. Nguyễn Minh Hải',
    email: 'fpharm@ntt.edu.vn',
    phone: '028 3940 0068',
    office: 'Phòng Y.102, Cơ sở An Phú Đông, Q.12',
    description: 'Đào tạo dược sĩ đại học và nghiên cứu khoa học y dược ứng dụng.',
    totalClasses: 10
  },
  {
    id: 'fac-5',
    code: 'NIIE',
    name: 'Viện Đào tạo Quốc tế NIIE',
    universityCode: 'NTTU',
    deanName: 'TS. Robert Bradley',
    viceDean: 'ThS. Nguyễn Quỳnh Trang',
    email: 'niie@ntt.edu.vn',
    phone: '028 3941 1234',
    office: 'Phòng N.501, Cơ sở 458/3 Huỳnh Tấn Phát, Q.7',
    description: 'Chương trình chuẩn quốc tế 100% tiếng Anh, rèn luyện kỹ năng biện luận chuẩn WUDC.',
    totalClasses: 6
  }
];

export const INITIAL_PERMISSIONS: RolePermissionItem[] = [
  {
    id: 'perm-1',
    name: 'Tham gia Sàn đấu Tranh biện & Làm Case Study',
    category: 'Tranh Biện & Tình Huống',
    description: 'Cho phép tham gia các trận tranh biện đối kháng AI và phân tích tình huống thực tế',
    admin: true,
    lecturer: true,
    staff: true,
    student: true
  },
  {
    id: 'perm-2',
    name: 'Xem Báo cáo Đánh giá Rubric & Radar Chart cá nhân',
    category: 'Đánh Giá & Báo Cáo',
    description: 'Truy cập biểu đồ năng lực 5 chiều và phân tích ngụy biện logic của bản thân',
    admin: true,
    lecturer: true,
    staff: true,
    student: true
  },
  {
    id: 'perm-3',
    name: 'Xem Bảng Xếp Hạng & Thách đấu 1 vs 1',
    category: 'Tranh Biện & Tình Huống',
    description: 'Xem bục vinh quang, thứ hạng mùa giải và gửi lời mời thách đấu',
    admin: true,
    lecturer: true,
    staff: true,
    student: true
  },
  {
    id: 'perm-4',
    name: 'Tạo phòng Tranh Biện Nhóm & Tổng hợp Luận điểm',
    category: 'Tranh Biện & Tình Huống',
    description: 'Khởi tạo phòng tranh biện nhóm, điều phối phiên thảo luận và trích xuất biên bản',
    admin: true,
    lecturer: true,
    staff: true,
    student: true
  },
  {
    id: 'perm-5',
    name: 'Xuất Bảng Điểm Học Thuật Chính Thức (Transcript)',
    category: 'Đánh Giá & Báo Cáo',
    description: 'In ấn hoặc xuất PDF bảng điểm đánh giá năng lực tư duy phản biện',
    admin: true,
    lecturer: true,
    staff: true,
    student: true
  },
  {
    id: 'perm-6',
    name: 'Xem Toàn Bộ Bảng Điểm & Báo Cáo Sinh Viên Cả Lớp',
    category: 'Đánh Giá & Báo Cáo',
    description: 'Theo dõi tiến độ, bảng điểm và radar năng lực của toàn thể sinh viên trong lớp',
    admin: true,
    lecturer: true,
    staff: true,
    student: false
  },
  {
    id: 'perm-7',
    name: 'Chỉnh Sửa Tiêu Chí Rubric & Cố Vấn Luận Điểm',
    category: 'Quản Lý Học Thuật',
    description: 'Hiệu chỉnh trọng số các chiều rubric và cung cấp nhận xét học thuật chuyên sâu',
    admin: true,
    lecturer: true,
    staff: false,
    student: false
  },
  {
    id: 'perm-8',
    name: 'Import / Export Excel Danh Sách Sinh Viên',
    category: 'Hệ Thống & Dữ Liệu',
    description: 'Xuất và nhập dữ liệu sinh viên bằng định dạng Excel .xlsx chuẩn',
    admin: true,
    lecturer: true,
    staff: true,
    student: false
  },
  {
    id: 'perm-9',
    name: 'Thêm / Xóa / Khóa Tài Khoản Sinh Viên & Reset Chỉ Số',
    category: 'Quản Lý Học Thuật',
    description: 'Tạo mới, khóa tạm thời, xóa và đặt lại cấp bậc/rubric/xp/chuỗi sinh viên',
    admin: true,
    lecturer: false,
    staff: true,
    student: false
  },
  {
    id: 'perm-10',
    name: 'Quản Lý Trường, Khoa/Viện, Lớp Học Toàn Hệ Thống',
    category: 'Quản Lý Học Thuật',
    description: 'Toàn quyền chỉnh sửa thông tin trường, khoa/viện, lớp học và phân quyền hệ thống',
    admin: true,
    lecturer: false,
    staff: false,
    student: false
  },
  {
    id: 'perm-11',
    name: 'Cấu hình Ma Trận Phân Quyền Vai Trò (RBAC)',
    category: 'Hệ Thống & Dữ Liệu',
    description: 'Thêm mới quyền hạn, bật/tắt quyền truy cập của từng nhóm vai trò',
    admin: true,
    lecturer: false,
    staff: false,
    student: false
  }
];

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'cls-1', code: '25DKQT1A', name: 'Quản trị kinh doanh 25A', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 14 },
  { id: 'cls-2', code: '25DMK2B', name: 'Marketing 25B', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 10 },
  { id: 'cls-3', code: '25DKQT1B', name: 'Quản trị kinh doanh 25B', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 8 },
  { id: 'cls-4', code: '25DMK1C', name: 'Marketing 25C', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 16 },
  { id: 'cls-5', code: '25DMK1D', name: 'Marketing 25D', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 12 },
  { id: 'cls-6', code: '25DMK2A', name: 'Marketing 25A', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 8 },
  { id: 'cls-7', code: '25DMK2C', name: 'Marketing 25C-N2', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 14 },
  { id: 'cls-8', code: '25DMK2D', name: 'Marketing 25D-N2', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 8 },
  { id: 'cls-9', code: '25DMK1A', name: 'Marketing 25A-N1', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 9 },
  { id: 'cls-10', code: '25DMK1B', name: 'Marketing 25B-N1', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 4 },
  { id: 'cls-11', code: '25DLG2A', name: 'Logistics 25A', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 4 },
  { id: 'cls-12', code: '25DKTS1A', name: 'Kinh tế số 25A', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 3 },
  { id: 'cls-13', code: '25DQN1B', name: 'Quản trị nhân lực 25B', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2024-2028', totalStudents: 1 },
  { id: 'cls-14', code: '24DQN1B', name: 'Quản trị nhân lực 24B', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2023-2027', totalStudents: 2 },
  { id: 'cls-15', code: '24DTD1B', name: 'Thương mại điện tử 24B', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2023-2027', totalStudents: 2 },
  { id: 'cls-16', code: '24DTD2A', name: 'Thương mại điện tử 24A-N2', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2023-2027', totalStudents: 1 },
  { id: 'cls-17', code: '24DTD2C', name: 'Thương mại điện tử 24C-N2', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2023-2027', totalStudents: 1 },
  { id: 'cls-18', code: '24DTD3B', name: 'Thương mại điện tử 24B-N3', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2023-2027', totalStudents: 1 },
  { id: 'cls-19', code: '24DQT1A', name: 'Quản trị kinh doanh 24A', facultyCode: 'FBA', universityCode: 'NTTU', academicYear: '2023-2027', totalStudents: 1 }
];

// Raw 114 students dataset from NTTU
const RAW_STUDENT_ROWS: [number, string, string, string, 'Nam' | 'Nữ', string, string, string, string, string][] = [
  [1, '2500011076', 'Lữ Quỳnh', 'Anh', 'Nữ', '27/10/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011076'],
  [2, '2500017850', 'Cao Hữu', 'Bảo', 'Nam', '05/07/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017850'],
  [3, '2500010598', 'Trần Duy', 'Các', 'Nữ', '26/04/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010598'],
  [4, '2500018254', 'Lê Nguyễn Hải', 'Đăng', 'Nam', '28/03/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018254'],
  [5, '2500017385', 'Nguyễn Phước', 'Đạt', 'Nam', '01/02/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017385'],
  [6, '2500014445', 'Trần Thành', 'Đạt', 'Nam', '14/06/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014445'],
  [7, '2500015798', 'Vũ Văn', 'Đạt', 'Nam', '27/01/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015798'],
  [8, '2500013581', 'Lê Ngọc', 'Diệp', 'Nữ', '14/11/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013581'],
  [9, '2500013930', 'Hà Nguyễn Hương', 'Giang', 'Nữ', '24/04/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013930'],
  [10, '2500018303', 'Nguyễn Ngọc', 'Hà', 'Nữ', '09/11/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018303'],
  [11, '2500014527', 'Nguyễn Thị Thuý', 'Hà', 'Nữ', '11/10/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014527'],
  [12, '2500017871', 'Trần Thị', 'Hà', 'Nữ', '08/05/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017871'],
  [13, '2500013881', 'Phạm Thị Hồng', 'Hạnh', 'Nữ', '08/10/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013881'],
  [14, '2500013708', 'Huỳnh Nguyễn Chí', 'Hiếu', 'Nam', '06/06/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013708'],
  [15, '2500018211', 'Huỳnh Đăng', 'Huy', 'Nam', '14/08/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018211'],
  [16, '2500019379', 'Nguyễn Đức Long', 'Huy', 'Nam', '16/02/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019379'],
  [17, '2500016214', 'Nguyễn Quang', 'Huy', 'Nam', '13/09/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016214'],
  [18, '2500017736', 'Lý Khánh', 'Huyền', 'Nữ', '28/05/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017736'],
  [19, '2500017024', 'Trương Gia', 'Khánh', 'Nam', '16/04/2007', '25DMK2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017024'],
  [20, '2500016265', 'Dương Hiếu', 'Kỷ', 'Nam', '19/06/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016265'],
  [21, '2500018789', 'Phan Thị Ngọc', 'Liên', 'Nữ', '11/12/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018789'],
  [22, '2500014169', 'Danh Bét', 'Lil', 'Nam', '16/11/2006', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014169'],
  [23, '2500014549', 'Trần Thị Thùy', 'Linh', 'Nữ', '29/05/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014549'],
  [24, '2500017603', 'Bùi Thị Khánh', 'Ly', 'Nữ', '25/12/2005', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017603'],
  [25, '2500019598', 'Đinh Võ Thanh', 'Mai', 'Nữ', '05/04/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019598'],
  [26, '2500011101', 'Nguyễn Thị Thanh', 'Ngân', 'Nữ', '18/05/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011101'],
  [27, '2500012155', 'Trịnh Thị Kim', 'Ngân', 'Nữ', '16/05/2007', '25DMK1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500012155'],
  [28, '2500016482', 'Chung Yến', 'Nhi', 'Nữ', '27/08/2007', '25DMK2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016482'],
  [29, '2500018485', 'Đoàn Thị Phương', 'Nhi', 'Nữ', '08/06/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018485'],
  [30, '2500019327', 'Nguyễn Ái', 'Nhi', 'Nữ', '14/04/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019327'],
  [31, '2500019020', 'Trương Quỳnh', 'Như', 'Nữ', '21/08/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019020'],
  [32, '2500014499', 'Lê Như', 'Phụng', 'Nữ', '17/11/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014499'],
  [33, '2500019233', 'Trần Thị', 'Phương', 'Nữ', '06/12/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019233'],
  [34, '2500016702', 'Đoàn Anh', 'Quân', 'Nam', '25/12/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016702'],
  [35, '2500016739', 'Ngô Hồ Đăng', 'Quang', 'Nam', '20/01/2007', '25DMK2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016739'],
  [36, '2500017281', 'Nguyễn Việt', 'Quốc', 'Nam', '02/12/2007', '25DMK2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017281'],
  [37, '2500018745', 'Đỗ Ngọc', 'Quý', 'Nam', '18/06/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018745'],
  [38, '2500018273', 'Nguyễn Diễm', 'Quyền', 'Nữ', '23/01/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018273'],
  [39, '2500010626', 'Đỗ Như', 'Quỳnh', 'Nữ', '12/04/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010626'],
  [40, '2500011016', 'Đoàn Lê Như', 'Quỳnh', 'Nữ', '04/12/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011016'],
  [41, '2500019351', 'Trịnh Thị Thu', 'Sương', 'Nữ', '02/10/2007', '25DQN1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019351'],
  [42, '2500019422', 'Nguyễn Minh', 'Thanh', 'Nữ', '15/02/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019422'],
  [43, '2500016732', 'Phạm Đình', 'Thành', 'Nam', '21/02/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016732'],
  [44, '2500018004', 'Cao Bích Phương', 'Thảo', 'Nữ', '13/03/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018004'],
  [45, '2500019786', 'Nguyễn Thị Phương', 'Thịnh', 'Nữ', '30/11/2005', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019786'],
  [46, '2500018113', 'Ngô Anh', 'Thư', 'Nữ', '30/12/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018113'],
  [47, '2500018499', 'Nguyễn Thị Anh', 'Thư', 'Nữ', '31/01/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500018499'],
  [48, '2500012479', 'Phạm Đỗ Thị Minh', 'Thư', 'Nữ', '16/11/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500012479'],
  [49, '2500017034', 'Nguyễn Ngọc Mỹ', 'Thuy', 'Nữ', '24/08/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017034'],
  [50, '2500019375', 'Hồ Phương', 'Thuý', 'Nữ', '09/07/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019375'],
  [51, '2500019306', 'Bùi Huỳnh', 'Trâm', 'Nữ', '25/10/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019306'],
  [52, '2500016058', 'Trần Thị Ngọc', 'Trâm', 'Nữ', '03/05/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016058'],
  [53, '2500014707', 'Huỳnh Thị Phương', 'Trinh', 'Nữ', '11/11/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014707'],
  [54, '2500019337', 'Trần Ngọc Phương', 'Trinh', 'Nữ', '17/01/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019337'],
  [55, '2500015457', 'Nguyễn', 'Trọng', 'Nam', '20/12/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015457'],
  [56, '2500014818', 'Trần Khắc', 'Trọng', 'Nam', '14/10/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014818'],
  [57, '2500017570', 'Phạm Nguyễn Nhật', 'Trường', 'Nam', '19/06/2007', '25DMK2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017570'],
  [58, '2500014204', 'Trần Hoàng Mỹ', 'Uyên', 'Nữ', '13/10/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014204'],
  [59, '2500016811', 'Lý Ngọc Thanh', 'Xuân', 'Nữ', '08/12/2007', '25DMK2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016811'],
  [60, '2400005648', 'Đoàn Lê Phi', 'Yến', 'Nữ', '24/10/2006', '24DQN1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400005648'],
  [61, '2500015230', 'Trương Thị Châu', 'An', 'Nữ', '11/02/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015230'],
  [62, '2500015198', 'Cao Bích Trâm', 'Anh', 'Nữ', '09/09/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015198'],
  [63, '2500020151', 'Cao Lương Ngọc', 'Anh', 'Nữ', '19/03/2007', '25DMK2D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500020151'],
  [64, '2500020212', 'Đặng Quỳnh', 'Anh', 'Nữ', '01/01/2007', '25DMK2D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500020212'],
  [65, '2500015991', 'Hoàng Phương', 'Anh', 'Nữ', '10/02/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015991'],
  [66, '2400008717', 'Lê Hồng', 'Anh', 'Nữ', '24/02/2005', '24DTD2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400008717'],
  [67, '2500010078', 'Phan Bùi Ngọc', 'Anh', 'Nữ', '16/03/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010078'],
  [68, '2400006776', 'Nguyễn Lê Ngọc', 'Ánh', 'Nữ', '11/12/2006', '24DTD1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400006776'],
  [69, '2500011237', 'Phan Khánh', 'Băng', 'Nữ', '14/12/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011237'],
  [70, '2500010889', 'Phạm Hồng Mai', 'Chi', 'Nữ', '31/08/2005', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010889'],
  [71, '2500021269', 'Nguyễn Ngọc', 'Cúc', 'Nữ', '15/09/2007', '25DLG2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500021269'],
  [72, '2500019097', 'Lê Văn', 'Đông', 'Nam', '12/04/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019097'],
  [73, '2500016143', 'Nguyễn Ngọc Khánh', 'Du', 'Nữ', '20/01/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016143'],
  [74, '2500019588', 'Lê Huỳnh', 'Đức', 'Nam', '31/01/2004', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019588'],
  [75, '2500012597', 'Nguyễn Thị Mỹ', 'Duyên', 'Nữ', '14/06/2007', '25DMK1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500012597'],
  [76, '2500019765', 'Phan Cao Trung', 'Hiếu', 'Nam', '02/01/2007', '25DMK2C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019765'],
  [77, '2500013809', 'Nguyễn Quang', 'Huy', 'Nam', '13/02/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013809'],
  [78, '2400001966', 'Tiêu Anh', 'Khoa', 'Nam', '07/03/2006', '24DTD2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400001966'],
  [79, '2500014824', 'Trần Nguyễn Bảo', 'Khuyên', 'Nữ', '03/05/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014824'],
  [80, '2400008924', 'Võ Đức', 'Kiệt', 'Nam', '10/03/2006', '24DQN1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400008924'],
  [81, '2500010533', 'Nguyễn Hoàng Tuyết', 'Linh', 'Nữ', '19/05/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010533'],
  [82, '2500014867', 'Võ Nguyễn Kiều', 'Linh', 'Nữ', '22/10/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014867'],
  [83, '2500013749', 'Ngô Phạm Thành', 'Long', 'Nam', '06/06/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013749'],
  [84, '2500014945', 'Đặng Thị Diệu', 'Mi', 'Nữ', '14/11/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014945'],
  [85, '2500021200', 'Trần Thị Diễm', 'My', 'Nữ', '23/05/2006', '25DLG2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500021200'],
  [86, '2500014367', 'Phạm Ân', 'Ngọc', 'Nữ', '02/11/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014367'],
  [87, '2500020395', 'Nguyễn Thị Minh', 'Nguyệt', 'Nữ', '21/02/2007', '25DMK2D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500020395'],
  [88, '2500021299', 'Phan Ngọc Phương', 'Nhi', 'Nữ', '12/03/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500021299'],
  [89, '2400006883', 'Trần Lan', 'Nhi', 'Nữ', '20/10/2006', '24DTD3B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400006883'],
  [90, '2500011771', 'Hồ Thị Tâm', 'Như', 'Nữ', '09/11/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011771'],
  [91, '2500015374', 'Hoàng Ngọc Quỳnh', 'Như', 'Nữ', '26/02/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015374'],
  [92, '2500017938', 'Nguyễn Ngọc Quỳnh', 'Như', 'Nữ', '26/07/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017938'],
  [93, '2411553417', 'Võ Thị Diệu', 'Oanh', 'Nữ', '03/03/2006', '24DQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2411553417'],
  [94, '2500013556', 'Vũ Đình', 'Phát', 'Nam', '24/04/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013556'],
  [95, '2500011330', 'Trần Tiến', 'Phong', 'Nam', '25/07/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011330'],
  [96, '2500020660', 'Vũ Tiến', 'Phong', 'Nam', '20/09/2007', '25DMK2D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500020660'],
  [97, '2500016211', 'Đinh Thị', 'Phương', 'Nữ', '21/11/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016211'],
  [98, '2500014720', 'Nguyễn Phạm Ái', 'Quyên', 'Nữ', '03/05/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014720'],
  [99, '2500013406', 'Nguyễn Thị Tuyết', 'Sang', 'Nữ', '12/09/2007', '25DMK1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500013406'],
  [100, '2500020455', 'Ninh Nguyễn Quang', 'Sơn', 'Nam', '24/03/2007', '25DKTS1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500020455'],
  [101, '2500017428', 'Lê Phát', 'Tài', 'Nam', '15/11/2005', '25DKTS1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017428'],
  [102, '2500009886', 'Nguyễn Mỹ', 'Tâm', 'Nữ', '27/08/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500009886'],
  [103, '2500017646', 'Trần Thanh', 'Thảo', 'Nữ', '03/01/2007', '25DMK2B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017646'],
  [104, '2500014787', 'Hồ Uyên', 'Thư', 'Nữ', '19/02/2007', '25DMK1C', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500014787'],
  [105, '2500017787', 'Nguyễn Huy', 'Thuần', 'Nam', '02/11/2007', '25DKQT1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500017787'],
  [106, '2500016530', 'Đinh Anh', 'Tiến', 'Nam', '13/11/2007', '25DKTS1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016530'],
  [107, '2400007042', 'Lê Thùy', 'Trang', 'Nữ', '04/10/2006', '24DTD1B', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2400007042'],
  [108, '2500015243', 'Nguyễn Huyền', 'Trang', 'Nữ', '14/08/2007', '25DKQT1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500015243'],
  [109, '2500020312', 'Trần Thị Thu', 'Trang', 'Nữ', '29/03/2007', '25DMK2D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500020312'],
  [110, '2500016223', 'Lục Viễn', 'Trinh', 'Nữ', '05/09/2007', '25DMK1D', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500016223'],
  [111, '2500019846', 'Phạm Nguyên', 'Tường', 'Nam', '28/11/2007', '25DLG2A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500019846'],
  [112, '2500010795', 'Lâm Bích', 'Tuyền', 'Nữ', '08/04/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010795'],
  [113, '2500011019', 'Đậu Thị Hồng', 'Vy', 'Nữ', '12/02/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500011019'],
  [114, '2500010370', 'Trần Thị Thảo', 'Yên', 'Nữ', '13/12/2007', '25DMK1A', 'Khoa Quản trị kinh doanh', 'Trường Đại học Nguyễn Tất Thành (NTTU)', '2500010370']
];

function calculateTier(xp: number, rubricAvg: number): 'Bậc Thầy Socrates' | 'Bạch Kim Rhetor' | 'Vàng Scholar' | 'Bạc Dialectic' | 'Đồng Debater' {
  if (xp >= 3000 && rubricAvg >= 90) return 'Bậc Thầy Socrates';
  if (xp >= 2000 && rubricAvg >= 82) return 'Bạch Kim Rhetor';
  if (xp >= 1200 && rubricAvg >= 75) return 'Vàng Scholar';
  if (xp >= 500 && rubricAvg >= 65) return 'Bạc Dialectic';
  return 'Đồng Debater';
}

export const ADMIN_USER: Student = {
  id: 'admin-master',
  studentId: 'admin',
  lastName: 'Ban',
  firstName: 'Quản Trị',
  fullName: 'Quản Trị Viên Hệ Thống (Admin)',
  gender: 'Nam',
  birthDate: '01/01/1990',
  className: 'BAN-QUAN-TRI',
  faculty: 'Hội đồng Học thuật & Quản trị',
  university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
  password: 'admin',
  status: 'active',
  role: 'admin',
  tier: 'Bậc Thầy Socrates',
  xp: 9999,
  streakDays: 30,
  rubricAverage: 98,
  totalDebates: 50,
  casesAnalyzed: 40,
  rubricScores: {
    logic: 98,
    evidence: 96,
    rebuttal: 99,
    toulmin: 98,
    multiPerspective: 97
  }
};

export const INITIAL_STUDENTS: Student[] = [
  ADMIN_USER,
  ...RAW_STUDENT_ROWS.map((row, idx) => {
  const [stt, studentId, lastName, firstName, gender, birthDate, className, faculty, university, password] = row;
  const fullName = `${lastName} ${firstName}`;
  
  // Seed realistic dialectic scores and progression
  const baseScore = 65 + ((idx * 7) % 31); // 65 - 95
  const xp = 350 + ((idx * 93) % 3100);
  const totalDebates = 3 + (idx % 18);
  const casesAnalyzed = 2 + (idx % 12);
  const streakDays = (idx % 22) + 1;
  const rubricAvg = Math.min(96, Math.max(68, Math.round(baseScore)));

  const tier = calculateTier(xp, rubricAvg);

  return {
    id: `student-${stt}`,
    studentId,
    lastName,
    firstName,
    fullName,
    gender,
    birthDate,
    className,
    faculty,
    university,
    password: password || studentId,
    status: 'active' as const,
    role: 'student' as const,
    tier,
    xp,
    streakDays,
    rubricAverage: rubricAvg,
    totalDebates,
    casesAnalyzed,
    rubricScores: {
      logic: Math.min(98, Math.max(65, rubricAvg + ((idx % 5) - 2) * 2)),
      evidence: Math.min(98, Math.max(65, rubricAvg + (((idx + 1) % 5) - 2) * 2)),
      rebuttal: Math.min(98, Math.max(65, rubricAvg + (((idx + 2) % 5) - 2) * 2)),
      toulmin: Math.min(98, Math.max(65, rubricAvg + (((idx + 3) % 5) - 2) * 2)),
      multiPerspective: Math.min(98, Math.max(65, rubricAvg + (((idx + 4) % 5) - 2) * 2)),
    }
  };
})];

export const INITIAL_TOPICS: DebateTopic[] = [
  {
    id: 'topic-1',
    title: 'Bản quyền & Quyền tác giả cho Tác phẩm tạo bởi Trí tuệ nhân tạo (AI Generative)',
    description: 'Liệu các sản phẩm văn học, mỹ thuật và âm nhạc do mô hình AI tạo ra có nên được cấp quyền sở hữu trí tuệ tương đương với con người hay thuộc về phạm vi công cộng?',
    format: 'Oxford',
    difficulty: 'Trung cấp',
    category: 'Đạo đức Công nghệ & Luật học',
    round1Prompt: 'Hiệp 1: Trình bày định nghĩa AI tác quyền, xây dựng luận cứ nền tảng (Grounds & Claims) về đóng góp trí tuệ con người vs. thuật toán tự động.',
    round2Prompt: 'Hiệp 2: Phản biện luận điểm đối phương và giải quyết 1 câu hỏi chất vấn chéo (POI) từ Hội đồng phản biện.',
    round3Prompt: 'Hiệp 3: Tổng kết, chốt hạ trọng số pháp lý & kinh tế văn hóa sáng tạo trong kỷ nguyên số.'
  },
  {
    id: 'topic-2',
    title: 'Cơ chế điều chỉnh biên giới Carbon (CBAM) của EU đối với các nền kinh tế đang phát triển',
    description: 'CBAM là động lực thúc đẩy chuyển đổi xanh toàn cầu hay là một hình thức bảo hộ thương mại trá hình gây bất bình đẳng cho các quốc gia đang phát triển?',
    format: 'Parliamentary WUDC',
    difficulty: 'Nâng cao',
    category: 'Kinh tế Quốc tế & Môi trường',
    round1Prompt: 'Hiệp 1: Xây dựng khung phân tích chi phí ngoại ứng carbon, gánh nặng chuyển đổi công nghệ và tính hợp lý của CBAM.',
    round2Prompt: 'Hiệp 2: Tấn công trực diện vào tính khả thi, phân tích rủi ro dịch chuyển chuỗi cung ứng và tác động tới SME.',
    round3Prompt: 'Hiệp 3: So sánh lợi ích dài hạn của trung hòa phát thải (Net Zero) với áp lực sinh kế ngắn hạn.'
  },
  {
    id: 'topic-3',
    title: 'Chỉnh sửa gen phôi thai người vì mục đích nâng cao năng lực (Human Germline Enhancement)',
    description: 'Công nghệ CRISPR-Cas9 nên được giới hạn nghiêm ngặt ở điều trị bệnh di truyền nan y hay mở rộng cho việc tối ưu hóa trí tuệ và thể chất con người?',
    format: 'Karl Popper',
    difficulty: 'Bậc thầy',
    category: 'Y sinh học & Triết học Đạo đức',
    round1Prompt: 'Hiệp 1: Thiết lập tiền đề luân lý về quyền tự quyết của cá nhân vs. rủi ro phân hóa giai cấp di truyền (Genetic Stratification).',
    round2Prompt: 'Hiệp 2: Phản bác nguy cơ hiệu ứng trượt dốc (Slippery Slope) và đề xuất cơ chế kiểm soát liên chính phủ.',
    round3Prompt: 'Hiệp 3: Đưa ra phán quyết đạo đức sau cùng về giới hạn can thiệp của khoa học vào bản chất sinh học con người.'
  },
  {
    id: 'topic-4',
    title: 'Bãi bỏ hình thức thi viết truyền thống, chuyển 100% sang Vấn đáp & Biện luận trực tiếp',
    description: 'Trước sự bùng nổ của các công cụ làm bài tự động, liệu thi vấn đáp và bảo vệ đề án có phải là giải pháp duy nhất đánh giá thực chất năng lực sinh viên đại học?',
    format: 'Oxford',
    difficulty: 'Nhập môn',
    category: 'Giáo dục Đại học',
    round1Prompt: 'Hiệp 1: Đánh giá độ tin cậy của bài thi viết trong kỷ nguyên AI và khả năng đo lường tư duy phản biện thời gian thực.',
    round2Prompt: 'Hiệp 2: Phản biện tính công bằng, vấn đề tâm lý phòng thi và chi phí nhân lực tổ chức của phương thức vấn đáp.',
    round3Prompt: 'Hiệp 3: Tổng hợp mô hình đánh giá lai (Hybrid Assessment) tối ưu cho đại học hiện đại.'
  }
];

export const INITIAL_CASES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Khủng hoảng Thuật toán Tuyển dụng Tự động tại NovaTech Solutions',
    industry: 'Công nghệ & Quản trị Nhân sự',
    context: 'Tập đoàn NovaTech triển khai hệ thống AI sàng lọc hồ sơ CV của 200,000 ứng viên. Sau 1 năm, báo cáo kiểm toán nội bộ phát hiện tỷ lệ ứng viên nữ được mời phỏng vấn vị trí kỹ sư trưởng giảm 68% do thuật toán học từ dữ liệu tuyển dụng lịch sử 10 năm trước. Ban điều hành đứng trước áp lực lớn từ công đoàn, báo chí và hội đồng cổ đông.',
    stakeholders: [
      { group: 'Ứng viên nữ & Công đoàn', interest: 'Công bằng cơ hội việc làm, bồi thường thiệt hại và minh bạch thuật toán', powerLevel: 'Trung bình', concern: 'Bị phân biệt đối xử hệ thống qua "hộp đen" thuật toán' },
      { group: 'Ban Giám đốc (CEO & CTO)', interest: 'Duy trì tốc độ tuyển dụng, uy tín cổ phiếu và chi phí bảo hành phần mềm', powerLevel: 'Cao', concern: 'Khủng hoảng truyền thông và rủi ro kiện tụng tập thể' },
      { group: 'Đội ngũ Kỹ sư AI', interest: 'Tự do kỹ thuật, bảo vệ mô hình học máy và giải trình khoa học', powerLevel: 'Thấp', concern: 'Bị đổ lỗi cho dữ liệu lịch sử thiên lệch' },
      { group: 'Khách hàng & Đối tác Doanh nghiệp', interest: 'Đảm bảo tuân thủ tiêu chuẩn ESG và đạo đức kinh doanh', powerLevel: 'Cao', concern: 'Hình ảnh thương hiệu bị liên đới' }
    ],
    ethicalDilemma: 'Nên tạm dừng toàn bộ hệ thống để đại tu (thiệt hại hàng triệu USD và chậm trễ dự án) hay vá lỗi dần dần trong khi vẫn tiếp tục sử dụng để giữ nhịp độ kinh doanh?',
    guidingQuestions: [
      '1. Trách nhiệm đạo đức thuộc về lập trình viên, ban giám đốc hay tập dữ liệu lịch sử?',
      '2. Làm thế nào để loại bỏ thiên kiến mà không làm suy giảm độ chính xác dự báo kỹ năng?',
      '3. Giải pháp công bố thông tin nào vừa minh bạch vừa bảo vệ bí mật kinh doanh?'
    ],
    suggestedBiases: ['Thiên kiến xác nhận (Confirmation Bias)', 'Ngụy biện chi phí chìm (Sunk Cost Fallacy)', 'Hiệu ứng hào quang kỹ thuật (Technological Halo Effect)']
  },
  {
    id: 'case-2',
    title: 'Dự án Thủy điện Sông Xanh: Năng lượng Tái tạo vs. Di sản Văn hóa Bản địa',
    industry: 'Năng lượng, Môi trường & Nhân học',
    context: 'Tỉnh miền núi phê duyệt dự án thủy điện 150MW nhằm cung cấp năng lượng sạch và thúc đẩy công nghiệp địa phương. Tuy nhiên, lòng hồ thủy điện sẽ nhấn chìm 3 ngôi làng cổ có tuổi đời 400 năm của người dân tộc thiểu số cùng khu rừng linh thiêng mang ý nghĩa tâm linh sâu sắc.',
    stakeholders: [
      { group: 'Cộng đồng bản địa', interest: 'Bảo tồn không gian sinh tồn, mộ phần tổ tiên và bản sắc văn hóa', powerLevel: 'Thấp', concern: 'Mất gốc văn hóa và sinh kế truyền thống khi bị tái định cư' },
      { group: 'Tập đoàn Năng lượng Xanh', interest: 'Lợi nhuận đầu tư, hoàn thành cam kết tín chỉ carbon', powerLevel: 'Cao', concern: 'Tiến độ thi công bị đình trệ phát sinh lãi vay ngân hàng' },
      { group: 'Chính quyền Tỉnh', interest: 'Tăng trưởng GRDP, nguồn thu ngân sách và điện năng cho khu công nghiệp', powerLevel: 'Cao', concern: 'Thiếu hụt điện ảnh hưởng thu hút FDI' },
      { group: 'Các tổ chức Môi trường & UNESCO', interest: 'Bảo tồn đa dạng sinh học và di sản văn hóa phi vật thể', powerLevel: 'Trung bình', concern: 'Sự biến mất vĩnh viễn của kho tàng tri thức bản địa' }
    ],
    ethicalDilemma: 'Lợi ích của đa số (hàng triệu người cần điện sạch) có quyền đánh đổi quyền thiêng liêng của thiểu số (vài trăm hộ dân bản địa)?',
    guidingQuestions: [
      '1. Áp dụng thuyết Lợi ích (Utilitarianism) và thuyết Bổn phận (Deontology) vào trường hợp này sẽ dẫn đến các kết luận trái ngược nhau ra sao?',
      '2. Đền bù kinh tế có bao giờ bù đắp được giá trị văn hóa và ký ức lịch sử?',
      '3. Có phương án thỏa hiệp công nghệ nào (ví dụ: chuyển sang điện mặt trời nổi, giảm cốt ngập lòng hồ)?'
    ],
    suggestedBiases: ['Ngụy biện Nhị nguyên giả (False Dilemma)', 'Thiên kiến vị kỷ nhóm (In-group Bias)', 'Hiệu ứng chiết khấu tương lai (Present Bias)']
  }
];

export const INITIAL_GROUP_ROOMS: GroupRoom[] = [
  {
    id: 'room-1',
    code: 'CTX-7842',
    title: 'Tranh Biện Bản Quyền AI Sáng Tạo - Khóa 25 ĐH NTTU',
    topicType: 'debate',
    format: 'Oxford Team Debate 3 vs 3',
    createdAt: '2026-10-04T14:30:00Z',
    status: 'active',
    members: [
      {
        id: 'sub-1',
        studentId: '2500011076',
        studentName: 'Lữ Quỳnh Anh',
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: 'Pro',
        roleInTeam: 'Chủ tọa mở màn (Prime Minister)',
        speechContent: 'Kính thưa hội đồng, chúng tôi khẳng định các tác phẩm tạo bởi AI kết hợp với chỉ lệnh của con người phải được công nhận quyền tác giả liên danh. Con người là người lên ý tưởng, tinh chỉnh prompt qua hàng trăm bước lặp và lựa chọn kết quả. Phủ nhận điều này sẽ kìm hãm dòng vốn đầu tư vào công nghệ văn hóa số.',
        wordCount: 58,
        submittedAt: '2026-10-04T15:10:00Z',
        rubricScore: {
          overallScore: 88,
          dimensionScores: { logic: 90, evidence: 85, rebuttal: 86, toulmin: 91, multiPerspective: 88 },
          dimensionFeedback: {
            logic: 'Mạch lập luận rõ ràng, liên kết tốt giữa công sức con người và giá trị sản phẩm cuối.',
            evidence: 'Cần bổ sung án lệ từ Tòa án Bản quyền Hoa Kỳ hoặc Đạo luật AI của EU.',
            rebuttal: 'Đã phòng bị trước nguy cơ lạm dụng sao chép phong cách nghệ sĩ.',
            toulmin: 'Cấu trúc Claim - Grounds rất vững, Warrant thuyết phục.',
            multiPerspective: 'Nên xem xét thêm góc nhìn của các nghệ sĩ truyền thống.'
          },
          fallaciesDetected: [],
          toulminRecommendation: {
            claim: 'Tác phẩm AI cần có bản quyền phái sinh có thời hạn.',
            grounds: 'Dữ liệu cho thấy 74% tác phẩm thương mại hiện nay đều có sự tham gia của công cụ AI.',
            warrant: 'Sự sáng tạo được đo bằng ý niệm và định hướng thẩm mỹ chứ không chỉ là thao tác cơ học.',
            backing: 'Quy chế bản quyền nhiếp ảnh năm 1884 (Burrow-Giles v. Sarony) cũng từng thừa nhận máy ảnh là công cụ sáng tác của con người.',
            rebuttal: 'Trừ trường hợp AI tạo nội dung hoàn toàn tự phát không có bất kỳ sự can thiệp có ý nghĩa nào của con người.'
          },
          devilsAdvocateChallenge: 'Nếu thuật toán học trên hàng tỷ tác phẩm có bản quyền chưa được xin phép, liệu việc cấp bản quyền mới có phải là hành vi rửa dữ liệu lậu?',
          microExercises: ['Luyện tập bóc tách khái niệm Trí tuệ con người vs Tự động hóa', 'Phân tích án lệ bản quyền nhiếp ảnh 1884']
        }
      },
      {
        id: 'sub-2',
        studentId: '2500017850',
        studentName: 'Cao Hữu Bảo',
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: 'Con',
        roleInTeam: 'Lãnh đạo phe đối lập (Leader of Opposition)',
        speechContent: 'Thưa hội đồng, phe ủng hộ đã nhầm lẫn tai hại giữa "công cụ trợ giúp" và "thực thể sáng tạo". Việc gõ một câu lệnh văn bản không thể xem là hành vi sáng tạo nghệ thuật. Cho phép cấp bản quyền cho AI sẽ dẫn đến tình trạng độc quyền hàng loạt, giết chết toàn bộ giới nghệ sĩ độc lập và làm tràn ngập thị trường bằng rác nội dung tổng hợp.',
        wordCount: 71,
        submittedAt: '2026-10-04T15:25:00Z',
        rubricScore: {
          overallScore: 86,
          dimensionScores: { logic: 88, evidence: 82, rebuttal: 92, toulmin: 84, multiPerspective: 84 },
          dimensionFeedback: {
            logic: 'Đòn phản biện sắc bén vào định nghĩa lao động sáng tạo.',
            evidence: 'Dẫn chứng về làn sóng đình công của các biên kịch Hollywood rất kịp thời.',
            rebuttal: 'Bẻ gãy tiền đề coi Prompt engineering tương đương với nghệ thuật thị giác.',
            toulmin: 'Warrant mạnh mẽ nhưng kết luận có xu hướng hơi phóng đại hậu quả.',
            multiPerspective: 'Cần nhìn nhận khía cạnh hỗ trợ người khuyết tật sáng tạo nghệ thuật.'
          },
          fallaciesDetected: [
            {
              name: 'Slippery Slope',
              viName: 'Ngụy biện Dốc trượt',
              quote: 'dẫn đến tình trạng độc quyền hàng loạt, giết chết toàn bộ giới nghệ sĩ độc lập và làm tràn ngập thị trường bằng rác nội dung tổng hợp',
              explanation: 'Phóng đại dây chuyền hậu quả tiêu cực mà không chứng minh được tính tất yếu của từng bước trung gian.',
              severity: 'medium'
            }
          ],
          toulminRecommendation: {
            claim: 'Nội dung thuần AI phải được xếp vào Miền công cộng (Public Domain).',
            grounds: 'Cơ quan Bản quyền Hoa Kỳ (USCO) đã liên tục từ chối cấp quyền tác giả cho các tác phẩm sinh bởi Midjourney.',
            warrant: 'Bản quyền sinh ra để bảo vệ phẩm giá và sinh kế của con người sáng tạo.',
            backing: 'Hiến chương Nhân quyền và Công ước Berne đều đặt con người làm trung tâm của quyền tác giả.',
            rebuttal: 'Chỉ chấp nhận bản quyền với phần chỉnh sửa thủ công bổ sung có dấu ấn rõ rệt.'
          },
          devilsAdvocateChallenge: 'Nếu không có cơ chế bảo hộ, các doanh nghiệp sẽ giữ kín thuật toán và tác phẩm AI dưới dạng bí mật thương mại, làm giảm tính cởi mở của tri thức số.',
          microExercises: ['Nhận diện và hóa giải ngụy biện dốc trượt', 'Xây dựng thang đo đóng góp con người']
        }
      },
      {
        id: 'sub-3',
        studentId: '2500010598',
        studentName: 'Trần Duy Các',
        university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
        side: 'Independent',
        roleInTeam: 'Hội đồng phản biện độc lập (Independent Analyst)',
        speechContent: 'Tôi đề xuất mô hình Dung hòa thứ ba: Không cấp bản quyền độc quyền nhân thân truyền thống (Moral Rights) nhưng cấp Quyền kinh tế phái sinh có giới hạn (Sui Generis Economic Right) trong 5 năm, với điều kiện phải trích nộp 10% doanh thu vào Quỹ Hỗ trợ Nghệ thuật Cộng đồng để bù đắp cho tập dữ liệu bị khai thác.',
        wordCount: 65,
        submittedAt: '2026-10-04T15:40:00Z',
        rubricScore: {
          overallScore: 92,
          dimensionScores: { logic: 94, evidence: 90, rebuttal: 92, toulmin: 93, multiPerspective: 95 },
          dimensionFeedback: {
            logic: 'Tư duy tổng hợp đa chiều vượt lên trên thế nhị nguyên Pro vs Con.',
            evidence: 'Tham chiếu khéo léo tới mô hình Sui Generis cho cơ sở dữ liệu của châu Âu.',
            rebuttal: 'Hóa giải được cả nỗi lo của phe đối lập lẫn nguyện vọng bảo hộ của phe ủng hộ.',
            toulmin: 'Cấu trúc hoàn hảo từ tiền đề tới giải pháp bồi hoàn xã hội.',
            multiPerspective: 'Cân bằng tuyệt vời giữa động lực thị trường và công bằng xã hội.'
          },
          fallaciesDetected: [],
          toulminRecommendation: {
            claim: 'Thiết lập khung pháp lý đặc thù Sui Generis 5 năm cho sản phẩm AI.',
            grounds: 'Kinh nghiệm quản lý vệ tinh phát sóng và bản quyền cơ sở dữ liệu số thập niên 1990.',
            warrant: 'Đổi mới công nghệ đòi hỏi cơ chế sở hữu trí tuệ linh hoạt thay vì áp đặt khung luật cổ điển.',
            backing: 'Nghị quyết của Nghị viện Châu Âu về Trách nhiệm Dân sự đối với Trí tuệ Nhân tạo.',
            rebuttal: 'Áp dụng ngoại lệ cho các dự án nghiên cứu học thuật phi lợi nhuận.'
          },
          devilsAdvocateChallenge: 'Làm thế nào để xác minh một tác phẩm có sử dụng AI hay không khi các công cụ ngụy trang văn phong ngày càng tinh vi?',
          microExercises: ['Luyện thiết kế giải pháp bên thứ ba (Third-way Compromise)', 'Kỹ năng thiết lập quỹ bồi hoàn sở hữu trí tuệ']
        }
      }
    ],
    comparativeSynthesis: {
      rankings: [
        {
          studentId: '2500010598',
          studentName: 'Trần Duy Các',
          score: 92,
          badge: 'Tầm Nhìn Đa Chiều & Kiến Tạo Giải Pháp',
          highlight: 'Đột phá tư duy với mô hình Sui Generis 5 năm và Quỹ bù đắp dữ liệu cộng đồng.'
        },
        {
          studentId: '2500011076',
          studentName: 'Lữ Quỳnh Anh',
          score: 88,
          badge: 'Cấu Trúc Toulmin & Tiền Đề Chặt Chẽ',
          highlight: 'Xây dựng mối liên hệ lịch sử với án lệ nhiếp ảnh 1884 xuất sắc.'
        },
        {
          studentId: '2500017850',
          studentName: 'Cao Hữu Bảo',
          score: 86,
          badge: 'Phản Biện Sắc Bén & Tấn Công Trọng Tâm',
          highlight: 'Bóc tách ranh giới bản chất sáng tạo con người vs mô hình ngôn ngữ lớn.'
        }
      ],
      rubricMatrix: [
        {
          category: 'Logic & Chuỗi suy luận',
          scores: { '2500010598': 94, '2500011076': 90, '2500017850': 88 },
          bestStudentId: '2500010598',
          reason: 'Lập luận không rơi vào bẫy tuyệt đối hóa, xây dựng chuỗi giải pháp thực tiễn.'
        },
        {
          category: 'Chất lượng Dẫn chứng',
          scores: { '2500010598': 90, '2500011076': 85, '2500017850': 82 },
          bestStudentId: '2500010598',
          reason: 'Áp dụng tiền lệ pháp lý Sui Generis châu Âu rất tương thích.'
        },
        {
          category: 'Phản biện Rebuttal',
          scores: { '2500010598': 92, '2500011076': 86, '2500017850': 92 },
          bestStudentId: '2500017850',
          reason: 'Tấn công dứt khoát vào tiền đề coi việc nhập prompt là hành vi sáng tác nghệ thuật.'
        },
        {
          category: 'Cấu trúc Toulmin',
          scores: { '2500010598': 93, '2500011076': 91, '2500017850': 84 },
          bestStudentId: '2500010598',
          reason: 'Đầy đủ cả 5 thành phần, có Rebuttal mở rộng cho khối nghiên cứu phi thương mại.'
        },
        {
          category: 'Tầm nhìn Đa chiều',
          scores: { '2500010598': 95, '2500011076': 88, '2500017850': 84 },
          bestStudentId: '2500010598',
          reason: 'Giải quyết cùng lúc bài toán kinh tế số của doanh nghiệp và quyền lợi nghệ sĩ bị khai thác.'
        }
      ],
      consensusPoints: [
        'Cả 3 thành viên đều thống nhất rằng việc gõ câu lệnh đơn giản không thể được trao quyền tác giả vĩnh viễn (Life + 70 years) như tác phẩm con người.',
        'Đồng thuận rằng cần có cơ chế trích xuất lợi nhuận để hỗ trợ cộng đồng nghệ sĩ có tác phẩm bị cào dữ liệu huấn luyện.',
        'Thừa nhận tính cấp thiết của khung pháp lý mới để tránh tranh chấp bản quyền làm tê liệt ngành công nghiệp phần mềm.'
      ],
      divergencePoints: [
        'Phe Ủng hộ (Quỳnh Anh) muốn bảo hộ quyền kinh tế tức thì để kích cầu công nghệ, trong khi Phe Phản đối (Hữu Bảo) lo ngại rủi ro độc quyền nội dung.',
        'Mâu thuẫn về việc liệu có nên thừa nhận "Ý niệm tạo sinh" là một hình thức biểu đạt được pháp luật bảo vệ hay không.'
      ],
      masterSynthesis: 'Bản Luận Điểm Nhóm Toàn Bích: "Hệ thống sở hữu trí tuệ hiện đại cần từ bỏ lối tư duy nhị nguyên (Toàn quyền hoặc Hoàn toàn không bản quyền). Chúng tôi đề xuất cơ chế Bản Quyền Phái Sinh Có Kỳ Hạn (5 năm) dành cho các sản phẩm có sự phối hợp đáng kể giữa con người và AI. Điều kiện tiên quyết là nhà sản xuất phải minh bạch nguồn dữ liệu huấn luyện và nộp 10% doanh thu bản quyền vào Quỹ Tái đầu tư Văn hóa Cộng đồng. Giải pháp này vừa thúc đẩy ứng dụng công nghệ, vừa bảo vệ công bằng xã hội và ngăn chặn nguy cơ ngụy biện dốc trượt."'
    }
  }
];

export const INITIAL_QUESTS: DailyQuest[] = [
  { id: 'quest-1', title: 'Hoàn thành 1 hiệp phản biện trên Sàn Đấu Oxford', rewardXp: 120, completed: false, category: 'debate' },
  { id: 'quest-2', title: 'Phân tích Ma trận Các bên liên quan cho Case NovaTech', rewardXp: 150, completed: false, category: 'case' },
  { id: 'quest-3', title: 'Bóc tách ít nhất 1 lỗi ngụy biện trong phần thi đối kháng', rewardXp: 80, completed: true, category: 'fallacy' }
];
