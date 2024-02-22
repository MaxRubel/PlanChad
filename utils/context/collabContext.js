import React, { createContext, useState, useContext } from 'react';

const CollabContext = createContext();

export const useCollabContext = () => useContext(CollabContext);

// eslint-disable-next-line react/prop-types
const CollabContextProvider = ({ children }) => {
  const [projCollabs, setProjCollabs] = useState([]);
  const [taskCollabs, setTaskCollabs] = useState([]);

  const updateCollabs = (newValue) => {
    setProjCollabs((prevVal) => [...prevVal, newValue]);
  };

  return (
    <CollabContext.Provider value={{ projCollabs, updateCollabs }}>
      {children}
    </CollabContext.Provider>
  );
};

export { CollabContext, CollabContextProvider };
