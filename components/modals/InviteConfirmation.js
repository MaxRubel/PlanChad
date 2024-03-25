/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createNewInvite, updateInvite } from '../../api/invites';
import { useAuth } from '../../utils/context/authContext';
import { closeIcon } from '../../public/icons';
import useSaveStore from '../../utils/stores/saveStore';
import { copyIcon, thumbsUpIcon } from '../../public/icons2';

export default function InviteCollaborator({
  show, closeModal, collab, projectId,
}) {
  const [formInput, setFormInput] = useState({ email: '' });
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const addInviteToProject = useSaveStore((state) => state.addInviteToProject);
  const invitesOfProject = useSaveStore((state) => state.invitesOfProject);
  const [extraMessageShowing, setExtraMessageShowing] = useState(false);
  const [copiedMessageShowing, setCopiedMessageShowing] = useState(false);
  const [alreadyInvitedMessage, setAlreadyInvitedMessage] = useState(false);

  let timeout;

  const successAnimation = () => {
    setSuccess((preVal) => true);
    timeout = setTimeout(() => {
      setExtraMessageShowing((preVal) => true);
      setSuccess((preVal) => false);
    }, 1000);
  };

  useEffect(() => {
    setFormInput(collab);
    setSuccess((preVal) => false);
    return () => {
      clearTimeout(timeout);
      setSuccess((preVal) => false);
      setExtraMessageShowing((preVal) => false);
      setAlreadyInvitedMessage((preVal) => false);
    };
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((preVal) => ({ ...preVal, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = formInput.email
      .toLowerCase()
      .replace(/\s/g, '');
    if (invitesOfProject.some((item) => item.email === email && item.projectId === projectId)) {
      setExtraMessageShowing((preVal) => true);
      setAlreadyInvitedMessage((preVal) => true);
    } else {
      const payload = {
        projectId,
        email,
        name: collab.name,
        collabId: collab.collabId,
        userId: user.uid,
        teamLeader: false,
        status: 'Pending',
        timeStamp: new Date().getTime(),
      };
      createNewInvite(payload)
        .then(({ name }) => {
          updateInvite({ inviteId: name })
            .then(() => {
              const payload2 = { ...payload, inviteId: name };
              addInviteToProject(payload2);
              successAnimation();
            });
        });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://main--planchad.netlify.app/project/plan/${projectId}`)
      .then(() => {
        setCopiedMessageShowing((preVal) => true);
        timeout = setTimeout(() => {
          setCopiedMessageShowing((preVal) => false);
        }, 1000);
      });
  };

  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <form onSubmit={handleSubmit}>
          <Modal.Header style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Modal.Title>Invite Collaborator</Modal.Title>
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                className="clearButton"
                style={{ color: 'white' }}
                onClick={closeModal}
              >{closeIcon}
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            Please make sure this email matches what this collaborator would use to log in to this app.
            <div style={{ margin: '3% 0px' }}>
              <input
                className="form-control"
                type="email"
                name="email"
                autoComplete="email"
                value={formInput.email}
                onChange={handleChange}
                required
              />
            </div>
            {extraMessageShowing && (
              <div style={{ borderTop: '1px solid lightgrey', paddingTop: '3%', marginBottom: '3px' }}>
                <div style={{ marginBottom: '2%' }}>
                  {alreadyInvitedMessage ? 'This person has already been invited.  Here is a link to share with them:' : 'Share link:'}
                </div>
                <input
                  id="readOnly"
                  className="form-control"
                  readOnly
                  value={`https://main--planchad.netlify.app/project/plan/${projectId}`}
                />
                <div style={{ marginTop: '6px' }}>
                  <button type="button" onClick={handleCopy} className="clearButton" style={{ color: 'white' }}>
                    {copiedMessageShowing ? (
                      <>
                        Copied <span role="img" aria-label="thumbs up">{thumbsUpIcon}</span>
                      </>
                    ) : (
                      <>
                        Copy text <span role="img" aria-label="thumbs up">{copyIcon}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {success && (
              <div style={{ display: 'flex', justifyContent: 'right' }}>
                <div>  Invite Created!</div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              {extraMessageShowing ? '' : (
                <Button
                  style={{ margin: '0px 8px' }}
                  type="submit"
                >
                  Create Invite
                </Button>
              )}
              <Button variant="dark" onClick={closeModal}>
                {extraMessageShowing ? 'Close' : 'Cancel'}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
