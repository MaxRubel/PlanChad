import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import useSaveStore from './saveStore';

const useAnimationStore = create(devtools(
  (set, get) => ({
    reorderPaused: false,
    minAll: 0,
    completeTasksHidden: false,
    checkpointsDragging: false,

    checkpointsAreBeingDragged: () => {
      set((state) => ({
        checkpointsDragging: true,
      }));
    },

    checkpointsAreNotBeingDragged: () => {
      set((state) => ({
        checkpointsDragging: false,
      }));
    },

    resetAnimations: () => {
      set((state) => ({
        reorderPaused: false,
        minAll: 0,
      }));
    },
    pauseReorder: () => {
      const { checkpointsDragging } = useAnimationStore.getState();
      if (checkpointsDragging) {
        return;
      }
      set((state) => ({
        reorderPaused: true,
      }));

      setTimeout(() => {
        set((state) => ({ reorderPaused: false }));
      }, 500);
    },

    minimizeAll: () => {
      set((state) => ({
        minAll: state.minAll + 1,
        reorderPaused: true,
      }));
    },

    hideCompletedTasks: () => {
      set((state) => ({
        completeTasksHidden: !state.completeTasksHidden,
      }));
    },

    showProgress: () => {
      useSaveStore.setState((state) => ({
        project: { ...state.project, progressIsShowing: !state.project.progressIsShowing },
      }));
    },

  }),

));

export default useAnimationStore;
