import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useRouter } from 'next/router';
import { deleteProject, getUserProjects, updateProject } from '../../api/project';
import { useAuth } from './authContext';
import { useCollabContext } from './collabContext';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
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

  // load all user data:
  useEffect(() => {
    if (user && !projectsLoaded) {
      getUserProjects(user.uid)
        .then((data) => {
          const copy = [...data];
          const allTasksArr = [];
          for (let i = 0; i < copy.length; i++) {
            if (data[i].tasks) {
              const theseTasks = JSON.parse(data[i].tasks);
              for (let x = 0; x < theseTasks.length; x++) {
                allTasksArr.push(theseTasks[x]);
              }
            }
          }
          setAllProjects((preVal) => data);
          setProjectsLoaded((preVal) => true);
          setAllTasks((preVal) => allTasksArr);
          setIsFetchingProjects((preVal) => false);
        });
    }
  }, [user, fetchUserData]);

  const clearSaveManager = () => {
    setIsSaving(0);
    setSaveInput((prevVal) => initState);
    setMin((preVal) => 0);
    setSingleProjectRunning((preVal) => false);
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
    if (project?.checkpoints) {
      const checkpointsForm = JSON.parse(project.checkpoints);
      checkpoints = checkpointsForm.sort((a, b) => a.index - b.index);
    }
    if (project?.tasks) {
      const tasksForm = JSON.parse(project.tasks);
      tasks = tasksForm;
    }
    const obj = { project, checkpoints, tasks };
    setSaveInput((preVal) => obj);
    setSingleProjectRunning((preVal) => true);
    return obj;
  };

  const theBigDelete = (projectId) => {
    deleteProject(projectId).then(() => {
      const projectCollabs = setIsFetchingProjects((preVal) => true);
      setFetchUserData((prev) => prev + 1);
      clearSaveManager();
      router.push('/');
      setIsFetchingProjects((preVal) => true);
      setProjectsLoaded((preVal) => false);
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
    if (allProjects.length === 0) { return; }
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
  };
  // --------delete-----------------
  const deleteFromSaveManager = (input, action, type) => {
    const checkPs = [...saveInput.checkpoints];
    const tasks = [...saveInput.tasks];
    if (type === 'checkpoint' && action === 'delete') {
      const updatedTasks = saveInput.tasks.filter((task) => task.checkpointId !== input.localId);
      const updatedCheckpoints = saveInput.checkpoints.filter((checkpoint) => checkpoint.localId !== input.localId);
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
  };

  const sendToServer = () => {
    if (allProjects.length === 0) { return; }
    setIsSaving((preVal) => preVal + 1);
    const { checkpoints, tasks, project } = saveInput;
    const checkpointsFormatted = checkpoints.length > 0 ? JSON.stringify(checkpoints) : null;
    const tasksFormatted = tasks.length > 0 ? JSON.stringify(tasks) : null;
    if (!saveInput.project) { return; }
    const { projectId, userId } = saveInput.project;
    const payload = {
      ...project,
      projectId,
      userId,
      checkpoints: checkpointsFormatted,
      tasks: tasksFormatted,
    };

    updateProject(payload).then(() => {
      const copy = [...allProjects];
      const index = copy.findIndex((item) => item.projectId === payload.projectId);
      copy[index] = payload;
      setAllProjects((preVal) => copy);
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
