/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteProjCollabModal({ show, closeModal, handleDelete }) {
  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Collaborator?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this collaborator from your project?  This action will delete their task assignments and cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { closeModal(); handleDelete(); }}>
            Remove This Collaborator
          </Button>
          <Button variant="dark" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
