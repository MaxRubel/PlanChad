/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';
import { useState, useEffect } from 'react';
import { grey } from '@mui/material/colors';
import { trashIcon } from '../public/icons';
import { deleteCheckpoint, updateCheckpoint } from '../api/checkpoint';

const initialState = {

};

export default function Checkpoint({
  checkP,
  handleRefresh,
  save,
  saveSuccess,
}) {
  const [formInput, setFormInput] = useState({});
  const [fresh, setFresh] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setFormInput(checkP);
  }, [checkP]);

  useEffect(() => {
    if (hasChanged) {
      updateCheckpoint(formInput).then(() => {
        saveSuccess();
        setHasChanged((prevVal) => false);
      });
    }
  }, [save]);

  const handleFreshness = () => {
    if (fresh) {
      setFresh((prevVal) => false);
    }
    if (!hasChanged) {
      setHasChanged((prevVal) => true);
    }
  };

  const handleChange = (e) => {
    handleFreshness();
    const { name, value } = e.target;
    setFormInput((prevVal) => ({ ...prevVal, [name]: value }));
  };

  // const HandleCheck = (e) => {
  //   handleFreshness();
  //   const { name, checked } = e.target;
  //   setFormInput((prevVal) => ({ ...prevVal, closed: checked }));
  // };

  const handleDelete = () => {
    if (fresh) {
      deleteCheckpoint(checkP.checkpointId)
        .then(() => {
          handleRefresh();
        });
    }
    if (!fresh) {
      if (window.confirm('Are you sure you would like to delete this task?')) {
        deleteCheckpoint(checkP.checkpointId).then(() => {
          handleRefresh();
        });
      }
    }
  };

  return (
    <div key={checkP.checkpointId} className="checkpoint">
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
                {/* <FormGroup>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        sx={{
                          color: grey[800],
                          '&.Mui-checked': {
                            color: grey[600],
                          },
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                        }}
                        checked={formInput.checked}
                        onChange={HandleCheck}
                        name="checked" />
                      )}
                    label={(
                      <span style={{
                        fontSize: 14,
                        color: 'rgb(102, 102, 102)',
                        fontFamily: 'Arial',
                      }}>Completed
                      </span>
                    )} />
                </FormGroup> */}
              </div>
              <div className="verticalCenter">
                <input
                  className="form-control"
                  style={{
                    textAlign: 'center',
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                  placeholder="Enter a task name..."
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
                  }}>{trashIcon}
                </button>
              </div>
            </div>
            <div className="card-body">

              <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            </div>
          </div>
          <div className="marginR" />
        </div>
      </div>
      <div className="marginR" />
    </div>
  );
}
