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

export { createNewMessage, updateMessage };
