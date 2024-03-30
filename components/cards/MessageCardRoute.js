import { memo, useEffect } from 'react';
import { useAuth } from '../../utils/context/authContext';
import UserMessageCard from './UserMessageCard';
import NonUserMessageCard from './NonUserMessageCard';

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

const MessageCardRoute = memo(({ message }) => {
  const { user } = useAuth();
  const isUserMessage = user.uid === message.userId;

  if (isUserMessage) {
    return <UserMessageCard message={message} />;
  }

  if (!isUserMessage) {
    return <NonUserMessageCard message={message} />;
  }

  return null;
}, deepEqualityCheck);

export default MessageCardRoute;
