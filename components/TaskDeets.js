/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
import { Collapse } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export default function TaskDeets({ formInput, min, handleChange }) {
  const [fresh, setFresh] = useState(true);

  // useEffect(() => {
  //   let timeout;
  //   if (formInput.deetsExpanded && fresh) {
  //     document.getElementById(`taskDeets${formInput.localId}`).style.display = 'grid';
  //     setFresh((prevVal) => !prevVal);
  //   }

  //   if (!formInput.deetsExpanded && !fresh) {
  //     timeout = setTimeout(() => {
  //       document.getElementById(`taskDeets${formInput.localId}`).style.display = 'none';
  //     }, 266);
  //   }
  // }, [formInput.deetsExpanded]);

  useEffect(() => {
    let timeout;
    if (fresh && formInput.localId) { // onload
      document.getElementById(`taskDeets${formInput.localId}`).style.display = 'none';
      setFresh((prevVal) => !prevVal);
    }
    if (!formInput.deetsExpanded && formInput.localId && !fresh) {
      timeout = setTimeout(() => {
        document.getElementById(`taskDeets${formInput.localId}`).style.display = 'none';
      }, 266);
    }
    if (formInput.deetsExpanded) {
      document.getElementById(`taskDeets${formInput.localId}`).style.display = 'grid';
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [formInput.deetsExpanded, fresh]);

  return (
    <div id={`taskDeets${formInput.localId}`} className="taskDeets" style={{ display: 'hidden' }}>
      <div id="margin" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div id="empty" />
        <div id="line" style={{ borderLeft: '2px solid rgb(84, 84, 84)', display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
        </div>
      </div>
      <div id="margin 2" style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
        <div id="line" style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
        <div id="empty" />
      </div>
      <div className="card" style={{ margin: '3px 0px' }}>
        {/* -------card-body------------------------ */}
        <Collapse in={formInput.deetsExpanded}>
          <div id="whole-card">
            <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '2% 0%' }}>
              <div
                id="row1"
                className="cardRow2">
                <div
                  className="fullCenter2"
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingRight: '10%',
                  }}><label htmlFor="prep">Prep:</label>
                  </div>
                  <div style={{ marginLeft: '4%' }}>
                    <textarea
                      id="prep"
                      className="form-control"
                      name="prep"
                      onChange={handleChange}
                      value={formInput.prep}
                      style={{ backgroundColor: 'rgb(225, 225, 225)', border: '2px solid lightgrey' }} />
                  </div>
                </div>
              </div>
              <div
                id="row2"
                className="cardRow2">
                <div
                  className="fullCenter2"
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingRight: '10%',
                  }}><label htmlFor="exec">Execution:</label>
                  </div>
                  <div style={{ marginLeft: '4%' }}>
                    <textarea
                      id="exec"
                      className="form-control"
                      onChange={handleChange}
                      value={formInput.exec}
                      name="exec"
                      style={{ backgroundColor: 'rgb(225, 225, 225)', border: '2px solid lightgrey' }} />
                  </div>
                </div>
              </div>
              <div
                id="row3"
                className="cardRow2">
                <div
                  className="fullCenter2">
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingRight: '10%',
                  }}>
                    <label htmlFor="debrief">Debrief:</label>
                  </div>
                  <div style={{ marginLeft: '4%' }}>
                    <textarea
                      id="debrief"
                      className="form-control"
                      name="debrief"
                      onChange={handleChange}
                      value={formInput.debrief}
                      style={{ backgroundColor: 'rgb(225, 225, 225)', border: '2px solid lightgrey' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
      <div id="margin 3" />
    </div>
  );
}
