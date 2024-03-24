import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useSaveStore = create(devtools(
  (set) => ({
    project: {},
    checkpoints: [],
    tasks: [],

    clearSaveStore: () => set((state) => ({
      project: {},
      checkpoints: [],
      tasks: [],
    })),
    loadProject: (projectObject) => set((state) => ({ project: projectObject })),
    loadCheckpoints: (checkpointsArray) => set((state) => ({ checkpoints: checkpointsArray })),
    loadTasks: (tasksArray) => set((state) => ({ tasks: tasksArray })),

    updateProject: (updatedProject) => set((state) => ({ project: updatedProject })),

    createNewCheckpoint: (newCheckpoint) => set((state) => ({ checkpoints: [...state.checkpoints, newCheckpoint] })),

    updateCheckpoint: (updatedCheckpoint) => set((state) => ({
      checkpoints: state.checkpoints.map((checkpoint) => (checkpoint.localId === updatedCheckpoint.localId
        ? updatedCheckpoint
        : checkpoint)),
    })),

    deleteCheckpoint: (deletedCheckpoint) => set((state) => ({
      checkpoints: state.checkpoints.filter(
        (checkpoint) => checkpoint.localId !== deletedCheckpoint.localId,
      ),
    })),

    createNewTask: (newTask) => set((preVal) => ({ tasks: [...preVal.tasks, newTask] })),

    updateTask: (updatedTask) => set((preVal) => ({
      tasks: preVal.tasks.map((task) => (task.localId === updatedTask.localId ? updatedTask : task)),
    })),

    deleteTask: (deletedTask) => set((preVal) => ({
      tasks: preVal.tasks.filter(
        (task) => task.localId !== deletedTask.localId,
      ),
    })),
  }),
));

export default useSaveStore;
