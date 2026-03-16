import React, { useState } from 'react';
import { Student } from '../types';
import { useAppContext } from '../context/AppContext';
import { X, CheckCircle, Clock } from 'lucide-react';
import { presetReasons } from '../mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { hu } from 'date-fns/locale';

interface ModalProps {
  student: Student;
  onClose: () => void;
}

export const CustomPointsModal: React.FC<ModalProps> = ({ student, onClose }) => {
  const { addPointLog } = useAppContext();
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (!isNaN(numAmount) && reason.trim()) {
      addPointLog(student.id, numAmount, reason.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Pontozás: {student.name}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pontszám</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-crea-teal focus:border-transparent outline-none transition-all"
              placeholder="Pl. 5 vagy -3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Indoklás</label>
            <input
              type="text"
              list="reasons-list"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-crea-teal focus:border-transparent outline-none transition-all"
              placeholder="Válassz vagy írj be egy indokot"
              required
            />
            <datalist id="reasons-list">
              {presetReasons.map((r, idx) => (
                <option key={idx} value={r.text} />
              ))}
            </datalist>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Mégse
            </button>
            <button type="submit" className="px-6 py-3 rounded-xl font-medium text-white bg-crea-teal hover:bg-crea-darkTeal transition-colors shadow-sm">
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AssignTaskModal: React.FC<ModalProps> = ({ student, onClose }) => {
  const { addTask } = useAppContext();
  const [title, setTitle] = useState<string>('');
  const [rewardPoints, setRewardPoints] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPoints = parseInt(rewardPoints, 10);
    if (!isNaN(numPoints) && title.trim()) {
      addTask(student.id, title.trim(), numPoints);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Feladat: {student.name}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Feladat megnevezése</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-crea-purple focus:border-transparent outline-none transition-all"
              placeholder="Pl. Külön prezentáció"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Jutalom pont</label>
            <input
              type="number"
              value={rewardPoints}
              onChange={(e) => setRewardPoints(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-crea-purple focus:border-transparent outline-none transition-all"
              placeholder="Pl. 10"
              min="1"
              required
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Mégse
            </button>
            <button type="submit" className="px-6 py-3 rounded-xl font-medium text-white bg-crea-purple hover:bg-crea-darkPurple transition-colors shadow-sm">
              Kiosztás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const StudentStatsModal: React.FC<ModalProps> = ({ student, onClose }) => {
  const { pointLogs, tasks, getStudentTotalPoints } = useAppContext();

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

  const chartData = Object.values(monthlyData).reverse(); // Assuming logs are sorted desc, we want asc for chart

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-crea-light">
        <div className="p-6 border-b border-crea-light flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full bg-white shadow-sm" />
            <div>
              <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
              <p className="text-sm text-slate-500 font-medium">Összpontszám: {getStudentTotalPoints(student.id)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Chart & Tasks */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold text-slate-800 mb-4">Havi Teljesítmény</h4>
              <div className="h-64 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="Jutalmak" fill="#0097b2" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Levonások" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-800 mb-4">Feladatok</h4>
              {studentTasks.length === 0 ? (
                <p className="text-slate-500 italic">Nincsenek feladatok.</p>
              ) : (
                <div className="space-y-3">
                  {studentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-500" />
                        )}
                        <span className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="font-bold text-crea-purple">+{task.rewardPoints}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: History */}
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-4">Előzmények</h4>
            <div className="space-y-4">
              {studentLogs.slice(0, 15).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div>
                    <p className="font-medium text-slate-800">{log.reason}</p>
                    <p className="text-xs text-slate-400 mt-1">{format(parseISO(log.date), 'yyyy. MM. dd. HH:mm')}</p>
                  </div>
                  <span className={`font-bold text-lg ${log.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {log.amount > 0 ? `+${log.amount}` : log.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
