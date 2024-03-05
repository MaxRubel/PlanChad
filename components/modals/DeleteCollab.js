/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteCollabModal({ show, closeModal, handleDelete }) {
  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Collaborator</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this collaborator?  This action will delete their task and project assignments and cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { closeModal(); handleDelete(); }}>
            Delete This Collaborator
          </Button>
          <Button variant="dark" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
