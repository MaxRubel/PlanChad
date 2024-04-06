/* eslint-disable react/prop-types */
import {
  useState, useEffect, memo, useCallback, useRef,
} from 'react';
import { Collapse, OverlayTrigger } from 'react-bootstrap';
import uniqid from 'uniqid';
import { Reorder, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import { calendarIcon, plusIcon, trashIcon } from '../public/icons';
import {
  expandTooltip,
  collapseToolTip,
  addTaskToolTip,
  deleteSegment,
  expandTaskTooltip,
  collapseToolTaskTip,
} from './util/toolTips';
import { useCollabContext } from '../utils/context/collabContext';
import { deleteTaskCollab } from '../api/taskCollab';
import DeleteCheckpointModal from './modals/DeleteCheckpoint';
import Task from './Task';
import useSaveStore from '../utils/stores/saveStore';
import useAnimationStore from '../utils/stores/animationsStore';
import useProgressBarAnimation from '../utils/hooks/useProgressBarAnimation';
import useProgressBar from '../utils/hooks/useProgressBar';
import useMinimizeCheckpoint from '../utils/hooks/useMinimizeCheckpoint';

const Checkpoint = memo(({
  checkP, handleRefresh, index, progressIsShowing,
}) => {
  const [formInput, setFormInput] = useState({
    description: '',
    name: '',
    startDate: '',
    deadline: '',
    index: '',
    fresh: true,
    expandedCal: false,
    expanded: false,
  });

  const { taskCollabJoins, deleteFromCollabManager } = useCollabContext();
  const [tasks, setTasks] = useState([]);
  const [checkPrefresh, setCheckPrefresh] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [hasLoaded, setHasloaded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const updatedCheckpoint = useSaveStore((state) => state.updateCheckpoint);
  const deleteCheckpoint = useSaveStore((state) => state.deleteCheckpoint);
  const createNewTask = useSaveStore((state) => state.createNewTask);
  const storedTasks = useSaveStore((state) => state.tasks);
  const reOrderTheTasks = useSaveStore((state) => state.reOrderTheTasks);
  const pauseReorder = useAnimationStore((state) => state.pauseReorder);
  const reorderPaused = useAnimationStore((state) => state.reorderPaused);

  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512"
    >
      <path
        d="M285.5 273L91.1 467.3c-9.4 9.4-24.6
      9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5
      256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4
      24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z"
      />
    </svg>
  );

  const timeoutRef = useRef(null);

  useEffect(() => {
    pauseReorder();
    const theseTasks = storedTasks
      .filter((task) => task.checkpointId === checkP.localId)
      .sort((a, b) => a.index - b.index);
    setTasks(theseTasks);
    setFormInput(checkP);
    setHasloaded((preVal) => true);
    timeoutRef.current = setInterval(() => {
      setHasMounted((preVal) => true);
    }, 1000);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [checkP]);

  useEffect(() => {
    // send to zustand
    updatedCheckpoint(formInput);
  }, [formInput]);

  useEffect(() => {
    // saveIndex after dragNdrop
    setFormInput((prevVal) => ({ ...prevVal, index }));
  }, [index]);

  useEffect(() => {
    const theseTasks = storedTasks.filter((task) => task.checkpointId === checkP.localId);
    setTasks((preVal) => theseTasks);
  }, [checkPrefresh]);

  useMinimizeCheckpoint(hasLoaded, setFormInput);
  useProgressBarAnimation(progressIsShowing, storedTasks, checkP);
  useProgressBar(progressIsShowing, storedTasks, checkP);

  const dance = () => {
    document
      .getElementById(`addTask${checkP.localId}`)
      .animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }], {
        duration: 500,
        iterations: 1,
      });
  };
  const refreshCheckP = useCallback(() => {
    setCheckPrefresh((prevVal) => prevVal + 1);
  }, []);

  const handleFresh = () => {
    if (formInput.fresh) {
      setFormInput((preVal) => ({ ...preVal, fresh: false }));
    }
  };
  const handleChange = (e) => {
    handleFresh();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const handleCollapse = () => {
    pauseReorder();
    if (formInput.expanded) {
      setFormInput((prevVal) => ({ ...prevVal, expanded: false }));
    } else {
      setFormInput((prevVal) => ({ ...prevVal, expanded: true }));
    }
  };
  const handleCollapseCal = () => {
    pauseReorder();
    if (formInput.expandedCal) {
      setFormInput((prevVal) => ({ ...prevVal, expandedCal: false }));
    } else {
      setFormInput((prevVal) => ({ ...prevVal, expandedCal: true }));
    }
  };

  const handleDragStart = () => {
    refreshCheckP();
  };
  const handleDragEnd = () => {
    reOrderTheTasks(tasks);
  };
  const handleReorder = (e) => {
    const reordered = e.map((item, idx) => ({ ...item, index: idx }));
    setTasks((preVal) => reordered);
  };

  const handleOpenModal = () => {
    setOpenDeleteModal((prevVal) => true);
  };
  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };

  const addTask = () => {
    dance();
    handleFresh();
    setFormInput((preVal) => ({ ...preVal, expanded: true }));
    const emptyTask = {
      checkpointId: checkP.localId,
      projectId: checkP.projectId,
      localId: uniqid(),
      name: '',
      startDate: '',
      deadline: '',
      description: '',
      planning: '',
      index: tasks.length,
      weight: '',
      status: 'open',
      fresh: true,
      expanded: false,
      deetsExpanded: false,
      collabsExpanded: false,
      lineColor: randomColor(),
      startTime: '',
      endTime: '',
    };
    createNewTask(emptyTask);
    pauseReorder();
    setCheckPrefresh((prevVal) => prevVal + 1);
  };

  const updateArrayAfterDelete = (array) => {
    setTasks(array);
  };

  const handleDelete = () => {
    const taskCollabsCopy = [...taskCollabJoins];
    const checkPtasks = storedTasks.filter((item) => item.checkpointId === checkP.localId);
    const collabDeleteArray = [];
    for (let i = 0; i < checkPtasks.length; i++) {
      const filtered = taskCollabsCopy.filter((item) => item.taskId === checkPtasks[i].localId);
      for (let x = 0; x < filtered.length; x++) {
        collabDeleteArray.push(filtered[x]);
      }
    }
    Promise.all(collabDeleteArray.map((item) => deleteTaskCollab(item.taskCollabId))).then(() => {
      for (let i = 0; i < collabDeleteArray.length; i++) {
        deleteFromCollabManager(collabDeleteArray[i].taskCollabId, 'taskCollabJoin');
      }
      deleteCheckpoint(formInput);
      handleRefresh();
      setOpenDeleteModal((preVal) => false);
    });
  };

  return (
    <>
      {openDeleteModal && (
        <DeleteCheckpointModal
          handleDelete={handleDelete}
          closeModal={handleCloseModal}
          show={openDeleteModal}
        />
      )}
      <div className="checkpoint">
        {/* -------line-side------------- */}
        <div className="marginL hide" style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <div id="line" className="blue-line-left hide">
            <div className="blue-line-bottom" />
            <div />
          </div>
        </div>
        {/* --------------card------------------------ */}
        <div className="card white" style={{ margin: '3px 0px' }}>
          <div className="checkpoint-header" style={{ border: !formInput.expandedCal ? 'none' : '' }}>
            <div id={`progressOf${checkP.localId}`} className="checkpoint-progress" />
            <div id="col1" className="header-col-1">
              <OverlayTrigger
                placement="top"
                overlay={formInput.expanded ? collapseToolTip : expandTooltip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  className="clearButtonDark"
                  onClick={handleCollapse}
                  style={{ height: '44px', width: '44px' }}
                >
                  {downIcon}
                </button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={formInput.expandedCal ? collapseToolTaskTip : expandTaskTooltip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  onClick={handleCollapseCal}
                  className="clearButtonDark hide"
                  style={{ height: '44px', width: '44px' }}
                >
                  {calendarIcon}
                </button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={addTaskToolTip} delay={{ show: 750, hide: 0 }}>
                <button
                  type="button"
                  className="clearButtonDark"
                  style={{ height: '44px', width: '44px' }}
                  id={`addTask${checkP.localId}`}
                  onClick={addTask}
                >
                  {plusIcon}
                </button>
              </OverlayTrigger>
            </div>
            <div id="col2" className="fullCenter">
              <input
                className="form-control small-name"
                style={{
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                }}
                placeholder={`Phase ${index + 1}`}
                value={formInput.name}
                name="name"
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div
              id="col3"
              className="fullCenter hide"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: '8%',
              }}
            >
              <div className="hide" style={{ fontSize: '13px', color: 'grey' }}>
                {tasks.length > 0 && formInput.expanded ? '' : `(${tasks.length} tasks)`}
              </div>
            </div>
            <div id="col4" className="fullCenter">
              <OverlayTrigger placement="top" overlay={deleteSegment} delay={{ show: 750, hide: 0 }}>
                <button
                  type="button"
                  className="clearButtonDark hide"
                  onClick={formInput.fresh ? handleDelete : handleOpenModal}
                  style={{
                    paddingBottom: '4px',
                    height: '44px',
                    width: '44px',
                  }}
                >
                  {trashIcon}
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
      {/* --------------card-body------------------------ */}
      <Collapse in={formInput.expandedCal} style={{ transition: hasMounted ? '' : 'none' }}>
        <div className="checkpoint">
          <div className="marginL hide" style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
            <div id="line" className="blue-line-left hide">
              <div className="blue-line-bottom" />
              <div />
            </div>
          </div>
          <div className="card" id="whole-card">
            <div
              id="card-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1% 0%',
              }}
            >
              <div id="row3" className="cardRow">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div />
                  <div className="verticalCenter" style={{ whiteSpace: 'nowrap' }}>
                    <label htmlFor={`budget${checkP.localId}`}>Start Date:</label>
                  </div>
                  <div />
                </div>
                <div className="fullCenter" style={{ paddingRight: '20%' }}>
                  <input
                    id={`budget${checkP.localId}`}
                    className="form-control"
                    type="date"
                    value={formInput.startDate}
                    placeholder="$$$"
                    onChange={handleChange}
                    name="startDate"
                    style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div id="row2" className="cardRow">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div />
                  <div className="verticalCenter">
                    <label htmlFor={`deadline${checkP.localId}`}>Deadline:</label>
                  </div>
                  <div />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '20%',
                  }}
                >
                  <input
                    className="form-control"
                    type="date"
                    value={formInput.deadline}
                    onChange={handleChange}
                    name="deadline"
                    id={`deadline${checkP.localId}`}
                    style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
            <div
              id="description-field"
              className="fullCenter"
              style={{
                borderTop: '1px solid rgb(180, 180, 180)',
                padding: '1% 10%',
                paddingTop: '1%',
                paddingBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div id="text-label" className="fullCenter">
                <label
                  htmlFor={`description${checkP.localId}`}
                  className="form-label"
                  style={{ textAlign: 'center' }}
                >
                  Description:
                </label>
              </div>
              <textarea
                className="form-control"
                placeholder="A description of your segment..."
                id={`description${checkP.localId}`}
                rows="3"
                value={formInput.description}
                onChange={handleChange}
                name="description"
                style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }}
                onPointerDownCapture={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </Collapse>

      {/* ----------tasks------------------ */}
      <Collapse in={formInput.expanded} style={{ transition: hasMounted ? '' : 'none' }}>
        <div>
          <motion.div>
            <Reorder.Group axis="y" key={tasks} values={tasks} onReorder={handleReorder} as="div">
              {tasks.map((task, indexT) => (
                <Reorder.Item
                  key={task.localId}
                  value={task}
                  as={motion.div}
                  style={{ cursor: 'grab' }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  layoutId={task.localId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reorderPaused ? 0 : 0.4 }}
                >
                  <Task
                    key={task.localId}
                    checkPHasLoaded={hasLoaded}
                    task={task}
                    indexT={indexT}
                    refreshCheckP={refreshCheckP}
                    updateArrayAfterDelete={updateArrayAfterDelete}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        </div>
      </Collapse>
    </>
  );
});

export default Checkpoint;

Checkpoint.propTypes = {
  checkP: PropTypes.shape({
    localId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
  }).isRequired,
  handleRefresh: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  progressIsShowing: PropTypes.bool.isRequired,
};
