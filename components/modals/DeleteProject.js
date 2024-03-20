/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteProjectModal({ show, closeModal, handleDelete }) {
  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this project?  This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { handleDelete(); closeModal(); }}>
            Delete This Project
          </Button>
          <Button variant="dark" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
