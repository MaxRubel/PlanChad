import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useSaveStore = create(devtools(
  (set) => ({
    project: {},
    checkpoints: [],
    tasks: [],
    invites: [],
    allProjects: [],
    allTasks: [],
    projectsLoaded: false,

    clearSaveStore: () => set((state) => ({
      project: {},
      checkpoints: [],
      tasks: [],
      invites: [],
      allTasks: state.allTasks,
      allProjects: state.allProjects,
    })),

    projectsHaveBeenLoaded: (value) => set((state) => ({ projectsLoaded: value })),
    // ----load-in-data-----------
    loadProject: (projectObject) => set((state) => ({ project: projectObject })),
    loadCheckpoints: (checkpointsArray) => set((state) => ({ checkpoints: checkpointsArray })),
    loadTasks: (tasksArray) => set((state) => ({ tasks: tasksArray })),
    loadInvites: (invitesArray) => set((state) => ({ invites: invitesArray })),
    loadAllProjects: (projectsArray) => set((state) => ({ allProjects: projectsArray })),
    loadAllCheckpoints: (tasksArray) => set((state) => ({ allCheckpoints: tasksArray })),
    loadAllTasks: (tasksArray) => set((state) => ({ allTasks: tasksArray })),

    // ------project-------
    createNewProject: (newProject) => set((state) => ({ allProjects: [...state.allProjects, newProject] })),
    updateProject: (updatedProject) => set((state) => ({ project: updatedProject })),

    // ----checkpoints-------
    createNewCheckpoint: (newCheckpoint) => set((state) => ({
      checkpoints: [...state.checkpoints, newCheckpoint],
    })),
    updateCheckpoint: (updatedCheckpoint) => set((state) => ({
      checkpoints: state.checkpoints.map((checkpoint) => (
        checkpoint.localId === updatedCheckpoint.localId ? updatedCheckpoint : checkpoint)),
    })),
    deleteCheckpoint: (deletedCheckpoint) => set((state) => ({
      checkpoints: state.checkpoints.filter((checkpoint) => checkpoint.localId !== deletedCheckpoint.localId),
      allTasks: state.allTasks.filter((task) => task.checkpointId !== deletedCheckpoint.localId),
      tasks: state.tasks.filter((task) => task.checkpointId !== deletedCheckpoint.localId),
    })),

    // ------tasks--------
    createNewTask: (newTask) => set((preVal) => ({
      tasks: [...preVal.tasks, newTask],
      allTasks: [...preVal.allTasks, newTask],
    })),
    updateTask: (updatedTask) => set((preVal) => ({
      tasks: preVal.tasks.map((task) => (task.localId === updatedTask.localId ? updatedTask : task)),
    })),
    deleteTask: (deletedTask) => set((preVal) => ({
      tasks: preVal.tasks.filter((task) => task.localId !== deletedTask.localId),
      allTasks: preVal.allTasks.filter((task) => task.localId !== deletedTask.localId),
    })),

    // ------invites---------
    createNewInvite: (newInvite) => set((preVal) => ({ invites: [...preVal.invites, newInvite] })),
    updateInvite: (updatedInvite) => set((preVal) => ({
      invites: preVal.invites.map((invite) => (
        invite.localId === updatedInvite.localId ? updatedInvite : invite)),
    })),
    deleteInvite: (deletedInvite) => set((preVal) => ({
      invites: preVal.invite.filter(
        (invite) => invite.localId !== deletedInvite.localId,
      ),
    })),
  }),
));

export default useSaveStore;
