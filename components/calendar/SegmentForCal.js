/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { deleteTaskCollab } from '../../api/taskCollab';
import { useSaveContext } from '../../utils/context/saveManager';
import { useCollabContext } from '../../utils/context/collabContext';
import DeleteCheckpointModal from '../modals/DeleteCheckpoint';
import { trashIcon } from '../../public/icons';
import { deleteSegment } from '../util/toolTips';

export default function SegmentForCal({ checkP, closeModal }) {
  const [formInput, setFormInput] = useState({
    description: '',
    name: '',
    startDate: '',
    deadline: '',
    index: '',
    fresh: true,
  });

  const {
    addToSaveManager,
    saveInput,
    deleteFromSaveManager,
  } = useSaveContext();
  const { deleteFromCollabManager, taskCollabJoins } = useCollabContext();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => { // grab and sort the tasks from save manager
    setFormInput(checkP);
  }, [checkP]);

  useEffect(() => { // send to save manager
    addToSaveManager(formInput, 'update', 'checkpoint');
  }, [formInput]);

  const handleChange = (e) => {
    if (formInput.fresh) {
      setFormInput((preVal) => !preVal);
    }
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };

  const handleOpenModal = () => {
    setOpenDeleteModal((prevVal) => true);
  };

  const handleDelete = () => {
    const tasksCopy = [...saveInput.tasks];
    const taskCollabsCopy = [...taskCollabJoins];
    const checkPtasks = tasksCopy.filter((item) => item.checkpointId === checkP.localId);
    const collabDeleteArray = [];
    for (let i = 0; i < checkPtasks.length; i++) {
      const filtered = taskCollabsCopy.filter((item) => item.taskId === checkPtasks[i].localId);
      for (let x = 0; x < filtered.length; x++) {
        collabDeleteArray.push(filtered[x]);
      }
    }
    Promise.all(collabDeleteArray.map((item) => deleteTaskCollab(item.taskCollabId)))
      .then(() => {
        for (let i = 0; i < collabDeleteArray.length; i++) {
          deleteFromCollabManager(collabDeleteArray[i].taskCollabId, 'taskCollabJoin');
        }
        deleteFromSaveManager(formInput, 'delete', 'checkpoint');
        setOpenDeleteModal((preVal) => false);
        closeModal();
      });
  };

  return (
    <>
      <DeleteCheckpointModal handleDelete={handleDelete} closeModal={handleCloseModal} show={openDeleteModal} />
      <div className="fullCenter">

        {/* --------------card------------------------ */}
        <div
          className="card"
          style={{
            margin: '3px 0px',
            minWidth: '565px',
          }}
        >
          <div
            className="card-header 2"
            style={{
              minWidth: '516px',
              height: '53px',
            }}
          >
            <div className="verticalCenter" />
            <div className="verticalCenter" style={{ justifyContent: 'center' }}>
              <input
                className="form-control"
                style={{
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '75%',
                }}
                placeholder={`Phase ${formInput.index + 1}`}
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
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={deleteSegment}
                delay={{ show: 750, hide: 0 }}
              >
                <button
                  type="button"
                  onClick={formInput.fresh ? handleDelete : handleOpenModal}
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

          <div id="whole-card">
            <div
              id="card-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1% 0%',
              }}
            >
              <div
                id="row3"
                className="cardRow"
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                  <div className="verticalCenter" style={{ whiteSpace: 'nowrap' }}>
                    <label htmlFor={`budget${checkP.localId}`}>Start Date:</label>
                  </div>
                  <div />
                </div>
                <div
                  className="fullCenter"
                  style={{ paddingRight: '20%' }}
                >
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
              <div
                id="row2"
                className="cardRow"
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                  <div className="verticalCenter">
                    <label htmlFor={`deadline${checkP.localId}`}>Deadline:</label>
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
                style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none', minWidth: '250px' }}
                onPointerDownCapture={(e) => e.stopPropagation()}
              />
            </div>
          </div>

        </div>
      </div>
    </>

  );
}
