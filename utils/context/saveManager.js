import React, { createContext, useContext, useState } from 'react';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const initState = { project: {}, checkpoints: [], tasks: [] };
  const [saveInput, setSaveInput] = useState(initState);
  const [test, setTest] = useState(0);
  console.log(saveInput.checkpoints);
  const addToSaveManager = (value) => {
    if (value.type === 'project') {
      console.log('saving project deets');
    }
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
    }
    if (value.type === 'task') {
      console.log('task:', value);
    }
  };
  return (
    <saveContext.Provider value={{ addToSaveManager }}>
      {children}
    </saveContext.Provider>
  );
};
