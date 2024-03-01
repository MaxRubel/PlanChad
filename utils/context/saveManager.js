import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { getCheckpointsOfProject } from '../../api/checkpoint';
import { getUserProjects, updateProject } from '../../api/project';
import { useAuth } from './authContext';

// import { useCollabContext } from './collabContext';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };

  const [saveInput, setSaveInput] = useState(initState);
  const [serverRefresh, setServerRefresh] = useState(0);
  const [min, setMin] = useState(0);
  const [asigneesIsOpen, setAssigneesIsOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [projectsLoaded, setProjectLoaded] = useState(false);
  const { user } = useAuth();
  const [singleProjectRunning, setSingleProjectRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sendThisArray, setSendThisArray] = useState(null);

  useEffect(() => {
    if (user && !projectsLoaded) { // load in all user project data when page first loads
      getUserProjects(user.uid)
        .then((data) => {
          setAllProjects(data);
          setProjectLoaded((preVal) => true);
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
          setAllTasks((preVal) => allTasksArr);
        });
    }
  }, [user]);

  const clearSaveManager = () => {
    setSaveInput((prevVal) => initState);
    setMin((preVal) => 0);
    setSingleProjectRunning((preVal) => false);
  };

  const loadProject = (projectId) => {
    clearSaveManager();
    const copy = [...allProjects];
    const project = copy.find((item) => item.projectId === projectId);

    let checkpoints = [];
    let tasks = [];
    if (project.checkpoints) {
      const checkpointsForm = JSON.parse(project.checkpoints);
      checkpoints = checkpointsForm.sort((a, b) => a.index - b.index);
    }
    if (project.tasks) {
      const tasksForm = JSON.parse(project.tasks);
      tasks = tasksForm;
    }

    const obj = { project, checkpoints, tasks };
    setSaveInput((preVal) => obj);
    setSingleProjectRunning((preVal) => true);
    return obj;
  };

  // ---------for-modal-----------
  const openAssigneesModal = (taskIdRecent) => {
    setAssigneesIsOpen(true);
    setTaskId((preVal) => taskIdRecent);
  };

  const closeAsigneesModal = () => {
    setAssigneesIsOpen(false);
  };

  const minAll = () => { // trigger minAll and animation
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
      setSendThisArray(input);
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

  const fetchAll = (projectId) => new Promise((resolve, reject) => {
    getCheckpointsOfProject(projectId)
      .then((data) => (resolve(data)))
      .catch(reject);
  });

  const sendToServer = () => {
    setIsSaving((preVal) => true);
    const { checkpoints, tasks, project } = saveInput;
    const checkpointsFormatted = checkpoints.length > 0 ? JSON.stringify(checkpoints) : null;
    const tasksFormatted = tasks.length > 0 ? JSON.stringify(tasks) : null;
    const { projectId, userId } = saveInput.project;
    const payload = {
      ...project,
      projectId,
      userId,
      checkpoints: checkpointsFormatted,
      tasks: tasksFormatted,
    };

    updateProject(payload).then(() => { setIsSaving((preVal) => false); });
    const copy = [...allProjects];
    const index = copy.findIndex((item) => item.projectId === payload.projectId);
    copy[index] = payload;
    setAllProjects((preVal) => copy);
  };

  return (
    <saveContext.Provider value={{
      addToSaveManager,
      deleteFromSaveManager,
      saveInput,
      clearSaveManager,
      sendToServer,
      fetchAll,
      serverRefresh,
      min,
      minAll,
      allTasks,
      openAssigneesModal,
      closeAsigneesModal,
      asigneesIsOpen,
      taskId,
      allProjects,
      projectsLoaded,
      loadProject,
      singleProjectRunning,
      isSaving,
      hideCompletedTasks,
      sendThisArray,
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
