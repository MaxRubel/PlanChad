/* eslint-disable react/prop-types */
import { Collapse } from 'react-bootstrap';
import { useState } from 'react';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { plusIcon } from '../public/icons';
import { createNewCollab, updateCollab } from '../api/collabs';
import { useAuth } from '../utils/context/authContext';

const initialState = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export default function AddCollabForm({ refreshAllColabs }) {
  const [expanded, setExpanded] = useState(false);
  const [formInput, setForminput] = useState(initialState);
  const [addToProject, setAddtoProj] = useState(false);
  const [role, setRole] = useState('');
  const { user } = useAuth();

  const downIcon = (
    <svg
      className={formInput.expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512"
    >
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6
      9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5
      256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4
      24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z"
      />
    </svg>
  );

  const handleClick = () => {
    setExpanded((prevVal) => true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRole((prevVal) => value);
    } else {
      setForminput((prevVal) => ({ ...prevVal, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewCollab({ ...formInput, userId: user.uid }).then(({ name }) => {
      updateCollab({ collabId: name });
      // setExpanded((prevVal) => false);
      setAddtoProj((prevVal) => false);
      setForminput((prevVal) => initialState);
      refreshAllColabs();
    });
  };

  return (
    <div id="addCollabPlacement">
      <div className="card" style={{ margin: '3px 0px', width: '400px' }}>
        <div
          className="card-header 2"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '500',
          }}
        >
          <button
            type="button"
            style={{
              display: 'flex', alignItems: 'center', backgroundColor: 'transparent', border: 'none',
            }}
            onClick={handleClick}
          >
            {plusIcon} Add a Collaborator
          </button>
        </div>
        {/* --------------card-body------------------------ */}
        <Collapse in={expanded}>
          <form onSubmit={handleSubmit}>
            <div id="whole-card">
              <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '2% 0%' }}>
                <div
                  id="row1"
                  className="cardRow"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}
                >
                  <div className="verticalCenter" style={{ marginLeft: '50%' }}>
                    <label htmlFor="name">Name:</label>
                  </div>
                  <div>
                    <div style={{ padding: '1% 10%' }}>
                      <input
                        className="form-control"
                        type="text"
                        value={formInput.name}
                        onChange={handleChange}
                        name="name"
                        id="name"
                        style={{ backgroundColor: 'rgb(225, 225, 225)', border: '1px solid lightgrey' }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  id="row2"
                  className="cardRow"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}
                >
                  <div className="verticalCenter" style={{ marginLeft: '50%' }}>
                    <label htmlFor="phone">Phone:</label>
                  </div>
                  <div>
                    <div style={{ padding: '1% 10%' }}>
                      <input
                        className="form-control"
                        type="phone"
                        value={formInput.phone}
                        onChange={handleChange}
                        name="phone"
                        id="phone"
                        style={{ backgroundColor: 'rgb(225, 225, 225)', border: '1px solid lightgrey' }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  id="row3"
                  className="cardRow"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}
                >
                  <div className="verticalCenter" style={{ marginLeft: '50%' }}>
                    <label htmlFor="email">Email:</label>
                  </div>
                  <div>
                    <div style={{ padding: '1% 10%' }}>
                      <input
                        className="form-control"
                        type="email"
                        value={formInput.email}
                        onChange={handleChange}
                        name="email"
                        id="email"
                        style={{ backgroundColor: 'rgb(225, 225, 225)', border: '1px solid lightgrey' }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  id="row4"
                  className="cardRow"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}
                >
                  <div className="verticalCenter" style={{ marginLeft: '50%' }}>
                    <label htmlFor="notes">Notes:</label>
                  </div>
                  <div>
                    <div style={{ padding: '0% 10%' }}>
                      <textarea
                        className="form-control"
                        type="text"
                        value={formInput.notes}
                        onChange={handleChange}
                        name="notes"
                        id="notes"
                        style={{ backgroundColor: 'rgb(225, 225, 225)', border: '1px solid lightgrey' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="fullCenter">
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={addToProject}
                        onChange={() => { setAddtoProj((prevVal) => !prevVal); }}
                      />
                    )}
                    label="Add to Project?"
                  />
                </div>
              </div>
              {/* ------role-field------------- */}
              <Collapse in={addToProject}>
                <div>
                  <div
                    id="description-field"
                    className="fullCenter"
                    style={{
                      borderTop: '1px solid rgb(180, 180, 180)',
                      padding: '2% 10%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div id="text-label" className="fullCenter" style={{ marginBottom: '1%' }}>
                      <label htmlFor="role" className="form-label" style={{ textAlign: 'center' }}>
                        Role:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      placeholder="What they doin..."
                      id="role"
                      rows="3"
                      value={role}
                      onChange={handleChange}
                      name="role"
                      style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none', minWidth: '250px' }}
                    />
                  </div>
                </div>

              </Collapse>
            </div>
            <div id="button-row" className="fullCenter">
              <Button
                variant="outlined"
                type="submit"
                style={{
                  margin: '1% 0%',
                  color: 'black',
                  border: '1px solid rgb(100, 100, 100)',
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </Collapse>
      </div>
    </div>
  );
}
