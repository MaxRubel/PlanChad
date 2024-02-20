import { getSingleProject } from '../api/project';

const fetchAll2 = (projectId) => new Promise((resolve, reject) => {
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
  });
});

export default fetchAll2;
