import { getSingleCollab } from '../api/collabs';
import { getCollabsOfProject } from '../api/projCollab';
import { getSingleProject } from '../api/project';
import { getTaskCollabsOfProject } from '../api/taskCollab';

const fetchProjectDetails = (projectId) => new Promise((resolve, reject) => {
  getSingleProject(projectId).then((data) => {
    const checkpoints = [];
    const tasks = data.tasks ? JSON.parse(data.tasks) : [];
    if (data.checkpoints) {
      const checkpointsFormatted = JSON.parse(data.checkpoints);
      checkpointsFormatted.forEach((checkP) => {
        const copy = checkP;
        const tasksOfCheckp = tasks.filter((task) => task.checkpointId === checkP.localId);
        copy.tasks = tasksOfCheckp;
        checkpoints.push(copy);
      });
    }
    resolve({ project: data, checkpoints });
  }).catch(reject);
});

const fetchProjectCollabs = (projectId) => new Promise((resolve, reject) => {
  getCollabsOfProject(projectId).then((projCollabJoins) => {
    const collabsOfProjcProm = projCollabJoins.map((item) => getSingleCollab(item.collabId));
    Promise.all(collabsOfProjcProm).then((projCollabs) => {
      getTaskCollabsOfProject(projectId).then((taskCollabs) => {
        resolve({ projCollabs, taskCollabs, projCollabJoins });
      });
    });
  }).catch(reject);
});

export { fetchProjectDetails, fetchProjectCollabs };
