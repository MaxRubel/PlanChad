/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import InviteCard from '../cards/InviteCard';
import useSaveStore from '../../utils/stores/saveStore';
import { getInvitesByProject } from '../../api/invites';

export default function ViewInvites({ projectId }) {
  const [invites, setInvites] = useState([]);
  const invitesOfProject = useSaveStore((state) => state.invitesOfProject);

  useEffect(() => {
    setInvites(invitesOfProject);
  }, [projectId, invitesOfProject]);

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
