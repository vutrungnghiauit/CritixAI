import React, { useState, useRef } from 'react';
import { Student, University, Faculty, ClassItem, DialecticTier, UserRole, RolePermissionItem } from '../types';
import { INITIAL_PERMISSIONS } from '../data/initialData';
import {
  exportStudentsToExcel,
  generateStudentTemplateExcel,
  importStudentsFromExcel,
  exportUniversitiesToExcel,
  generateUniversityTemplateExcel,
  importUniversitiesFromExcel,
  exportFacultiesToExcel,
  generateFacultyTemplateExcel,
  importFacultiesFromExcel,
  exportClassesToExcel,
  generateClassTemplateExcel,
  importClassesFromExcel
} from '../utils/excelHelper';
import { RadarChart } from './RadarChart';
import {
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  KeyRound,
  Lock,
  Unlock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  Award,
  Flame,
  ArrowUpDown,
  RotateCcw,
  CheckSquare,
  SlidersHorizontal,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  Check,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminStudentManagementProps {
  students: Student[];
  universities: University[];
  faculties: Faculty[];
  classes: ClassItem[];
  currentRole: UserRole;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateUniversities: (universities: University[]) => void;
  onUpdateFaculties: (faculties: Faculty[]) => void;
  onUpdateClasses: (classes: ClassItem[]) => void;
}

export const AdminStudentManagement: React.FC<AdminStudentManagementProps> = ({
  students,
  universities,
  faculties,
  classes,
  currentRole,
  onUpdateStudents,
  onUpdateUniversities,
  onUpdateFaculties,
  onUpdateClasses
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'universities' | 'faculties' | 'classes' | 'permissions'>('students');

  // Search & Filter for Students
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Modals state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingProfileStudent, setViewingProfileStudent] = useState<Student | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Reset Metrics States
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetScope, setResetScope] = useState<'selected' | 'all'>('selected');
  const [singleTargetStudent, setSingleTargetStudent] = useState<Student | null>(null);
  const [resetFields, setResetFields] = useState({
    resetTier: true,
    tierValue: 'Đồng Debater' as DialecticTier,
    resetRubric: true,
    rubricValue: 60,
    resetXp: true,
    xpValue: 0,
    resetStreak: true,
    streakValue: 1,
    resetDebates: true,
    debatesValue: 0,
    resetCases: true,
    casesValue: 0
  });

  // Universities, faculties, classes modals & editing states
  const [showAddUniModal, setShowAddUniModal] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);

  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // Role Permissions (RBAC) State
  const [permissions, setPermissions] = useState<RolePermissionItem[]>(() => {
    try {
      const saved = localStorage.getItem('critix_permissions_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PERMISSIONS;
  });
  const [permissionSearch, setPermissionSearch] = useState('');
  const [permissionCategory, setPermissionCategory] = useState<string>('all');
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<RolePermissionItem | null>(null);
  const [permissionForm, setPermissionForm] = useState<{
    name: string;
    category: RolePermissionItem['category'];
    description: string;
    admin: boolean;
    lecturer: boolean;
    staff: boolean;
    student: boolean;
  }>({
    name: '',
    category: 'Quản Lý Học Thuật',
    description: '',
    admin: true,
    lecturer: false,
    staff: false,
    student: false
  });

  // File input refs for Excel import
  const studentFileRef = useRef<HTMLInputElement>(null);
  const uniFileRef = useRef<HTMLInputElement>(null);
  const facultyFileRef = useRef<HTMLInputElement>(null);
  const classFileRef = useRef<HTMLInputElement>(null);

  // Add/Edit Student Form State
  const [studentForm, setStudentForm] = useState({
    studentId: '',
    lastName: '',
    firstName: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    birthDate: '01/01/2007',
    className: '25DKQT1A',
    faculty: 'Khoa Quản trị kinh doanh',
    university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
    tier: 'Đồng Debater' as DialecticTier,
    xp: 500,
    rubricAverage: 75
  });

  // University Form State (All fields editable)
  const [uniForm, setUniForm] = useState({
    code: '',
    name: '',
    shortName: '',
    address: '',
    rector: '',
    email: '',
    phone: '',
    website: '',
    description: ''
  });

  // Faculty Form State (All fields editable)
  const [facultyForm, setFacultyForm] = useState({
    code: '',
    name: '',
    universityCode: 'NTTU',
    deanName: '',
    viceDean: '',
    email: '',
    phone: '',
    office: '',
    description: ''
  });

  // Class Form State (All fields editable)
  const [classForm, setClassForm] = useState({
    code: '',
    name: '',
    facultyCode: 'FBA',
    universityCode: 'NTTU',
    academicYear: '2024-2028',
    advisor: '',
    advisorEmail: '',
    room: ''
  });

  const showNotify = (type: 'success' | 'error' | 'info', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || s.faculty === selectedFaculty;
    const matchesClass = selectedClass === 'all' || s.className === selectedClass;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    const matchesTier = selectedTier === 'all' || s.tier === selectedTier;

    return matchesSearch && matchesFaculty && matchesClass && matchesStatus && matchesTier;
  });

  // Metrics
  const totalActive = students.filter(s => s.status === 'active').length;
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.rubricAverage, 0) / (students.length || 1));
  const totalDebatesCount = students.reduce((acc, s) => acc + s.totalDebates, 0);

  // ===================================
  // 1. STUDENT ACTIONS
  // ===================================

  const handleOpenAddStudent = () => {
    setStudentForm({
      studentId: `25000${Math.floor(10000 + Math.random() * 90000)}`,
      lastName: '',
      firstName: '',
      gender: 'Nữ',
      birthDate: '15/05/2007',
      className: classes[0]?.code || '25DKQT1A',
      faculty: faculties[0]?.name || 'Khoa Quản trị kinh doanh',
      university: universities[0]?.name || 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      tier: 'Đồng Debater',
      xp: 500,
      rubricAverage: 75
    });
    setEditingStudent(null);
    setShowAddStudentModal(true);
  };

  const handleOpenEditStudent = (s: Student) => {
    setEditingStudent(s);
    setStudentForm({
      studentId: s.studentId,
      lastName: s.lastName,
      firstName: s.firstName,
      gender: s.gender,
      birthDate: s.birthDate,
      className: s.className,
      faculty: s.faculty,
      university: s.university,
      tier: s.tier,
      xp: s.xp,
      rubricAverage: s.rubricAverage
    });
    setShowAddStudentModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.studentId || !studentForm.firstName) {
      showNotify('error', 'Vui lòng nhập đầy đủ Mã sinh viên và Tên!');
      return;
    }

    const fullName = `${studentForm.lastName} ${studentForm.firstName}`.trim();

    if (editingStudent) {
      // Update
      const updated = students.map(s => {
        if (s.id === editingStudent.id) {
          return {
            ...s,
            studentId: studentForm.studentId,
            lastName: studentForm.lastName,
            firstName: studentForm.firstName,
            fullName,
            gender: studentForm.gender,
            birthDate: studentForm.birthDate,
            className: studentForm.className,
            faculty: studentForm.faculty,
            university: studentForm.university,
            tier: studentForm.tier,
            xp: Number(studentForm.xp),
            rubricAverage: Number(studentForm.rubricAverage)
          };
        }
        return s;
      });
      onUpdateStudents(updated);
      showNotify('success', `Đã cập nhật sinh viên ${fullName} (${studentForm.studentId})`);
    } else {
      // Check duplicate studentId
      if (students.some(s => s.studentId === studentForm.studentId)) {
        showNotify('error', `Mã sinh viên ${studentForm.studentId} đã tồn tại trong hệ thống!`);
        return;
      }
      const newStudent: Student = {
        id: `student-custom-${Date.now()}`,
        studentId: studentForm.studentId,
        lastName: studentForm.lastName,
        firstName: studentForm.firstName,
        fullName,
        gender: studentForm.gender,
        birthDate: studentForm.birthDate,
        className: studentForm.className,
        faculty: studentForm.faculty,
        university: studentForm.university,
        password: studentForm.studentId, // Mật khẩu mặc định là Mã sinh viên
        status: 'active',
        role: 'student',
        tier: studentForm.tier,
        xp: Number(studentForm.xp) || 500,
        streakDays: 1,
        rubricAverage: Number(studentForm.rubricAverage) || 75,
        totalDebates: 0,
        casesAnalyzed: 0,
        rubricScores: {
          logic: Number(studentForm.rubricAverage) || 75,
          evidence: Number(studentForm.rubricAverage) || 75,
          rebuttal: Number(studentForm.rubricAverage) || 75,
          toulmin: Number(studentForm.rubricAverage) || 75,
          multiPerspective: Number(studentForm.rubricAverage) || 75
        }
      };
      onUpdateStudents([newStudent, ...students]);
      showNotify('success', `Đã thêm mới sinh viên ${fullName} (${studentForm.studentId}). Mật khẩu mặc định là Mã SV.`);
    }

    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (s: Student) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sinh viên ${s.fullName} (${s.studentId}) khỏi hệ thống?`)) {
      const remaining = students.filter(st => st.id !== s.id);
      onUpdateStudents(remaining);
      showNotify('success', `Đã xóa sinh viên ${s.fullName} thành công.`);
    }
  };

  const handleToggleLockStudent = (s: Student) => {
    const newStatus = s.status === 'active' ? 'locked' : 'active';
    const updated = students.map(st => st.id === s.id ? { ...st, status: newStatus as 'active' | 'locked' } : st);
    onUpdateStudents(updated);
    showNotify('info', `Đã ${newStatus === 'active' ? 'mở khóa' : 'tạm khóa'} tài khoản ${s.studentId}`);
  };

  const handleResetPassword = (s: Student) => {
    const updated = students.map(st => st.id === s.id ? { ...st, password: st.studentId } : st);
    onUpdateStudents(updated);
    showNotify('success', `Đã đặt lại mật khẩu của sinh viên ${s.studentId} về mặc định (Mã SV).`);
  };

  const handleImportStudentsExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await importStudentsFromExcel(file);
      if (res.success && res.students.length > 0) {
        // Merge or replace duplicate studentIds
        const existingIds = new Set(students.map(s => s.studentId));
        const newOnes: Student[] = [];
        const updatedList = students.map(s => {
          const match = res.students.find(ns => ns.studentId === s.studentId);
          return match ? { ...s, ...match } : s;
        });

        res.students.forEach(ns => {
          if (!existingIds.has(ns.studentId)) {
            newOnes.push(ns);
          }
        });

        const combined = [...newOnes, ...updatedList];
        onUpdateStudents(combined);
        showNotify('success', `${res.message} (Đã thêm ${newOnes.length} mới, đồng bộ ${res.students.length - newOnes.length} sẵn có)`);
      } else {
        showNotify('error', res.message);
      }
    } catch (err: any) {
      showNotify('error', `Lỗi nhập Excel: ${err?.message || 'Không thể xử lý file'}`);
    } finally {
      if (studentFileRef.current) studentFileRef.current.value = '';
    }
  };

  // Selection handlers
  const handleSelectAllFiltered = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Reset metrics handlers
  const handleOpenResetModalForSelected = () => {
    setSingleTargetStudent(null);
    setResetScope(selectedStudentIds.length > 0 ? 'selected' : 'all');
    setShowResetModal(true);
  };

  const handleOpenResetModalForSingle = (s: Student) => {
    setSingleTargetStudent(s);
    setResetScope('selected');
    setShowResetModal(true);
  };

  const handleExecuteReset = () => {
    const targetIds = new Set<string>();
    if (singleTargetStudent) {
      targetIds.add(singleTargetStudent.id);
    } else if (resetScope === 'all') {
      students.forEach(s => targetIds.add(s.id));
    } else {
      selectedStudentIds.forEach(id => targetIds.add(id));
    }

    if (targetIds.size === 0) {
      showNotify('error', 'Chưa có sinh viên nào được chọn để đặt lại chỉ số!');
      return;
    }

    const updated = students.map(s => {
      if (targetIds.has(s.id)) {
        const newTier = resetFields.resetTier ? resetFields.tierValue : s.tier;
        const newRubric = resetFields.resetRubric ? Number(resetFields.rubricValue) : s.rubricAverage;
        const newXp = resetFields.resetXp ? Number(resetFields.xpValue) : s.xp;
        const newStreak = resetFields.resetStreak ? Number(resetFields.streakValue) : s.streakDays;
        const newDebates = resetFields.resetDebates ? Number(resetFields.debatesValue) : s.totalDebates;
        const newCases = resetFields.resetCases ? Number(resetFields.casesValue) : s.casesAnalyzed;

        return {
          ...s,
          tier: newTier,
          rubricAverage: newRubric,
          xp: newXp,
          streakDays: newStreak,
          totalDebates: newDebates,
          casesAnalyzed: newCases,
          rubricScores: resetFields.resetRubric ? {
            logic: newRubric,
            evidence: Math.max(50, newRubric - 2),
            rebuttal: Math.max(50, newRubric + 1),
            toulmin: newRubric,
            multiPerspective: Math.max(50, newRubric - 1)
          } : s.rubricScores
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    setShowResetModal(false);
    setSelectedStudentIds([]);
    setSingleTargetStudent(null);
    showNotify('success', `Đã đặt lại thành công Cấp bậc, Rubric, XP và Chuỗi cho ${targetIds.size} sinh viên!`);
  };

  // ===================================
  // 2. UNIVERSITIES ACTIONS (ADD, EDIT, DELETE)
  // ===================================
  const handleOpenAddUni = () => {
    setEditingUni(null);
    setUniForm({
      code: '',
      name: '',
      shortName: '',
      address: '',
      rector: '',
      email: '',
      phone: '',
      website: '',
      description: ''
    });
    setShowAddUniModal(true);
  };

  const handleOpenEditUni = (u: University) => {
    setEditingUni(u);
    setUniForm({
      code: u.code,
      name: u.name,
      shortName: u.shortName || u.code,
      address: u.address || '',
      rector: u.rector || '',
      email: u.email || '',
      phone: u.phone || '',
      website: u.website || '',
      description: u.description || ''
    });
    setShowAddUniModal(true);
  };

  const handleSaveUni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniForm.name.trim() || !uniForm.code.trim()) {
      showNotify('error', 'Vui lòng nhập Mã trường và Tên trường!');
      return;
    }
    const code = uniForm.code.trim().toUpperCase();
    const name = uniForm.name.trim();

    if (editingUni) {
      const updated = universities.map(u => {
        if (u.id === editingUni.id) {
          return {
            ...u,
            code,
            name,
            shortName: uniForm.shortName.trim() || code,
            address: uniForm.address.trim(),
            rector: uniForm.rector.trim(),
            email: uniForm.email.trim(),
            phone: uniForm.phone.trim(),
            website: uniForm.website.trim(),
            description: uniForm.description.trim()
          };
        }
        return u;
      });
      onUpdateUniversities(updated);
      showNotify('success', `Đã cập nhật toàn bộ thông tin trường ${name}`);
    } else {
      const newUni: University = {
        id: `uni-${Date.now()}`,
        code,
        name,
        shortName: uniForm.shortName.trim() || code,
        address: uniForm.address.trim(),
        rector: uniForm.rector.trim(),
        email: uniForm.email.trim(),
        phone: uniForm.phone.trim(),
        website: uniForm.website.trim(),
        description: uniForm.description.trim(),
        totalStudents: 0
      };
      onUpdateUniversities([...universities, newUni]);
      showNotify('success', `Đã thêm trường mới: ${newUni.name}`);
    }
    setShowAddUniModal(false);
    setEditingUni(null);
  };

  const handleDeleteUni = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa trường "${name}"? Thao tác này không thể hoàn tác.`)) {
      onUpdateUniversities(universities.filter(u => u.id !== id));
      showNotify('success', `Đã xóa trường ${name}`);
    }
  };

  const handleImportUniExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importUniversitiesFromExcel(file);
    if (res.success) {
      onUpdateUniversities([...universities, ...res.universities]);
      showNotify('success', res.message);
    } else {
      showNotify('error', res.message);
    }
    if (uniFileRef.current) uniFileRef.current.value = '';
  };

  // ===================================
  // 3. FACULTIES ACTIONS (ADD, EDIT, DELETE)
  // ===================================
  const handleOpenAddFaculty = () => {
    setEditingFaculty(null);
    setFacultyForm({
      code: '',
      name: '',
      universityCode: universities[0]?.code || 'NTTU',
      deanName: '',
      viceDean: '',
      email: '',
      phone: '',
      office: '',
      description: ''
    });
    setShowAddFacultyModal(true);
  };

  const handleOpenEditFaculty = (f: Faculty) => {
    setEditingFaculty(f);
    setFacultyForm({
      code: f.code,
      name: f.name,
      universityCode: f.universityCode,
      deanName: f.deanName || '',
      viceDean: f.viceDean || '',
      email: f.email || '',
      phone: f.phone || '',
      office: f.office || '',
      description: f.description || ''
    });
    setShowAddFacultyModal(true);
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name.trim() || !facultyForm.code.trim()) {
      showNotify('error', 'Vui lòng nhập Mã khoa và Tên khoa/viện!');
      return;
    }
    const code = facultyForm.code.trim().toUpperCase();
    const name = facultyForm.name.trim();

    if (editingFaculty) {
      const updated = faculties.map(f => {
        if (f.id === editingFaculty.id) {
          return {
            ...f,
            code,
            name,
            universityCode: facultyForm.universityCode,
            deanName: facultyForm.deanName.trim(),
            viceDean: facultyForm.viceDean.trim(),
            email: facultyForm.email.trim(),
            phone: facultyForm.phone.trim(),
            office: facultyForm.office.trim(),
            description: facultyForm.description.trim()
          };
        }
        return f;
      });
      onUpdateFaculties(updated);
      showNotify('success', `Đã cập nhật toàn bộ thông tin khoa/viện ${name}`);
    } else {
      const newFac: Faculty = {
        id: `fac-${Date.now()}`,
        code,
        name,
        universityCode: facultyForm.universityCode,
        deanName: facultyForm.deanName.trim(),
        viceDean: facultyForm.viceDean.trim(),
        email: facultyForm.email.trim(),
        phone: facultyForm.phone.trim(),
        office: facultyForm.office.trim(),
        description: facultyForm.description.trim(),
        totalClasses: 0
      };
      onUpdateFaculties([...faculties, newFac]);
      showNotify('success', `Đã thêm khoa/viện mới: ${newFac.name}`);
    }
    setShowAddFacultyModal(false);
    setEditingFaculty(null);
  };

  const handleDeleteFaculty = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa khoa/viện "${name}"?`)) {
      onUpdateFaculties(faculties.filter(f => f.id !== id));
      showNotify('success', `Đã xóa khoa ${name}`);
    }
  };

  const handleImportFacultyExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importFacultiesFromExcel(file);
    if (res.success) {
      onUpdateFaculties([...faculties, ...res.faculties]);
      showNotify('success', res.message);
    } else {
      showNotify('error', res.message);
    }
    if (facultyFileRef.current) facultyFileRef.current.value = '';
  };

  // ===================================
  // 4. CLASSES ACTIONS (ADD, EDIT, DELETE)
  // ===================================
  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassForm({
      code: '',
      name: '',
      facultyCode: faculties[0]?.code || 'FBA',
      universityCode: universities[0]?.code || 'NTTU',
      academicYear: '2024-2028',
      advisor: '',
      advisorEmail: '',
      room: ''
    });
    setShowAddClassModal(true);
  };

  const handleOpenEditClass = (c: ClassItem) => {
    setEditingClass(c);
    setClassForm({
      code: c.code,
      name: c.name || c.code,
      facultyCode: c.facultyCode,
      universityCode: c.universityCode,
      academicYear: c.academicYear,
      advisor: c.advisor || '',
      advisorEmail: c.advisorEmail || '',
      room: c.room || ''
    });
    setShowAddClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.code.trim()) {
      showNotify('error', 'Vui lòng nhập Mã lớp!');
      return;
    }
    const code = classForm.code.trim().toUpperCase();
    const name = classForm.name.trim() || code;

    if (editingClass) {
      const updated = classes.map(c => {
        if (c.id === editingClass.id) {
          return {
            ...c,
            code,
            name,
            facultyCode: classForm.facultyCode,
            universityCode: classForm.universityCode,
            academicYear: classForm.academicYear.trim(),
            advisor: classForm.advisor.trim(),
            advisorEmail: classForm.advisorEmail.trim(),
            room: classForm.room.trim()
          };
        }
        return c;
      });
      onUpdateClasses(updated);
      showNotify('success', `Đã cập nhật toàn bộ thông tin lớp ${code}`);
    } else {
      const newCls: ClassItem = {
        id: `cls-${Date.now()}`,
        code,
        name,
        facultyCode: classForm.facultyCode,
        universityCode: classForm.universityCode,
        academicYear: classForm.academicYear.trim(),
        advisor: classForm.advisor.trim(),
        advisorEmail: classForm.advisorEmail.trim(),
        room: classForm.room.trim(),
        totalStudents: 0
      };
      onUpdateClasses([...classes, newCls]);
      showNotify('success', `Đã thêm lớp sinh hoạt mới: ${newCls.code}`);
    }
    setShowAddClassModal(false);
    setEditingClass(null);
  };

  const handleDeleteClass = (id: string, code: string) => {
    if (confirm(`Bạn có chắc muốn xóa lớp "${code}"?`)) {
      onUpdateClasses(classes.filter(c => c.id !== id));
      showNotify('success', `Đã xóa lớp ${code}`);
    }
  };

  const handleImportClassExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importClassesFromExcel(file);
    if (res.success) {
      onUpdateClasses([...classes, ...res.classes]);
      showNotify('success', res.message);
    } else {
      showNotify('error', res.message);
    }
    if (classFileRef.current) classFileRef.current.value = '';
  };

  // ===================================
  // 5. ROLE PERMISSIONS ACTIONS (RBAC)
  // ===================================
  const updatePermissionsState = (newPermissions: RolePermissionItem[]) => {
    setPermissions(newPermissions);
    try {
      localStorage.setItem('critix_permissions_v3', JSON.stringify(newPermissions));
    } catch {
      // ignore
    }
  };

  const handleToggleRolePermission = (permId: string, role: 'admin' | 'lecturer' | 'staff' | 'student') => {
    let permName = '';
    let nextVal = false;
    const updated = permissions.map(p => {
      if (p.id === permId) {
        nextVal = !p[role];
        permName = p.name;
        return { ...p, [role]: nextVal };
      }
      return p;
    });
    updatePermissionsState(updated);
    const roleLabels = {
      admin: 'Quản Trị Viên',
      lecturer: 'Giảng Viên',
      staff: 'Hỗ Trợ Viên',
      student: 'Sinh Viên'
    };
    showNotify('info', `Đã ${nextVal ? 'cấp' : 'thu hồi'} quyền "${permName}" cho ${roleLabels[role]}`);
  };

  const handleOpenAddPermission = () => {
    setEditingPermission(null);
    setPermissionForm({
      name: '',
      category: 'Quản Lý Học Thuật',
      description: '',
      admin: true,
      lecturer: false,
      staff: false,
      student: false
    });
    setShowAddPermissionModal(true);
  };

  const handleOpenEditPermission = (p: RolePermissionItem) => {
    setEditingPermission(p);
    setPermissionForm({
      name: p.name,
      category: p.category,
      description: p.description || '',
      admin: p.admin,
      lecturer: p.lecturer,
      staff: p.staff,
      student: p.student
    });
    setShowAddPermissionModal(true);
  };

  const handleSavePermission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionForm.name.trim()) {
      showNotify('error', 'Vui lòng nhập Tên quyền hạn tác vụ!');
      return;
    }

    if (editingPermission) {
      const updated = permissions.map(p => {
        if (p.id === editingPermission.id) {
          return {
            ...p,
            name: permissionForm.name.trim(),
            category: permissionForm.category,
            description: permissionForm.description.trim(),
            admin: permissionForm.admin,
            lecturer: permissionForm.lecturer,
            staff: permissionForm.staff,
            student: permissionForm.student
          };
        }
        return p;
      });
      updatePermissionsState(updated);
      showNotify('success', `Đã cập nhật quyền hạn "${permissionForm.name}"`);
    } else {
      const newPerm: RolePermissionItem = {
        id: `perm-${Date.now()}`,
        name: permissionForm.name.trim(),
        category: permissionForm.category,
        description: permissionForm.description.trim(),
        admin: permissionForm.admin,
        lecturer: permissionForm.lecturer,
        staff: permissionForm.staff,
        student: permissionForm.student
      };
      updatePermissionsState([...permissions, newPerm]);
      showNotify('success', `Đã thêm quyền hạn mới: "${newPerm.name}"`);
    }
    setShowAddPermissionModal(false);
    setEditingPermission(null);
  };

  const handleDeletePermission = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa quyền hạn "${name}" khỏi ma trận?`)) {
      const updated = permissions.filter(p => p.id !== id);
      updatePermissionsState(updated);
      showNotify('success', `Đã xóa quyền hạn "${name}"`);
    }
  };

  const handleResetPermissionsToDefault = () => {
    if (confirm('Khôi phục ma trận phân quyền về chuẩn mặc định hệ thống?')) {
      updatePermissionsState(INITIAL_PERMISSIONS);
      showNotify('success', 'Đã khôi phục ma trận phân quyền về mặc định!');
    }
  };

  const handleExpandLecturerPermissions = () => {
    const updated = permissions.map(p => ({
      ...p,
      lecturer: true
    }));
    updatePermissionsState(updated);
    showNotify('success', 'Đã mở rộng toàn bộ quyền hạn cho nhóm Giảng viên!');
  };

  const handleRestrictStudentPermissions = () => {
    const updated = permissions.map(p => ({
      ...p,
      student: p.category === 'Tranh Biện & Tình Huống' || p.name.includes('Transcript') || p.name.includes('Radar')
    }));
    updatePermissionsState(updated);
    showNotify('info', 'Đã áp dụng chính sách bảo mật: Hạn chế quyền cho Sinh viên.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-lg text-sm transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
            : notification.type === 'error'
            ? 'bg-rose-600 text-white shadow-rose-500/20'
            : 'bg-blue-600 text-white shadow-blue-500/20'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <span className="font-medium">{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng Sinh Viên</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{students.length}</span>
            <span className="text-xs text-emerald-600 font-medium">({totalActive} Hoạt động)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Trường & Khoa/Viện</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{universities.length}</span>
            <span className="text-xs text-slate-500">Trường / {faculties.length} Khoa</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lớp Học Hoạt Động</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{classes.length}</span>
            <span className="text-xs text-amber-600 font-medium">Lớp sinh hoạt</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Điểm Rubric TB</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{avgScore}/100</span>
            <span className="text-xs text-slate-500 font-mono">({totalDebatesCount} Lượt thi)</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl overflow-x-auto no-scrollbar border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Quản Lý Sinh Viên ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'universities'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Quản Lý Trường ({universities.length})
        </button>

        <button
          onClick={() => setActiveTab('faculties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'faculties'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Quản Lý Khoa / Viện ({faculties.length})
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Quản Lý Lớp Học ({classes.length})
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'permissions'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Phân Quyền Vai Trò
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: QUẢN LÝ SINH VIÊN */}
      {/* ======================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo Mã SV, Họ tên, Lớp học..."
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Excel & Add Buttons Group */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Tải File Mẫu */}
              <button
                type="button"
                onClick={generateStudentTemplateExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Tải file Excel mẫu chuẩn để điền và import lại"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Tải File Mẫu
              </button>

              {/* Import Excel */}
              <input
                type="file"
                ref={studentFileRef}
                accept=".xlsx, .xls"
                onChange={handleImportStudentsExcel}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => studentFileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Import Excel
              </button>

              {/* Xuất Excel */}
              <button
                type="button"
                onClick={() => exportStudentsToExcel(filteredStudents)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition cursor-pointer border border-blue-200 dark:border-blue-800"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                Xuất Excel ({filteredStudents.length})
              </button>

              {/* Reset Chỉ Số Học Thuật */}
              <button
                type="button"
                onClick={handleOpenResetModalForSelected}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 transition cursor-pointer border border-amber-200 dark:border-amber-800"
                title="Đặt lại Cấp bậc, Rubric, XP, Chuỗi cho toàn bộ hoặc sinh viên đã chọn"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                Reset Chỉ Số {selectedStudentIds.length > 0 ? `(${selectedStudentIds.length} SV)` : '(Toàn bộ)'}
              </button>

              {/* Thêm Sinh Viên */}
              <button
                type="button"
                onClick={handleOpenAddStudent}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Sinh Viên
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc theo:
            </span>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả Lớp học</option>
              {classes.map(c => (
                <option key={c.id} value={c.code}>{c.code}</option>
              ))}
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả Cấp bậc thi đua</option>
              <option value="Bậc Thầy Socrates">Bậc Thầy Socrates</option>
              <option value="Bạch Kim Rhetor">Bạch Kim Rhetor</option>
              <option value="Vàng Scholar">Vàng Scholar</option>
              <option value="Bạc Dialectic">Bạc Dialectic</option>
              <option value="Đồng Debater">Đồng Debater</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Tạm khóa</option>
            </select>

            {(searchTerm || selectedClass !== 'all' || selectedTier !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedClass('all');
                  setSelectedTier('all');
                  setSelectedStatus('all');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-auto"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          {/* Batch Actions Bar */}
          {selectedStudentIds.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Đang chọn <strong>{selectedStudentIds.length}</strong> sinh viên để thao tác</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenResetModalForSelected}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Cấp bậc, Rubric, XP, Chuỗi
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentIds([])}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          )}

          {/* Table of Students */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Hiển thị <strong>{filteredStudents.length}</strong> / {students.length} sinh viên</span>
              <span className="hidden sm:inline">👉 Vuốt ngang bảng để xem đầy đủ cột điểm và thao tác</span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs min-w-[960px]">
                <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAllFiltered}
                        className="rounded cursor-pointer accent-blue-600"
                        title="Chọn tất cả sinh viên đang hiển thị"
                      />
                    </th>
                    <th className="py-3 px-2 w-10 text-center">STT</th>
                    <th className="py-3 px-3">Mã Sinh Viên</th>
                    <th className="py-3 px-4">Họ và Tên</th>
                    <th className="py-3 px-2 text-center">Giới tính</th>
                    <th className="py-3 px-3">Ngày sinh</th>
                    <th className="py-3 px-3">Lớp học</th>
                    <th className="py-3 px-3">Cấp bậc</th>
                    <th className="py-3 px-3 text-center">Rubric TB</th>
                    <th className="py-3 px-3 text-center">XP</th>
                    <th className="py-3 px-3 text-center">Chuỗi 🔥</th>
                    <th className="py-3 px-3 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-8 text-center text-slate-500">
                        Không tìm thấy sinh viên nào phù hợp với điều kiện tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, index) => (
                      <tr
                        key={s.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                          s.status === 'locked' ? 'opacity-60 bg-rose-50/20' : ''
                        } ${selectedStudentIds.includes(s.id) ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''}`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={() => handleToggleSelectStudent(s.id)}
                            className="rounded cursor-pointer accent-blue-600"
                          />
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-slate-400">{index + 1}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {s.studentId}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                          <button
                            onClick={() => setViewingProfileStudent(s)}
                            className="hover:text-blue-600 hover:underline text-left cursor-pointer"
                          >
                            {s.fullName}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">
                          {s.gender}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono">
                          {s.birthDate}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {s.className}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            s.tier === 'Bậc Thầy Socrates'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : s.tier === 'Bạch Kim Rhetor'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300'
                              : s.tier === 'Vàng Scholar'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300'
                              : s.tier === 'Bạc Dialectic'
                              ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                          }`}>
                            {s.tier}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                          <span className={`px-2 py-0.5 rounded ${
                            s.rubricAverage >= 85 ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700'
                          }`}>
                            {s.rubricAverage}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {s.xp}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-amber-600 dark:text-amber-400 font-semibold">
                          <span className="inline-flex items-center gap-0.5">
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {s.streakDays}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            s.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}>
                            {s.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Xem hồ sơ năng lực */}
                            <button
                              type="button"
                              onClick={() => setViewingProfileStudent(s)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
                              title="Xem Biểu đồ Radar năng lực 5 chiều"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Chỉnh sửa */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditStudent(s)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
                              title="Chỉnh sửa thông tin sinh viên"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Khóa/Mở khóa */}
                            <button
                              type="button"
                              onClick={() => handleToggleLockStudent(s)}
                              className={`p-1.5 rounded-lg transition ${
                                s.status === 'active'
                                  ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-rose-600 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={s.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            >
                              {s.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            {/* Reset Mật khẩu */}
                            <button
                              type="button"
                              onClick={() => handleResetPassword(s)}
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition"
                              title="Đặt lại mật khẩu về Mã sinh viên"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Chỉ Số Học Thuật Cá Nhân */}
                            <button
                              type="button"
                              onClick={() => handleOpenResetModalForSingle(s)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
                              title="Đặt lại Cấp bậc, Rubric, XP, Chuỗi của sinh viên này"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                            </button>

                            {/* Xóa */}
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(s)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                              title="Xóa sinh viên khỏi hệ thống"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: QUẢN LÝ TRƯỜNG ĐẠI HỌC (EDIT TOÀN BỘ THÔNG TIN) */}
      {/* ======================================================== */}
      {activeTab === 'universities' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Danh Sách Trường Đại Học & Học Viện ({universities.length})
              </h3>
              <p className="text-xs text-slate-500">Toàn quyền chỉnh sửa thông tin trường, hiệu trưởng, website và địa chỉ các cơ sở đào tạo</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={generateUniversityTemplateExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Tải Mẫu Trường
              </button>

              <input
                type="file"
                ref={uniFileRef}
                accept=".xlsx, .xls"
                onChange={handleImportUniExcel}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => uniFileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Import Excel Trường
              </button>

              <button
                type="button"
                onClick={() => exportUniversitiesToExcel(universities)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                Xuất Excel Trường
              </button>

              <button
                type="button"
                onClick={handleOpenAddUni}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Trường Mới
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map(u => {
              const studentCount = students.filter(s => s.university.includes(u.code) || s.university.includes(u.shortName) || s.university.includes(u.name)).length;
              const facultyCount = faculties.filter(f => f.universityCode === u.code).length;

              return (
                <div key={u.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
                          {u.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          ({u.shortName})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUni(u)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 rounded-lg transition cursor-pointer"
                          title="Chỉnh sửa toàn bộ thông tin trường"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUni(u.id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          title="Xóa trường"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{u.name}</h4>
                      {u.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{u.description}</p>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {u.address && (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{u.address}</span>
                        </div>
                      )}
                      {u.rector && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Hiệu trưởng: <strong>{u.rector}</strong></span>
                        </div>
                      )}
                      {u.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono">{u.email}</span>
                        </div>
                      )}
                      {u.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono">{u.phone}</span>
                        </div>
                      )}
                      {u.website && (
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={u.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-mono truncate">
                            {u.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-purple-600 font-semibold">{facultyCount} khoa trực thuộc</span>
                    <span className="text-blue-600 font-bold">{studentCount} sinh viên</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: QUẢN LÝ KHOA / VIỆN (EDIT TOÀN BỘ THÔNG TIN) */}
      {/* ======================================================== */}
      {activeTab === 'faculties' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Danh Sách Khoa & Viện Đào Tạo ({faculties.length})
              </h3>
              <p className="text-xs text-slate-500">Toàn quyền chỉnh sửa thông tin khoa, trưởng khoa, phó khoa, văn phòng và các lớp trực thuộc</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={generateFacultyTemplateExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Tải Mẫu Khoa/Viện
              </button>

              <input
                type="file"
                ref={facultyFileRef}
                accept=".xlsx, .xls"
                onChange={handleImportFacultyExcel}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => facultyFileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Import Excel Khoa
              </button>

              <button
                type="button"
                onClick={() => exportFacultiesToExcel(faculties)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                Xuất Excel Khoa
              </button>

              <button
                type="button"
                onClick={handleOpenAddFaculty}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Khoa / Viện
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculties.map(f => {
              const classCount = classes.filter(c => c.facultyCode === f.code).length;
              const studentCount = students.filter(s => s.faculty === f.name).length;

              return (
                <div key={f.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 transition">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800">
                          {f.code}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Trường: {f.universityCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFaculty(f)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 rounded-lg transition cursor-pointer"
                          title="Chỉnh sửa toàn bộ thông tin khoa/viện"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaculty(f.id, f.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          title="Xóa khoa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{f.name}</h4>
                      {f.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{f.description}</p>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {f.deanName && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>Trưởng khoa: <strong>{f.deanName}</strong></span>
                        </div>
                      )}
                      {f.viceDean && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Phó trưởng khoa: {f.viceDean}</span>
                        </div>
                      )}
                      {f.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono">{f.email}</span>
                        </div>
                      )}
                      {f.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono">{f.phone}</span>
                        </div>
                      )}
                      {f.office && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{f.office}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{classCount} lớp sinh hoạt</span>
                    <span className="text-purple-600 font-bold">{studentCount} sinh viên</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: QUẢN LÝ LỚP HỌC (EDIT TOÀN BỘ THÔNG TIN) */}
      {/* ======================================================== */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Danh Sách Lớp Học Sinh Hoạt ({classes.length})
              </h3>
              <p className="text-xs text-slate-500">Toàn quyền chỉnh sửa mã lớp, tên lớp, niên khóa, cố vấn học tập và giảng đường</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={generateClassTemplateExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Tải Mẫu Lớp
              </button>

              <input
                type="file"
                ref={classFileRef}
                accept=".xlsx, .xls"
                onChange={handleImportClassExcel}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => classFileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Import Excel Lớp
              </button>

              <button
                type="button"
                onClick={() => exportClassesToExcel(classes)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                Xuất Excel Lớp
              </button>

              <button
                type="button"
                onClick={handleOpenAddClass}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Lớp Mới
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classes.map(c => {
              const countInClass = students.filter(s => s.className === c.code).length;
              return (
                <div key={c.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">{c.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditClass(c)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                          title="Chỉnh sửa toàn bộ thông tin lớp"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClass(c.id, c.code)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Xóa lớp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <div>Khoa: <strong className="text-slate-700 dark:text-slate-300">{c.facultyCode}</strong></div>
                      <div>Niên khóa: <span className="font-mono">{c.academicYear}</span></div>
                      {c.advisor && (
                        <div>Cố vấn: <strong className="text-emerald-600">{c.advisor}</strong></div>
                      )}
                      {c.advisorEmail && (
                        <div className="font-mono truncate">{c.advisorEmail}</div>
                      )}
                      {c.room && (
                        <div>Phòng: <span className="font-mono">{c.room}</span></div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{c.universityCode}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold font-mono">
                      {countInClass} SV
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: HỆ THỐNG PHÂN QUYỀN VAI TRÒ HỌC THUẬT (RBAC CHỈNH SỬA TOÀN BỘ) */}
      {/* ======================================================== */}
      {activeTab === 'permissions' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Ma Trận Phân Quyền Vai Trò Học Thuật (RBAC System)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toàn quyền tùy chỉnh quyền hạn tác vụ, bật/tắt trực tiếp cho từng vai trò hoặc thêm mới quyền hạn tùy chỉnh
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExpandLecturerPermissions}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition cursor-pointer"
                title="Cấp toàn bộ quyền hạn cho Giảng viên"
              >
                Mở Rộng Giảng Viên
              </button>

              <button
                type="button"
                onClick={handleRestrictStudentPermissions}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                title="Hạn chế quyền chỉ cho phép sinh viên tham gia và xem điểm cá nhân"
              >
                Hạn Chế Sinh Viên
              </button>

              <button
                type="button"
                onClick={handleResetPermissionsToDefault}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition cursor-pointer"
                title="Khôi phục ma trận phân quyền về chuẩn mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                Chuẩn Mặc Định
              </button>

              <button
                type="button"
                onClick={handleOpenAddPermission}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Quyền Hạn
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm quyền hạn hoặc mô tả..."
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Nhóm tác vụ:</span>
              <select
                value={permissionCategory}
                onChange={(e) => setPermissionCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả nhóm ({permissions.length})</option>
                <option value="Tranh Biện & Tình Huống">Tranh Biện & Tình Huống</option>
                <option value="Đánh Giá & Báo Cáo">Đánh Giá & Báo Cáo</option>
                <option value="Quản Lý Học Thuật">Quản Lý Học Thuật</option>
                <option value="Hệ Thống & Dữ Liệu">Hệ Thống & Dữ Liệu</option>
              </select>
            </div>
          </div>

          {/* Interactive Editable Permissions Table */}
          <div className="overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4 w-[42%]">Tác Vụ / Chức Năng Hệ Thống</th>
                  <th className="py-3 px-3 text-center w-[12%]">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold block">
                      Admin
                    </span>
                  </th>
                  <th className="py-3 px-3 text-center w-[12%]">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold block">
                      Giảng Viên
                    </span>
                  </th>
                  <th className="py-3 px-3 text-center w-[12%]">
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-bold block">
                      Hỗ Trợ Viên
                    </span>
                  </th>
                  <th className="py-3 px-3 text-center w-[12%]">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold block">
                      Sinh Viên
                    </span>
                  </th>
                  <th className="py-3 px-3 text-center w-[10%]">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {permissions
                  .filter(p => {
                    const matchSearch = p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                      (p.description && p.description.toLowerCase().includes(permissionSearch.toLowerCase()));
                    const matchCategory = permissionCategory === 'all' || p.category === permissionCategory;
                    return matchSearch && matchCategory;
                  })
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
                            p.category === 'Tranh Biện & Tình Huống'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : p.category === 'Đánh Giá & Báo Cáo'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : p.category === 'Quản Lý Học Thuật'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {p.category}
                          </span>
                        </div>
                        {p.description && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                        )}
                      </td>

                      {/* Admin Toggle */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={p.admin}
                          onChange={() => handleToggleRolePermission(p.id, 'admin')}
                          className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                          title="Bật/Tắt quyền cho Quản Trị Viên"
                        />
                      </td>

                      {/* Lecturer Toggle */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={p.lecturer}
                          onChange={() => handleToggleRolePermission(p.id, 'lecturer')}
                          className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                          title="Bật/Tắt quyền cho Giảng Viên"
                        />
                      </td>

                      {/* Staff Toggle */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={p.staff}
                          onChange={() => handleToggleRolePermission(p.id, 'staff')}
                          className="w-4 h-4 rounded accent-slate-600 cursor-pointer"
                          title="Bật/Tắt quyền cho Hỗ Trợ Viên"
                        />
                      </td>

                      {/* Student Toggle */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={p.student}
                          onChange={() => handleToggleRolePermission(p.id, 'student')}
                          className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                          title="Bật/Tắt quyền cho Sinh Viên"
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPermission(p)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                            title="Chỉnh sửa quyền hạn này"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePermission(p.id, p.name)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                            title="Xóa quyền hạn khỏi ma trận"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            💡 Gợi ý: Quản trị viên có thể bấm trực tiếp vào bất kỳ ô checkbox nào để cấp hoặc thu hồi quyền truy cập tức thì cho vai trò tương ứng. Dữ liệu sẽ tự động lưu vào bộ nhớ hệ thống.
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: THÊM / SỬA SINH VIÊN */}
      {/* ======================================================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingStudent ? `Chỉnh Sửa Sinh Viên: ${editingStudent.studentId}` : 'Thêm Sinh Viên Mới'}
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mã sinh viên (MSSV) *
                  </label>
                  <input
                    type="text"
                    value={studentForm.studentId}
                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Mật khẩu khởi tạo sẽ chính là Mã SV</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Họ đệm *
                  </label>
                  <input
                    type="text"
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tên *
                  </label>
                  <input
                    type="text"
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    placeholder="Ví dụ: An"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ngày sinh (dd/mm/yyyy)
                  </label>
                  <input
                    type="text"
                    value={studentForm.birthDate}
                    onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lớp sinh hoạt
                  </label>
                  <select
                    value={studentForm.className}
                    onChange={(e) => setStudentForm({ ...studentForm, className: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.code}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Khoa / Viện
                  </label>
                  <select
                    value={studentForm.faculty}
                    onChange={(e) => setStudentForm({ ...studentForm, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {faculties.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trường Đại học
                  </label>
                  <select
                    value={studentForm.university}
                    onChange={(e) => setStudentForm({ ...studentForm, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {universities.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cấp bậc thi đua
                  </label>
                  <select
                    value={studentForm.tier}
                    onChange={(e) => setStudentForm({ ...studentForm, tier: e.target.value as DialecticTier })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Bậc Thầy Socrates">Bậc Thầy Socrates</option>
                    <option value="Bạch Kim Rhetor">Bạch Kim Rhetor</option>
                    <option value="Vàng Scholar">Vàng Scholar</option>
                    <option value="Bạc Dialectic">Bạc Dialectic</option>
                    <option value="Đồng Debater">Đồng Debater</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Điểm XP
                  </label>
                  <input
                    type="number"
                    value={studentForm.xp}
                    onChange={(e) => setStudentForm({ ...studentForm, xp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Điểm Rubric TB
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={studentForm.rubricAverage}
                    onChange={(e) => setStudentForm({ ...studentForm, rubricAverage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  {editingStudent ? 'Lưu Thay Đổi' : 'Tạo Sinh Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: XEM HỒ SƠ & RADAR NĂNG LỰC */}
      {/* ======================================================== */}
      {viewingProfileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{viewingProfileStudent.fullName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {viewingProfileStudent.studentId} • Lớp {viewingProfileStudent.className}
                </p>
              </div>
              <button
                onClick={() => setViewingProfileStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Biểu Đồ Radar Năng Lực Lập Luận 5 Chiều
              </h4>
              <RadarChart scores={viewingProfileStudent.rubricScores} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="text-slate-500 block">Khoa:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingProfileStudent.faculty}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Trường:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingProfileStudent.university}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cấp bậc thi đua:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{viewingProfileStudent.tier}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Chuỗi ngày rèn luyện:</span>
                <span className="font-bold text-amber-500">🔥 {viewingProfileStudent.streakDays} ngày liên tục</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tổng số trận tranh biện:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingProfileStudent.totalDebates} trận</span>
              </div>
              <div>
                <span className="text-slate-500 block">Điểm tích lũy XP:</span>
                <span className="font-mono font-bold text-purple-600">{viewingProfileStudent.xp} XP</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewingProfileStudent(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white font-semibold text-xs rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: THÊM / CHỈNH SỬA TOÀN BỘ THÔNG TIN TRƯỜNG ĐẠI HỌC */}
      {/* ======================================================== */}
      {showAddUniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {editingUni ? `Chỉnh Sửa Toàn Bộ Thông Tin: ${editingUni.name}` : 'Thêm Trường Đại Học / Học Viện Mới'}
                </h3>
              </div>
              <button
                onClick={() => { setShowAddUniModal(false); setEditingUni(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUni} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mã trường *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: NTTU"
                    value={uniForm.code}
                    onChange={(e) => setUniForm({ ...uniForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên viết tắt</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: NTTU"
                    value={uniForm.shortName}
                    onChange={(e) => setUniForm({ ...uniForm, shortName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên trường đầy đủ *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Trường Đại học Nguyễn Tất Thành"
                  value={uniForm.name}
                  onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Địa chỉ trụ sở chính & các cơ sở</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 300A Nguyễn Tất Thành, P.13, Q.4, TP. Hồ Chí Minh"
                  value={uniForm.address}
                  onChange={(e) => setUniForm({ ...uniForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hiệu trưởng / Đại diện trường</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: TS. Trần Ái Cầm"
                    value={uniForm.rector}
                    onChange={(e) => setUniForm({ ...uniForm, rector: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hotline / Điện thoại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 1900 2039"
                    value={uniForm.phone}
                    onChange={(e) => setUniForm({ ...uniForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email học vụ / Tuyển sinh</label>
                  <input
                    type="email"
                    placeholder="Ví dụ: tuyensinh@ntt.edu.vn"
                    value={uniForm.email}
                    onChange={(e) => setUniForm({ ...uniForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Website chính thức</label>
                  <input
                    type="text"
                    placeholder="https://ntt.edu.vn"
                    value={uniForm.website}
                    onChange={(e) => setUniForm({ ...uniForm, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Giới thiệu tổng quan & định hướng đào tạo</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt về trường, sứ mệnh và định hướng học thuật..."
                  value={uniForm.description}
                  onChange={(e) => setUniForm({ ...uniForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowAddUniModal(false); setEditingUni(null); }}
                  className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
                >
                  {editingUni ? 'Cập Nhật Toàn Bộ Thông Tin Trường' : 'Lưu Trường Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: THÊM / CHỈNH SỬA TOÀN BỘ THÔNG TIN KHOA / VIỆN */}
      {/* ======================================================== */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {editingFaculty ? `Chỉnh Sửa Toàn Bộ Thông Tin: ${editingFaculty.name}` : 'Thêm Khoa / Viện Mới'}
                </h3>
              </div>
              <button
                onClick={() => { setShowAddFacultyModal(false); setEditingFaculty(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaculty} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mã khoa/viện *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: FBA hoặc FIT"
                    value={facultyForm.code}
                    onChange={(e) => setFacultyForm({ ...facultyForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Thuộc Trường Đại Học *</label>
                  <select
                    value={facultyForm.universityCode}
                    onChange={(e) => setFacultyForm({ ...facultyForm, universityCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    {universities.map(u => (
                      <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên khoa / viện đầy đủ *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Khoa Quản trị kinh doanh"
                  value={facultyForm.name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Trưởng khoa / Viện trưởng</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: TS. Nguyễn Văn Hùng"
                    value={facultyForm.deanName}
                    onChange={(e) => setFacultyForm({ ...facultyForm, deanName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phó trưởng khoa / Viện phó</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: ThS. Lê Thị Mai"
                    value={facultyForm.viceDean}
                    onChange={(e) => setFacultyForm({ ...facultyForm, viceDean: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email văn phòng khoa</label>
                  <input
                    type="email"
                    placeholder="fba@ntt.edu.vn"
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    placeholder="028 3940 0065"
                    value={facultyForm.phone}
                    onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Văn phòng làm việc / Địa điểm</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng A.302, Cơ sở An Phú Đông, Q.12"
                  value={facultyForm.office}
                  onChange={(e) => setFacultyForm({ ...facultyForm, office: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Giới thiệu chuyên môn & đào tạo</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả ngành đào tạo, thế mạnh nghiên cứu và năng lực phản biện..."
                  value={facultyForm.description}
                  onChange={(e) => setFacultyForm({ ...facultyForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowAddFacultyModal(false); setEditingFaculty(null); }}
                  className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition"
                >
                  {editingFaculty ? 'Cập Nhật Toàn Bộ Thông Tin Khoa' : 'Lưu Khoa / Viện Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: THÊM / CHỈNH SỬA TOÀN BỘ THÔNG TIN LỚP HỌC */}
      {/* ======================================================== */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {editingClass ? `Chỉnh Sửa Toàn Bộ Thông Tin Lớp: ${editingClass.code}` : 'Thêm Lớp Sinh Hoạt Mới'}
                </h3>
              </div>
              <button
                onClick={() => { setShowAddClassModal(false); setEditingClass(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mã lớp sinh hoạt *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 25DKQT1A"
                    value={classForm.code}
                    onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Niên khóa đào tạo</label>
                  <input
                    type="text"
                    placeholder="2024-2028"
                    value={classForm.academicYear}
                    onChange={(e) => setClassForm({ ...classForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên mô tả lớp</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quản trị kinh doanh Quốc tế 25A"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Thuộc Khoa / Viện *</label>
                  <select
                    value={classForm.facultyCode}
                    onChange={(e) => setClassForm({ ...classForm, facultyCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    {faculties.map(f => (
                      <option key={f.id} value={f.code}>{f.name} ({f.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Thuộc Trường Đại Học *</label>
                  <select
                    value={classForm.universityCode}
                    onChange={(e) => setClassForm({ ...classForm, universityCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    {universities.map(u => (
                      <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cố vấn học tập / GVCN</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: TS. Nguyễn Thị Lan"
                    value={classForm.advisor}
                    onChange={(e) => setClassForm({ ...classForm, advisor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email cố vấn học tập</label>
                  <input
                    type="email"
                    placeholder="ntlan@ntt.edu.vn"
                    value={classForm.advisorEmail}
                    onChange={(e) => setClassForm({ ...classForm, advisorEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Giảng đường / Phòng sinh hoạt lớp</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giảng đường B.204, Khu phức hợp công nghệ cao"
                  value={classForm.room}
                  onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowAddClassModal(false); setEditingClass(null); }}
                  className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition"
                >
                  {editingClass ? 'Cập Nhật Toàn Bộ Thông Tin Lớp' : 'Lưu Lớp Học Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: THÊM / CHỈNH SỬA QUYỀN HẠN RBAC */}
      {/* ======================================================== */}
      {showAddPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {editingPermission ? 'Chỉnh Sửa Quyền Hạn RBAC' : 'Thêm Quyền Hạn Mới Vào Hệ Thống'}
                </h3>
              </div>
              <button
                onClick={() => { setShowAddPermissionModal(false); setEditingPermission(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePermission} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên tác vụ / quyền hạn *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phê duyệt đề tài tranh biện tự tạo"
                  value={permissionForm.name}
                  onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nhóm danh mục chức năng</label>
                <select
                  value={permissionForm.category}
                  onChange={(e) => setPermissionForm({ ...permissionForm, category: e.target.value as RolePermissionItem['category'] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="Tranh Biện & Tình Huống">Tranh Biện & Tình Huống</option>
                  <option value="Đánh Giá & Báo Cáo">Đánh Giá & Báo Cáo</option>
                  <option value="Quản Lý Học Thuật">Quản Lý Học Thuật</option>
                  <option value="Hệ Thống & Dữ Liệu">Hệ Thống & Dữ Liệu</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả tác vụ</label>
                <textarea
                  rows={2}
                  placeholder="Diễn giải chức năng cụ thể và phạm vi ảnh hưởng..."
                  value={permissionForm.description}
                  onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div>
                <span className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Phân quyền ban đầu cho các vai trò:</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={permissionForm.admin}
                      onChange={(e) => setPermissionForm({ ...permissionForm, admin: e.target.checked })}
                      className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Quản Trị Viên (Admin)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={permissionForm.lecturer}
                      onChange={(e) => setPermissionForm({ ...permissionForm, lecturer: e.target.checked })}
                      className="rounded accent-purple-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Giảng Viên (Lecturer)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={permissionForm.staff}
                      onChange={(e) => setPermissionForm({ ...permissionForm, staff: e.target.checked })}
                      className="rounded accent-slate-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Hỗ Trợ Viên (Staff)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={permissionForm.student}
                      onChange={(e) => setPermissionForm({ ...permissionForm, student: e.target.checked })}
                      className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Sinh Viên (Student)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowAddPermissionModal(false); setEditingPermission(null); }}
                  className="px-4 py-2 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
                >
                  {editingPermission ? 'Lưu Thay Đổi' : 'Thêm Quyền Hạn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RESET CHỈ SỐ HỌC THUẬT (CẤP BẬC, RUBRIC, XP, CHUỖI) */}
      {/* ======================================================== */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Đặt Lại Chỉ Số Học Thuật (Reset Metrics)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật lại Cấp bậc, Điểm Rubric, XP và Chuỗi ngày rèn luyện
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scope Selection */}
            <div className="mb-5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Phạm vi áp dụng:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                  resetScope === 'all' && !singleTargetStudent
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="resetScope"
                    checked={resetScope === 'all' && !singleTargetStudent}
                    onChange={() => {
                      setResetScope('all');
                      setSingleTargetStudent(null);
                    }}
                    className="accent-amber-600 cursor-pointer"
                  />
                  <span>Toàn bộ sinh viên ({students.length} SV)</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                  resetScope === 'selected' || singleTargetStudent
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="resetScope"
                    checked={resetScope === 'selected' || !!singleTargetStudent}
                    onChange={() => setResetScope('selected')}
                    className="accent-amber-600 cursor-pointer"
                  />
                  <span>
                    {singleTargetStudent
                      ? `Chỉ 1 SV: ${singleTargetStudent.studentId}`
                      : `Các SV đã chọn (${selectedStudentIds.length} SV)`}
                  </span>
                </label>
              </div>

              {singleTargetStudent ? (
                <div className="pt-1.5 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300">
                  <span>
                    Đang chọn riêng: <strong>{singleTargetStudent.fullName}</strong> ({singleTargetStudent.studentId})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSingleTargetStudent(null)}
                    className="underline text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700"
                  >
                    Bỏ chọn riêng
                  </button>
                </div>
              ) : resetScope === 'selected' && selectedStudentIds.length === 0 ? (
                <p className="text-[11px] text-rose-500 font-medium">
                  ⚠️ Chưa có sinh viên nào được tích chọn trong bảng. Vui lòng tích chọn sinh viên hoặc chuyển sang &quot;Toàn bộ sinh viên&quot;.
                </p>
              ) : null}
            </div>

            {/* Quick Presets */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Bộ mẫu thiết lập nhanh:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setResetFields({
                      resetTier: true,
                      tierValue: 'Đồng Debater',
                      resetRubric: true,
                      rubricValue: 40,
                      resetXp: true,
                      xpValue: 0,
                      resetStreak: true,
                      streakValue: 1,
                      resetDebates: true,
                      debatesValue: 0,
                      resetCases: true,
                      casesValue: 0
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold transition cursor-pointer shadow-sm"
                >
                  ⚡ Chuẩn Khởi Đầu (Đồng Debater, 1 Chuỗi, Rubric 40, 0 XP)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetFields({
                      resetTier: true,
                      tierValue: 'Đồng Debater',
                      resetRubric: true,
                      rubricValue: 60,
                      resetXp: true,
                      xpValue: 0,
                      resetStreak: true,
                      streakValue: 1,
                      resetDebates: true,
                      debatesValue: 0,
                      resetCases: true,
                      casesValue: 0
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer"
                >
                  🌱 Mặc định Học kỳ mới (Hạng Đồng, 60đ, 0 XP, Chuỗi 1)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetFields(prev => ({
                      ...prev,
                      resetStreak: true,
                      streakValue: 1,
                      resetTier: false,
                      resetRubric: false,
                      resetXp: false,
                      resetDebates: false,
                      resetCases: false
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium transition cursor-pointer"
                >
                  🔥 Chỉ đặt lại Chuỗi ngày (Streak = 1)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetFields(prev => ({
                      ...prev,
                      resetTier: true,
                      tierValue: 'Đồng Debater',
                      resetRubric: true,
                      rubricValue: 60,
                      resetStreak: false,
                      resetXp: false,
                      resetDebates: false,
                      resetCases: false
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-medium transition cursor-pointer"
                >
                  ⚖️ Chỉ đặt lại Rubric & Cấp bậc
                </button>
              </div>
            </div>

            {/* Config Fields */}
            <div className="space-y-4 text-xs">
              {/* 1. Cấp Bậc (Tier) */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resetFields.resetTier}
                      onChange={(e) => setResetFields({ ...resetFields, resetTier: e.target.checked })}
                      className="rounded accent-blue-600 cursor-pointer"
                    />
                    <span>Đặt lại Cấp bậc thi đua (Dialectic Tier)</span>
                  </label>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                {resetFields.resetTier && (
                  <select
                    value={resetFields.tierValue}
                    onChange={(e) => setResetFields({ ...resetFields, tierValue: e.target.value as DialecticTier })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    <option value="Đồng Debater">Đồng Debater (Khởi điểm chuẩn)</option>
                    <option value="Bạc Dialectic">Bạc Dialectic</option>
                    <option value="Vàng Scholar">Vàng Scholar</option>
                    <option value="Bạch Kim Rhetor">Bạch Kim Rhetor</option>
                    <option value="Bậc Thầy Socrates">Bậc Thầy Socrates</option>
                  </select>
                )}
              </div>

              {/* 2. Điểm Rubric Trung Bình */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resetFields.resetRubric}
                      onChange={(e) => setResetFields({ ...resetFields, resetRubric: e.target.checked })}
                      className="rounded accent-blue-600 cursor-pointer"
                    />
                    <span>Đặt lại Điểm Rubric Trung Bình (Thang 0 - 100)</span>
                  </label>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {resetFields.rubricValue}/100
                  </span>
                </div>
                {resetFields.resetRubric && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={resetFields.rubricValue}
                        onChange={(e) => setResetFields({ ...resetFields, rubricValue: Number(e.target.value) })}
                        className="flex-1 accent-blue-600 cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={resetFields.rubricValue}
                        onChange={(e) => setResetFields({ ...resetFields, rubricValue: Number(e.target.value) })}
                        className="w-16 px-2 py-1 text-center font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      ℹ️ Tự động đồng bộ hóa cả 5 tiêu chí: Logic, Dẫn chứng, Phản biện, Cấu trúc Toulmin, và Đa chiều nhận thức.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Điểm Kinh Nghiệm (XP) */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resetFields.resetXp}
                      onChange={(e) => setResetFields({ ...resetFields, resetXp: e.target.checked })}
                      className="rounded accent-blue-600 cursor-pointer"
                    />
                    <span>Đặt lại Điểm Tích Lũy XP</span>
                  </label>
                  <span className="font-mono font-bold text-purple-600">
                    {resetFields.xpValue} XP
                  </span>
                </div>
                {resetFields.resetXp && (
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={resetFields.xpValue}
                    onChange={(e) => setResetFields({ ...resetFields, xpValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-mono"
                    placeholder="Nhập số XP mong muốn (ví dụ: 0 hoặc 500)"
                  />
                )}
              </div>

              {/* 4. Chuỗi Ngày Rèn Luyện (Streak Days) */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resetFields.resetStreak}
                      onChange={(e) => setResetFields({ ...resetFields, resetStreak: e.target.checked })}
                      className="rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="flex items-center gap-1">
                      Đặt lại Chuỗi ngày học tập <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </span>
                  </label>
                  <span className="font-mono font-bold text-amber-600">
                    {resetFields.streakValue} ngày
                  </span>
                </div>
                {resetFields.resetStreak && (
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={resetFields.streakValue}
                    onChange={(e) => setResetFields({ ...resetFields, streakValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-mono"
                    placeholder="Nhập số ngày chuỗi (ví dụ: 1 hoặc 0)"
                  />
                )}
              </div>

              {/* 5. Số Trận Tranh Biện & Case Study */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resetFields.resetDebates}
                      onChange={(e) => setResetFields({ ...resetFields, resetDebates: e.target.checked, resetCases: e.target.checked })}
                      className="rounded accent-blue-600 cursor-pointer"
                    />
                    <span>Đặt lại số trận Tranh biện & Case Study đã hoàn thành</span>
                  </label>
                </div>
                {resetFields.resetDebates && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Số trận tranh biện:</span>
                      <input
                        type="number"
                        min="0"
                        value={resetFields.debatesValue}
                        onChange={(e) => setResetFields({ ...resetFields, debatesValue: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Số case study:</span>
                      <input
                        type="number"
                        min="0"
                        value={resetFields.casesValue}
                        onChange={(e) => setResetFields({ ...resetFields, casesValue: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Box */}
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý quan trọng:</strong> Hành động này sẽ cập nhật trực tiếp vào hồ sơ sinh viên đã chọn (
                {singleTargetStudent
                  ? `1 sinh viên: ${singleTargetStudent.studentId}`
                  : resetScope === 'all'
                  ? `toàn bộ ${students.length} sinh viên`
                  : `${selectedStudentIds.length} sinh viên đã chọn`}
                ). Bạn có thể tải file Excel dự phòng trước khi đặt lại.
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                disabled={resetScope === 'selected' && !singleTargetStudent && selectedStudentIds.length === 0}
                className={`px-5 py-2 rounded-xl text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                  resetScope === 'selected' && !singleTargetStudent && selectedStudentIds.length === 0
                    ? 'bg-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Xác Nhận Đặt Lại Chỉ Số
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

