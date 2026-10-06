/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Student,
  University,
  Faculty,
  ClassItem,
  DebateTopic,
  CaseStudy,
  GroupRoom,
  DailyQuest,
  AppSettings,
  UserRole,
  RubricEvaluation
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_UNIVERSITIES,
  INITIAL_FACULTIES,
  INITIAL_CLASSES,
  INITIAL_TOPICS,
  INITIAL_CASES,
  INITIAL_GROUP_ROOMS,
  INITIAL_QUESTS
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { DebateArena } from './components/DebateArena';
import { CaseStudyAnalysis } from './components/CaseStudyAnalysis';
import { GroupDebateCouncil } from './components/GroupDebateCouncil';
import { LeaderboardView } from './components/LeaderboardView';
import { LearningRoadmap } from './components/LearningRoadmap';
import { AdminStudentManagement } from './components/AdminStudentManagement';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { AcademicTranscriptModal } from './components/AcademicTranscriptModal';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  // Persistence with localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('critix_students_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS;
  });

  const [universities, setUniversities] = useState<University[]>(() => {
    try {
      const saved = localStorage.getItem('critix_unis_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_UNIVERSITIES;
  });

  const [faculties, setFaculties] = useState<Faculty[]>(() => {
    try {
      const saved = localStorage.getItem('critix_faculties_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FACULTIES;
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    try {
      const saved = localStorage.getItem('critix_classes_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CLASSES;
  });

  const [topics, setTopics] = useState<DebateTopic[]>(() => {
    try {
      const saved = localStorage.getItem('critix_topics_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TOPICS;
  });
  const [cases, setCases] = useState<CaseStudy[]>(() => {
    try {
      const saved = localStorage.getItem('critix_cases_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CASES;
  });
  const [rooms, setRooms] = useState<GroupRoom[]>(() => {
    try {
      const saved = localStorage.getItem('critix_rooms_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GROUP_ROOMS;
  });
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);

  // Active student & role
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem('critix_active_student_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return students[0] || null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'debate' | 'case' | 'group' | 'leaderboard' | 'roadmap' | 'admin'>('debate');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('critix_settings_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      theme: 'theme-light',
      fontScale: 'font-scale-normal',
      layoutDensity: 'comfortable',
      isOffline: false,
      reminderEnabled: true,
      reminderTime: '20:00',
      cloudSyncPlatform: 'critix_vault'
    };
  });

  // Modal open states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Unread notification count based on pending quests and streak
  const unreadCount = (currentStudent && currentStudent.streakDays > 0 ? 1 : 0) + quests.filter(q => !q.completed).length + 1;

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('critix_students_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('critix_unis_v3', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('critix_faculties_v3', JSON.stringify(faculties));
  }, [faculties]);

  useEffect(() => {
    localStorage.setItem('critix_classes_v3', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('critix_topics_v3', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('critix_cases_v3', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('critix_rooms_v3', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('critix_active_student_v3', JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem('critix_active_student_v3');
    }
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('critix_settings_v3', JSON.stringify(settings));
  }, [settings]);

  // Apply Theme & Font Scale classes to document body
  useEffect(() => {
    document.body.className = `${settings.theme} ${settings.fontScale}`;
  }, [settings.theme, settings.fontScale]);

  // Handle Login Student
  const handleLoginStudent = (student: Student) => {
    setCurrentStudent(student);
    setCurrentRole('student');
  };

  // Handle Login Admin
  const handleLoginAdmin = (role: UserRole = 'admin') => {
    setCurrentRole(role);
    const adminUser: Student = {
      id: 'admin-master',
      studentId: 'admin',
      lastName: 'Ban',
      firstName: 'Quản Trị',
      fullName: 'Quản Trị Viên Hệ Thống (Admin)',
      gender: 'Nam',
      birthDate: '01/01/1990',
      className: 'BAN-QUAN-TRI',
      faculty: 'Hội đồng Khoa học & Đào tạo',
      university: 'Trường Đại học Nguyễn Tất Thành (NTTU)',
      password: 'admin',
      status: 'active',
      role: role,
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
    setCurrentStudent(adminUser);
    setActiveTab('admin');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentRole('student');
    setIsLoginModalOpen(true);
  };

  // Complete debate handler
  const handleCompleteDebate = (rubric: RubricEvaluation, xpEarned: number) => {
    if (!currentStudent) return;
    const newDebates = currentStudent.totalDebates + 1;
    const newRubricAvg = Math.round((currentStudent.rubricAverage * (newDebates - 1) + rubric.overallScore) / newDebates);
    const newXp = currentStudent.xp + xpEarned;
    const newStreak = currentStudent.streakDays + 1;

    const updated = {
      ...currentStudent,
      totalDebates: newDebates,
      rubricAverage: newRubricAvg,
      xp: newXp,
      streakDays: newStreak,
      rubricScores: {
        logic: Math.round((currentStudent.rubricScores.logic + rubric.dimensionScores.logic) / 2),
        evidence: Math.round((currentStudent.rubricScores.evidence + rubric.dimensionScores.evidence) / 2),
        rebuttal: Math.round((currentStudent.rubricScores.rebuttal + rubric.dimensionScores.rebuttal) / 2),
        toulmin: Math.round((currentStudent.rubricScores.toulmin + rubric.dimensionScores.toulmin) / 2),
        multiPerspective: Math.round((currentStudent.rubricScores.multiPerspective + rubric.dimensionScores.multiPerspective) / 2)
      }
    };

    setCurrentStudent(updated);
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  // Complete case handler
  const handleCompleteCase = (rubric: RubricEvaluation, xpEarned: number) => {
    if (!currentStudent) return;
    const updated = {
      ...currentStudent,
      casesAnalyzed: currentStudent.casesAnalyzed + 1,
      xp: currentStudent.xp + xpEarned,
      streakDays: currentStudent.streakDays + 1
    };
    setCurrentStudent(updated);
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  // Complete quest handler
  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
    if (currentStudent) {
      const updated = { ...currentStudent, xp: currentStudent.xp + quest.rewardXp };
      setCurrentStudent(updated);
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    }
  };

  // Export full JSON backup
  const handleExportBackupJson = () => {
    const backupData = {
      version: '3.8',
      exportedAt: new Date().toISOString(),
      students,
      universities,
      faculties,
      classes,
      settings
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sao_Luu_CritixAI_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportBackupJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.students && Array.isArray(parsed.students)) {
          setStudents(parsed.students);
          if (parsed.universities) setUniversities(parsed.universities);
          if (parsed.faculties) setFaculties(parsed.faculties);
          if (parsed.classes) setClasses(parsed.classes);
          alert('Đã khôi phục dữ liệu từ file backup thành công!');
        }
      } catch (err) {
        alert('File JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        currentStudent={currentStudent}
        currentRole={currentRole}
        isOffline={settings.isOffline}
        unreadNotificationCount={unreadCount}
        onToggleOffline={() => setSettings(s => ({ ...s, isOffline: !s.isOffline }))}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenTranscript={() => setIsTranscriptModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'debate' && (
          <DebateArena
            topics={topics}
            currentStudent={currentStudent}
            isOffline={settings.isOffline}
            onCompleteDebate={handleCompleteDebate}
            onAddTopic={(newTopic) => setTopics(prev => [newTopic, ...prev])}
          />
        )}

        {activeTab === 'case' && (
          <CaseStudyAnalysis
            cases={cases}
            currentStudent={currentStudent}
            isOffline={settings.isOffline}
            onCompleteCase={handleCompleteCase}
            onAddCase={(newCase) => setCases(prev => [newCase, ...prev])}
          />
        )}

        {activeTab === 'group' && (
          <GroupDebateCouncil
            rooms={rooms}
            currentStudent={currentStudent}
            onUpdateRooms={setRooms}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            students={students}
            currentStudent={currentStudent}
            onNavigateToDebate={() => setActiveTab('debate')}
          />
        )}

        {activeTab === 'roadmap' && (
          <LearningRoadmap
            currentStudent={currentStudent}
            quests={quests}
            onCompleteQuest={handleCompleteQuest}
            onUseStreakFreeze={() => {
              // Notification
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminStudentManagement
            students={students}
            universities={universities}
            faculties={faculties}
            classes={classes}
            currentRole={currentRole}
            onUpdateStudents={setStudents}
            onUpdateUniversities={setUniversities}
            onUpdateFaculties={setFaculties}
            onUpdateClasses={setClasses}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            CritixAI — Nền tảng Rèn Luyện Kỹ Năng Tư Duy Phản Biện & Tranh Biện Học Thuật
          </div>
          <div>
            Trường Đại học Nguyễn Tất Thành (NTTU) • Niên khóa 2024 - 2028
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        students={students}
        onLoginStudent={handleLoginStudent}
        onLoginAdmin={handleLoginAdmin}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onExportBackupJson={handleExportBackupJson}
        onImportBackupJson={handleImportBackupJson}
      />

      <AcademicTranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        student={currentStudent}
      />

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        currentStudent={currentStudent}
        quests={quests}
        settings={settings}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsNotificationCenterOpen(false);
        }}
      />
    </div>
  );
}
