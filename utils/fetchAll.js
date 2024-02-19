import { getCheckpointsOfProject } from '../api/checkpoint';
import { getSingleProject } from '../api/project';
import { getTasksOfCheckP } from '../api/task';

const fetchAll = (projectId) => new Promise((resolve, reject) => {
  getSingleProject(projectId).then((project) => {
    getCheckpointsOfProject(projectId).then((checkpointsData) => {
      const taskPromArray = checkpointsData.map((checkpoint) => getTasksOfCheckP(checkpoint.localId));
      Promise.all(taskPromArray).then((tasksData) => {
        const checkpoints = [];
        checkpointsData.forEach((checkP) => {
          const copy = { ...checkP };
          const tasksOfCheckPoint = tasksData.find((innerArray) => innerArray.some((obj) => obj.checkpointId === checkP.localId));
          if (tasksOfCheckPoint) {
            copy.tasks = tasksOfCheckPoint;
          } else {
            copy.tasks = [];
          }
          checkpoints.push(copy);
        });
        resolve({ project, checkpoints });
      }).catch(reject);
    });
  });
});

export default fetchAll;
