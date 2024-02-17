import React, { createContext, useContext, useState } from 'react';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);

  console.log('save manager says:', saveInput);

  const addToSaveManager = (value) => {
    if (value.type === 'project') {
      setSaveInput((prevVal) => ({ ...prevVal, project: { ...prevVal.project, ...value } }));
    }
    // ----------checkpoints------------
    if (value.type === 'checkpoint') {
      let inArray = false;
      for (let i = 0; i < saveInput.checkpoints.length; i++) {
        if (saveInput.checkpoints[i].localId === value.localId) {
          inArray = true;
        }
      }
      if (inArray === false) {
        const newArray = [...saveInput.checkpoints, value];
        setSaveInput((preVal) => ({ ...preVal, checkpoints: newArray }));
      }
      if (inArray === true) {
        const newArray = [...saveInput.checkpoints];
        const index = newArray.findIndex((item) => item.localId === value.localId);
        newArray[index] = value;
        setSaveInput((preVal) => ({ ...preVal, checkpoints: newArray }));
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
