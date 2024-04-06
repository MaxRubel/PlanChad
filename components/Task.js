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
import useSaveStore from '../utils/stores/saveStore';
import useAnimationStore from '../utils/stores/animationsStore';

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
  startTime: '',
  endTime: '',
};

const Task = memo(({
  task, refreshCheckP, indexT, checkPHasLoaded, updateArrayAfterDelete,
}) => {
  const [formInput, setFormInput] = useState(initialState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { taskCollabJoins, deleteFromCollabManager } = useCollabContext();
  const [hasMounted, setHasMounted] = useState(false);
  const userExpandedChoice = useRef();
  const updateTask = useSaveStore((state) => state.updateTask);
  const deleteTask = useSaveStore((state) => state.deleteTask);
  const pauseReorder = useAnimationStore((state) => state.pauseReorder);
  const minAll = useAnimationStore((state) => state.minAll);
  const storedProject = useSaveStore((state) => state.project);
  const reorderPaused = useAnimationStore((state) => state.reorderPaused);

  useEffect(() => {
    let timeout;
    if (checkPHasLoaded) {
      setFormInput((preVal) => task);
      timeout = setTimeout(() => {
        setHasMounted((preVal) => true);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [task, checkPHasLoaded]);

  useEffect(() => {
    if (checkPHasLoaded) {
      updateTask(formInput);
    }
  }, [formInput]);

  const handleFresh = () => {
    setFormInput((preVal) => ({ ...preVal, fresh: false }));
  };

  useEffect(() => {
    // minimze task
    if ((formInput.expanded || formInput.deetsExpanded) && checkPHasLoaded) {
      setFormInput((prevVal) => ({
        ...prevVal,
        expanded: false,
        deetsExpanded: false,
      }));
    }
  }, [minAll]);

  const handleCollapse = () => {
    // collapse main details
    pauseReorder();
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };
  const handleCollapse2 = () => {
    // collapse extra details
    pauseReorder();
    setFormInput((prevVal) => ({ ...prevVal, deetsExpanded: !prevVal.deetsExpanded }));
    userExpandedChoice.current = !formInput.deetsExpanded;
    if (formInput.deetsExpanded && formInput.collabsExpanded) {
      setFormInput((preVal) => ({ ...preVal, collabsExpanded: false }));
    }
  };

  const handleExpandCollabs = () => {
    pauseReorder();
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

  const handleChange = useCallback((e) => {
    handleFresh();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
  }, []);

  const handleCheck = useCallback((e) => {
    handleFresh();
    const { checked } = e.target;
    setFormInput((prevVal) => ({
      ...prevVal,
      status: checked ? 'closed' : 'open',
    }));
  }, []);

  const handleDelete = () => {
    const joinsCopy = [...taskCollabJoins];
    const filteredCopy = joinsCopy.filter((item) => item.taskId === task.localId);
    const promiseArray = filteredCopy.map((item) => deleteTaskCollab(item.taskCollabId));
    Promise.all(promiseArray).then(() => {
      for (let i = 0; i < filteredCopy.length; i++) {
        deleteFromCollabManager(filteredCopy[i].taskCollabId, 'taskCollabJoin');
      }
    });
    pauseReorder();
    deleteTask(formInput);
    refreshCheckP();
    setOpenDeleteModal((prevVal) => false);
  };

  const handleOpenModal = useCallback(() => {
    setOpenDeleteModal((preVal) => true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenDeleteModal((prevVal) => false);
  }, []);

  if (storedProject?.hideCompletedTasks && formInput.status === 'closed') {
    return <div style={{ display: 'none', transition: '1s all ease' }} />;
  }
  return (
    <>
      {openDeleteModal && (
        <DeleteTaskModal show={openDeleteModal} handleDelete={handleDelete} closeModal={handleCloseModal} />
      )}
      <div className="task">
        {/* -------line-side------------- */}

        <div
          className="marginL"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
        >
          <div
            className="task-deets-left-line"
            id="line"
            style={{
              transition: reorderPaused ? 'none' : '1.5s all ease',
            }}
          >
            <div
              id="empty"
              style={{
                transition: reorderPaused ? 'none' : '1.5s all ease',
                borderBottom:
                  formInput.status === 'closed'
                    ? '2px solid grey'
                    : '2px solid rgb(255, 117, 26, .5)',
              }}
            />
            <div />
          </div>
        </div>
        <div id="line" style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div
            id="top-div"
            style={{
              transition: reorderPaused ? 'none' : '1.5s all ease',
              borderBottom:
                formInput.status === 'closed'
                  ? '2px solid grey'
                  : '2px solid rgb(255, 117, 26, .5)',
            }}
          />
          <div id="bottom-div" />
        </div>
        {/* -----------card---------------------- */}
        <div
          className="card white"
          style={{
            margin: '3px 0px',
            backgroundColor: formInput.status === 'closed' ? 'grey' : '',
            transition: reorderPaused ? 'none' : '1.5s all ease',
          }}
        >
          <div className="task-header verticalCenter">
            <div className="col-1-task" style={{ padding: '0px 4px' }}>
              <OverlayTrigger
                placement="top"
                overlay={closeTaskToolTip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <Checkbox
                  id={`task-completed${task.localId}`}
                  checked={formInput.status === 'closed'}
                  onChange={(e) => {
                    handleCheck(e);
                  }}
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
              <OverlayTrigger
                placement="top"
                overlay={formInput.expanded ? collapseToolTaskTip : expandTaskTooltip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  onClick={handleCollapse}
                  style={{ width: '44px', height: '44px' }}
                  className="clearButtonDark fullCenter hide"
                >
                  {calendarIcon}
                </button>
              </OverlayTrigger>
            </div>
            <div id="col-2" className="verticalCenter">
              <input
                className="form-control small-name"
                style={{
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
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
              id="col-3"
              className="verticalCenter hide"
              style={{
                justifyContent: 'right',
              }}
            >
              {' '}
              <OverlayTrigger
                placement="top"
                overlay={formInput.deetsExpanded ? viewTaskDeetsToolTipCollapse : viewTaskDeetsToolTip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  onClick={handleCollapse2}
                  style={{ width: '44px', height: '44px', marginRight: '-3px' }}
                  className="clearButtonDark fullCenter hide"
                >
                  {editIcon}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={formInput.collabsExpanded ? hideCollabsToolTips : viewCollabsToolTips}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  className="clearButtonDark fullCenter hide"
                  style={{ height: '44px', width: '44px' }}
                  onClick={handleExpandCollabs}
                >
                  {peopleIcon}
                </button>
              </OverlayTrigger>
            </div>
            <div id="col-4" className="fullCenter">
              <OverlayTrigger
                placement="top"
                overlay={deleteTaskToolTip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  className="clearButtonDark fullCenter hide"
                  onClick={formInput.fresh ? handleDelete : handleOpenModal}
                  style={{ height: '44px', width: '44px' }}
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
                <div
                  id="card-container"
                  style={{ display: 'flex', flexDirection: 'column', padding: '.5% 0%' }}
                >
                  <div id="row1" className="cardRowTask">
                    <div id="col2" className="fullCenter">
                      <label htmlFor="startDate">Start:</label>
                    </div>
                    <div id="col3" className="fullCenter">
                      <input
                        id="startDate"
                        className="form-control"
                        type="date"
                        value={formInput.startDate}
                        onChange={handleChange}
                        name="startDate"
                        style={{
                          backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                          border: formInput.status === 'closed' ? '1px solid rgb(116, 116, 116)' : '',
                          transition: reorderPaused ? 'none' : '1.5s all ease',
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div id="col4">
                      <input
                        id="startDate"
                        className="form-control"
                        type="time"
                        value={formInput.startTime}
                        onChange={handleChange}
                        name="startTime"
                        style={{
                          backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                          border: formInput.status === 'closed' ? '1px solid rgb(116, 116, 116)' : '',
                          transition: reorderPaused ? 'none' : '1.5s all ease',
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div id="col5 empty" />
                  </div>
                  <div id="row2" className="cardRowTask">
                    <div id="col2" className="fullCenter">
                      <label htmlFor="deadline">End:</label>
                    </div>
                    <div id="col3">
                      <input
                        className="form-control"
                        type="date"
                        value={formInput.deadline}
                        onChange={handleChange}
                        name="deadline"
                        id="deadline"
                        style={{
                          backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                          border: formInput.status === 'closed' ? '1px solid rgb(116, 116, 116)' : '',
                          transition: reorderPaused ? 'none' : '1.5s all ease',
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div id="col4">
                      <input
                        id="end"
                        className="form-control"
                        type="time"
                        value={formInput.endTime}
                        onChange={handleChange}
                        name="endTime"
                        style={{
                          backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
                          border: formInput.status === 'closed' ? '1px solid rgb(116, 116, 116)' : '',
                          transition: reorderPaused ? 'none' : '1.5s all ease',
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div id="col5 empty" />
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
                    <label
                      htmlFor={`description${task.localId}`}
                      className="form-label"
                      style={{ textAlign: 'center' }}
                    >
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
                      transition: reorderPaused ? 'none' : '1.5s all ease',
                      border: formInput.status === 'closed' ? '1px solid rgb(116, 116, 116)' : '',
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
      <TaskDeets formInput={formInput} handleChange={handleChange} taskId={task.localId} />
    </>
  );
});

export default Task;

Task.propTypes = {
  task: PropTypes.shape({
    index: PropTypes.number.isRequired,
    localId: PropTypes.string.isRequired,
    progressIsShowing: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([undefined])]),
  }).isRequired,
  refreshCheckP: PropTypes.func.isRequired,
  indexT: PropTypes.number.isRequired,
  checkPHasLoaded: PropTypes.bool.isRequired,
  updateArrayAfterDelete: PropTypes.func.isRequired,
};
