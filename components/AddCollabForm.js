import { Collapse } from 'react-bootstrap';
import { useState } from 'react';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { plusIcon } from '../public/icons';

const initialState = {
  name: '',
  phone: '',
  email: '',
  notes: '',
};

export default function AddCollabForm() {
  const [expanded, setExpanded] = useState(false);
  const [formInput, setForminput] = useState({});
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setExpanded((prevVal) => true);
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
          <form>
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
                        // value={formInput.deadline}
                        // onChange={handleChange}
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
                        // value={formInput.deadline}
                        // onChange={handleChange}
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
                        // value={formInput.deadline}
                        // onChange={handleChange}
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
                        // value={formInput.deadline}
                        // onChange={handleChange}
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
                        checked={checked}
                        onChange={() => { setChecked((prevVal) => !prevVal); }}
                      />
                    )}
                    label="Add to Project?"
                  />
                </div>
              </div>
              {/* ------role-field------------- */}
              <Collapse in={checked}>
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
                      // value={formInput.description}
                      // onChange={handleChange}
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
                // onClick={() => { addCheckpoint(); }}
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
