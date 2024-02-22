import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
import { fetchProjectCollabs } from '../fetchAll';
import { useSaveContext } from './saveManager';

const CollabContext = createContext();

export const useCollabContext = () => useContext(CollabContext);

// eslint-disable-next-line react/prop-types
const CollabContextProvider = ({ children }) => {
  const [allCollabs, setAllCollabs] = useState([]);
  const [projCollabs, setProjCollabs] = useState([]);
  const [taskCollabs, setTaskCollabs] = useState([]);
  const [projCollabJoins, setProjCollabJoins] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [updateCollaborator, setUpdateCollaborator] = useState(null);
  // const [refreshAllCollabs, setRefreshAllCollabs] = useState(0);
  // const { saveInput } = useSaveContext();

  // useEffect(() => {
  //   if (allCollabs.length === 0) {
  //     fetchProjectCollabs(saveInput.project.projectId).then((data) => {
  //     });
  //   }
  // }, [saveInput.project.projectId]);

  const setUpdateCollab = (collabObj) => {
    setUpdateCollaborator(collabObj);
  };

  const clearCollabManager = () => {
    setProjCollabs([]);
  };

  const addToCollabManager = (input, type, action) => {
    // --------all-collaborators--------------------------
    if (type === 'allCollabs') {
      if (action === 'loadin') {
        setAllCollabs(input);
        setLoaded((preVal) => true);
      }
      if (action === 'create') {
        setAllCollabs((preVal) => ([...preVal, input]));
      }
      if (action === 'update') {
        const copy = [...allCollabs];
        const copy2 = [...projCollabs];
        const index = allCollabs.findIndex((item) => item.collabId === input.collabId);
        const index2 = projCollabs.findIndex((item) => item.collabId === input.collabId);
        copy[index] = input;
        copy2[index2] = input;
        setAllCollabs((preVal) => (copy));
        setProjCollabs((preVal) => (copy2));
      }
    }
    // --------project-collaborators----------------------
    if (type === 'projCollabs') {
      if (action === 'loadin') {
        setProjCollabs((preVal) => input);
        setLoaded((preVal) => true);
      }
      if (action === 'create') {
        const copy = [...allCollabs];
        const index = copy.findIndex((item) => item.collabId === input.collabId);
        setProjCollabs((preVal) => [...preVal, copy[index]]);
        setProjCollabJoins((preVal) => [...preVal, input]);
      }
    }
    if (type === 'projCollabJoins') {
      if (action === 'loadin') {
        setProjCollabJoins((preVal) => input);
      }
    }
    if (type === 'taskCollabs') {
      if (action === 'create') {
        setTaskCollabs(input);
      }
    }
  };

  const deleteFromCollabManager = (id, type) => {
    if (type === 'allCollabs') {
      const copy = [...allCollabs];
      const index = copy.findIndex((item) => item.collabId === id);
      copy.splice(index, 1);
      setAllCollabs((preVal) => (copy));
      // const indexArr = [];
      // const copy2 = [...taskCollabs];
      // for (let i = 0; i < copy2.length; i++) { // remove from taskCollabs
      //   if (copy[i].collabId === id) {
      //     indexArr.push(i);
      //   }
      // }
    }
    if (type === 'projCollab') {
      const copy = [...projCollabs];
      const joinCopy = [...projCollabJoins];
      const index = copy.findIndex((item) => item.collabId === id);
      const joinInex = joinCopy.findIndex((item) => item.collabId === id);
      copy.splice(index, 1);
      joinCopy.splice(joinInex, 1);
      setProjCollabs((preVal) => (copy));
      setProjCollabJoins((preVal) => (joinCopy));
    }
  };

  return (
    <CollabContext.Provider value={{
      clearCollabManager,
      addToCollabManager,
      allCollabs,
      projCollabs,
      taskCollabs,
      updateCollaborator,
      setUpdateCollab,
      deleteFromCollabManager,
      loaded,
      projCollabJoins,
    }}
    >
      {children}
    </CollabContext.Provider>
  );
};

export { CollabContext, CollabContextProvider };
