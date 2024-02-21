const endpoint = 'https://planchad-6fcf7-default-rtdb.firebaseio.com';

const getCollabsOfUser = (userId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/collabs.json?orderBy="userId"&equalTo="${userId}"`, {
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

const getSingleCollab = (collabId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/collabs/${collabId}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const createNewCollab = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/collabs.json`, {
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

const updateCollab = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/collabs/${payload.collabId}.json`, {
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

const deleteCollab = (collabId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/collabs/${collabId}.json`, {
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
  createNewCollab, updateCollab, getCollabsOfUser, deleteCollab, getSingleCollab,
};
