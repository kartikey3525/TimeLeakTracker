export type TaskStatus = 'pending' | 'running' | 'completed';

export type Task = {
  id: string;
  title: string;

  status: TaskStatus;

  startedAt?: number;
  endedAt?: number;
};

export const createTask = (title: string): Task => {
  return {
    id: Date.now().toString(),
    title,
    status: 'pending',
  };
};

export const startTask = (task: Task): Task => {
  return {
    ...task,
    status: 'running',
    startedAt: Date.now(),
  };
};

export const endTask = (task: Task): Task => {
  return {
    ...task,
    status: 'completed',
    endedAt: Date.now(),
  };
};
