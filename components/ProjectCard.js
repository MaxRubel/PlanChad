import { useEffect, useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useSaveStore from '../utils/stores/saveStore';
import useAnimationStore from '../utils/stores/animationsStore';

const initialState = {
  name: '',
  deadline: '',
  budget: '',
  client: '',
  description: '',
  start_date: '',
  progressIsShowing: false,
  expanded: false,
};

export default function ProjectCard() {
  const [formInput, setFormInput] = useState(initialState);
  const [hasMounted, setHasMounted] = useState(false);
  const project = useSaveStore((state) => state.project);
  const updateProject = useSaveStore((state) => state.updateProject);
  const minAll = useAnimationStore((state) => state.minAll);

  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512"
      fill={formInput.expanded ? '' : 'white'}
    >
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6 9.4-33.9
      0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5 256 34.5
      101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4
      33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z"
      />
    </svg>
  );

  useEffect(() => {
    let timeout;
    if (project?.projectId) {
      setFormInput(project);
      timeout = setTimeout(() => { setHasMounted((preVal) => true); }, 1000);
    }
  }, [project]);

  useEffect(() => {
    updateProject(formInput);
  }, [formInput]);

  const handleCollapse = () => {
    setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };

  useEffect(() => {
    if (formInput.expanded) {
      handleCollapse();
    }
  }, [minAll]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  return (
    // -----------------card--header----------------
    <div
      className="card text-bg-info mb-3"
      style={{
        border: formInput.expanded ? '' : 'none',
        opacity: '.9',
        width: '100%',
      }}
    >
      <div
        className="card-header"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          borderBottom: 'none',
          backgroundColor: formInput.expanded ? '' : '#1f2226',
          border: formInput.expanded ? '' : 'none',
          transition: 'all ease 1s',
        }}
      >
        <Button
          className="projectCollapse"
          onClick={handleCollapse}
        >
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
              fontWeight: '600',
              color: formInput.expanded ? '' : 'white',
              transition: 'all ease 1s',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>

      {/* --------------card-body------------------------ */}
      <Collapse in={formInput.expanded} style={{ transition: hasMounted ? '' : 'none' }}>
        <div id="whole-card">
          <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '2% 0%' }}>
            <div
              id="row1"
              className="cardRow"
            >
              <div className="project-card-left-label">
                <div />
                <div className="verticalCenter">
                  <label htmlFor="client">Client:</label>
                </div>
                <div />
              </div>
              <div className="project-input-container">
                <input
                  id="client"
                  className="form-control"
                  placeholder="Name"
                  name="client"
                  value={formInput.client}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'rgb(13, 195, 240)',
                    border: 'none',
                  }}
                />
                <div />
              </div>
            </div>
            <div
              id="row2"
              className="cardRow"
            >
              <div className="project-card-left-label"><div />
                <div className="verticalCenter">
                  <label htmlFor="deadline">Start Date:</label>
                </div>
              </div>
              <div className="project-input-container">
                <input
                  className="form-control"
                  type="date"
                  value={formInput.start_date}
                  onChange={handleChange}
                  name="start_date"
                  id="start_date"
                  style={{
                    backgroundColor: 'rgb(13, 195, 240)',
                    border: 'none',
                  }}
                />
              </div>
            </div>
            <div
              id="row2"
              className="cardRow"
            >
              <div className="project-card-left-label "><div />
                <div className="verticalCenter">
                  <label htmlFor="deadline">Deadline:</label>
                </div>
                <div />
              </div>
              <div className="project-input-container">
                <input
                  className="form-control"
                  type="date"
                  value={formInput.deadline}
                  onChange={handleChange}
                  name="deadline"
                  id="deadline"
                  style={{
                    backgroundColor: 'rgb(13, 195, 240)',
                    border: 'none',
                  }}
                />
              </div>
            </div>
            <div
              id="row3"
              className="cardRow"
            >
              <div className="project-card-left-label "><div />
                <div className="verticalCenter">
                  <label htmlFor="budget">Budget:</label>
                </div>
                <div />
              </div>
              <div className="project-input-container">
                <input
                  id="budget"
                  className="form-control"
                  type="number"
                  value={formInput.budget}
                  placeholder="$$$"
                  onChange={handleChange}
                  name="budget"
                  style={{
                    backgroundColor: 'rgb(13, 195, 240)',
                    border: 'none',
                    margin: '6px 0px',
                  }}
                />
              </div>
            </div>

          </div>
          <div
            id="description-field"
            className="fullCenter"
            style={{
              borderTop: '1px solid rgb(11, 162, 192)', padding: '2% 10%', display: 'flex', flexDirection: 'column',
            }}
          >
            <div id="text-label" className="fullCenter" style={{ marginBottom: '1%' }}>
              <label htmlFor="exampleFormControlTextarea1" className="form-label" style={{ textAlign: 'center' }}>
                Description:
              </label>
            </div>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              value={formInput.description}
              onChange={handleChange}
              name="description"
              style={{
                backgroundColor: 'rgb(13, 195, 240)',
                border: 'none',
                // minWidth: '250px',
              }}
            />
          </div>
        </div>
      </Collapse>
    </div>

  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    projectId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([undefined]),
    ]),
    progressIsShowing: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([undefined]),
    ]),
  }),
};

ProjectCard.defaultProps = {
  project: undefined,
};
