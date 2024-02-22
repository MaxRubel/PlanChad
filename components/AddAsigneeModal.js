/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '@mui/material';
import CollabCard from './CollabCard';
import { useSaveContext } from '../utils/context/saveManager';
import { getCollabsOfProject } from '../api/projCollab';
import { getSingleCollab } from '../api/collabs';
import CollabCardForTask from './CollabCardForTask';

export default function AddAsigneeModal() {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const {
    setProjCollabs,
    saveInput,
    asigneesIsOpen,
    closeAsigneesModal,
    taskId,
  } = useSaveContext();

  useEffect(() => {
    if (asigneesIsOpen) {
      getCollabsOfProject(saveInput.project.projectId).then((data) => {
        const collabIds = [];
        for (let i = 0; i < data.length; i++) {
          collabIds.push(data[i].collabId);
        }
        const promArray = collabIds.map((collabId) => (getSingleCollab(collabId)));
        Promise.all(promArray).then((collabsData) => {
          setCollabsOfProj(collabsData);
          setProjCollabs(collabsData);
        });
      });
    }
  }, [asigneesIsOpen]);

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
                  {collabsOfProj.map((collab) => (
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
