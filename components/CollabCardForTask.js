/* eslint-disable react/prop-types */
import { Collapse } from 'react-bootstrap';
import { useState } from 'react';
import { useSaveContext } from '../utils/context/saveManager';
import { plusIcon } from '../public/icons';
import { createTaskCollab, updateTaskCollab } from '../api/taskCollab';

export default function CollabCardForTask({
  taskId,
  collab,
}) {
  const [expanded, setExpanded] = useState(false);
  const {
    setTaskCollabs,
    taskCollabs,
    saveInput,
  } = useSaveContext();

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

  const addToTask = () => {
    const payload = {
      collabId: collab.collabId,
      taskId,
      projectId: saveInput.project.projectId,
    };
    const isAlreadyInTask = taskCollabs.filter((taskCollab) => taskCollab.collabId === collab.collabId
      && taskCollab.taskId === taskId);
    if (isAlreadyInTask.length === 0) {
      createTaskCollab(payload).then(({ name }) => {
        const payload2 = { taskCollabId: name };
        updateTaskCollab(payload2).then(() => {
          setTaskCollabs((preVal) => ([...preVal, { ...payload, ...payload2 }]));
        });
      });
    }
  };

  const handleCollapse = () => {
    setExpanded((prevVal) => !prevVal);
  };

  return (
    <div className="card" style={{ margin: '1% 0%' }}>
      <div className="card-body" style={{ padding: '2%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        <div id="col1">
          <button type="button" style={{ marginRight: '3%' }} className="clearButton" onClick={handleCollapse}>
            {downIcon}
          </button>
          {collab.name}
        </div>

        <div id="col2" style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="clearButton"
            style={{ color: 'black' }}
            onClick={addToTask}
          >
            {plusIcon}
          </button>
        </div>

        <Collapse in={expanded}>
          <div>
            <div className="grid3">
              <div />
              <div>Phone:</div>
              {collab.phone}
            </div>
            <div className="grid3">
              <div />
              <div>Email:</div>
              {collab.email}
            </div>
            <div className="grid3">
              <div />
              <div>Notes:</div>
              {collab.notes}
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
