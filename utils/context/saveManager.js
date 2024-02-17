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
      // const existingIndex = saveInput.checkpoints.findIndex((item) => item.localId === value.localId);
      // if (existingIndex === -1) { // create new item
      //   console.log('add new');
      //   const newArray = [...saveInput.checkpoints, value];
      //   setSaveInput((prevVal) => ({ ...prevVal, checkpoints: newArray }));
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
      const index = saveInput.checkpoints.findIndex((item) => item.localId === input.localId);
      console.log('index of item to delete is:', index);
      // const index = newArray.findIndex((item) => item.localId === value.localId);
      // console.log('deleting:', newArray[index].name);
      newArray.splice(index, 1); // delete item
      newArray.sort((a, b) => a.index - b.index); // sort
      const updatedArray = newArray.map((item, i) => ({ ...item, index: i })); // update indexes
      console.table(updatedArray);
      setSaveInput((prevVal) => ({ ...prevVal, checkpoints: updatedArray })); // set new array
    }
  };

  return (
    <saveContext.Provider value={{ addToSaveManager, deleteFromSaveManager, saveInput }}>
      {children}
    </saveContext.Provider>
  );
};
