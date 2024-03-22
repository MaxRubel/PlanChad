import { useEffect, useRef, useState } from 'react';

import CollabCard from '../cards/CollabCard';

import { useSaveContext } from '../../utils/context/saveManager';
import InviteCard from '../cards/InviteCard';

export default function ViewInvites() {
  const { saveInput } = useSaveContext();
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const projectInvites = [...saveInput.invites];
    setInvites(projectInvites);
  }, [saveInput.invites]);

  return (

    <div
      className="card-body"
      id="1"
      style={{
        paddingTop: '0%',
        padding: '0% 1%',
        backgroundColor: 'rgb(225,225,225)',
        borderRadius: '5px',
        overflow: 'auto',
        margin: '1.75%',
      }}
    >
      <div className="card" style={{ border: 'none' }}>
        <div
          className="card-body"
          id="2"
          style={{
            paddingTop: '1%',
            padding: '1%',
            backgroundColor: 'rgb(225,225,225)',
          }}
        >
          {invites.length === 0 ? (
            <div>No one has been invited yet...</div>
          ) : (
            invites.map((invitee) => (
              <InviteCard
                key={invitee.email}
                invitee={invitee}
              />
            ))
          )}
        </div>
      </div>
    </div>

  );
}
