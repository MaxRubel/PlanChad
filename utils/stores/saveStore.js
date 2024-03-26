import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { updateProject } from '../../api/project';
import { getInvitesByProject } from '../../api/invites';

const useSaveStore = create(devtools(
  (set, get) => ({
    project: {},
    checkpoints: [],
    tasks: [],
    invitesOfProject: [],
    invites: [],
    allProjects: [],
    allTasks: [],
    projectsLoaded: false,
    singleProjectRunning: false,
    zustandFinised: false,

    clearSaveStore: () => set((state) => ({
      project: {},
      checkpoints: [],
      tasks: [],
      invites: [],
      singleProjectRunning: false,
      zustandFinised: false,
    })),

    clearAllLocalData: () => set((state) => ({
      project: {},
      checkpoints: [],
      tasks: [],
      invites: [],
      allProjects: [],
      allTasks: [],
      projectsLoaded: false,
      singleProjectRunning: false,
    })),

    projectsHaveBeenLoaded: (value) => set((state) => ({ projectsLoaded: value })),

    // ----load-in-data-----------
    loadProject: (projectObject) => set((state) => ({ project: projectObject })),
    loadCheckpoints: (checkpointsArray) => {
      set((state) => ({ checkpoints: checkpointsArray }));
    },
    loadTasks: (tasksArray) => set((state) => ({ tasks: tasksArray })),
    loadInvites: (invitesArray) => set((state) => ({ invites: invitesArray })),
    loadAllProjects: (projectsArray) => set((state) => ({ allProjects: projectsArray })),
    loadAllTasks: (tasksArray) => set((state) => ({ allTasks: tasksArray })),

    // ------project-------
    createNewProject: (newProject) => set((state) => ({
      allProjects: [...state.allProjects, newProject],
    })),
    updateProject: (updatedProject) => set((state) => {
      const index = state.allProjects.findIndex((item) => item.projectId === updatedProject.projectId);
      const updatedProjects = [...state.allProjects];
      updatedProjects[index] = updatedProject;
      return {
        project: updatedProject,
        allProjects: updatedProjects,
      };
    }),
    deleteProject: (projectId) => set((state) => ({
      allProjects: state.allProjects.filter((item) => item.projectId !== projectId),
    })),
    hideCompletedTasksProjectData: () => set((state) => ({
      project: {
        ...state.project,
        hideCompletedTasks: !state.project.hideCompletedTasks,
      },
    })),
    loadASingleProject: (projectId) => set((state) => {
      const project = state.allProjects.find((item) => item.projectId === projectId);
      const checkpoints = project.checkpoints ? JSON.parse(project.checkpoints) : [];
      const tasks = project.tasks ? JSON.parse(project.tasks) : [];
      const invites = project.invites ? JSON.parse(project.invites) : [];
      return {
        project, checkpoints, tasks, invites, zustandFinised: true, singleProjectRunning: true,
      };
    }),

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
      allTasks: preVal.allTasks.map((item) => (
        item.localId === updatedTask.localId ? updatedTask : item)),
      tasks: preVal.tasks.map((task) => (
        task.localId === updatedTask.localId ? updatedTask : task)),
    })),
    deleteTask: (deletedTask) => set((preVal) => ({
      tasks: preVal.tasks.filter((task) => task.localId !== deletedTask.localId),
      allTasks: preVal.allTasks.filter((task) => task.localId !== deletedTask.localId),
    })),
    reOrderTheTasks: (newTasks) => set((preVal) => {
      const oldTasks = preVal.tasks.filter((task) => !newTasks.some((newTask) => newTask.localId === task.localId));
      const allOldTasks = preVal.allTasks.filter((task) => !newTasks.some((newTask) => newTask.localId === task.localId));
      return {
        tasks: [...oldTasks, ...newTasks],
        allTasks: [...allOldTasks, ...newTasks],
      };
    }),
    // ------invites---------
    addInviteToProject: (newInvite) => set((preVal) => ({ invitesOfProject: [...preVal.invitesOfProject, newInvite] })),
    createNewInvite: (newInvite) => set((preVal) => ({ invites: [...preVal.invites, newInvite] })),
    updateInvitesOfProjectBatch: (newInvites) => set((preVal) => ({ invitesOfProject: newInvites })),
    addBatchOfInvites: (newInvites) => set((preVal) => {
      const uniqueNewInvites = newInvites
        .filter((newInvite) => !preVal.invites.some((invite) => invite.inviteId === newInvite.inviteId));
      return { invites: [...preVal.invites, ...uniqueNewInvites] };
    }),
    updateInvite: (updatedInvite) => set((preVal) => ({
      invites: preVal.invites.map((invite) => (
        invite.localId === updatedInvite.localId ? updatedInvite : invite)),
    })),
    deleteInvite: (deletedInvite) => set((preVal) => ({
      invitesOfProject: preVal.invitesOfProject.filter(
        (invite) => invite.inviteId !== deletedInvite.inviteId,
      ),
    })),
    deleteInvitesUponRemoval: (deletedInvites) => set((preVal) => {
      const updatedInvites = preVal.invites.filter(
        (invite) => !deletedInvites.some((deletedInvite) => deletedInvite.inviteId === invite.inviteId),
      );
      return { invites: updatedInvites };
    }),

    sendToServer: () => {
      const {
        allProjects, checkpoints, tasks, invitesOfProject, project,
      } = get();

      if (allProjects.length === 0) { return; }
      const checkpointsFormatted = checkpoints.length > 0 ? JSON.stringify(checkpoints) : null;
      const tasksFormatted = tasks.length > 0 ? JSON.stringify(tasks) : null;

      if (!project) { return; }
      const { projectId, userId } = project;
      const payload = {
        ...project,
        projectId,
        userId,
        checkpoints: checkpointsFormatted,
        tasks: tasksFormatted,
      };
      set((state) => ({
        allProjects: state.allProjects.map((item) => (
          item.projectId === projectId ? payload : item
        )),
      }));
      updateProject(payload);
    },
  }),
));

export default useSaveStore;
