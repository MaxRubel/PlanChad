import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createNewInvite = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/invites.json`, {
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

const updateInvite = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/invites/${payload.inviteId}.json`, {
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

const getInvitesByEmail = (email) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/invites.json?orderBy="email"&equalTo="${email}"`, {
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

const getInvitesByProject = (projectId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/invites.json?orderBy="projectId"&equalTo="${projectId}"`, {
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

const deleteInvite = (inviteId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/invites/${inviteId}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteAllInvitesOfProject = (projectId) => {
  getInvitesByProject(projectId).then((data) => {
    const promiseArray = data.map((item) => deleteInvite(item.inviteId));
    Promise.all(promiseArray);
  });
};

export {
  createNewInvite, updateInvite, getInvitesByEmail, deleteAllInvitesOfProject,
};
