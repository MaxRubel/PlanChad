/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { trashIcon } from '../../public/icons';
import { useSaveContext } from '../../utils/context/saveManager';
import { deleteTaskToolTip } from '../util/toolTips';
import { useCollabContext } from '../../utils/context/collabContext';
import { deleteTaskCollab } from '../../api/taskCollab';
import DeleteTaskModal from '../modals/DeleteTask';
import TaskDeetsForCalendar from './TaskDeetsForCal';
import ViewTaskCollabsForCal from './ViewTaskCollabsForCal';

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

export default function TaskForCal({ task, min, closeModal }) {
  const [formInput, setFormInput] = useState(initialState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { addToSaveManager, deleteFromSaveManager, saveInput } = useSaveContext();
  const { taskCollabJoins, deleteFromCollabManager } = useCollabContext();

  useEffect(() => {
    setFormInput((preVal) => task);
  }, [task]);

  useEffect(() => {
    addToSaveManager(formInput, 'update', 'task');
  }, [formInput]);

  const handleFresh = () => {
    setFormInput((preVal) => ({ ...preVal, fresh: false }));
  };

  useEffect(() => { // minimze task
    if (formInput.expanded || formInput.deetsExpanded) {
      setFormInput((prevVal) => ({
        ...prevVal, expanded: false, deetsExpanded: false,
      }));
    }
  }, [min]);

  const handleChange = (e) => {
    handleFresh();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
  };

  const handleDelete = () => {
    setOpenDeleteModal((prevVal) => false);
    const joinsCopy = [...taskCollabJoins];
    const filteredCopy = joinsCopy.filter((item) => item.taskId === task.localId);
    const promiseArray = filteredCopy.map((item) => deleteTaskCollab(item.taskCollabId));
    Promise.all(promiseArray).then(() => {
      for (let i = 0; i < filteredCopy.length; i++) {
        deleteFromCollabManager(filteredCopy[i].taskCollabId, 'taskCollabJoin');
      }
      deleteFromSaveManager(formInput, 'delete', 'task');
      closeModal();
    });
  };

  const handleOpenModal = () => {
    setOpenDeleteModal((preVal) => true);
  };

  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };

  if (saveInput.project.hideCompletedTasks && formInput.status === 'closed') {
    return (<div style={{ display: 'none' }} />);
  }
  return (
    <>
      <DeleteTaskModal show={openDeleteModal} handleDelete={handleDelete} closeModal={handleCloseModal} />
      <div>

        {/* -----------card---------------------- */}
        <div
          className="card"
          style={{
            margin: '3px 0px',
            backgroundColor: formInput.status === 'closed' ? 'grey' : '',
            minWidth: '300px',
          }}
        >
          <div
            className="card-header 2"
            style={{
              alignContent: 'center',
              height: '53px',
              border: !formInput.expanded ? 'none' : '',
            }}
          >
            <div className="verticalCenter" />
            <div className="fullCenter" style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                className="form-control"
                style={{
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  // width: '75%',
                }}
                placeholder={`Task ${task.index + 1}`}
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
                overlay={deleteTaskToolTip}
                trigger={['hover', 'focus']}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
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

          <div id="whole-card">
            <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '1% 0%' }}>
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
                padding: '22px 10%',
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
                  border: 'none',
                  minWidth: '250px',
                }}
                onPointerDownCapture={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
        {/* -----add-a-task------ */}
      </div>
      <TaskDeetsForCalendar
        formInput={formInput}
        handleChange={handleChange}
        taskId={task.localId}
      />
      <ViewTaskCollabsForCal formInput={formInput} taskId={task.localId} />
    </>
  );
}
