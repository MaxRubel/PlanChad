import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getCollabsOfProject = (projectId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/projCollabs.json?orderBy="projectId"&equalTo="${projectId}"`, {
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

const getProjCollabsOfCollab = (collabId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/projCollabs.json?orderBy="collabId"&equalTo="${collabId}"`, {
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

const getProjCollabsOfUser = (userId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/projCollabs.json?orderBy="userId"&equalTo="${userId}"`, {
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

const createNewProjCollab = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/projCollabs.json`, {
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

const updateProjCollab = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/projCollabs/${payload.projCollabId}.json`, {
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

const deleteProjCollab = (projCollabId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/projCollabs/${projCollabId}.json`, {
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
  createNewProjCollab,
  updateProjCollab,
  getCollabsOfProject,
  getProjCollabsOfCollab,
  deleteProjCollab,
  getProjCollabsOfUser,
};
