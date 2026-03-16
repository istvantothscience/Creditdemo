import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, Star, Plus, Minus, Gift, ClipboardList, BarChart2 } from 'lucide-react';
import { Student } from '../types';
import { CustomPointsModal, AssignTaskModal, StudentStatsModal } from './Modals';

export const TeacherDashboard: React.FC = () => {
  const { students, pointLogs, tasks, addGlobalPoints, addPointLog, getStudentTotalPoints } = useAppContext();
  
  const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<Student | null>(null);
  const [selectedStudentForTask, setSelectedStudentForTask] = useState<Student | null>(null);
  const [selectedStudentForStats, setSelectedStudentForStats] = useState<Student | null>(null);

  const totalStudents = students.length;
  const totalPoints = pointLogs.reduce((sum, log) => sum + log.amount, 0);

  const handleGlobalPoints = () => {
    addGlobalPoints(5, 'Bizalmi alap');
  };

  const handleQuickPoint = (studentId: string, amount: number) => {
    addPointLog(studentId, amount, amount > 0 ? 'Gyors pont' : 'Gyors levonás');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-crea-teal/20 shadow-lg border border-crea-light flex items-center space-x-4">
          <div className="bg-crea-teal/10 p-4 rounded-2xl">
            <Users className="w-8 h-8 text-crea-teal" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Összes diák</p>
            <p className="text-3xl font-bold text-slate-800">{totalStudents}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-crea-purple/30 shadow-lg border border-crea-light flex flex-col justify-center">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-crea-purple/10 p-4 rounded-2xl">
              <Star className="w-8 h-8 text-crea-purple" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Osztály cél</p>
              <p className="text-xl font-bold text-slate-800">Közös mozizás</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium text-slate-600">
              <span>{totalPoints} pont</span>
              <span>1000 pont</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-crea-purple h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalPoints / 1000) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-crea-teal to-crea-darkTeal rounded-3xl p-6 shadow-crea-teal/25 shadow-xl flex items-center justify-between text-white">
          <div>
            <p className="text-sm font-medium opacity-90">Közös jutalom</p>
            <p className="text-xl font-bold mt-1">Bizalmi alap</p>
          </div>
          <button 
            onClick={handleGlobalPoints}
            className="bg-white/20 hover:bg-white/30 transition-colors p-4 rounded-2xl flex items-center space-x-2"
            title="Közös jutalom: +5 pont mindenkinek"
          >
            <Gift className="w-6 h-6" />
            <span className="font-bold text-lg">+5</span>
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-crea-light overflow-hidden">
        <div className="p-6 border-b border-crea-light">
          <h2 className="text-xl font-bold text-slate-800">Diákok</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Diák</th>
                <th className="p-4 font-medium text-center">Gyors Pontok</th>
                <th className="p-4 font-medium text-center">Aktuális Feladatok</th>
                <th className="p-4 font-medium text-center">Összpontszám</th>
                <th className="p-4 font-medium text-right">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer group"
                      onClick={() => setSelectedStudentForStats(student)}
                    >
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-slate-100" />
                      <span className="font-medium text-slate-800 group-hover:text-crea-teal transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      {/* Negative Points */}
                      <div className="flex space-x-1 mr-4">
                        {[-1, -2, -3, -4, -5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleQuickPoint(student.id, val)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:scale-110 transition-all"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      {/* Positive Points */}
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleQuickPoint(student.id, val)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:scale-110 transition-all"
                          >
                            +{val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap justify-center gap-1 max-w-[200px] mx-auto">
                      {tasks.filter(t => t.studentId === student.id && t.status === 'active').length > 0 ? (
                        tasks.filter(t => t.studentId === student.id && t.status === 'active').map(task => (
                          <span key={task.id} className="text-[10px] bg-crea-purple/10 text-crea-purple px-2 py-0.5 rounded-full font-medium truncate max-w-[150px]" title={task.title}>
                            {task.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold">
                      {getStudentTotalPoints(student.id)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedStudentForPoints(student)}
                        className="p-2 text-crea-teal hover:bg-crea-teal/10 rounded-xl transition-colors"
                        title="Egyedi pontozás"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSelectedStudentForTask(student)}
                        className="p-2 text-crea-purple hover:bg-crea-purple/10 rounded-xl transition-colors"
                        title="Feladat kiosztása"
                      >
                        <ClipboardList className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSelectedStudentForStats(student)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Statisztika"
                      >
                        <BarChart2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedStudentForPoints && (
        <CustomPointsModal 
          student={selectedStudentForPoints} 
          onClose={() => setSelectedStudentForPoints(null)} 
        />
      )}
      {selectedStudentForTask && (
        <AssignTaskModal 
          student={selectedStudentForTask} 
          onClose={() => setSelectedStudentForTask(null)} 
        />
      )}
      {selectedStudentForStats && (
        <StudentStatsModal 
          student={selectedStudentForStats} 
          onClose={() => setSelectedStudentForStats(null)} 
        />
      )}
    </div>
  );
};
