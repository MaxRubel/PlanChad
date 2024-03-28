import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useRouter } from 'next/router';
import {
  deleteProject, getSingleProject, getUserProjects,
} from '../../api/project';
import { useAuth } from './authContext';
import { useCollabContext } from './collabContext';
import { getInvitesByEmail } from '../../api/invites';
import useSaveStore from '../stores/saveStore';

const saveContext = createContext(null);

export const useSaveContext = () => useContext(saveContext);

// eslint-disable-next-line react/prop-types
export const SaveContextProvider = ({ children }) => {
  const [fetchUserData, setFetchUserData] = useState(0);
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { sendToCollabManager } = useCollabContext();

  // ----zustand-data-store-----
  const loadAllProjects = useSaveStore((state) => state.loadAllProjects);
  const loadAllTasks = useSaveStore((state) => state.loadAllTasks);
  const projectsHaveBeenLoaded = useSaveStore((state) => state.projectsHaveBeenLoaded);
  const deleteProjectZus = useSaveStore((state) => state.deleteProject);
  const clearSaveStore = useSaveStore((state) => state.clearSaveStore);

  useEffect(() => {
    const projectsArray = [];
    const allTasksArr = [];
    if (user) {
      // load user data:
      getUserProjects(user.uid)
        .then((data) => {
          const userProjects = [...data];
          projectsArray.push(...userProjects);
          // decipher all tasks:
          for (let i = 0; i < userProjects.length; i++) {
            if (userProjects[i].tasks) {
              const theseTasks = JSON.parse(userProjects[i].tasks);
              for (let x = 0; x < theseTasks.length; x++) {
                allTasksArr.push(theseTasks[x]);
              }
            }
          }
          // load invites:
          getInvitesByEmail(user.email)
            .then((userInvites) => {
              const invitedProjectIDs = userInvites.map((item) => item.projectId);
              const promiseArray = invitedProjectIDs.map((projectId) => getSingleProject(projectId));

              Promise.all(promiseArray).then((invitedProjects) => {
                const projectsData = [...invitedProjects];
                // add additional projects if not
                for (let y = 0; y < projectsData.length; y++) {
                  projectsArray.push(projectsData[y]);
                }
                // decipher tasks:
                for (let i = 0; i < projectsData.length; i++) {
                  if (projectsData[i].tasks) {
                    const theseTasks = JSON.parse(projectsData[i].tasks);
                    for (let x = 0; x < theseTasks.length; x++) {
                      allTasksArr.push(theseTasks[x]);
                    }
                  }
                }
                sendToCollabManager(projectsData);
                loadAllProjects(projectsArray);
                projectsHaveBeenLoaded(true);
                loadAllTasks(allTasksArr);
                setIsFetchingUserData((preVal) => false);
              });
            });
        });
    }
  }, [user, fetchUserData]);

  const clearAllLocalData = () => {
    projectsHaveBeenLoaded(false);
  };

  const theBigDelete = (projectId) => {
    setIsFetchingUserData((preVal) => true);
    deleteProjectZus(projectId);
    deleteProject(projectId).then(() => {
      setFetchUserData((prev) => prev + 1);
      clearSaveStore();
      router.push('/');
      projectsHaveBeenLoaded(false);
    });
  };

  // --------delete-----------------

  return (
    <saveContext.Provider value={{
      isFetchingUserData, // bool
      theBigDelete, // function
      clearAllLocalData, // function
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
