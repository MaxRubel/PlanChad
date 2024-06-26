import { Collapse } from 'react-bootstrap';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { removeIcon } from '../../public/icons';
import { deleteTaskCollab } from '../../api/taskCollab';
import { useCollabContext } from '../../utils/context/collabContext';

export default function CollabCardForTaskInProj({ taskId, collab, formInput }) {
  const [expanded, setExpanded] = useState(false);
  const { taskCollabJoins, deleteFromCollabManager } = useCollabContext();

  const downIcon = (
    <svg
      className={expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512"
    >
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6
    9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5
    256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4
    24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z"
      />
    </svg>
  );

  const removeFromTask = () => {
    const copy = [...taskCollabJoins];
    const itemToRemove = copy.find((item) => item.collabId === collab.collabId && item.taskId === taskId);
    deleteTaskCollab(itemToRemove.taskCollabId).then(() => {
      deleteFromCollabManager(itemToRemove.taskCollabId, 'taskCollabJoin');
    });
  };
  const handleCollapse = () => {
    setExpanded((prevVal) => !prevVal);
  };

  return (
    <div className="card" style={{ margin: '1% 0%', backgroundColor: formInput.status === 'closed' ? 'grey' : 'white' }}>
      <div className="card-body" style={{ padding: '2%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div id="col1">
          <button type="button" style={{ marginRight: '3%' }} className="clearButton" onClick={handleCollapse}>
            {downIcon}
          </button>
          {collab?.name}
        </div>
        <div id="col2" style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="clearButton"
            style={{ color: 'black' }}
            onClick={removeFromTask}
          >
            {removeIcon}
          </button>
        </div>
        <Collapse in={expanded}>
          <div>
            <div className="grid3">
              <div />
              <div>Phone:</div>
              {collab?.phone}
            </div>
            <div className="grid3">
              <div />
              <div>Email:</div>
              {collab?.email}
            </div>
            <div className="grid3">
              <div />
              <div>Notes:</div>
              {collab?.notes}
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

CollabCardForTaskInProj.propTypes = {
  collab: PropTypes.shape({
    name: PropTypes.string.isRequired,
    collabId: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  taskId: PropTypes.string.isRequired,
  formInput: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
};
