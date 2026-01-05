export interface User {
  id: number;
  email: string;
  passwordHash: string;
}

export interface Project {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}