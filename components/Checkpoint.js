/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
// import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from 'react';
import { Collapse, Button as ButtonBoot, OverlayTrigger } from 'react-bootstrap';
import uniqid from 'uniqid';
import { Reorder } from 'framer-motion';
import { trashIcon } from '../public/icons';
import Task from './Task';
import { useSaveContext } from '../utils/context/saveManager';
import {
  expandTooltip, collapseToolTip, addTaskToolTip, deleteSegment,
} from './toolTips';

export default function Checkpoint({
  checkP,
  handleRefresh,
  save,
  saveSuccess,
  saveIndexes,
  minAll,
  min,
  index,
  isLoading,
  progressIsShowing,
  refreshTasks,
  isDragging,
  checkPBeingDragged,
}) {
  const [formInput, setFormInput] = useState({
    description: '',
    name: '',
    startDate: '',
    deadline: '',
    index: '',
  });

  const {
    addToSaveManager, deleteFromSaveManager, saveInput, sendThisArray,
  } = useSaveContext();

  const [tasks, setTasks] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState(0);
  const [checkPrefresh, setCheckPrefresh] = useState(0);

  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512">
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6
      9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5
      256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4
      24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z" />
    </svg>
  );
  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29px"
      height="29px"
      style={{ pointerEvents: 'none' }}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
    </svg>
  );

  useEffect(() => { // grab and sort the tasks from save manager
    if (!isDragging) {
      setFormInput(checkP);
      const copy = [...saveInput.tasks];
      const theseTasks = copy.filter((task) => task.checkpointId === checkP.localId);
      const sorted = theseTasks.sort((a, b) => a.index - b.index);
      setTasks(sorted);
    }
  }, [checkP]);

  useEffect(() => {
    if (refreshTasks > 0 && !isDragging) {
      if (checkP.localId === checkPBeingDragged) {
        setTasks((preVal) => sendThisArray);
      }
    }
  }, [sendThisArray]);

  useEffect(() => { // send to save manager
    addToSaveManager(formInput, 'update', 'checkpoint');
  }, [formInput]);

  useEffect(() => { // saveIndex after dragNdrop
    setFormInput((prevVal) => ({ ...prevVal, index }));
  }, [index]);

  useEffect(() => { // refresh tasks from save manager
    const copy = [...saveInput.tasks];
    const theseTasks = copy.filter((task) => task.checkpointId === checkP.localId);
    setTasks((preVal) => theseTasks);
  }, [checkPrefresh]);

  useEffect(() => { // minimize
    setFormInput((prevVal) => ({ ...prevVal, expanded: false }));
  }, [min]);

  useEffect(() => { // show progress bar animation
    let timeout;
    if (progressIsShowing) {
      const tasksCopy = [...saveInput.tasks];
      const theseTasks = tasksCopy.filter((task) => task.checkpointId === checkP.localId);
      const totalTasks = theseTasks.length;
      let closedTasks = 0;
      let closedPercentage = 0;
      for (let i = 0; i < totalTasks; i++) {
        if (theseTasks[i].status === 'closed') {
          closedTasks += 1;
        }
      }
      if (totalTasks !== 0) {
        closedPercentage = Math.round((closedTasks / totalTasks) * 100);
      }
      let i = 0;
      const interval = setInterval(() => {
        document.getElementById(`progressOf${checkP.localId}`).style.width = `${i}%`;
        i += 1;
        if (i > closedPercentage) {
          clearInterval(interval);
        }
      }, 20);
    } else {
      document.getElementById(`progressOf${checkP.localId}`).style.width = '0%';
    }
    return () => {
      clearInterval(timeout);
    };
  }, [progressIsShowing]);

  useEffect(() => { // show progress bar on change of task
    if (progressIsShowing) {
      const tasksCopy = [...saveInput.tasks];
      const theseTasks = tasksCopy.filter((task) => task.checkpointId === checkP.localId);
      const totalTasks = theseTasks.length;
      let closedTasks = 0;
      let closedPercentage = 0;
      for (let i = 0; i < totalTasks; i++) {
        if (theseTasks[i].status === 'closed') {
          closedTasks += 1;
        }
      }
      if (totalTasks !== 0) {
        closedPercentage = Math.round((closedTasks / totalTasks) * 100);
      }
      document.getElementById(`progressOf${checkP.localId}`).style.width = `${closedPercentage}%`;
    } else {
      document.getElementById(`progressOf${checkP.localId}`).style.width = '0%';
    }
  }, [saveInput.tasks]);

  const dance = () => {
    document.getElementById(`addTask${checkP.localId}`).animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }],
      { duration: 500, iterations: 1 },
    );
  };

  const taskHasBeenCompleted = () => {
    setTaskCompleted((preVal) => preVal + 1);
  };

  const refreshCheckP = () => {
    setCheckPrefresh((prevVal) => prevVal + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const handleCollapse = () => {
    if (formInput.expanded) {
      setFormInput((prevVal) => ({ ...prevVal, expanded: false }));
    } else {
      setFormInput((prevVal) => ({ ...prevVal, expanded: true }));
    }
  };

  const handleDragStart = () => {
    refreshCheckP();
  };

  const handleReorder = (e) => {
    const reordered = e.map((item, index) => ({ ...item, index }));
    setTasks((preVal) => reordered);
    addToSaveManager(reordered, 'update', 'reorderedTasks');
  };

  const handleDelete = () => {
    deleteFromSaveManager(formInput, 'delete', 'checkpoint');
    handleRefresh();
  };

  const addTask = () => {
    dance();
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
    };
    addToSaveManager(emptyTask, 'create', 'task');
    setCheckPrefresh((prevVal) => prevVal + 1);
  };

  return (
    <>
      <div className="checkpoint">
        {/* -------line-side------------- */}
        <div className="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div id="empty" />
          <div
            id="line"
            style={{
              borderLeft: '2px solid rgb(16, 197, 234, .6)',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
            }}>
            <div id="empty" style={{ borderBottom: '2px solid rgb(16, 197, 234, .6)' }} />
            <div />
          </div>
        </div>
        {/* --------------card------------------------ */}
        <div className="card" style={{ margin: '3px 0px', minWidth: '565px' }}>
          <div className="card-header 2" style={{ minWidth: '516px', border: !formInput.expanded ? 'none' : '' }}>
            <div id={`progressOf${checkP.localId}`} className="checkpoint-progress" />
            <div className="verticalCenter">
              <div className="verticalCenter">
                <OverlayTrigger
                  placement="top"
                  overlay={formInput.expanded ? collapseToolTip : expandTooltip}
                  trigger={['hover', 'focus']}
                  delay={500}
                  // // defaultShow={1000}
                  >
                  <button
                    type="button"
                    onClick={handleCollapse}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      textAlign: 'center',
                      color: 'black',
                      width: '35px',
                      height: '35px',
                    }}>
                    {downIcon}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={addTaskToolTip} delay={500}>
                  <button
                    type="button"
                    id={`addTask${checkP.localId}`}
                    onClick={addTask}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      marginLeft: '10%',
                      textAlign: 'center',
                      color: 'black',
                      width: '35px',
                      height: '35px',
                    }}>
                    {plusIcon}
                  </button>
                </OverlayTrigger>
              </div>
            </div>
            <div className="verticalCenter" style={{ justifyContent: 'center' }}>
              <input
                className="form-control"
                style={{
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '75%',
                }}
                placeholder={`Segment ${index}`}
                value={formInput.name}
                name="name"
                onChange={handleChange}
                autoComplete="off"
                  />
            </div>
            <div
              className="verticalCenter"
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingRight: '8%',
              }}>
              <OverlayTrigger placement="top" overlay={deleteSegment}>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    paddingBottom: '4px',
                    color: 'black',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '35px',
                    height: '35px',
                  }}
                  >{trashIcon}
                </button>
              </OverlayTrigger>
            </div>
          </div>
          {/* --------------card-body------------------------ */}
          <Collapse in={formInput.expanded}>
            <div id="whole-card">
              <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '0% 0% !important' }}>
                <div
                  id="row2"
                  className="cardRow">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                    <div className="verticalCenter">
                      <label htmlFor={`deadline${checkP.localId}`}>Deadline:</label>
                    </div>
                    <div />
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20%',
                  }}>
                    <input
                      className="form-control"
                      type="date"
                      value={formInput.deadline}
                      onChange={handleChange}
                      name="deadline"
                      id={`deadline${checkP.localId}`}
                      style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }} />
                  </div>
                </div>
                <div
                  id="row3"
                  className="cardRow">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                    <div className="verticalCenter" style={{ whiteSpace: 'nowrap' }}>
                      <label htmlFor={`budget${checkP.localId}`}>Start Date:</label>
                    </div>
                    <div />
                  </div>
                  <div
                    className="fullCenter"
                    style={{ paddingRight: '20%' }}>
                    <input
                      id={`budget${checkP.localId}`}
                      className="form-control"
                      type="date"
                      value={formInput.startDate}
                      placeholder="$$$"
                      onChange={handleChange}
                      name="startDate"
                      style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }} />
                  </div>
                </div>
              </div>
              <div
                id="description-field"
                className="fullCenter"
                style={{
                  borderTop: '1px solid rgb(180, 180, 180)',
                  padding: '1.4% 10%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <div id="text-label" className="fullCenter" style={{ marginBottom: '1%' }}>
                  <label htmlFor={`description${checkP.localId}`} className="form-label" style={{ textAlign: 'center' }}>
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
                  style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none', minWidth: '250px' }} />
              </div>
            </div>
          </Collapse>
        </div>
        {/* -----add-a-task------ */}
        {/* <div className="marginR" /> */}
      </div>

      <div>
        <Reorder.Group axis="y" values={tasks} onReorder={handleReorder} as="div">
          {tasks.map((task, indexT) => (
            <Reorder.Item
              key={task.localId}
              value={task}
              as="div"
              style={{ cursor: 'grab' }}
              onDragStart={handleDragStart}>
              <Task
                key={task.localId}
                task={task}
                minAll={minAll}
                save={save}
                saveIndexes={saveIndexes}
                min={min}
                saveSuccess={saveSuccess}
                handleRefresh={handleRefresh}
                indexT={indexT}
                isLoading={isLoading}
                refreshCheckP={refreshCheckP}
                taskHasBeenCompleted={taskHasBeenCompleted}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

    </>

  );
}
