export type TaskStatus = 'todo' | 'completed';

export interface TaskItem {
  id: string;
  title: string;
  action: string;
  date: string;
  status: TaskStatus;
}
