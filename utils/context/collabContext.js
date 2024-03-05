import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
// import { getCollapseUtilityClass } from '@mui/material';
import { fetchProjectCollabs } from '../fetchAll';
// import { useSaveContext } from './saveManager';
import { useAuth } from './authContext';
import { getCollabsOfUser } from '../../api/collabs';
import { getProjCollabsOfUser } from '../../api/projCollab';
import { getTaskCollabsOfUser } from '../../api/taskCollab';

const CollabContext = createContext();

export const useCollabContext = () => useContext(CollabContext);

// eslint-disable-next-line react/prop-types
const CollabContextProvider = ({ children }) => {
  const [allCollabs, setAllCollabs] = useState([]);
  const [projCollabs, setProjCollabs] = useState([]);
  const [taskCollabs, setTaskCollabs] = useState([]);
  const [projCollabJoins, setProjCollabJoins] = useState([]);
  const [taskCollabJoins, setTaskCollabJoins] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [updateCollaborator, setUpdateCollaborator] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const { user } = useAuth();
  const [isFetchingCollabs, setIsFetchingCollabs] = useState(true);
  const clearCollabManager = () => {
    setAllCollabs((preVal) => []);
    setProjCollabs((preVal) => []);
    setProjCollabJoins((preVal) => []);
    setTaskCollabJoins((preVal) => []);
  };

  useEffect(() => { // get all of the user's collabs on initial app load
    if (user && !loaded) {
      // console.log('Grabbing user data...');
      getCollabsOfUser(user.uid).then((userCollabs) => {
        getProjCollabsOfUser(user.uid).then((userProjCollabJoins) => {
          getTaskCollabsOfUser(user.uid).then((taskCollabJoinData) => {
            // console.log('All Collaborators: ', userCollabs);
            // console.log('All Proj/Collab Joins: ', userProjCollabJoins);
            // console.log('All Task Collab Joins:', taskCollabJoinData);
            setAllCollabs((preVal) => userCollabs);
            setProjCollabJoins((preVal) => userProjCollabJoins);
            setTaskCollabJoins((preVal) => taskCollabJoinData);
            setLoaded((preVal) => !preVal);
          });
        });
      });
      setIsFetchingCollabs((preVal) => false);
    }
  }, [user]);

  const setUpdateCollab = (collabObj) => {
    setUpdateCollaborator(collabObj);
  };
  const updateSearchInput = (value) => {
    setSearchInput((preVal) => value);
  };

  const addToCollabManager = (input, type, action) => {
    // --------all-collaborators--------------------------
    if (type === 'allCollabs') {
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
      if (action === 'create') {
        const copy = [...allCollabs];
        const index = copy.findIndex((item) => item.collabId === input.collabId);
        setProjCollabs((preVal) => [...preVal, copy[index]]);
        setProjCollabJoins((preVal) => [...preVal, input]);
      }
    }
    if (type === 'projCollabJoins') {
      if (action === 'create') {
        const copy = [...projCollabJoins];
        copy.push(input);
        setProjCollabJoins((preVal) => copy);
      }
    }
    if (type === 'taskCollabJoins') {
      if (action === 'create') {
        setTaskCollabJoins((preVal) => [...preVal, input]);
      }
    }
  };

  const deleteFromCollabManager = (id, type) => {
    if (type === 'allCollabs') {
      const copy = [...allCollabs];
      const index = copy.findIndex((item) => item.collabId === id);
      copy.splice(index, 1);
      setAllCollabs((preVal) => (copy));
    }
    if (type === 'projCollabJoin') {
      setProjCollabJoins((prevProjCollabJoins) => prevProjCollabJoins.filter((item) => item.projCollabId !== id));
    }
    if (type === 'taskCollabJoin') {
      setTaskCollabJoins((prevTaskCollabJoins) => prevTaskCollabJoins.filter((item) => item.taskCollabId !== id));
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
      taskCollabJoins,
      updateSearchInput,
      searchInput,
    }}
    >
      {children}
    </CollabContext.Provider>
  );
};

export { CollabContext, CollabContextProvider };
