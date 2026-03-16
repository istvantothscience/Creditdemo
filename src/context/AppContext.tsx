import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, PointLog, Task } from '../types';
import { generateMockData } from '../mockData';
import { formatISO } from 'date-fns';

interface AppContextType {
  students: Student[];
  pointLogs: PointLog[];
  tasks: Task[];
  addPointLog: (studentId: string, amount: number, reason: string) => void;
  addGlobalPoints: (amount: number, reason: string) => void;
  addTask: (studentId: string, title: string, rewardPoints: number) => void;
  completeTask: (taskId: string) => void;
  getStudentTotalPoints: (studentId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('school-gamification-data');
    if (savedData) {
      const { students, pointLogs, tasks } = JSON.parse(savedData);
      setStudents(students);
      setPointLogs(pointLogs);
      setTasks(tasks);
    } else {
      const initialData = generateMockData();
      setStudents(initialData.students);
      setPointLogs(initialData.pointLogs);
      setTasks(initialData.tasks);
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('school-gamification-data', JSON.stringify({ students, pointLogs, tasks }));
    }
  }, [students, pointLogs, tasks]);

  const addPointLog = (studentId: string, amount: number, reason: string) => {
    const newLog: PointLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      amount,
      reason,
      date: formatISO(new Date()),
    };
    setPointLogs((prev) => [newLog, ...prev]);
  };

  const addGlobalPoints = (amount: number, reason: string) => {
    const newLogs: PointLog[] = students.map((student) => ({
      id: `log-${Date.now()}-${student.id}`,
      studentId: student.id,
      amount,
      reason,
      date: formatISO(new Date()),
    }));
    setPointLogs((prev) => [...newLogs, ...prev]);
  };

  const addTask = (studentId: string, title: string, rewardPoints: number) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      title,
      rewardPoints,
      status: 'active',
      createdAt: formatISO(new Date()),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.status === 'active') {
          addPointLog(task.studentId, task.rewardPoints, `Feladat teljesítve: ${task.title}`);
          return { ...task, status: 'completed' };
        }
        return task;
      })
    );
  };

  const getStudentTotalPoints = (studentId: string) => {
    return pointLogs
      .filter((log) => log.studentId === studentId)
      .reduce((sum, log) => sum + log.amount, 0);
  };

  return (
    <AppContext.Provider
      value={{
        students,
        pointLogs,
        tasks,
        addPointLog,
        addGlobalPoints,
        addTask,
        completeTask,
        getStudentTotalPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
