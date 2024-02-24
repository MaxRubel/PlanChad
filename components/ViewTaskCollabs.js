/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { getCollabsOfProject } from '../api/projCollab';
import CollabCard from './CollabCard';
import { getSingleCollab } from '../api/collabs';
import { useSaveContext } from '../utils/context/saveManager';
import { plusIcon } from '../public/icons';
import CollabCardForTask from './CollabCardForTask';

// eslint-disable-next-line react/prop-types
export default function ViewTaskCollabs({
  projectId, refreshProjCollabs, refreshProjCs, collabsExpand, taskId, onManageCollabsPage,
}) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const {
    projCollabs,
    setProjCollabs,
    saveInput,
    sendTaskIdtoSaveManager,
  } = useSaveContext();
  const [addAsigneeM, setAddAsigneeM] = useState(false);
  const [collabsOfTask, setCOllabsOfTaks] = useState([]);
  const { openAssigneesModal } = useSaveContext();

  // useEffect(() => {
  //   getCollabsOfTask(projectId).then((data) => {
  //     const collabIds = [];
  //     for (let i = 0; i < data.length; i++) {
  //       collabIds.push(data[i].collabId);
  //     }
  //     const promArray = collabIds.map((collabId) => (getSingleCollab(collabId)));
  //     Promise.all(promArray).then((collabsData) => {
  //       setCollabsOfProj(collabsData);
  //       setProjCollabs(collabsData);
  //     });
  //   });
  // }, [refreshProjCs, projectId]);
  const addAsignee = () => {
    openAssigneesModal(taskId);
  };

  return (
    <>
      {/* <Collapse in={collabsExpand} dimension="width"> */}
      <div className="card text-bg-info mb-3" style={{ width: '47%' }}>
        <div className="card-header" style={{ fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
          <div> Assigned to Task:</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
            <label htmlFor="tasks">Choose a car:</label>
            <select name="tasks" id="tasks">
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="card">
            <div className="card-body">
              {collabsOfProj.map((collab) => (
                <CollabCardForTask
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
      {/* </Collapse> */}
    </>
  );
}
