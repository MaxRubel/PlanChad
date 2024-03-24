import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useRouter } from 'next/router';
import {
  deleteProject, getSingleProject, getUserProjects, updateProject,
} from '../../api/project';
import { useAuth } from './authContext';
import { useCollabContext } from './collabContext';
import { getInvitesByEmail } from '../../api/invites';
import useSaveStore from '../stores/saveStore';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = {
    project: {}, checkpoints: [], tasks: [], invites: [],
  };
  const [min, setMin] = useState(0);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const { user } = useAuth();
  const [singleProjectRunning, setSingleProjectRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(0);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [fetchUserData, setFetchUserData] = useState(0);
  const router = useRouter();
  const { sendToCollabsManager } = useCollabContext();
  const loadCheckpoints = useSaveStore((state) => state.loadCheckpoints);
  const loadTasks = useSaveStore((state) => state.loadTasks);
  const loadProjectZus = useSaveStore((state) => state.loadProject);
  const loadInvites = useSaveStore((state) => state.loadInvites);
  const loadAllProjects = useSaveStore((state) => state.loadAllProjects);
  const loadAllTasks = useSaveStore((state) => state.loadAllTasks);
  const allProjectsZus = useSaveStore((state) => state.allProjects);
  const storedProject = useSaveStore((state) => state.project);
  const storedCheckpoints = useSaveStore((state) => state.checkpoints);
  const storedTasks = useSaveStore((state) => state.tasks);
  const storedInvites = useSaveStore((state) => state.invites);
  const updateProjectZus = useSaveStore((state) => state.updateProject);
  const projectsHaveBeenLoaded = useSaveStore((state) => state.projectsHaveBeenLoaded);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);
  useEffect(() => {
    const projectsArray = [];
    const allTasksArr = [];
    if (user && !projectsLoaded) {
      // load user data:
      getUserProjects(user.uid)
        .then((data) => {
          const userProjects = [...data];
          projectsArray.push(...userProjects);
          // decipher all tasks:
          for (let i = 0; i < userProjects.length; i++) {
            if (userProjects[i].tasks) {
              const theseTasks = JSON.parse(userProjects[i].tasks);
              for (let x = 0; x < theseTasks.length; x++) {
                allTasksArr.push(theseTasks[x]);
              }
            }
          }
          // load invites:
          getInvitesByEmail(user.email).then((userInvites) => {
            const invitedProjectIDs = userInvites.map((item) => item.projectId);
            const promiseArray = invitedProjectIDs.map((projectId) => getSingleProject(projectId));

            Promise.all(promiseArray).then((invitedProjects) => {
              const projectsData = [...invitedProjects];
              // add additional projects if not
              for (let y = 0; y < projectsData.length; y++) {
                projectsArray.push(projectsData[y]);
              }
              // decipher tasks:
              for (let i = 0; i < projectsData.length; i++) {
                if (projectsData[i].tasks) {
                  const theseTasks = JSON.parse(projectsData[i].tasks);
                  for (let x = 0; x < theseTasks.length; x++) {
                    allTasksArr.push(theseTasks[x]);
                  }
                }
              }
              sendToCollabsManager(projectsData);
              loadAllProjects(projectsArray);
              projectsHaveBeenLoaded(true);
              loadAllTasks(allTasksArr);
              setIsFetchingProjects((preVal) => false);
            });
          });
        });
    }
  }, [user, fetchUserData]);

  const clearSaveManager = () => {
    setIsSaving(0);
    setMin(0);
    setSingleProjectRunning(false);
  };

  const clearAllLocalData = () => {
    clearSaveManager();
    setAllProjects([]);
    setAllTasks([]);
    projectsHaveBeenLoaded(false);
    setSingleProjectRunning(false);
  };

  const cancelSaveAnimation = useCallback(() => {
    setIsSaving(0);
  }, []);

  const loadProject = (projectId) => {
    clearSaveManager();
    const project = allProjectsZus.find((item) => item.projectId === projectId);
    let checkpoints = [];
    let tasks = [];
    let invites = [];
    if (project?.checkpoints) {
      const checkpointsFormat = JSON.parse(project.checkpoints);
      checkpoints = checkpointsFormat.sort((a, b) => a.index - b.index);
    }
    if (project?.tasks) {
      const tasksFormat = JSON.parse(project.tasks);
      tasks = tasksFormat;
    }
    if (project?.invites) {
      const invitesFormat = JSON.parse(project.invites);
      invites = invitesFormat;
    }
    const obj = {
      project, checkpoints, tasks, invites,
    };
    loadProjectZus(project);
    loadCheckpoints(checkpoints);
    loadTasks(tasks);
    loadInvites(invites);
    setSingleProjectRunning((preVal) => true);
    return obj;
  };

  const theBigDelete = (projectId) => {
    setIsFetchingProjects((preVal) => true);
    deleteProject(projectId).then(() => {
      setFetchUserData((prev) => prev + 1);
      router.push('/');
      setIsFetchingProjects((preVal) => true);
      projectsHaveBeenLoaded(false);
      clearSaveManager();
    });
  };

  const minAll = useCallback(() => {
    setMin((prevVal) => prevVal + 1);
    const minimizedChecks = storedCheckpoints.map((checkpoint) => ({
      ...checkpoint, expanded: false,
    }));
    const minimizedTasks = storedTasks.map((task) => ({
      ...task, expanded: false, deetsExpanded: false,
    }));
    loadCheckpoints(minimizedChecks);
    loadTasks(minimizedTasks);
  }, []);

  const hideCompletedTasks = useCallback(() => {
    updateProjectZus({ ...storedProject, hideCompletedTasks: !storedProject.hideCompletedTasks });
  }, []);

  // --------delete-----------------

  const sendToServer = () => {
    if (allProjectsZus.length === 0) { return; }
    setIsSaving((preVal) => preVal + 1);
    const checkpointsFormatted = storedCheckpoints.length > 0 ? JSON.stringify(storedCheckpoints) : null;
    const tasksFormatted = storedTasks.length > 0 ? JSON.stringify(storedTasks) : null;
    const invitesFormatted = storedInvites.length > 0 ? JSON.stringify(storedInvites) : null;

    if (!storedProject) { return; }
    const { projectId, userId } = storedProject;
    const payload = {
      ...storedProject,
      projectId,
      userId,
      checkpoints: checkpointsFormatted,
      tasks: tasksFormatted,
      invites: invitesFormatted,
    };

    updateProject(payload).then(() => {
      const index = allProjectsZus.findIndex((item) => item.projectId === payload.projectId);
      allProjectsZus[index] = payload;
    });
  };

  const memoizedValues = useMemo(() => ({
    clearSaveManager,
    sendToServer,
    min,
    minAll,
    loadProject,
    singleProjectRunning,
    isSaving,
    hideCompletedTasks,
    isFetchingProjects,
    theBigDelete,
    cancelSaveAnimation,
    clearAllLocalData,
  }), [
    clearSaveManager,
    sendToServer,
    min,
    minAll,
    allTasks,
    allProjects,
    loadProject,
    singleProjectRunning,
    isSaving,
    hideCompletedTasks,
    isFetchingProjects,
    theBigDelete,
    cancelSaveAnimation,
    clearAllLocalData,
  ]);

  return (
    <saveContext.Provider value={
      memoizedValues
    }
    >
      {children}
    </saveContext.Provider>
  );
};
