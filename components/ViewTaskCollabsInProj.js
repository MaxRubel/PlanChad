/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSaveContext } from '../utils/context/saveManager';
import CollabCardForTaskInProj from './CollabCardForTaskInProj';
import { useCollabContext } from '../utils/context/collabContext';

// eslint-disable-next-line react/prop-types
export default function ViewTaskCollabsInProj({
  refreshProjCollabs,
  collabsExpand,
  taskId,
}) {
  const { taskCollabJoins, allCollabs } = useCollabContext();

  const [collabsOfTask, setCollabsOfTask] = useState([]);

  useEffect(() => {
    const copy = [...taskCollabJoins];
    const filtered = copy.filter((item) => item.taskId === taskId);
    const collabs = [];
    for (let i = 0; i < filtered.length; i++) {
      const collab = allCollabs.find((item) => item.collabId === filtered[i].collabId);
      collabs.push(collab);
    }
    setCollabsOfTask((preVal) => collabs);
  }, [taskId, taskCollabJoins]);

  return (
    <>
      <div className="card" style={{ marginTop: '3px', display: collabsExpand ? 'block' : 'none' }}>
        <div className="card-header" style={{ fontSize: '18px', textAlign: 'center' }}>
          <div> Assigned to This Task:</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }} />
        </div>
        <div className="card-body">
          <div className="card">
            <div className="card-body">
              {collabsOfTask.length === 0 ? (
                'No one is assigned to this task...'
              ) : (
                collabsOfTask.map((collab) => (
                  <CollabCardForTaskInProj
                    key={collab.collabId}
                    collab={collab}
                    refreshProjCollabs={refreshProjCollabs}
                    taskId={taskId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
