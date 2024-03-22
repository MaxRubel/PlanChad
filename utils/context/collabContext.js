import React, {
  createContext, useState, useContext, useEffect, useRef,
} from 'react';
import { useAuth } from './authContext';
import { getCollabsOfUser, getSingleCollab } from '../../api/collabs';
import { deleteProjCollab, getCollabsOfProject, getProjCollabsOfUser } from '../../api/projCollab';
import { deleteTaskCollab, getTaskCollabsOfUser } from '../../api/taskCollab';

const CollabContext = createContext();

export const useCollabContext = () => useContext(CollabContext);

// eslint-disable-next-line react/prop-types
const CollabContextProvider = ({ children }) => {
  const [allCollabs, setAllCollabs] = useState([]);
  const [projCollabs, setProjCollabs] = useState([]);
  const [projCollabJoins, setProjCollabJoins] = useState([]);
  const [taskCollabJoins, setTaskCollabJoins] = useState([]);
  const [updateCollaborator, setUpdateCollaborator] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const { user } = useAuth();
  const [isFetchingCollabs, setIsFetchingCollabs] = useState(true);
  const [fetchUserData, setFetchUserData] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);
  const nonUserProjects = useRef(null);

  const clearCollabManager = () => {
    setAllCollabs((preVal) => []);
    setProjCollabs((preVal) => []);
    setProjCollabJoins((preVal) => []);
    setTaskCollabJoins((preVal) => []);
  };

  const sendToCollabsManager = (projects) => {
    nonUserProjects.current = projects;
  };

  // fetch user collaborators
  useEffect(() => {
    if (user) {
      getCollabsOfUser(user.uid).then((userCollabs) => {
        getProjCollabsOfUser(user.uid).then((userProjCollabJoins) => {
          getTaskCollabsOfUser(user.uid).then((taskCollabJoinData) => {
            setAllCollabs((preVal) => userCollabs);
            setProjCollabJoins((preVal) => userProjCollabJoins);
            setTaskCollabJoins((preVal) => taskCollabJoinData);
            setIsFetchingCollabs((preVal) => false);
            setHasFetched((preVal) => true);
          });
        });
      });
    }
  }, [user, fetchUserData]);

  // fetch non-user collaborators
  useEffect(() => {
    if (nonUserProjects.current && hasFetched) {
      const allCollabsCopy = [...allCollabs];
      const nonUserProjectsArray = nonUserProjects.current.map((item) => getCollabsOfProject(item.projectId));
      Promise.all(nonUserProjectsArray).then((collabJoins) => {
        const flatArray = [...collabJoins.flat()];
        setProjCollabJoins((preVal) => [...preVal, ...flatArray]);
        // the person who created the project has no collabId
        const getNonUserCollabs = flatArray.map((item) => {
          if (item.collabId) {
            return getSingleCollab(item.collabId);
          }
          return false;
        }).filter(Boolean);
        Promise.all(getNonUserCollabs).then((collabs) => {
          const filtered2 = collabs.filter((item) => item.email !== user.email);
          for (let i = 0; i < filtered2.length; i++) {
            if (!allCollabsCopy.some((item) => item.collabId === filtered2.collabId)) {
              allCollabsCopy.push(filtered2[i]);
            }
          }

          const removeDuplicates = allCollabsCopy.filter(
            (obj, index, self) => index === self.findIndex((t) => t.email === obj.email),
          );
          setAllCollabs((preVal) => ([...removeDuplicates]));
        });
      });
    }
  }, [nonUserProjects.current, hasFetched]);

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

  const deleteAllProjCollabs = (projectId) => {
    const projCollabJoinsCopy = [...projCollabJoins];
    const taskCollabJoinsCopy = [...taskCollabJoins];
    const thisProjectJoinsCopy2 = projCollabJoinsCopy.filter((item) => item.projectId === projectId);
    const taskCollabsJoinsCopy2 = taskCollabJoinsCopy.filter((item) => item.projectId === projectId);

    const projectJoinsDel = thisProjectJoinsCopy2.map((item) => deleteProjCollab(item.projCollabId));
    const taskJoinsDel = taskCollabsJoinsCopy2.map((item) => deleteTaskCollab(item.taskCollabId));
    Promise.all([...projectJoinsDel, ...taskJoinsDel])
      .then(() => {
        setIsFetchingCollabs((preVal) => true);
        setFetchUserData((preVal) => preVal + 1);
      });
  };

  return (
    <CollabContext.Provider value={{
      clearCollabManager,
      addToCollabManager,
      allCollabs,
      projCollabs,
      updateCollaborator,
      setUpdateCollab,
      deleteFromCollabManager,
      projCollabJoins,
      taskCollabJoins,
      updateSearchInput,
      searchInput,
      isFetchingCollabs,
      deleteAllProjCollabs,
      sendToCollabsManager,
    }}
    >
      {children}
    </CollabContext.Provider>
  );
};

export { CollabContext, CollabContextProvider };
