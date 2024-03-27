/* eslint-disable react/prop-types */
import { Button, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { closeIcon } from '../../public/icons';
import DeleteProjectsTable from '../tables/DeleteProjectsTable';
import { alertDanger } from '../../public/icons2';
import { useSaveContext } from '../../utils/context/saveManager';
import { deleteAllInvitesOfProject } from '../../api/invites';
import { useCollabContext } from '../../utils/context/collabContext';

export default function DeleteAProjectModal({ show, closeModal }) {
  const [askAreYouSure, setAskAreYouSure] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const { theBigDelete } = useSaveContext();
  const { deleteAllProjCollabs } = useCollabContext();

  const handleStartDelete = (projectId) => {
    setAskAreYouSure((preVal) => true);
    setProjectToDelete((preVal) => projectId);
  };

  useEffect(() => {
    setAskAreYouSure((preVal) => false);
    setProjectToDelete((preVal) => null);
  }, [show]);

  const handleDelete = () => {
    theBigDelete(projectToDelete);
    deleteAllProjCollabs(projectToDelete);
    deleteAllInvitesOfProject(projectToDelete);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => { setAskAreYouSure(false); closeModal(); }}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
        style={{ minWidth: '200px', marginTop: '20vh', backgroundColor: 'black' }}
      >
        <Modal.Header style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Modal.Title>Delete A Project</Modal.Title>
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
        <Modal.Body style={{ padding: 'none !important' }}>
          <DeleteProjectsTable
            handleStartDelete={handleStartDelete}
          />
          {askAreYouSure && (
            <div className="verticalCenter" style={{ padding: '24px', paddingBottom: '8px' }}>
              <div style={{ color: 'red', margin: '0px 10px' }}> {alertDanger}</div>
              <div>
                &nbsp;
                Are you sure you want to delete this project and all its data? This action cannot be undone.
              </div>
            </div>
          )}
        </Modal.Body>
        {askAreYouSure && (
          <Modal.Footer style={{ border: 'none', paddingTop: '0px', paddingBottom: '16px' }}>
            <>
              <Button
                variant="danger"
                onClick={() => {
                  handleDelete();
                  closeModal();
                }}
              >
                Delete This Project
              </Button>
              <Button variant="dark" onClick={closeModal}>
                Cancel
              </Button>
            </>

          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
