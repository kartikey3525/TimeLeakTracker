export type Task = {
  id: string;
  title: string;
  startedAt?: number;
  endedAt?: number;
};

export const createTask = (title: string): Task => {
  return {
    id: Date.now().toString(),
    title,
  };
};

export const startTask = (task: Task): Task => {
  return {
    ...task,
    startedAt: Date.now(),
  };
};

export const endTask = (task: Task): Task => {
  return {
    ...task,
    endedAt: Date.now(),
  };
};
