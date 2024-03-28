import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createNewMessage = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages.json`, {
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

const updateMessage = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages/${payload.messageId}.json`, {
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

const deleteMessage = (messageId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages/${messageId}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getMessagesOfProject = (projectId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages.json?orderBy="projectId"&equalTo="${projectId}"`, {
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

const getMessageByKey = (key) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages.json?orderBy="key"&equalTo="${key}"`, {
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

const deleteMessagesOfProject = (projectId) => {
  getMessagesOfProject(projectId)
    .then((messagesData) => {
      Promise.all(messagesData.map((message) => deleteMessage(message.messageId)));
    });
};

export {
  createNewMessage, updateMessage, deleteMessage, deleteMessagesOfProject, getMessageByKey, getMessagesOfProject,
};
