/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSaveContext } from '../../utils/context/saveManager';
import { createNewInvite, updateInvite } from '../../api/invites';
import { useAuth } from '../../utils/context/authContext';
import { closeIcon } from '../../public/icons';

export default function InviteCollaborator({
  show, closeModal, collab, projectId,
}) {
  const [formInput, setFormInput] = useState({ email: '' });
  const [success, setSuccess] = useState(false);
  const { saveInput, addToSaveManager } = useSaveContext();
  const { user } = useAuth();

  let timeout;

  const successAnimation = () => {
    setSuccess((preVal) => true);
    timeout = setTimeout(() => {
      closeModal();
    }, 1500);
  };

  useEffect(() => {
    setFormInput(collab);
    setSuccess((preVal) => false);
    return () => {
      clearTimeout(timeout);
      setSuccess((preVal) => false);
    };
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((preVal) => ({ ...preVal, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const theseInvites = [...saveInput.invites];
    const email = formInput.email
      .toLowerCase()
      .replace(/\s/g, '');
    if (theseInvites.some((item) => item.email === email)) {
      window.alert('this person has already been invited');
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
              addToSaveManager(payload2, 'create', 'invite');
              successAnimation();
            });
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title>Invite Collaborator</Modal.Title>
            <button
              type="button"
              className="clearButton"
              style={{ color: 'white' }}
              onClick={closeModal}
            >{closeIcon}
            </button>
          </Modal.Header>
          <Modal.Body>
            If you would like to invite this collaborator to view this project, please make sure this email matches what they would use to log in to this app.
            <div style={{ margin: '7px 0px' }}>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formInput.email}
                onChange={handleChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            {success && (
              <div style={{ display: 'flex', justifyContent: 'right' }}>
                Invite Sent!
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <Button
                type="submit"
              >
                Send Invite
              </Button>
              <Button variant="dark" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
