/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import ViewInvites from '../views/ViewInvites';
import { closeIcon } from '../../public/icons';

export default function InvitesModal({ show, closeModal, handleDelete }) {
  return (
    <>
      <Modal
        show={show}
        onHide={closeModal}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Modal.Title>View Invites</Modal.Title>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              className="clearButton"
              style={{ color: 'white' }}
              onClick={closeModal}
            >{closeIcon}
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <ViewInvites />
        </Modal.Body>
        <Modal.Footer style={{ border: 'none' }} />
      </Modal>
    </>
  );
}
