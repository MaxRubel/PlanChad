/* eslint-disable react/prop-types */
import { OverlayTrigger } from 'react-bootstrap';
import { removeIcon } from '../../public/icons';
import { cancleInviteTT } from '../util/toolTips2';
import { deleteInvite } from '../../api/invites';
import { useSaveContext } from '../../utils/context/saveManager';

// eslint-disable-next-line react/prop-types
export default function InviteCard({ invitee }) {
  const { deleteFromSaveManager } = useSaveContext();
  const cancelInvite = () => {
    const { inviteId, projectId } = invitee;
    deleteInvite(inviteId)
      .then(() => {
        deleteFromSaveManager(invitee, 'delete', 'invite');
      });
  };
  return (
    <>
      <div className="card" style={{ margin: '1% 0%' }}>
        <div
          className="card-body"
          style={{
            padding: '.5%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr .3fr ',
          }}
        >
          <div id="col1" style={{ paddingLeft: '5%' }}>
            {invitee.name}
          </div>
          <div id="col2">
            {invitee.email}
          </div>
          <div id="col3" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            {invitee.status}
          </div>

          <div style={{ textAlign: 'right' }}>
            <OverlayTrigger placement="top" overlay={cancleInviteTT} delay={{ show: 750, hide: 0 }}>
              <button
                type="button"
                className="clearButton"
                style={{ color: 'black' }}
                onClick={cancelInvite}
              >
                {removeIcon}
              </button>
            </OverlayTrigger>
          </div>

          <div id="col2" style={{ textAlign: 'right' }} />

        </div>
      </div>
    </>
  );
}
