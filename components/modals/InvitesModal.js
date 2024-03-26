/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import ViewInvites from '../views/ViewInvites';
import { closeIcon } from '../../public/icons';
import useSaveStore from '../../utils/stores/saveStore';

export default function InvitesModal({ show, closeModal, projectId }) {
  const allProjects = useSaveStore((state) => state.allProjects);
  const project = allProjects.find((item) => item.projectId === projectId);

  return (
    <>
      <Modal
        show={show}
        onHide={closeModal}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Modal.Title>View Invites for {project?.name}</Modal.Title>
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
          <ViewInvites projectId={projectId} />
        </Modal.Body>
        <Modal.Footer style={{ border: 'none' }} />
      </Modal>
    </>
  );
}
