/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

export default function ShareLinkModal({ show, segment, closeModal }) {
  const [formInput, setFormInput] = useState();

  const handleSubmit = () => {
    console.log('lets go');
  };

  const handleChange = () => {
    console.log('change');
  };
  return (
    <>
      <Modal show={show} onHide={closeModal} animation>
        <Modal.Header closeButton>
          <Modal.Title>Share Link?</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body />
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                // handleClose(); setForminput(initialState);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
