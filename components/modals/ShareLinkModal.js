/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { closeIcon } from '../../public/icons';

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
        <Modal.Header>
          <Modal.Title>Share Link?</Modal.Title>
          <button
            type="button"
            className="clearButton"
            style={{ color: 'white' }}
            onClick={closeModal}
          >{closeIcon}
          </button>
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
