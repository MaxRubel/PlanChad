/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import { sendIcon, upArrow } from '../../public/icons2';
import { useAuth } from '../../utils/context/authContext';
import { createNewMessage, updateMessage } from '../../api/message';
import 'firebase/database';
import MessageCard from '../cards/MessageCard';

export default function ViewChat({ projectId }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const { user } = useAuth();
  const db = firebase.database();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = db.ref('messages').orderByChild('projectId').equalTo(projectId);
    const onMessageAdded = (snapshot) => {
      const newMessage = snapshot.val();
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    messagesRef.on('child_added', onMessageAdded);

    return () => {
      messagesRef.off('child_added', onMessageAdded);
    };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage((preVal) => value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <div
        id="allMessages"
        className="messagesView"
      >
        {allMessages.map((newMessage) => (
          <MessageCard key={newMessage.messageId} message={newMessage} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="transitionBlock" />
      <form
        id="inputMessage"
        onSubmit={handleSubmit}
        className="chatInputField"
      >
        <div
          className="input-container"
          style={{
            position: 'relative',
            display: 'flex',
          }}
        >
          <textarea
            className="form-control chat-message-input"
            type="text"
            name="message"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type something..."
          />
          <button
            type="submit"
            className="clearButton"
            style={{ color: 'black' }}
          >
            {upArrow}
          </button>
        </div>
      </form>
    </>
  );
}
