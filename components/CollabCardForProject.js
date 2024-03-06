import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteProjCollab } from '../api/projCollab';
import { useCollabContext } from '../utils/context/collabContext';
import { useAuth } from '../utils/context/authContext';
import { createTaskCollab, deleteTaskCollab, updateTaskCollab } from '../api/taskCollab';
import { removeIcon } from '../public/icons';
import { removeFromProjTT, viewCollabDeetsTT } from './toolTips';
import { useSaveContext } from '../utils/context/saveManager';
import DeleteProjCollabModal from './modals/DeleteProjCollab';

export default function CollabCardforProject({ collab, taskToAssign, projectToAssign }) {
  const [expanded, setExpanded] = useState(false);
  const [ttMessage, setTTMessage] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    deleteFromCollabManager,
    projCollabJoins,
    taskCollabJoins,
    addToCollabManager,
  } = useCollabContext();
  const { allTasks } = useSaveContext();
  const { user } = useAuth();

  useEffect(() => {
    const allTasksCopy = [...allTasks];
    const thisTasktoAssign = allTasksCopy.find((item) => item.localId === taskToAssign);
    if (!thisTasktoAssign) {
      setTTMessage((preVal) => 'There Are No Tasks To Assign');
      return;
    }
    if (thisTasktoAssign.localId && !thisTasktoAssign.name) {
      setTTMessage((preVal) => 'Assign To This Task');
    } else {
      setTTMessage((preVal) => `Assign To Task: ${thisTasktoAssign.name}`);
    }
  }, [taskToAssign]);

  const assignToTaskTT = (
    <Tooltip id="assignToTaskTT">
      {ttMessage}
    </Tooltip>
  );

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

  const rightArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-arrow-right"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0
      1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
      />
    </svg>
  );

  const handleCollapse = () => {
    setExpanded((prevVal) => !prevVal);
  };

  const assignToTask = () => {
    let isInTask = false;
    const theseJoins = taskCollabJoins.filter((item) => item.taskId === taskToAssign);
    for (let i = 0; i < theseJoins.length; i++) {
      if (theseJoins[i].collabId === collab.collabId) {
        isInTask = true;
      }
    }

    if (!isInTask && taskToAssign !== 'No tasks have been created...') {
      const payload = {
        projectId: projectToAssign,
        collabId: collab.collabId,
        taskId: taskToAssign,
        userId: user.uid,
      };

      createTaskCollab(payload).then(({ name }) => {
        const payload2 = { taskCollabId: name };
        addToCollabManager({ ...payload, ...payload2 }, 'taskCollabJoins', 'create');
        updateTaskCollab(payload2);
      });
    }
  };

  const handleRemove = () => {
    const copy = [...projCollabJoins];
    const thisCollabJoinsCopy = [...taskCollabJoins];
    const thisProjJoin = copy.filter((item) => item.projectId === projectToAssign);
    const delItem = thisProjJoin.find((item) => item.collabId === collab.collabId);
    const thisProjTasks = thisCollabJoinsCopy.filter((item) => item.projectId === projectToAssign);
    const tasksOfThisCollab = thisProjTasks.filter((item) => item.collabId === delItem.collabId);
    const tasksToRemoveIds = tasksOfThisCollab.map((item) => item.taskCollabId);
    const taskDeleteArray = tasksToRemoveIds.map((id) => deleteTaskCollab(id));
    Promise.all(taskDeleteArray).then(() => {
      for (let i = 0; i < tasksToRemoveIds.length; i++) {
        deleteFromCollabManager(tasksToRemoveIds[i], 'taskCollabJoin');
      }
      deleteProjCollab(delItem.projCollabId).then(() => {
        deleteFromCollabManager(delItem.projCollabId, 'projCollabJoin');
      });
    });
  };

  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };

  return (
    <>
      <DeleteProjCollabModal show={openDeleteModal} closeModal={handleCloseModal} handleDelete={handleRemove} />
      <div className="card" style={{ margin: '1% 0%' }}>
        <div className="card-body" style={{ padding: '.75%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

          <div id="col1">
            <OverlayTrigger placement="top" overlay={viewCollabDeetsTT} delay={500}>
              <button type="button" style={{ marginRight: '3%' }} className="clearButton" onClick={handleCollapse}>
                {downIcon}
              </button>
            </OverlayTrigger>
            {collab.name}
          </div>
          <div style={{ textAlign: 'right' }}>
            <OverlayTrigger placement="top" overlay={removeFromProjTT} delay={500}>
              <button
                type="button"
                className="clearButton"
                style={{ color: 'black' }}
                onClick={() => { setOpenDeleteModal((preVal) => true); }}
              >
                {removeIcon}
              </button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={assignToTaskTT} delay={500}>
              <button
                type="button"
                className="clearButton"
                style={{ color: 'black' }}
                onClick={assignToTask}
              >
                {rightArrow}
              </button>
            </OverlayTrigger>
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
    </>
  );
}

CollabCardforProject.propTypes = {
  collab: PropTypes.shape({
    name: PropTypes.string.isRequired,
    collabId: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  taskToAssign: PropTypes.string.isRequired,
  projectToAssign: PropTypes.string.isRequired,
};
