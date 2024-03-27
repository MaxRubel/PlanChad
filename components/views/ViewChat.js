/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import uniqid from 'uniqid';
import { upArrow } from '../../public/icons2';
import { useAuth } from '../../utils/context/authContext';
import { createNewMessage, updateMessage } from '../../api/message';
import 'firebase/database';
import MessageCardRoute from '../cards/MessageCardRoute';
import useSaveStore from '../../utils/stores/saveStore';
import { closeIcon } from '../../public/icons';

export default function ViewChat({ projectId }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const { user } = useAuth();
  const db = firebase.database();
  const messagesEndRef = useRef(null);
  const chatMessageToEdit = useSaveStore((state) => state.chatMessageToEdit);
  const clearEditChatMessage = useSaveStore((state) => state.clearEditChatMessage);

  useEffect(() => {
    const messagesRef = db.ref('messages').orderByChild('projectId').equalTo(projectId);

    const onMessageAdded = (snapshot) => {
      const newMessage = snapshot.val();
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const onMessageUpdated = (snapshot) => {
      const updatedMessage = snapshot.val();
      setAllMessages((prevMessages) => prevMessages.map((prevMessage) => (prevMessage.key === updatedMessage.key ? updatedMessage : prevMessage)));
    };

    const onMessageRemoved = (snapshot) => {
      const removedMessageId = snapshot.val().key;
      setAllMessages((prevMessages) => prevMessages.filter((prevMessage) => prevMessage.key !== removedMessageId));
    };

    const addedListener = messagesRef.on('child_added', onMessageAdded);
    const updatedListener = messagesRef.on('child_changed', onMessageUpdated);
    const removedListener = messagesRef.on('child_removed', onMessageRemoved);

    return () => {
      messagesRef.off('child_added', addedListener);
      messagesRef.off('child_changed', updatedListener);
      messagesRef.off('child_removed', removedListener);
    };
  }, [projectId]);

  useEffect(() => {
    setMessage((preVal) => chatMessageToEdit.message);
  }, [chatMessageToEdit]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage((preVal) => value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!chatMessageToEdit.key) {
      const payload = {
        message,
        projectId,
        key: uniqid(),
        photoURL: user.photoURL,
        email: user.email,
        userId: user.uid,
        timeStamp: new Date().toString(),
      };
      setMessage('');
      createNewMessage(payload)
        .then(({ name }) => {
          updateMessage({ messageId: name });
        });
    } else {
      setMessage('');
      const payload = {
        message,
        timeStamp: new Date().toString(),
        messageId: chatMessageToEdit.messageId,
        editted: true,
      };
      updateMessage(payload)
        .then(() => {
          clearEditChatMessage();
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const cancelEdit = () => {
    clearEditChatMessage();
    setMessage('');
  };

  return (
    <>
      <div
        id="allMessages"
        className="messagesView"
      >
        {allMessages.map((item) => (
          <MessageCardRoute key={item.key} message={item} />
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
        {chatMessageToEdit.key
          && (
            <div className="verticalCenter" style={{ marginLeft: '4px', paddingTop: '7px' }}>
              <button
                type="button"
                className="clearButton"
                onClick={cancelEdit}
                style={{
                  color: 'red', paddingBottom: '4px',
                }}
              >
                {closeIcon}
              </button>
              Editting...
            </div>
          )}
      </form>

    </>
  );
}
