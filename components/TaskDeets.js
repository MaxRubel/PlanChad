/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
import { Collapse } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { peopleIcon, rightArrowSmall } from '../public/icons';
import ViewTaskCollabs from './ViewTaskCollabs';

export default function TaskDeets({ formInput, handleChange, taskId }) {
  const [fresh, setFresh] = useState(true);
  const [collabsExpand, setCollabsExpand] = useState(false);
  const grid = document.getElementById(`taskDeets${formInput.localId}`);
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

  const handleExpand = () => {
    setCollabsExpand((preVal) => !preVal);
  };

  return (
    <>
      <div id={`taskDeets${formInput.localId}`} className={collabsExpand ? 'taskDeetsExpand' : 'taskDeets'}>
        <div id="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div id="empty" />
          <div
            id="line"
            style={{
              borderLeft: '2px solid rgb(84, 84, 84)',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
            }}>
            <div style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
          </div>
        </div>
        <div id="marginL2" style={{ display: collabsExpand ? 'none' : 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div id="line" style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
          <div id="empty" />
        </div>
        <div id="taskDeetsInfo" className="card" style={{ margin: '3px 0px' }}>
          {/* -------card-body------------------------ */}
          <Collapse in={formInput.deetsExpanded}>
            <div id="whole-card">
              <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '1% 0%' }}>
                <div id="smallHeader" style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="clearButton"
                    style={{ color: 'black' }}
                    onClick={handleExpand}
                  >
                    {peopleIcon} {rightArrowSmall}
                  </button>
                </div>
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
        <div id="taskCollabs">
          <ViewTaskCollabs taskId={taskId} collabsExpand={collabsExpand} />
        </div>
        {/* <div id="margin3" /> */}
      </div>

    </>
  );
}
