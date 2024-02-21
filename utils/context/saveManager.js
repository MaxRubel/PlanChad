import React, { createContext, useContext, useState } from 'react';
import {
  createNewCheckpoint, deleteCheckpoint, getCheckpointsOfProject, updateCheckpoint,
} from '../../api/checkpoint';
import { createNewTask, deleteTask, updateTask } from '../../api/task';
import { updateProject } from '../../api/project';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);
  const [serverRefresh, setServerRefresh] = useState(0);
  const [min, setMin] = useState(0);
  const [projCollabs, setProjCollabs] = useState([]);

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
      setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...input } }));
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
      // if (input.checkpointId) {
      //   setChecksToDelete((prevVal) => [...prevVal, input]);
      // }

      // const tasksOfCheckp = saveInput.tasks.filter((task) => task.checkpointId === input.localId);
      // tasksOfCheckp.forEach((task) => {
      //   if (task.taskId) {
      //     setTasksToDelete((prevVal) => [...prevVal, task]);
      //   }
      // });

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

  const clearSaveManager = () => {
    setSaveInput((prevVal) => initState);
  };

  const fetchAll = (projectId) => new Promise((resolve, reject) => {
    getCheckpointsOfProject(projectId)
      .then((data) => (resolve(data)))
      .catch(reject);
  });

  const sendToServer = (payloadFromChild) => {
    console.log('sending to server...');
    // // -----------------create---------
    // const checkpoints = [...saveInput.checkpoints];
    // const tasks = [...saveInput.tasks];

    // const postCheckpoints = checkpoints.filter((item) => !item.checkpointId);
    // const postTasks = tasks.filter((item) => !item.taskId);

    // const postCheckPPromise = postCheckpoints.map((item) => (
    //   createNewCheckpoint(item)
    //     .then(({ name }) => { updateCheckpoint({ checkpointId: name }); })));
    // const postTasksPromise = postTasks.map((item) => (
    //   createNewTask(item)
    //     .then(({ name }) => { updateTask({ taskId: name }); })));

    // // -----------update----------------
    // const patchCheckpoints = checkpoints.filter((item) => item.checkpointId);
    // const patchCheckPPromise = patchCheckpoints.map((item) => (updateCheckpoint(item)));
    // const patchTasks = tasks.filter((item) => (item.taskId));
    // const patchTaskPromise = patchTasks.map((item) => (updateTask(item)));

    // // ----------------delete-----------
    // const checksDeletePromise = checksToDelete.map((item) => (deleteCheckpoint(item.checkpointId)));
    // const taskDeletePromise = tasksToDelete.map((item) => (deleteTask(item.taskId)));

    // console.log('creating: ', postCheckpoints.length, 'checkpoints');
    // console.log('creating: ', postTasks.length, 'tasks');
    // console.log('updating, ', patchCheckpoints.length, 'checkpoints');
    // console.log('updating, ', patchTasks.length, 'tasks');
    // console.log('deleting: ', checksToDelete.length, 'checkpoints');
    // console.log('deleting: ', taskDeletePromise.length, 'tasks');

    // updateProject(saveInput.project).then(() => {
    //   Promise.all([...postCheckPPromise, ...postTasksPromise, ...patchCheckPPromise, ...patchTaskPromise,
    // ...patchTaskPromise, ...checksDeletePromise, ...taskDeletePromise]).then(() => {
    //     clearSaveManager();
    //     setServerRefresh((preVal) => preVal + 1);
    //   });
    // });

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
      projCollabs,
      setProjCollabs,
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
