/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteCheckpointModal({ show, closeModal, handleDelete }) {
  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Delete Phase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Phase?  This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => { handleDelete(); }}
          >
            Delete This Phase
          </Button>
          <Button variant="dark" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
