/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import uniqid from 'uniqid';
import { useAuth } from '../../utils/context/authContext';
import { useCollabContext } from '../../utils/context/collabContext';
import { createNewCollab, updateCollab } from '../../api/collabs';

const initialState = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export default function AddCollabForm2(props) {
  const {
    handleClose, show, email, inComingName,
  } = props;
  const [formInput, setForminput] = useState(initialState);
  const { user } = useAuth();
  const { addToCollabManager, updateCollaborator } = useCollabContext();
  useEffect(() => {
    if (email) {
      setForminput((preVal) => ({ ...preVal, email }));
    }
    if (inComingName) {
      setForminput((preVal) => ({ ...preVal, name: inComingName }));
    }
    if (updateCollaborator) {
      setForminput(updateCollaborator);
    }
  }, [updateCollaborator, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForminput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailFormatted = formInput.email.toLowerCase();
    if (updateCollaborator) { // update collaborator
      const payload = {
        ...formInput,
        email: emailFormatted,
        collabId: updateCollaborator.collabId,
      };
      updateCollab(payload);
      setForminput(initialState);
      addToCollabManager(payload, 'allCollabs', 'update');
    } else { // create collaborator
      const payload = {
        ...formInput,
        email: emailFormatted,
        userId: user.uid,
        localId: uniqid(),
      };
      createNewCollab(payload).then(({ name }) => {
        updateCollab({ collabId: name });
        setForminput((prevVal) => initialState);
        addToCollabManager({ ...payload, collabId: name }, 'allCollabs', 'create');
      });
    }
    handleClose();
    setForminput(initialState);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} animation>
        <Modal.Header>
          <Modal.Title>{updateCollaborator ? 'Edit Collaborator' : 'Add a Collaborator'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                style={{ backgroundColor: 'rgb(225, 225, 225)' }}
                value={formInput.name}
                onChange={handleChange}
                name="name"
                id="name"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                style={{ backgroundColor: 'rgb(225, 225, 225)' }}
                value={formInput.email}
                onChange={handleChange}
                name="email"
                id="email"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="phone"
                style={{ backgroundColor: 'rgb(225, 225, 225)' }}
                value={formInput.phone}
                onChange={handleChange}
                name="phone"
                id="phone"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                style={{ backgroundColor: 'rgb(225, 225, 225)' }}
                rows={3}
                value={formInput.notes}
                onChange={handleChange}
                name="notes"
                id="notes"
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setForminput(initialState);
                handleClose();
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
