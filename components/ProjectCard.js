/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable semi */
/* eslint-disable arrow-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
import { useEffect, useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import { useSaveContext } from '../utils/context/saveManager';

const initialState = {
  name: '',
  deadline: '',
  budget: '',
  client: '',
  description: '',
  start_date: '',
  progressIsShowing: false,
  expanded: false,
  type: 'project',
};

export default function ProjectCard({
  project, min, progressIsShowing, tellProjectIfProgressShowing,
}) {
  const [formInput, setFormInput] = useState(initialState);
  const { addToSaveManager } = useSaveContext();
  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512">
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6 9.4-33.9
      0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5 256 34.5
      101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4
      33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z" />
    </svg>
  );

  useEffect(() => {
    if (project?.projectId) {
      setFormInput(project)
      tellProjectIfProgressShowing(project.progressIsShowing)
    }
  }, [project])

  useEffect(() => {
    setFormInput((preVal) => ({ ...preVal, progressIsShowing }))
  }, [progressIsShowing])

  useEffect(() => {
    addToSaveManager(formInput, 'update', 'project')
  }, [formInput])

  const handleCollapse = () => {
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };

  useEffect(() => {
    if (formInput.expanded) {
      handleCollapse();
    }
  }, [min]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  return (
    // -----------------card--header----------------
    <div className="card text-bg-info mb-3">
      <div
        className="card-header"
        style={{ minWidth: '409.6px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <Button
          onClick={handleCollapse}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0px',
            paddingLeft: '10%',
            textAlign: 'left',
            color: 'black',
          }}>
          {downIcon}
        </Button>
        <div>
          <input
            className="form-control"
            name="name"
            value={formInput.name}
            style={{
              textAlign: 'center',
              minWidth: '250px',
              fontSize: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              fontWeight: '700',
            }}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      {/* --------------card-body------------------------ */}
      <Collapse in={formInput.expanded}>
        <div id="whole-card">
          <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '2% 0%' }}>
            <div
              id="row1"
              className="cardRow">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                <div className="verticalCenter">
                  <label htmlFor="client">Client:</label>
                </div>
                <div />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20%',
              }}>
                <input
                  id="client"
                  className="form-control"
                  placeholder="Name"
                  name="client"
                  value={formInput.client}
                  onChange={handleChange}
                  style={{ backgroundColor: 'rgb(13, 195, 240)', border: 'none' }}
                />
              </div>
            </div>
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
                  style={{ backgroundColor: 'rgb(13, 195, 240)', border: 'none' }}
                />
              </div>
            </div>
            <div
              id="row3"
              className="cardRow">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                <div className="verticalCenter">
                  <label htmlFor="budget">Budget:</label>
                </div>
                <div />
              </div>
              <div
                className="fullCenter"
                style={{ paddingRight: '20%' }}>
                <input
                  id="budget"
                  className="form-control"
                  type="number"
                  value={formInput.budget}
                  placeholder="$$$"
                  onChange={handleChange}
                  name="budget"
                  style={{ backgroundColor: 'rgb(13, 195, 240)', border: 'none' }}
                />
              </div>
            </div>
          </div>
          <div
            id="description-field"
            className="fullCenter"
            style={{
              borderTop: '1px solid rgb(11, 162, 192)', padding: '2% 10%', display: 'flex', flexDirection: 'column',
            }}>
            <div id="text-label" className="fullCenter" style={{ marginBottom: '1%' }}>
              <label htmlFor="exampleFormControlTextarea1" className="form-label" style={{ textAlign: 'center' }}>
                Project Description:
              </label>
            </div>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              value={formInput.description}
              onChange={handleChange}
              name="description"
              style={{ backgroundColor: 'rgb(13, 195, 240)', border: 'none', minWidth: '250px' }} />
          </div>
        </div>
      </Collapse>
    </div>

  );
}
