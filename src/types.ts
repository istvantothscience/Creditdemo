export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface PointLog {
  id: string;
  studentId: string;
  amount: number;
  reason: string;
  date: string; // ISO string
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  rewardPoints: number;
  status: 'active' | 'completed';
  createdAt: string; // ISO string
}
