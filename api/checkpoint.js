const endpoint = 'https://planchad-6fcf7-default-rtdb.firebaseio.com';

const createNewCheckpoint = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/checkpoints.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const updateCheckpoint = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/checkpoints/${payload.checkpointId}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getCheckpointsOfProject = (projectId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/checkpoints.json?orderBy="projectId"&equalTo="${projectId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

const deleteCheckpoint = (checkpointId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/checkpoints/${checkpointId}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {
  createNewCheckpoint,
  deleteCheckpoint,
  updateCheckpoint,
  getCheckpointsOfProject,
};
