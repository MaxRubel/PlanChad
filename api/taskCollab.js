const endpoint = 'https://planchad-6fcf7-default-rtdb.firebaseio.com';

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

export { createTaskCollab, updateTaskCollab };
