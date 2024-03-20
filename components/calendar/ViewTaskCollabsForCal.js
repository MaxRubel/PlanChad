import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useCollabContext } from '../../utils/context/collabContext';
import CollabCardForTaskInCal from './CollabCardForTaskInCal';

export default function ViewTaskCollabsForCal({ taskId, formInput }) {
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
      <div
        className="card"
        style={{
          margin: '3px 1.5px',
          height: '250px',
          minWidth: '300px',
          border: formInput.status === 'closed' ? 'grey' : '',
          backgroundColor: formInput.status === 'closed' ? 'grey' : '',
        }}
      >
        <div className="card-header" style={{ fontSize: '18px', textAlign: 'center' }}>
          <div> Assigned to This Task:</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }} />
        </div>
        <div className="card-body" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
          <div
            className="card"
            style={{
              border: formInput.status === 'closed' ? 'grey' : 'none',
            }}
          >
            <div
              className="card-body"
              style={{
                backgroundColor: formInput.status === 'closed' ? 'grey' : '',
                padding: '4px 2%',
              }}
            >
              {collabsOfTask.length === 0 ? (
                'No one is assigned to this task...'
              ) : (
                collabsOfTask.map((collab) => (
                  <CollabCardForTaskInCal
                    key={collab.collabId}
                    collab={collab}
                    taskId={taskId}
                    formInput={formInput}
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

ViewTaskCollabsForCal.propTypes = {
  taskId: PropTypes.string.isRequired,
  formInput: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
};
