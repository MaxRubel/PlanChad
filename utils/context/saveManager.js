import React, { createContext, useContext, useState } from 'react';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);
  const [hasMemory, setHasMemory] = useState(false);

  const addToSaveManager = (input, action, type) => {
    if (!hasMemory) {
      setHasMemory((preVal) => !preVal);
    }
    if (type === 'project') {
      setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...input } }));
    }

    // ----------checkpoints------------
    if (type === 'checkpoint') {
      if (action === 'create') {
        const newArray = [...saveInput.checkpoints, input];
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: newArray }));
      }
      if (action === 'update') {
        const existingIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
        const copy = [...saveInput.checkpoints];
        copy[existingIndex] = input;
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: copy }));
      }

      // ------------tasks-------------
    }
    if (type === 'task') {
      if (action === 'create') {
        const copy = [...saveInput.tasks, input];
        setSaveInput((prevVal) => ({ ...prevVal, tasks: copy }));
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
        const checkPs = [...saveInput.checkpoints];
        const tasks = [...saveInput.tasks];
        let x = 0;
        let i = 0;
        while (i < tasks.length) {
          if (tasks[i].checkpointId === input.localId) {
            tasks.splice(i, 1);
            x += 1;
          } else {
            i += 1;
          }
        }
        console.log('deleted: ', x, ' items');
        const deleteIndex = checkPs.findIndex((item) => item.localId === input.localId);
        checkPs.splice(deleteIndex, 1);
        checkPs.sort((a, b) => a.index - b.index);
        const checkpoints = checkPs.map((item, i1) => ({ ...item, index: i1 })); // update indexes
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints }));
        setSaveInput((prevVal) => ({ ...prevVal, tasks })); // save new array
      }
    }
    if (type === 'task') {
      const copy = [...saveInput.tasks];
      const deleteIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
      copy.splice(deleteIndex, 1);
      const updatedArray = copy.map((item, i) => ({ ...item, index: i })); // update indexes
      setSaveInput((prevVal) => ({ ...prevVal, tasks: updatedArray })); // save new array
    }
  };

  const clearSaveManager = () => {
    setSaveInput((prevVal) => initState);
    setHasMemory(false);
  };

  return (
    <saveContext.Provider value={{
      addToSaveManager, deleteFromSaveManager, saveInput, clearSaveManager, hasMemory,
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
