import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CollabCardForTaskInProj from '../cards/CollabCardForTaskInProj';
import { useCollabContext } from '../../utils/context/collabContext';

const ViewTaskCollabsInProj = memo(({ collabsExpand, taskId, formInput }) => {
  const { taskCollabJoins, projCollabs } = useCollabContext();
  const [collabsOfTask, setCollabsOfTask] = useState([]);

  useEffect(() => {
    const copy = [...taskCollabJoins];
    const filtered = copy.filter((item) => item.taskId === taskId);
    const collabs = [];
    for (let i = 0; i < filtered.length; i++) {
      const collab = projCollabs.find((item) => item.collabId === filtered[i].collabId);
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
          display: collabsExpand ? 'block' : 'none',
          border: formInput.status === 'closed' ? 'grey' : '1px solid lightgrey',
          backgroundColor: formInput.status === 'closed' ? 'grey' : '',
          transition: 'all 1.5s ease',
        }}
      >
        <div className="card-header" style={{ fontSize: '18px', textAlign: 'center' }}>
          <div> Assigned to This Task:</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }} />
        </div>
        <div className="card-body" style={{ padding: '12px' }}>
          <div
            className="card"
            style={{
              transition: 'all 1.5s ease',
              border: formInput.status === 'closed' ? 'grey' : '',
            }}
          >
            <div
              className="card-body"
              style={{
                transition: 'all 1.5s ease',
                padding: '8px',
                backgroundColor: formInput.status === 'closed' ? 'grey' : '',
              }}
            >
              {collabsOfTask.length === 0 ? (
                'No one is assigned to this task...'
              ) : (
                collabsOfTask.map((collab) => (
                  <CollabCardForTaskInProj
                    key={collab?.collabId}
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
});

export default ViewTaskCollabsInProj;

ViewTaskCollabsInProj.propTypes = {
  collabsExpand: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
  formInput: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
};
