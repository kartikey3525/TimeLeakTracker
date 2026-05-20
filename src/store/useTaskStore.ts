import { create } from 'zustand';
import { Task, createTask, startTask, endTask } from '../core/taskEngine';

export type SoundType = 'rain' | 'forest' | 'focus';

type TaskState = {
  currentTask: Task | null;
  tasks: Task[];

  isFocusMode: boolean;

  showJournal: boolean;
  completedTask: Task | null;

  selectedSound: SoundType;

  setSound: (sound: SoundType) => void;

  createNewTask: (title: string) => void;

  startTaskNow: (taskId: string) => void;

  endCurrentTask: () => void;

  enterFocusMode: () => void;
  exitFocusMode: () => void;

  closeJournal: () => void;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  currentTask: null,

  tasks: [],

  isFocusMode: false,

  showJournal: false,

  completedTask: null,

  selectedSound: 'rain',

  setSound: sound => set({ selectedSound: sound }),

  createNewTask: (title: string) => {
    const task = createTask(title);

    set({
      tasks: [task, ...get().tasks],
    });
  },

  startTaskNow: (taskId: string) => {
    const tasks = get().tasks;

    const found = tasks.find(t => t.id === taskId);

    if (!found) return;

    const updated = startTask(found);

    set({
      currentTask: updated,

      isFocusMode: true,

      tasks: tasks.map(t => (t.id === taskId ? updated : t)),
    });
  },

  endCurrentTask: () => {
    const activeTask = get().currentTask;

    if (!activeTask) return;

    const updated = endTask(activeTask);

    set(state => ({
      completedTask: updated,

      showJournal: true,

      currentTask: null,

      isFocusMode: false,

      tasks: state.tasks.map(t => (t.id === updated.id ? updated : t)),
    }));
  },

  enterFocusMode: () => set({ isFocusMode: true }),

  exitFocusMode: () => set({ isFocusMode: false }),

  closeJournal: () =>
    set({
      showJournal: false,
    }),
}));