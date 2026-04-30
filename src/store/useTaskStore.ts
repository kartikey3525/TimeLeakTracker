import { create } from 'zustand';
import { Task, createTask, startTask, endTask } from '../core/taskEngine';

export type SoundType = 'rain' | 'forest' | 'focus';

type TaskState = {
  currentTask: Task | null;
  tasks: Task[];

  isFocusMode: boolean;
  showJournal: boolean; // ✅ NEW

  selectedSound: SoundType;
  setSound: (sound: SoundType) => void;

  createNewTask: (title: string) => Task;
  startTaskNow: (task: Task) => void;
  endCurrentTask: () => void;

  enterFocusMode: () => void;
  exitFocusMode: () => void;

  openJournal: () => void;
  closeJournal: () => void;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  currentTask: null,
  tasks: [],

  isFocusMode: false,
  showJournal: false,

  selectedSound: 'rain',
  setSound: sound => set({ selectedSound: sound }),

  createNewTask: (title: string) => {
    return createTask(title);
  },

  startTaskNow: (task: Task) => {
    const updated = startTask(task);

    set({
      currentTask: updated,
      tasks: [...get().tasks, updated],
    });
  },

  endCurrentTask: () => {
    const task = get().currentTask;
    if (!task) return;

    const updated = endTask(task);

    set({
      currentTask: null,
      tasks: get().tasks.map(t => (t.id === updated.id ? updated : t)),
    });

    console.log('Trigger Journal Flow');

    // ✅ TRIGGER JOURNAL HERE
    set({ showJournal: true });
  },

  enterFocusMode: () => set({ isFocusMode: true }),

  exitFocusMode: () => set({ isFocusMode: false }),

  openJournal: () => set({ showJournal: true }),
  closeJournal: () => set({ showJournal: false }),
}));