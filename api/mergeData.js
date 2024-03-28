import { getSingleCollab } from './collabs';
import { getCollabsOfProject } from './projCollab';
import { getTaskCollabsOfProject } from './taskCollab';

const getJoinsOfProject = (projectId) => new Promise((resolve, reject) => {
  getCollabsOfProject(projectId).then((projCollabJoinsData) => {
    getTaskCollabsOfProject(projectId).then((taskCollabJoinsData) => {
      const projCollabPromise = projCollabJoinsData.map((item) => getSingleCollab(item.collabId));
      Promise.all(projCollabPromise).then((projCollabsData) => {
        resolve({ projCollabJoinsData, taskCollabJoinsData, projCollabsData });
      });
    });
  }).catch((error) => {
    reject(error);
  });
});

export default getJoinsOfProject;
