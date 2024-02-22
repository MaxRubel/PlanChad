/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '@mui/material';
import { useSaveContext } from '../utils/context/saveManager';
import CollabCardForTask from './CollabCardForTask';
import { useCollabContext } from '../utils/context/collabContext';

export default function AddAsigneeModal() {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const {
    saveInput,
    asigneesIsOpen,
    closeAsigneesModal,
    taskId,
  } = useSaveContext();

  const { projCollabs } = useCollabContext();

  useEffect(() => {
    setCollabsOfProj(projCollabs);
  }, [projCollabs]);

  return (
    <>
      <Modal
        show={asigneesIsOpen}
        onHide={closeAsigneesModal}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add an Asignee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card text-bg-info mb-3">
            <div className="card-header" style={{ fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
              {/* <div> Added to Project:</div> */}
              <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>{saveInput.project.name}</div>
            </div>
            <div className="card-body">
              <div className="card">
                <div className="card-body">
                  {collabsOfProj?.map((collab) => (
                    <CollabCardForTask
                      key={collab.collabId}
                      collab={collab}
                      ofProj
                      addToTask
                      taskId={taskId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3%' }}>
            <Button
              variant="outlined"
              onClick={() => { closeAsigneesModal(); }}
              style={{
                margin: '1% 0%',
                color: 'rgb(0,0,0)',
                border: '1px solid rgb(100, 100, 100)',
              }}
            >
              Back To Project
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
