/* eslint-disable react/prop-types */
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteCheckpointModal({ show, closeModal, handleDelete }) {
  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Segment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Segment?  This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { closeModal(); handleDelete(); }}>
            Delete This Segment
          </Button>
          <Button variant="dark" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}