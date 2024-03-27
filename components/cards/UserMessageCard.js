/* eslint-disable @next/next/no-img-element */
import { memo, useMemo } from 'react';
import { useAuth } from '../../utils/context/authContext';
import { editIconSmall, trashSmall } from '../../public/icons2';
import { deleteMessage, getMessageByKey } from '../../api/message';
import useSaveStore from '../../utils/stores/saveStore';

/* eslint-disable react/prop-types */
const deepEqualityCheck = (prevProps, nextProps) => {
  const prevMessage = prevProps.message;
  const nextMessage = nextProps.message;
  return (
    Object.keys(prevMessage).every(
      (key) => prevMessage[key] === nextMessage[key],
    )
    && Object.keys(nextMessage).every((key) => nextMessage[key] === prevMessage[key])
  );
};

const UserMessageCard = memo(({ message }) => {
  const { user } = useAuth();
  const editChatMessage = useSaveStore((state) => state.editChatMessage);

  const messageTimeLine = useMemo(() => {
    const messageDate = new Date(message.timeStamp);
    const messageMonth = messageDate.getMonth();
    const messageDay = messageDate.getDate();
    const messageYear = messageDate.getFullYear();
    const timeString = messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const todaysDate = new Date();
    const yesterdaysDate = new Date(todaysDate);
    yesterdaysDate.setDate(todaysDate.getDate() - 1);
    if (
      messageDay === yesterdaysDate.getDate()
      && messageMonth === yesterdaysDate.getMonth()
      && messageYear === yesterdaysDate.getFullYear()
    ) {
      return `${message.editted ? '(editted)' : ''} Yesterday at ${timeString}`;
    } if (
      messageDay === todaysDate.getDate()
      && messageMonth === todaysDate.getMonth()
      && messageYear === todaysDate.getFullYear()
    ) {
      return `${message.editted ? '(editted)' : ''} Today at ${timeString}`;
    }
    return `${message.editted ? '(editted)' : ''} ${messageMonth + 1}/${messageDay}/${messageYear} ${timeString}`;
  }, [message.timeStamp]);

  const handleClick = () => {
    if (!message.messageId) {
      getMessageByKey(message.key)
        .then((messageData) => {
          editChatMessage(messageData);
        });
    } else {
      editChatMessage(message);
    }
  };

  const handleDelete = () => {
    if (!message.messageId) {
      getMessageByKey(message.key)
        .then((messageData) => {
          deleteMessage(messageData.messageId);
        });
    } else {
      deleteMessage(message.messageId);
    }
  };

  return (
    <div id="message container" className="messageCardUser">
      <div id="author line" className="authorLineUser" />
      <div id="time line" className="timeLineUser">{messageTimeLine}</div>
      <div id="message card line" className="messageCardLineUser">
        <div id="message card" className="isUserMessage">
          {message.message}
        </div>
        <div className="fullCenter">
          <img
            src={message.photoURL}
            alt={user.displayName}
            className="userImageChat"
          />
        </div>
      </div>
      <div className="verticalCenter" style={{ justifyContent: 'right' }}>
        <button
          type="button"
          className="clearButtonDark"
          onClick={handleClick}
        >
          {editIconSmall}
        </button>
        <button
          type="button"
          className="clearButtonDark"
          onClick={handleDelete}
          style={{ paddingBottom: '2px', paddingTop: '0px' }}
        >
          {trashSmall}
        </button>
      </div>
    </div>

  );
}, deepEqualityCheck);

export default UserMessageCard;
