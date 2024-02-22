const endpoint = 'https://planchad-6fcf7-default-rtdb.firebaseio.com';

const getCollabsOfTask = (projectId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/taskCollabs.json?orderBy="projectId"&equalTo="${projectId}"`, {
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

const getTaskCollabsOfProject = (projectId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/taskCollabs.json?orderBy="projectId"&equalTo="${projectId}"`, {
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

const createTaskCollab = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/taskCollabs.json`, {
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

const updateTaskCollab = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/taskCollabs/${payload.taskCollabId}.json`, {
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

export {
  createTaskCollab,
  updateTaskCollab,
  getCollabsOfTask,
  getTaskCollabsOfProject,
};
