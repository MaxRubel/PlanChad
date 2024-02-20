/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
import { useState, useEffect } from 'react';
import { Collapse, Button as ButtonBoot } from 'react-bootstrap';
import { trashIcon } from '../public/icons';
import TaskDeets from './TaskDeets';
import { useSaveContext } from '../utils/context/saveManager';

const initialState = {
  localId: true,
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
};

export default function Task({
  task,
  min,
  refreshCheckP,
  handleRefresh,
  indexT,
  isLoading,
}) {
  const [formInput, setFormInput] = useState(initialState);
  const [hasChanged, setHasChanged] = useState(false);
  const { addToSaveManager, deleteFromSaveManager, saveInput } = useSaveContext();

  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512">
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5
      0-33.9L188.5 256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9
      0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z" />
    </svg>
  );

  const magGlass = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-search"
      viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85
      3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
    </svg>
  );

  useEffect(() => {
    setFormInput(task);
  }, [task]);

  useEffect(() => {
    if (!isLoading) {
      addToSaveManager(formInput, 'update', 'task');
    }
  }, [formInput]);

  const handleFreshness = () => {
    if (formInput.fresh) {
      setFormInput((prevVal) => ({ ...prevVal, fresh: false }));
    }
    if (!hasChanged) {
      setHasChanged((prevVal) => !prevVal);
    }
  };

  useEffect(() => { // minimze task
    if (formInput.expanded || formInput.deetsExpanded) {
      setFormInput((prevVal) => ({
        ...prevVal, expanded: false, deetsExpanded: false,
      }));
      setHasChanged((prevVal) => true);
    }
  }, [min]);

  const handleCollapse = () => { // collapse main details
    handleFreshness();
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };

  const handleCollapse2 = () => { // collapse extra details
    handleFreshness();
    setFormInput((prevVal) => ({ ...prevVal, deetsExpanded: !prevVal.deetsExpanded }));
  };

  const handleChange = (e) => {
    handleFreshness();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({
      ...prevVal, [name]: value,
    }));
  };

  const handleDelete = () => {
    deleteFromSaveManager(formInput, 'delete', 'task');
    refreshCheckP();
  };

  return (
    <>
      <div className="task">
        {/* -------line-side------------- */}
        <div className="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div id="empty" />
          <div
            id="line"
            style={{
              borderLeft: '2px solid rgb(251, 157, 80, .5)',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
            }}>
            <div id="empty" style={{ borderBottom: '2px solid rgb(251, 157, 80, .5)' }} />
            <div />
          </div>
        </div>
        <div id="line" style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div id="top-div" style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
          <div id="bottom-div" />
        </div>
        {/* -----------card---------------------- */}
        <div className="card" style={{ margin: '3px 0px' }}>
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
                  width: '50px',
                }}>
                {downIcon}
              </ButtonBoot>
              <ButtonBoot
                onClick={handleCollapse2}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0px',
                  paddingLeft: '10%',
                  textAlign: 'left',
                  color: 'black',
                  width: '50px',
                }}>
                {magGlass}
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
                placeholder={`Task ${indexT + 1}`}
                value={formInput.name}
                name="name"
                onChange={handleChange}
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
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  paddingBottom: '4px', color: 'black', backgroundColor: 'transparent', border: 'none',
                }}>
                {trashIcon}
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
                      <label htmlFor="startDate">Start Date:</label>
                    </div>
                    <div />
                  </div>
                  <div
                    className="fullCenter"
                    style={{ paddingRight: '20%' }}>
                    <input
                      id="startDate"
                      className="form-control"
                      type="date"
                      value={formInput.startDate}
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
                  padding: '2% 10%',
                  display: 'flex',
                  flexDirection: 'column',
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
                  style={{
                    backgroundColor: 'rgb(225, 225, 225)',
                    border: 'none',
                    minWidth: '250px',
                  }} />
              </div>
            </div>
          </Collapse>
        </div>
        {/* -----add-a-task------ */}
        <div className="marginR" />
      </div>
      <TaskDeets
        formInput={formInput}
        handleChange={handleChange} />

    </>
  );
}
