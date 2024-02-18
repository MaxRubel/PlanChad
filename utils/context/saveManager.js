import React, { createContext, useContext, useState } from 'react';
import {
  createNewCheckpoint, deleteCheckpoint, getCheckpointsOfProject, updateCheckpoint,
} from '../../api/checkpoint';
import { createNewTask, updateTask } from '../../api/task';
import { updateProject } from '../../api/project';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);
  const [hasMemory, setHasMemory] = useState(false);
  const [checksToDelete, setChecksToDelete] = useState([]);
  const [serverRefresh, setServerRefresh] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  const addToSaveManager = (input, action, type) => {
    console.log('save manager receiving, ', type, input);
    if (!hasMemory) {
      setHasMemory((preVal) => !preVal);
    }
    if (type === 'project') {
      setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...input } }));
    }

    // ----------checkpoints------------
    if (type === 'checkpoint') {
      if (action === 'create') {
        setSaveInput((prevVal) => ({
          ...prevVal,
          checkpoints: [...prevVal.checkpoints, input],
        }));
      }
      if (action === 'update') {
        const existingIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
        const copy = [...saveInput.checkpoints];
        copy[existingIndex] = input;
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: copy }));
      }
    }
    // ------------tasks-------------
    if (type === 'task') {
      if (action === 'create') {
        setSaveInput((prevVal) => ({
          ...prevVal,
          tasks: [...prevVal.tasks, input],
        }));
      }
      if (action === 'update') {
        const copy = [...saveInput.tasks];
        const index = copy.findIndex((item) => item.localId === input.localId);
        copy[index] = input;
        setSaveInput((prevVal) => ({ ...prevVal, tasks: copy }));
      }
    }
  };

  // --------delete-----------------
  const deleteFromSaveManager = (input, action, type) => {
    if (type === 'checkpoint') {
      if (action === 'delete') {
        if (input.checkpointId) {
          setChecksToDelete((prevVal) => [...prevVal, input]);
        }
        const checkPs = [...saveInput.checkpoints];
        const tasks = [...saveInput.tasks];
        let i = 0;
        while (i < tasks.length) {
          if (tasks[i].checkpointId === input.localId) {
            tasks.splice(i, 1);
          } else {
            i += 1;
          }
        }
        const deleteIndex = checkPs.findIndex((item) => item.localId === input.localId);
        checkPs.splice(deleteIndex, 1);
        checkPs.sort((a, b) => a.index - b.index);
        const checkpoints = checkPs.map((item, i1) => ({ ...item, index: i1 }));
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints }));
        setSaveInput((prevVal) => ({ ...prevVal, tasks }));
      }
    }
    if (type === 'task') {
      const copy = [...saveInput.tasks];
      const deleteIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
      copy.splice(deleteIndex, 1);
      const updatedArray = copy.map((item, i) => ({ ...item, index: i }));
      setSaveInput((prevVal) => ({ ...prevVal, tasks: updatedArray }));
    }
  };

  const clearSaveManager = () => {
    setSaveInput((prevVal) => initState);
    setHasMemory(false);
  };

  const fetchAll = (projectId) => new Promise((resolve, reject) => {
    getCheckpointsOfProject(projectId)
      .then((data) => (resolve(data)))
      .catch(reject); // Reject the promise if there is an error
  });

  const sendToServer = () => {
    console.log('seding to server...');
    // --------create---------
    const checkpoints = [...saveInput.checkpoints];
    const tasks = [...saveInput.tasks];

    const postCheckpoints = checkpoints.filter((item) => !item.checkpointId);
    const postTasks = tasks.filter((item) => !item.taskId);

    const postCheckPPromise = postCheckpoints.map((item) => (
      createNewCheckpoint(item)
        .then(({ name }) => { updateCheckpoint({ checkpointId: name }); })));
    const postTasksPromise = postTasks.map((item) => (
      createNewTask(item)
        .then(({ name }) => { updateTask({ taskId: name }); })));

    console.log('create new tasks: ', postTasks.length);
    console.log('create new checkpoints: ', postCheckpoints.length);

    // -----update----------------
    const patchCheckpoints = checkpoints.filter((item) => item.checkpointId);
    const patchChecPPromise = patchCheckpoints.map((item) => (updateCheckpoint(item)));
    const patchTasks = tasks.filter((item) => (item.taskId));
    const patchPromsie = patchTasks.map((item) => (updateTask(item)));

    console.log('update checkpoints, ', patchCheckpoints.length);

    // console.log('update tasks, ', patchCheckpoints.length);
    // ------delete server checkpoints----------
    console.log('deleting from server: ', checksToDelete.length, 'checkpoints');

    const checksDeletePromise = checksToDelete.map((item) => (deleteCheckpoint(item.checkpointId)));
    updateProject(saveInput.project);
    Promise.all(postCheckPPromise).then(() => {
      Promise.all(postTasksPromise).then(() => {
        Promise.all(patchChecPPromise).then(() => {
          Promise.all(patchChecPPromise).then(() => {
            Promise.all(patchChecPPromise).then(() => {
              Promise.all(checksDeletePromise).then(() => {
                setChecksToDelete((preVal) => ([]));
                clearSaveManager();
                setServerRefresh((preVal) => preVal + 1);
              });
            });
          });
        });
      });
    });
  };

  return (
    <saveContext.Provider value={{
      addToSaveManager, deleteFromSaveManager, saveInput, clearSaveManager, hasMemory, sendToServer, fetchAll, serverRefresh, hasFetched,
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
