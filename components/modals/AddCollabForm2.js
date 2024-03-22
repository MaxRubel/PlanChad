/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import uniqid from 'uniqid';
import { useAuth } from '../../utils/context/authContext';
import { useCollabContext } from '../../utils/context/collabContext';
import { createNewCollab, updateCollab } from '../../api/collabs';
import { getProjCollabsOfCollab, updateProjCollab } from '../../api/projCollab';
import { closeIcon } from '../../public/icons';

const initialState = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export default function AddCollabForm2(props) {
  const { handleClose, show } = props;
  const [formInput, setForminput] = useState(initialState);
  const [addToProject, setAddtoProj] = useState(false);
  const [role, setRole] = useState('');
  const { user } = useAuth();
  const { addToCollabManager, updateCollaborator, setUpdateCollab } = useCollabContext();

  useEffect(() => {
    if (updateCollaborator) {
      setForminput(updateCollaborator);
    }
  }, [updateCollaborator]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRole((prevVal) => value);
    } else {
      setForminput((prevVal) => ({ ...prevVal, [name]: value }));
    }
  };

  // const updateAllJoins = (payload) => {
  //   getProjCollabsOfCollab(payload.collabId).then((data) => {
  //     const IDs = data.map((item) => item.projCollabId);
  //     const promiseArray = IDs.map((id) => {
  //       const payload2 = {
  //         projCollabId: id,
  //         email: payload.email,
  //       };
  //       return updateProjCollab(payload2);
  //     });
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateCollaborator) { // update collaborator
      const payload = {
        ...formInput,
        collabId: updateCollaborator.collabId,
      };
      updateCollab(payload);
      setForminput(initialState);
      addToCollabManager(payload, 'allCollabs', 'update');
      // updateAllJoins(payload);
    } else { // create collaborator
      const payload = {
        ...formInput,
        userId: user.uid,
        localId: uniqid(),
      };
      createNewCollab(payload).then(({ name }) => {
        updateCollab({ collabId: name });
        setAddtoProj((prevVal) => false);
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
          <button
            type="button"
            className="clearButton"
            style={{ color: 'white' }}
            onClick={handleClose}
          >{closeIcon}
          </button>
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
            <Button variant="secondary" onClick={() => { handleClose(); setForminput(initialState); }}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
