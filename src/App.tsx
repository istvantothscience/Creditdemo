/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { GraduationCap, UserCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { students } = useAppContext();
  const [view, setView] = useState<'teacher' | 'student'>('teacher');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Set initial student when switching to student view
  React.useEffect(() => {
    if (view === 'student' && !selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [view, students, selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <div className="flex items-center text-crea-teal font-black text-2xl tracking-wide leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                  School Lab
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-[0.65rem] font-bold text-slate-400 tracking-[0.2em]">LEARN AND BEYOND.</span>
                  <div className="h-px bg-slate-200 w-8 ml-2"></div>
                </div>
              </div>
            </div>

            {/* View Switcher */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
              <button
                onClick={() => setView('teacher')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === 'teacher'
                    ? 'bg-white text-crea-teal shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <UserCircle className="w-4 h-4" />
                <span>Tanári Nézet</span>
              </button>
              <button
                onClick={() => setView('student')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === 'student'
                    ? 'bg-white text-crea-purple shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Diák Nézet</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-8">
        {view === 'teacher' ? (
          <TeacherDashboard />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            {/* Student Selector Dropdown for Demo Purposes */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 mb-8">
              <label htmlFor="student-select" className="font-bold text-slate-700">
                Válassz diákot a demóhoz:
              </label>
              <select
                id="student-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="flex-1 max-w-xs px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-crea-purple focus:border-transparent outline-none font-medium text-slate-800 bg-slate-50 hover:bg-white transition-colors cursor-pointer"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent ? (
              <StudentDashboard student={selectedStudent} />
            ) : (
              <div className="text-center py-12 text-slate-500">
                Kérlek válassz egy diákot.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
