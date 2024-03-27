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
  task, refreshCheckP, indexT, checkPHasLoaded,
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
  const completeTasksHidden = useAnimationStore((state) => state.completeTasksHidden);
  const reorderPaused = useAnimationStore((state) => state.reorderPaused);

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
      updateTask(formInput);
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
  }, [minAll]);

  const handleCollapse = () => { // collapse main details
    pauseReorder();
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };
  const handleCollapse2 = () => { // collapse extra details
    pauseReorder();
    setFormInput((prevVal) => ({ ...prevVal, deetsExpanded: !prevVal.deetsExpanded }));
    userExpandedChoice.current = !formInput.deetsExpanded;
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

  if (completeTasksHidden && formInput.status === 'closed') {
    return (<div style={{ display: 'none', transition: '1s all ease' }} />);
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
              transition: reorderPaused ? 'none' : '1.5s all ease',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
            }}
          >
            <div
              id="empty"
              style={{
                transition: reorderPaused ? 'none' : '1.5s all ease',
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
              transition: reorderPaused ? 'none' : '1.5s all ease',
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
            transition: reorderPaused ? 'none' : '1.5s all ease',
            minWidth: '516px',
          }}
        >
          <div
            className="card-header 2"
            style={{ border: !formInput.expanded ? 'none' : '' }}
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
                    className="clearButtonDark fullCenter"
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
                    className="clearButtonDark fullCenter"
                    style={{ marginRight: '-6px' }}
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
                  className="clearButtonDark fullCenter"
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
                  className="clearButtonDark fullCenter"
                  onClick={formInput.fresh ? handleDelete : handleOpenModal}

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
                  <div
                    id="row2"
                    className="cardRowTask"
                  >
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
                      transition: reorderPaused ? 'none' : '1.5s all ease',
                      border: formInput.status === 'closed' ? '1px solid rgb(116, 116, 116)' : '',
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
});

export default Task;

Task.propTypes = {
  task: PropTypes.shape({
    index: PropTypes.number.isRequired,
    localId: PropTypes.string.isRequired,
    progressIsShowing: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([undefined]),
    ]),
  }).isRequired,
  refreshCheckP: PropTypes.func.isRequired,
  indexT: PropTypes.number.isRequired,
  checkPHasLoaded: PropTypes.bool.isRequired,
};
