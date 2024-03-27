/* eslint-disable @next/next/no-img-element */
import {
  memo, useEffect, useMemo, useState,
} from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { useCollabContext } from '../../utils/context/collabContext';
import { addPersonSmall } from '../../public/icons2';
import { addToCollabsTT } from '../util/toolTips2';
import AddCollabForm2 from '../modals/AddCollabForm2';

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

const NonUserMessageCard = memo(({ message }) => {
  const { user } = useAuth();
  const { allCollabs } = useCollabContext();
  const [messageSenderName, setMessageSenderName] = useState('');
  const [inContacts, setInContacts] = useState(true);
  const [openAddCollab, setOpenAddCollab] = useState(false);

  useEffect(() => {
    const sender = allCollabs.find((item) => item.email === message.email);
    if (sender && sender.name) {
      setMessageSenderName(sender.name);
      setInContacts(true);
    } else {
      setMessageSenderName(message.email);
      setInContacts(false);
    }
  }, [message, allCollabs]);

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
      return `Yesterday at ${timeString}`;
    } if (
      messageDay === todaysDate.getDate()
      && messageMonth === todaysDate.getMonth()
      && messageYear === todaysDate.getFullYear()
    ) {
      return `Today at ${timeString}`;
    }
    return `${messageMonth + 1}/${messageDay}/${messageYear} ${timeString}`;
  }, [message.timeStamp]);

  const handleClick = () => {
    setOpenAddCollab((preVal) => true);
  };

  const handleClose = () => {
    setOpenAddCollab((preVal) => false);
  };

  return (
    <div id="message container" className="messageCardNonUser">
      <AddCollabForm2
        show={openAddCollab}
        handleClose={handleClose}
        email={message.email}
      />
      <div id="author line" className="authoerLineNonUser verticalCenter">
        {messageSenderName}
        {!inContacts && (
          <OverlayTrigger placement="top" overlay={addToCollabsTT} delay={{ show: 750, hide: 0 }}>
            <button
              type="button"
              className="clearButtonDark fullCenter"
              onClick={handleClick}
              style={{ paddingBottom: '3px' }}
            >
              {addPersonSmall}
            </button>
          </OverlayTrigger>

        )}
      </div>
      <div id="time line" className="timeLineNonUser">{messageTimeLine}</div>
      <div id="message card line" className="messageCardLineNonUser">
        <div className="fullCenter">
          <img
            src={message.photoURL}
            alt={user.displayName}
            className="nonUserImageChat"
          />
        </div>
        <div id="message card" className="isNonUserMessage">
          {message.message}
        </div>
      </div>
    </div>

  );
}, deepEqualityCheck);

export default NonUserMessageCard;
