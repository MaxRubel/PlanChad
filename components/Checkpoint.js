/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
// import Checkbox from '@mui/material/Checkbox';
// import { FormControlLabel, FormGroup } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { Collapse, Button as ButtonBoot } from 'react-bootstrap';
import { Button } from '@mui/material';
import Fade from '@mui/material/Fade';
import { trashIcon } from '../public/icons';
import { deleteCheckpoint, updateCheckpoint } from '../api/checkpoint';
import { createNewTask, getTasksOfCheckP, updateTask } from '../api/task';
import Task from './Task';

export default function Checkpoint({
  checkP,
  handleRefresh,
  save,
  saveSuccess,
  saveAll,
}) {
  const [formInput, setFormInput] = useState({});
  const [hasChanged, setHasChanged] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [twirl, setTwirl] = useState(false);
  const elementRef = useRef(null);

  const downIcon = (
    <svg className={formInput.expanded ? 'icon-up' : 'icon-down'} xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 320 512">
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5 256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z" />
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

  useEffect(() => {
    setFormInput(checkP);
  }, [checkP]);

  useEffect(() => {
    getTasksOfCheckP(checkP.checkpointId)
      .then((data) => {
        setTasks(data);
      });
  }, [refresh]);

  useEffect(() => {
    if (hasChanged) {
      updateCheckpoint(formInput).then(() => {
        saveSuccess();
        setHasChanged((prevVal) => false);
      });
    }
  }, [save]);

  const dance = () => {
    document.getElementById(`addTask${checkP.checkpointId}`).animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }],
      { duration: 500, iterations: 1 },
    );
  };

  const handleFreshness = () => {
    if (formInput.fresh) {
      setFormInput((prevVal) => ({ ...prevVal, fresh: false }));
    }
    if (!hasChanged) {
      setHasChanged((prevVal) => !prevVal);
    }
  };

  const handleChange = (e) => {
    handleFreshness();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const handleCollapse = () => {
    handleFreshness();
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };

  const handleDelete = () => {
    saveAll();
    if (formInput.fresh) {
      deleteCheckpoint(checkP.checkpointId)
        .then(() => {
          console.log('delete all tasks');
        })
        .then(() => {
          handleRefresh();
        });
    }
    if (!formInput.fresh) {
      if (window.confirm('Are you sure you would like to delete this task?')) {
        console.log(checkP.checkpointId);
        deleteCheckpoint(checkP.checkpointId)
          .then((data) => {
            console.log(data);
            handleRefresh();
          });
      }
    }
  };

  const addTask = () => {
    dance();
    handleFreshness();
    const payload = {
      checkpointId: checkP.checkpointId,
      startDate: '',
      deadline: '',
      description: '',
      preps: '',
      exec: '',
      debrief: '',
      list_index: '',
      weight: '',
      status: 'open',
    };
    createNewTask(payload)
      .then(({ name }) => {
        updateTask({ taskId: name })
          .then(() => {
            setRefresh((prevVal) => prevVal + 1);
          });
      });
  };

  return (
    <>
      <div className="checkpoint">
        {/* -------line-side------------- */}
        <div className="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div id="empty" />
          <div id="line" style={{ borderLeft: '2px solid rgb(84, 84, 84)', display: 'grid', gridTemplateRows: '1fr 1fr' }}>
            <div id="empty" style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
            <div />
          </div>
        </div>
        <div style={{ margin: '1% 0%' }}>
          <div>
            <div className="card">
              <div className="card-header 2">
                <div className="verticalCenter">
                  <ButtonBoot
                    onClick={handleCollapse}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      paddingLeft: '10%',
                      textAlign: 'left',
                      color: 'black',
                      width: '35px',
                    }}>
                    {downIcon}
                  </ButtonBoot>
                  <ButtonBoot
                    id={`addTask${checkP.checkpointId}`}
                    onClick={addTask}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      marginLeft: '10%',
                      textAlign: 'left',
                      color: 'black',
                    }}>
                    {plusIcon}
                  </ButtonBoot>
                </div>
                <div className="verticalCenter">
                  <input
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                    }}
                    placeholder="Enter a checkpoint name..."
                    value={formInput.name}
                    name="name"
                    onChange={handleChange} />
                </div>
                <div
                  className="verticalCenter"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingRight: '8%',
                  }}>
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{
                      paddingBottom: '4px', color: 'black', backgroundColor: 'transparent', border: 'none',
                    }}
                  >{trashIcon}
                  </button>
                </div>
              </div>
              {/* --------------card-body------------------------ */}
              <Collapse in={formInput.expanded}>
                <div id="whole-card">
                  <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '2% 0%' }}>
                    <div
                      id="row2"
                      className="cardRow">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                        <div className="verticalCenter">
                          <label htmlFor="deadline">Deadline:</label>
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
                          id="deadline"
                          style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }} />
                      </div>
                    </div>
                    <div
                      id="row3"
                      className="cardRow">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                        <div className="verticalCenter" style={{ whiteSpace: 'nowrap' }}>
                          <label htmlFor="budget">Start Date:</label>
                        </div>
                        <div />
                      </div>
                      <div
                        className="fullCenter"
                        style={{ paddingRight: '20%' }}>
                        <input
                          id="budget"
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
                      borderTop: '1px solid rgb(180, 180, 180)', padding: '2% 10%', display: 'flex', flexDirection: 'column',
                    }}>
                    <div id="text-label" className="fullCenter" style={{ marginBottom: '1%' }}>
                      <label htmlFor="description" className="form-label" style={{ textAlign: 'center' }}>
                        Description:
                      </label>
                    </div>
                    <textarea
                      className="form-control"
                      placeholder="A description of your checkpoint..."
                      id="description"
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
            <div className="marginR" />
          </div>
        </div>
        <div className="marginR" />
      </div>
      {/* ----add-a-task---- */}
      <div className="checkpoint">
        <div className="marginL" />
        <div id="middle">
          {/* <Fade in={formInput.expanded}>
            <Button
              variant="outlined"
              className="hello"
              hidden={!formInput.expanded}
              onClick={addTask}
              style={{
                margin: '1% 0%',
                color: 'rgb(200, 200, 200)',
                border: '1px solid rgb(100, 100, 100)',
                display: 'hidden',
              }}>
              Add A Task
            </Button>
          </Fade> */}
        </div>
        <div className="marginR" />
      </div>
      {tasks.map((task) => (
        <Task key={task.taskId} />
      ))}
    </>
  );
}
