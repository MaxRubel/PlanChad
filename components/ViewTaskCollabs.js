/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { getCollabsOfProject } from '../api/projCollab';
import CollabCard from './CollabCard';
import { getSingleCollab } from '../api/collabs';
import { useSaveContext } from '../utils/context/saveManager';
import { plusIcon } from '../public/icons';

// eslint-disable-next-line react/prop-types
export default function ViewTaskCollabs({
  projectId, refreshProjCollabs, refreshProjCs, collabsExpand, taskId,
}) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const {
    projCollabs, setProjCollabs, saveInput, sendTaskIdtoSaveManager,
  } = useSaveContext();
  const [addAsigneeM, setAddAsigneeM] = useState(false);
  const { openAssigneesModal } = useSaveContext();

  useEffect(() => {
    getCollabsOfProject(projectId).then((data) => {
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
  }, [refreshProjCs, projectId]);
  const addAsignee = () => {
    openAssigneesModal(taskId);
  };

  return (
    <>
      <Collapse in={collabsExpand} dimension="width">
        <div className="card text-bg-info mb-3" style={{ marginTop: '3px' }}>
          <div className="card-header" style={{ fontSize: '16px', textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div style={{ textAlign: 'left' }}>
                <button type="button" className="clearButton" style={{ color: 'black' }} onClick={addAsignee}>
                  {plusIcon}
                </button>
              </div>
              Asignees:
            </div>
          </div>
          <div className="card-body">
            <div className="card">
              <div className="card-body">
                {collabsOfProj.map((collab) => (
                  <CollabCard
                    key={collab.collabId}
                    collab={collab}
                    ofProj
                    refreshProjCollabs={refreshProjCollabs}
                    projectId={projectId}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
}
