export interface Task {
  id: string;
  content: string;
  column: 'start' | 'in_progress' | 'done';
  color: string;
}

export type Column = 'start' | 'in_progress' | 'done';