/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { sendIcon } from '../../public/icons2';
import { useAuth } from '../../utils/context/authContext';
import { createNewMessage, updateMessage } from '../../api/message';
import 'firebase/database';

export default function ViewChat({ projectId }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const { user } = useAuth();
  const db = firebase.database();

  useEffect(() => {
    const messagesRef = db.ref('messages').orderByChild('projectId').equalTo(projectId);

    const onMessageAdded = (snapshot) => {
      const newMessage = snapshot.val();
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage);
    };

    messagesRef.on('child_added', onMessageAdded);

    return () => {
      messagesRef.off('child_added', onMessageAdded);
    };
  }, [projectId]);

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage((preVal) => value);
  };

  const handleSubmit = () => {
    setMessage('');
    const payload = {
      message,
      projectId,
      email: user.email,
      userId: user.uid,
      timeStamp: new Date().toString(),
    };
    createNewMessage(payload)
      .then(({ name }) => {
        updateMessage({ messageId: name });
      });
  };

  return (
    <div className="card text-dark bg-info mb-3" style={{ marginBottom: '100px !important' }}>
      <div className="card-header fullCenter">Chat</div>
      <div className="card-body">
        <div
          className="card-body"
          style={{
            backgroundColor: 'lightgray',
            height: '70vh',
            overflow: 'auto',
            borderBottom: '1px solid grey',
          }}
        >
          {allMessages.map((newMessage) => (
            <div>
              {newMessage.message}
            </div>
          ))}
        </div>
        <div className="card-body" style={{ backgroundColor: 'lightgray', minHeight: '5vh' }}>
          <div id="input-bar" style={{ display: 'grid', gridTemplateColumns: '94% 5%', gap: '1%' }}>
            <textarea
              placeholder="Say something nice..."
              className="form-control"
              name="message"
              value={message}
              onChange={handleChange}
            />
            <button
              type="button"
              className="clearButton"
              style={{ color: 'black', border: '1px solid black', borderRadius: '20%' }}
              onClick={handleSubmit}
            >
              {sendIcon}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
