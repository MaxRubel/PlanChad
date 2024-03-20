import {
  useState, useEffect, useRef, useCallback, memo,
} from 'react';
import { Collapse, OverlayTrigger } from 'react-bootstrap';
import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import {
  calendarIcon, editIcon, peopleIcon, trashIcon,
} from '../public/icons';
import TaskDeets from './TaskDeets';
import { useSaveContext } from '../utils/context/saveManager';
import {
  closeTaskToolTip,
  collapseToolTaskTip,
  deleteTaskToolTip,
  expandTaskTooltip,
  hideCollabsToolTips,
  viewCollabsToolTips,
  viewTaskDeetsToolTip,
  viewTaskDeetsToolTipCollapse,
} from './util/toolTips';
import { useCollabContext } from '../utils/context/collabContext';
import { deleteTaskCollab } from '../api/taskCollab';
import DeleteTaskModal from './modals/DeleteTask';

const initialState = {
  localId: '',
  name: '',
  startDate: '',
  deadline: '',
  description: '',
  prep: '',
  exec: '',
  debrief: '',
  index: '',
  weight: '',
  status: 'open',
  expanded: false,
  deetsExpanded: false,
  collabsExpanded: false,
  fresh: true,
  planning: '',
};

function Task({
  task, min, refreshCheckP, indexT, checkPHasLoaded, pauseAnimations,
}) {
  const [formInput, setFormInput] = useState(initialState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { addToSaveManager, deleteFromSaveManager, saveInput } = useSaveContext();
  const { taskCollabJoins, deleteFromCollabManager } = useCollabContext();
  const [hasMounted, setHasMounted] = useState(false);
  const userExpandedChoice = useRef();

  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="10px"
      viewBox="0 0 320 512"
    >
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5
      0-33.9L188.5 256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9
      0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z"
      />
    </svg>
  );

  useEffect(() => {
    let timeout;
    if (checkPHasLoaded) {
      setFormInput((preVal) => task);
      timeout = setTimeout(() => {
        setHasMounted((preVal) => true);
      }, 1000);
    }
    return () => { clearTimeout(timeout); };
  }, [task, checkPHasLoaded]);

  useEffect(() => {
    if (checkPHasLoaded) {
      addToSaveManager(formInput, 'update', 'task');
    }
  }, [formInput]);

  const handleFresh = () => {
    setFormInput((preVal) => ({ ...preVal, fresh: false }));
  };

  useEffect(() => { // minimze task
    if ((formInput.expanded || formInput.deetsExpanded) && checkPHasLoaded) {
      setFormInput((prevVal) => ({
        ...prevVal, expanded: false, deetsExpanded: false,
      }));
    }
  }, [min]);

  const handleCollapse = () => { // collapse main details
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };

  const handleCollapse2 = () => { // collapse extra details
    setFormInput((prevVal) => ({ ...prevVal, deetsExpanded: !prevVal.deetsExpanded }));
    userExpandedChoice.current = !formInput.deetsExpanded;
  };

  const handleChange = (e) => {
    handleFresh();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
  };

  const handleCheck = (e) => {
    handleFresh();
    const { checked } = e.target;
    setFormInput((prevVal) => ({
      ...prevVal,
      status: checked ? 'closed' : 'open',
    }));
  };

  const handleExpandCollabs = () => {
    if (userExpandedChoice && formInput.deetsExpanded) {
      setFormInput((preVal) => ({ ...preVal, collabsExpanded: !preVal.collabsExpanded }));
    }
    if (!userExpandedChoice.current && !formInput.deetsExpanded) {
      setFormInput((preVal) => ({ ...preVal, collabsExpanded: true }));
      setFormInput((preVal) => ({ ...preVal, deetsExpanded: true }));
    }
    if (!userExpandedChoice.current && formInput.deetsExpanded) {
      setFormInput((preVal) => ({ ...preVal, collabsExpanded: false }));
      setFormInput((preVal) => ({ ...preVal, deetsExpanded: false }));
    }
  };

  const handleDelete = () => {
    const joinsCopy = [...taskCollabJoins];
    const filteredCopy = joinsCopy.filter((item) => item.taskId === task.localId);
    const promiseArray = filteredCopy.map((item) => deleteTaskCollab(item.taskCollabId));
    Promise.all(promiseArray).then(() => {
      for (let i = 0; i < filteredCopy.length; i++) {
        deleteFromCollabManager(filteredCopy[i].taskCollabId, 'taskCollabJoin');
      }
    });
    deleteFromSaveManager(formInput, 'delete', 'task');
    refreshCheckP();
    setOpenDeleteModal((prevVal) => false);
  };

  const handleOpenModal = useCallback(() => {
    setOpenDeleteModal((preVal) => true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenDeleteModal((prevVal) => false);
  }, []);

  if (saveInput.project.hideCompletedTasks && formInput.status === 'closed') {
    return (<div style={{ display: 'none' }} />);
  }

  return (
    <>
      {openDeleteModal && (
        <DeleteTaskModal
          show={openDeleteModal}
          handleDelete={handleDelete}
          closeModal={handleCloseModal}
        />
      )}
      <div className="task">
        {/* -------line-side------------- */}

        <div
          className="marginL"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <div id="empty" />
          <div
            id="line"
            style={{
              borderLeft: '2px solid rgb(255, 117, 26, .5)',
              transition: '1.5s all ease',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
            }}
          >
            <div
              id="empty"
              style={{
                transition: '1.5s all ease',
                borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(255, 117, 26, .5)',
              }}
            />
            <div />
          </div>
        </div>
        <div id="line" style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div
            id="top-div"
            style={{
              transition: '1.5s all ease',
              borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(255, 117, 26, .5)',
            }}
          />
          <div id="bottom-div" />
        </div>
        {/* -----------card---------------------- */}
        <div
          className="card"
          style={{
            margin: '3px 0px',
            backgroundColor: formInput.status === 'closed' ? 'grey' : '',
            transition: '1.5s all ease',
            minWidth: '516px',
          }}
        >
          <div
            className="card-header 2"
            style={{
              minWidth: '516px',
              alignContent: 'center',
              height: '53px',
              border: !formInput.expanded ? 'none' : '',
            }}
          >
            <div className="verticalCenter">
              <div
                id="button-row"
                className="verticalCenter"
                style={{
                  minWidth: '115px',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <OverlayTrigger
                  placement="top"
                  overlay={formInput.expanded ? collapseToolTaskTip : expandTaskTooltip}
                  trigger={['hover', 'focus']}
                  delay={{ show: 750, hide: 0 }}
                >
                  <button
                    type="button"
                    onClick={handleCollapse}
                    className="fullCenter"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      textAlign: 'center',
                      color: 'black',
                      width: '35px',
                      height: '35px',
                    }}
                  >
                    {calendarIcon}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={formInput.deetsExpanded ? viewTaskDeetsToolTipCollapse : viewTaskDeetsToolTip}
                  trigger={['hover', 'focus']}
                  delay={{ show: 750, hide: 0 }}
                >
                  <button
                    type="button"
                    onClick={handleCollapse2}
                    className="fullCenter"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      textAlign: 'center',
                      color: 'black',
                      width: '35px',
                      height: '35px',
                      justifyContent: 'center',
                    }}
                  >
                    {editIcon}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={closeTaskToolTip}
                  trigger={['hover', 'focus']}
                  delay={{ show: 750, hide: 0 }}
                >
                  <Checkbox
                    id={`task-completed${task.localId}`}
                    checked={formInput.status === 'closed'}
                    onChange={(e) => { handleCheck(e); }}
                    inputProps={{ 'aria-label': 'controlled' }}
                    size="medium"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 23,
                        color: 'black',
                      },
                    }}
                  />
                </OverlayTrigger>
              </div>
            </div>
            <div className="fullCenter" style={{ display: 'flex', justifyContent: 'left', marginLeft: '5%' }}>
              <input
                className="form-control"
                style={{
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '75%',
                }}
                placeholder={`Task ${indexT + 1}`}
                value={formInput.name}
                name="name"
                onChange={handleChange}
                onPointerDownCapture={(e) => e.stopPropagation()}
                autoComplete="off"
              />
            </div>
            <div
              className="verticalCenter"
              style={{

                gap: '12%',
                justifyContent: 'right',
                paddingRight: '10%',
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={formInput.collabsExpanded ? hideCollabsToolTips : viewCollabsToolTips}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  className="verticalCenter"
                  style={{ color: 'black', backgroundColor: 'transparent', border: 'none' }}
                  onClick={handleExpandCollabs}
                >
                  {peopleIcon}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={deleteTaskToolTip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  className="veritcalCenter"
                  onClick={formInput.fresh ? handleDelete : handleOpenModal}
                  style={{
                    paddingBottom: '4px', color: 'black', backgroundColor: 'transparent', border: 'none',
                  }}
                >
                  {trashIcon}
                </button>
              </OverlayTrigger>
            </div>
          </div>
          {/* --------------card-body------------------------ */}
          <Collapse in={formInput.expanded} style={{ transition: hasMounted ? '' : 'none' }}>
            <div>
              <div id="whole-card">
                <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '.5% 0%' }}>
                  <div
                    id="row3"
                    className="cardRow"
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                      <div className="verticalCenter" style={{ whiteSpace: 'nowrap' }}>
                        <label htmlFor="startDate">Start Date:</label>
                      </div>
                      <div />
                    </div>
                    <div
                      className="fullCenter"
                      style={{ paddingRight: '20%' }}
                    >
                      <input
                        id="startDate"
                        className="form-control"
                        type="date"
                        value={formInput.startDate}
                        onChange={handleChange}
                        name="startDate"
                        style={{
                          backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                          border: 'none',
                          transition: '1.5s all ease',
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div
                    id="row2"
                    className="cardRow"
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                      <div className="verticalCenter">
                        <label htmlFor="deadline">Deadline:</label>
                      </div>
                      <div />
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20%',
                    }}
                    >
                      <input
                        className="form-control"
                        type="date"
                        value={formInput.deadline}
                        onChange={handleChange}
                        name="deadline"
                        id="deadline"
                        style={{
                          backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                          border: 'none',
                          transition: '1.5s all ease',
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
                <div
                  id="description-field"
                  className="fullCenter"
                  style={{
                    borderTop: formInput.status === 'closed' ? 'none' : '1px solid rgb(180, 180, 180)',
                    padding: '1% 10%',
                    paddingBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div id="text-label" className="fullCenter">
                    <label htmlFor={`description${task.localId}`} className="form-label" style={{ textAlign: 'center' }}>
                      Description:
                    </label>
                  </div>
                  <textarea
                    className="form-control"
                    placeholder="A description of your task..."
                    id={`description${task.localId}`}
                    rows="3"
                    value={formInput.description}
                    onChange={handleChange}
                    name="description"
                    style={{
                      backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                      transition: '1.5s all ease',
                      border: 'none',
                      minWidth: '250px',
                    }}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                  />
                </div>

              </div>
            </div>
          </Collapse>
        </div>
        {/* -----add-a-task------ */}
        <div className="marginR" />
      </div>
      <TaskDeets
        formInput={formInput}
        handleChange={handleChange}
        taskId={task.localId}
      />
    </>
  );
}

Task.propTypes = {
  task: PropTypes.shape({
    index: PropTypes.number.isRequired,
    localId: PropTypes.string.isRequired,
    progressIsShowing: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([undefined]),
    ]),
  }).isRequired,
  min: PropTypes.number.isRequired,
  refreshCheckP: PropTypes.func.isRequired,
  indexT: PropTypes.number.isRequired,
  checkPHasLoaded: PropTypes.bool.isRequired,
  pauseAnimations: PropTypes.func.isRequired,
};

const MemoizedTask = memo(Task);

export default MemoizedTask;
