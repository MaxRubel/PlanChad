import React, { createContext, useContext, useState } from 'react';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);

  // console.log('save manager says:', saveInput);

  const addToSaveManager = (input, action) => {
    if (input.type === 'project') {
      setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...input } }));
    }
    // ----------checkpoints------------
    if (input.type === 'checkpoint') {
      if (action === 'create') {
        console.log('add new');
        const newArray = [...saveInput.checkpoints, input];
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: newArray }));
      }
      if (action === 'update') { // item exists
        const existingIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
        // console.log('saveing:', input.index);
        const copy = [...saveInput.checkpoints];
        copy[existingIndex] = input; // paste
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: copy }));
      }
      // ------------tasks-------------
    }
    if (input.type === 'task') {
      console.log('task:', input);
    }
  };

  // --------delete-----------------
  const deleteFromSaveManager = (input, action) => {
    if (action === 'delete') {
      const newArray = [...saveInput.checkpoints];
      const deleteIndex = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
      newArray.splice(deleteIndex, 1); // delete item
      newArray.sort((a, b) => a.index - b.index); // sort
      const updatedArray = newArray.map((item, i) => ({ ...item, index: i })); // update indexes
      setSaveInput((prevVal) => ({ ...prevVal, checkpoints: updatedArray })); // set new array
    }
  };

  const clearSaveManager = () => {
    console.log('clear save manager');
    setSaveInput((prevVal) => initState);
  };

  return (
    <saveContext.Provider value={{
      addToSaveManager, deleteFromSaveManager, saveInput, clearSaveManager,
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
