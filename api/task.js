const endpoint = 'https://planchad-6fcf7-default-rtdb.firebaseio.com';

const createNewTask = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tasks.json`, {
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

const updateTask = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tasks/${payload.taskId}.json`, {
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

const getTasksOfCheckP = (checkpointId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tasks.json?orderBy="checkpointId"&equalTo="${checkpointId}"`, {
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

const deleteTask = (taskId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/tasks/${taskId}.json`, {
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
  createNewTask, updateTask, getTasksOfCheckP, deleteTask,
};
