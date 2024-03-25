import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useRouter } from 'next/router';
import {
  deleteProject, getSingleProject, getUserProjects, updateProject,
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
  const [singleProjectRunning, setSingleProjectRunning] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { sendToCollabsManager } = useCollabContext();

  // ----zustand-data-store-----
  const loadCheckpoints = useSaveStore((state) => state.loadCheckpoints);
  const loadTasks = useSaveStore((state) => state.loadTasks);
  const loadProjectZus = useSaveStore((state) => state.loadProject);
  const loadInvites = useSaveStore((state) => state.loadInvites);
  const loadAllProjects = useSaveStore((state) => state.loadAllProjects);
  const loadAllTasks = useSaveStore((state) => state.loadAllTasks);
  const allProjectsZus = useSaveStore((state) => state.allProjects);
  const projectsHaveBeenLoaded = useSaveStore((state) => state.projectsHaveBeenLoaded);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);

  useEffect(() => {
    const projectsArray = [];
    const allTasksArr = [];
    if (user && !projectsLoaded) {
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
                sendToCollabsManager(projectsData);
                loadAllProjects(projectsArray);
                projectsHaveBeenLoaded(true);
                loadAllTasks(allTasksArr);
                setIsFetchingProjects((preVal) => false);
              });
            });
        });
    }
  }, [user, fetchUserData]);

  const clearAllLocalData = () => {
    projectsHaveBeenLoaded(false);
    setSingleProjectRunning(false);
  };

  const loadProject = useCallback((projectId) => {
    const project = allProjectsZus.find((item) => item.projectId === projectId);
    let checkpoints = [];
    let tasks = [];
    let invites = [];
    if (project?.checkpoints) {
      const checkpointsFormat = JSON.parse(project.checkpoints);
      checkpoints = checkpointsFormat.sort((a, b) => a.index - b.index);
    }
    if (project?.tasks) {
      const tasksFormat = JSON.parse(project.tasks);
      tasks = tasksFormat;
    }
    if (project?.invites) {
      const invitesFormat = JSON.parse(project.invites);
      invites = invitesFormat;
    }
    const obj = {
      project, checkpoints, tasks, invites,
    };
    loadProjectZus(project);
    loadCheckpoints(checkpoints);
    loadTasks(tasks);
    loadInvites(invites);
    setSingleProjectRunning((preVal) => true);
    return obj;
  }, [projectsLoaded]);

  const theBigDelete = (projectId) => {
    setIsFetchingProjects((preVal) => true);
    deleteProject(projectId).then(() => {
      setFetchUserData((prev) => prev + 1);
      router.push('/');
      projectsHaveBeenLoaded(false);
    });
  };

  // --------delete-----------------

  return (
    <saveContext.Provider value={{
      loadProject, // function
      singleProjectRunning, // bool
      isFetchingProjects, // bool
      theBigDelete, // function
      clearAllLocalData, // function
    }}
    >
      {children}
    </saveContext.Provider>
  );
};
