import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';

/* eslint-disable react/prop-types */
export default function MessageCard({ message }) {
  const { user } = useAuth();
  const isUserMessage = user.uid === message.userId;

  const timeDataTT = (
    <Tooltip id="messageTimestamp">
      Sent at: {message.timeStamp}
    </Tooltip>
  );
  return (
    // <OverlayTrigger placement="top" overlay={timeDataTT} delay={{ show: 750, hide: 0 }}>
    <div id="message container" className={isUserMessage ? 'messageCardUser' : 'messageCardNonUser'}>
      <div id="author line" className={isUserMessage ? 'authorLineUser' : 'authoerLineNonUser'}>{!isUserMessage && `${message.email}:`}</div>
      <div id="message card line" className={isUserMessage ? 'messageCardLineUser' : 'messageCardLineNonUser'}>
        <div id="message card" className={isUserMessage ? 'isUserMessage' : 'isNonUserMessage'}>
          {message.message}
        </div>
      </div>
    </div>

  );
}
