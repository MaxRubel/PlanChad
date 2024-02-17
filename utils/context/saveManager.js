import React, { createContext, useContext, useState } from 'react';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);

  // console.log('save manager says:', saveInput);

  const addToSaveManager = (value) => {
    if (value.type === 'project') {
      setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...value } }));
    }
    // ----------checkpoints------------
    if (value.type === 'checkpoint') {
      const existingIndex = saveInput.checkpoints.findIndex((item) => item.localId === value.localId);
      if (existingIndex === -1) { // create new item
        const newArray = [...saveInput.checkpoints, value];
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: newArray }));
      } else { // item exists
        const copy = [...saveInput.checkpoints];
        copy[existingIndex] = value; // paste
        setSaveInput((prevVal) => ({ ...prevVal, checkpoints: copy }));
      }
      // ------------tasks-------------
    }
    if (value.type === 'task') {
      console.log('task:', value);
    }
  };

  const deleteFromSaveManager = (value) => {
    const newArray = [...saveInput.checkpoints];
    const index = newArray.findIndex((item) => item.localId === value.localId);
    newArray.splice(index, 1);
    setSaveInput((prevVal) => ({ ...prevVal, checkpoints: newArray }));
  };
  return (
    <saveContext.Provider value={{ addToSaveManager, deleteFromSaveManager, saveInput }}>
      {children}
    </saveContext.Provider>
  );
};
