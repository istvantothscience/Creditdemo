import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Student } from '../types';
import { Trophy, Target, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { hu } from 'date-fns/locale';

interface StudentDashboardProps {
  student: Student;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const { pointLogs, tasks, getStudentTotalPoints, completeTask } = useAppContext();

  const totalPoints = getStudentTotalPoints(student.id);
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const pointsToNextLevel = 100 - (totalPoints % 100);
  const progressPercentage = (totalPoints % 100);

  const studentLogs = pointLogs.filter((log) => log.studentId === student.id);
  const studentTasks = tasks.filter((task) => task.studentId === student.id);

  // Group logs by month for chart
  const monthlyData = studentLogs.reduce((acc, log) => {
    const month = format(parseISO(log.date), 'MMM', { locale: hu });
    if (!acc[month]) {
      acc[month] = { name: month, Jutalmak: 0, Levonások: 0 };
    }
    if (log.amount > 0) {
      acc[month].Jutalmak += log.amount;
    } else {
      acc[month].Levonások += Math.abs(log.amount);
    }
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(monthlyData).reverse();

  const classTotalPoints = pointLogs.reduce((sum, log) => sum + log.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Profile & Level */}
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-crea-light mb-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img src={student.avatar} alt={student.name} className="w-32 h-32 rounded-full bg-slate-50 shadow-md border-4 border-white" />
        <div className="flex-1 w-full">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center md:text-left">{student.name}</h2>
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
            <div className="bg-crea-purple/10 text-crea-purple px-4 py-2 rounded-2xl font-bold flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Szint {currentLevel}</span>
            </div>
            <div className="text-slate-500 font-medium">
              Összpontszám: <span className="text-slate-800 font-bold">{totalPoints}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-crea-teal to-crea-darkTeal h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500 font-medium text-center md:text-left">
            Még <strong className="text-crea-teal">{pointsToNextLevel} pont</strong> a következő szintig!
          </p>
        </div>
      </div>

      {/* Class Goal */}
      <div className="bg-gradient-to-br from-crea-teal to-crea-darkTeal rounded-3xl p-6 shadow-crea-teal/25 shadow-xl mb-8 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10 mb-4">
          <div>
            <p className="text-sm font-medium opacity-90">Osztály cél</p>
            <p className="text-xl font-bold mt-1">Közös mozizás</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl flex items-center space-x-2">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span>{classTotalPoints} pont</span>
            <span>1000 pont</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3">
            <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (classTotalPoints / 1000) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tasks & Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tasks */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-crea-light">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-crea-purple/10 p-3 rounded-2xl">
                <Target className="w-6 h-6 text-crea-purple" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Aktív Feladatok</h3>
            </div>
            
            {studentTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 italic bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                Jelenleg nincs aktív feladatod.
              </div>
            ) : (
              <div className="space-y-4">
                {studentTasks.map((task) => (
                  <div key={task.id} className={`p-5 rounded-2xl border transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-crea-purple/20 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Clock className="w-6 h-6 text-amber-500" />
                        )}
                        <div>
                          <h4 className={`font-bold text-lg ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">Jutalom: <span className="text-crea-purple font-bold">+{task.rewardPoints} pont</span></p>
                        </div>
                      </div>
                      {task.status === 'active' && (
                        <button 
                          onClick={() => completeTask(task.id)}
                          className="px-4 py-2 bg-crea-purple/10 hover:bg-crea-purple/20 text-crea-purple font-bold rounded-xl transition-colors"
                        >
                          Kész
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-crea-light">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Havi Teljesítmény</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="Jutalmak" fill="#0097b2" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Levonások" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-crea-light overflow-hidden flex flex-col h-[800px]">
          <div className="p-6 border-b border-crea-light bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800">Legutóbbi Események</h3>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {studentLogs.length === 0 ? (
              <p className="text-slate-500 italic text-center py-8">Még nincsenek események.</p>
            ) : (
              studentLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {log.amount > 0 ? <Trophy className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{log.reason}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">{format(parseISO(log.date), 'yyyy. MM. dd. HH:mm')}</p>
                  </div>
                  <div className={`font-bold text-lg shrink-0 ${log.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {log.amount > 0 ? `+${log.amount}` : log.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
