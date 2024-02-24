import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import {
  createNewCheckpoint, deleteCheckpoint, getCheckpointsOfProject, updateCheckpoint,
} from '../../api/checkpoint';
import { createNewTask, deleteTask, updateTask } from '../../api/task';
import { getUserProjects, updateProject } from '../../api/project';
import { useAuth } from './authContext';
import { getProjCollabsOfUser } from '../../api/projCollab';
// import { useCollabContext } from './collabContext';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);
  const [serverRefresh, setServerRefresh] = useState(0);
  const [min, setMin] = useState(0);
  // const [projCollabs, setProjCollabs] = useState([]);
  // const [taskCollabs, setTaskCollabs] = useState([]);
  const [asigneesIsOpen, setAssigneesIsOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [projectsLoaded, setProjectLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && !projectsLoaded) { // load in all user project data when page first loads
      getUserProjects(user.uid)
        .then((data) => {
          // console.log('All Projects: ', data);
          setAllProjects(data);
          setProjectLoaded((preVal) => true);
        });
    }
  }, [user]);

  const clearSaveManager = () => {
    setSaveInput((prevVal) => initState);
  };

  const loadProject = (projectId) => {
    clearSaveManager();
    const copy = [...allProjects];
    const project = copy.find((item) => item.projectId === projectId);
    console.log('project found: ', project);
    let checkpoints = [];
    let tasks = [];
    if (project.checkpoints) {
      const checkpointsForm = JSON.parse(project.checkpoints);
      checkpoints = checkpointsForm.sort((a, b) => a.index - b.index);
      console.log(checkpoints);
    }
    if (project.tasks) {
      tasks = JSON.parse(project.tasks);
    }
    const obj = { project, checkpoints, tasks };
    console.log('the project you requested looks like: ', obj);
    setSaveInput((preVal) => obj);
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

  const addToSaveManager = (input, action, type) => {
    if (type === 'project') {
      if (action === 'create') {
        const copy = [...allProjects];
        copy.push(input);
        console.log(copy);
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

    // ------------tasks-------------
    if (type === 'task') {
      if (action === 'create') { // create tasks
        setSaveInput((prevVal) => ({
          ...prevVal,
          tasks: [...prevVal.tasks, input],
        }));
      }
      if (action === 'update') { // update tasks
        const copy = [...saveInput.tasks];
        const index = copy.findIndex((item) => item.localId === input.localId);
        copy[index] = input;
        setSaveInput((prevVal) => ({ ...prevVal, tasks: copy }));
      }
    }
    if (type === 'tasksArr') {
      setSaveInput((prevVal) => ({ ...prevVal, tasks: [...prevVal.tasks, ...input] }));
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
    if (type === 'task') { // delete tasks
      const copy = [...saveInput.tasks];
      const deleteIndex = saveInput.tasks.findIndex((item) => item.localId === input.localId);
      copy.splice(deleteIndex, 1);
      const updatedArray = copy.map((item, i) => ({ ...item, index: i }));
      setSaveInput((prevVal) => ({ ...prevVal, tasks: updatedArray }));
    }
  };

  const fetchAll = (projectId) => new Promise((resolve, reject) => {
    getCheckpointsOfProject(projectId)
      .then((data) => (resolve(data)))
      .catch(reject);
  });

  const sendToServer = () => {
    console.log('sending to server...');
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

    updateProject(payload);
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
      // projCollabs,
      // setProjCollabs,
      openAssigneesModal,
      closeAsigneesModal,
      asigneesIsOpen,
      taskId,
      // setTaskCollabs,
      // taskCollabs,
      allProjects,
      projectsLoaded,
      loadProject,
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
