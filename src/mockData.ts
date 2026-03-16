import { Student, PointLog, Task } from './types';
import { subDays, formatISO } from 'date-fns';

const firstNames = ['Péter', 'Anna', 'Bence', 'Eszter', 'László', 'Zsófia', 'Gábor', 'Katalin', 'Máté', 'Dóra', 'Tamás', 'Réka', 'Balázs', 'Nikolett', 'Dávid'];
const lastNames = ['Kovács', 'Nagy', 'Szabó', 'Tóth', 'Varga', 'Kiss', 'Molnár', 'Farkas', 'Horváth', 'Papp', 'Takács', 'Juhász', 'Mészáros', 'Simon', 'Fekete'];

export const presetReasons = [
  { text: 'Órai aktivitás', amount: 2 },
  { text: 'Házi feladat', amount: 3 },
  { text: 'Késés', amount: -2 },
  { text: 'Segítségnyújtás', amount: 5 },
  { text: 'Kiváló felelet', amount: 4 },
  { text: 'Felszerelés hiánya', amount: -3 },
  { text: 'Zavaró viselkedés', amount: -5 },
  { text: 'Szorgalmi feladat', amount: 5 },
];

const taskTitles = [
  'Prezentáció készítése',
  'Külön feladat megoldása',
  'Segédanyag gyűjtése',
  'Tábla letörlése',
  'Füzet ellenőrzése',
];

export const generateMockData = () => {
  const students: Student[] = [];
  const pointLogs: PointLog[] = [];
  const tasks: Task[] = [];

  const numStudents = 12;

  for (let i = 0; i < numStudents; i++) {
    const name = `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
    const id = `student-${i + 1}`;
    students.push({
      id,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    // Generate 10-15 point logs per student
    const numLogs = Math.floor(Math.random() * 6) + 10;
    for (let j = 0; j < numLogs; j++) {
      const reasonObj = presetReasons[Math.floor(Math.random() * presetReasons.length)];
      const daysAgo = Math.floor(Math.random() * 90); // past 3 months
      pointLogs.push({
        id: `log-${id}-${j}`,
        studentId: id,
        amount: reasonObj.amount,
        reason: reasonObj.text,
        date: formatISO(subDays(new Date(), daysAgo)),
      });
    }

    // Generate 1-2 tasks per student
    const numTasks = Math.floor(Math.random() * 2) + 1;
    for (let k = 0; k < numTasks; k++) {
      const daysAgo = Math.floor(Math.random() * 14);
      tasks.push({
        id: `task-${id}-${k}`,
        studentId: id,
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        rewardPoints: Math.floor(Math.random() * 5) + 5,
        status: Math.random() > 0.5 ? 'active' : 'completed',
        createdAt: formatISO(subDays(new Date(), daysAgo)),
      });
    }
  }

  // Sort point logs by date descending
  pointLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { students, pointLogs, tasks };
};
