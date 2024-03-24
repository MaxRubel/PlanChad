import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useRouter } from 'next/router';
import useSaveStore from './saveStore';
import {
  deleteProject, getSingleProject, getUserProjects, updateProject,
} from '../../api/project';
import { useAuth } from './authContext';
import { useCollabContext } from './collabContext';
import { getInvitesByEmail } from '../../api/invites';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = {
    project: {}, checkpoints: [], tasks: [], invites: [],
  };
  const [saveInput, setSaveInput] = useState(initState);
  const [min, setMin] = useState(0);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
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
              setAllProjects((preVal) => projectsArray);
              setProjectsLoaded((preVal) => true);
              setAllTasks((preVal) => allTasksArr);
              setIsFetchingProjects((preVal) => false);
            });
          });
        });
    }
  }, [user, fetchUserData]);

  const clearSaveManager = () => {
    setIsSaving(0);
    setSaveInput(initState);
    setMin(0);
    setSingleProjectRunning(false);
  };

  const clearAllLocalData = () => {
    clearSaveManager();
    setAllProjects([]);
    setAllTasks([]);
    setProjectsLoaded(false);
    setSingleProjectRunning(false);
  };

  const cancelSaveAnimation = () => {
    setIsSaving(0);
  };

  const loadProject = (projectId) => {
    clearSaveManager();
    const copy = [...allProjects];
    const project = copy.find((item) => item.projectId === projectId);
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
    loadCheckpoints(checkpoints);
    loadProjectZus(project);
    loadTasks(tasks);
    setSaveInput((preVal) => obj);
    setSingleProjectRunning((preVal) => true);
    return obj;
  };

  const theBigDelete = (projectId) => {
    setIsFetchingProjects((preVal) => true);
    deleteProject(projectId).then(() => {
      setFetchUserData((prev) => prev + 1);
      router.push('/');
      setIsFetchingProjects((preVal) => true);
      setProjectsLoaded((preVal) => false);
      clearSaveManager();
    });
  };

  const minAll = () => {
    setMin((prevVal) => prevVal + 1);
    const copyCheck = [...saveInput.checkpoints];
    const copyTask = [...saveInput.tasks];
    const minimizedChecks = copyCheck.map((checkpoint) => ({
      ...checkpoint, expanded: false,
    }));
    const minimizedTasks = copyTask.map((task) => ({
      ...task, expanded: false, deetsExpanded: false,
    }));
    setSaveInput((prevVal) => ({ ...prevVal, checkpoints: minimizedChecks, tasks: minimizedTasks }));
  };

  const hideCompletedTasks = () => {
    setSaveInput((prevVal) => ({
      ...prevVal,
      project: {
        ...prevVal.project,
        hideCompletedTasks: !prevVal.project.hideCompletedTasks,
      },
    }));
  };

  const addToSaveManager = (input, action, type) => {
    if (type === 'project') {
      if (action === 'create') {
        const copy = [...allProjects];
        copy.push(input);
        setAllProjects((preVal) => copy);
      }
      if (action === 'update') {
        setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...input } }));
      }
    }
    // ----------checkpoints------------
    if (type === 'checkpoint') {
      if (action === 'create') { // create checkpoints
        setSaveInput((prevVal) => ({
          ...prevVal,
          checkpoints: [...prevVal.checkpoints, input],
        }));
      }
      if (action === 'update') { // update checkpoints
        const existingIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
        const copy = [...saveInput.checkpoints];
        copy[existingIndex] = input;
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: copy }));
      }
    }
    if (type === 'checkpointsArr') { // load in array on fetch //reorder index
      setSaveInput((preVal) => ({ ...preVal, checkpoints: input }));
    }
    if (type === 'reorderedCheckPs') {
      setSaveInput((preVal) => ({ ...preVal, checkpoints: input }));
    }
    // ------------tasks-------------
    if (type === 'task') {
      if (action === 'create') { // create tasks
        setSaveInput((prevVal) => ({
          ...prevVal,
          tasks: [...prevVal.tasks, input],
        }));
        setAllTasks((preVal) => ([...preVal, input]));
      }
      if (action === 'update') { // update tasks
        const copy = [...saveInput.tasks];
        const index = copy.findIndex((item) => item.localId === input.localId);
        copy[index] = input;
        setSaveInput((prevVal) => ({ ...prevVal, tasks: copy }));
        const tasksCopy = [...allTasks];
        tasksCopy[index] = input;
        setAllTasks((prevVal) => tasksCopy);
      }
    }
    if (type === 'tasksArr') {
      setSaveInput((prevVal) => ({ ...prevVal, tasks: [...prevVal.tasks, ...input] }));
    }
    if (type === 'reorderedTasks') {
      setSaveInput((prevSaveInput) => {
        const copy = [...prevSaveInput.tasks];
        const filteredTasks = copy.filter((task) => !input.some((inputTask) => inputTask.checkpointId === task.checkpointId));
        const updatedTasks = input.map((inputTask) => inputTask);
        const newTasks = [...filteredTasks, ...updatedTasks];
        return { ...prevSaveInput, tasks: newTasks };
      });
    }
    // ---------invites------------
    if (type === 'invite') {
      if (action === 'create') {
        const invitesCopy = [...saveInput.invites];
        invitesCopy.push(input);
        setSaveInput((prevVal) => ({ ...prevVal, invites: [...prevVal.invites, input] }));
      }
      if (action === 'update') {
        const invites = [...saveInput.invites];
        const updateIndex = invites.findIndex((item) => item.email === input.email);
        invites[updateIndex] = input;
        setSaveInput((prevVal) => ({ ...prevVal, invites }));
      }
    }
  };
  // --------delete-----------------
  const deleteFromSaveManager = (input, action, type) => {
    const checkpoints = [...saveInput.checkpoints];
    const tasks = [...saveInput.tasks];
    if (type === 'checkpoint' && action === 'delete') {
      const updatedTasks = tasks.filter((task) => task.checkpointId !== input.localId);
      const updatedCheckpoints = checkpoints.filter((checkpoint) => checkpoint.localId !== input.localId);
      setSaveInput((prevVal) => ({
        ...prevVal,
        tasks: updatedTasks,
        checkpoints: updatedCheckpoints.sort((a, b) => a.index - b.index),
      }));
    }
    if (type === 'task') {
      const copy = [...saveInput.tasks];
      const allTasksCopy = [...allTasks];
      const deleteIndex = saveInput.tasks.findIndex((item) => item.localId === input.localId);
      const deleteAllIndex = allTasksCopy.findIndex((item) => item.localId === input.localId);
      allTasksCopy.splice(deleteAllIndex, 1);
      copy.splice(deleteIndex, 1);
      const updatedArray = copy.map((item, i) => ({ ...item, index: i }));
      setSaveInput((prevVal) => ({ ...prevVal, tasks: updatedArray }));
      setAllTasks((preVal) => allTasksCopy);
    }
    if (type === 'invite') {
      const invites = [...saveInput.invites];
      const deleteIndex = invites.findIndex((item) => item.inviteId === input.inviteId);
      invites.splice(deleteIndex, 1);
      setSaveInput((preVal) => ({ ...preVal, invites }));
    }
  };

  const sendToServer = () => {
    if (allProjects.length === 0) { return; }
    setIsSaving((preVal) => preVal + 1);
    const {
      checkpoints, tasks, project, invites,
    } = saveInput;
    const checkpointsFormatted = checkpoints.length > 0 ? JSON.stringify(checkpoints) : null;
    const tasksFormatted = tasks.length > 0 ? JSON.stringify(tasks) : null;
    const invitesFormatted = invites.length > 0 ? JSON.stringify(invites) : null;

    if (!saveInput.project) { return; }
    const { projectId, userId } = saveInput.project;
    const payload = {
      ...project,
      projectId,
      userId,
      checkpoints: checkpointsFormatted,
      tasks: tasksFormatted,
      invites: invitesFormatted,
    };

    updateProject(payload).then(() => {
      const copy = [...allProjects];
      const index = copy.findIndex((item) => item.projectId === payload.projectId);
      copy[index] = payload;
      setAllProjects(copy);
    });
  };

  const memoizedValues = useMemo(() => ({
    addToSaveManager,
    deleteFromSaveManager,
    saveInput,
    clearSaveManager,
    sendToServer,
    min,
    minAll,
    allTasks,
    allProjects,
    projectsLoaded,
    loadProject,
    singleProjectRunning,
    isSaving,
    hideCompletedTasks,
    isFetchingProjects,
    theBigDelete,
    cancelSaveAnimation,
    clearAllLocalData,
  }), [
    addToSaveManager,
    deleteFromSaveManager,
    saveInput,
    clearSaveManager,
    sendToServer,
    min,
    minAll,
    allTasks,
    allProjects,
    projectsLoaded,
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
