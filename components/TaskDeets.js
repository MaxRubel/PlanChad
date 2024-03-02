/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-closing-bracket-location */
import { Collapse } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { peopleIcon, rightArrowSmall } from '../public/icons';
import ViewTaskCollabsInProj from './ViewTaskCollabsInProj';

export default function TaskDeets({
  formInput, handleChange, taskId, saveCollabsExpand,
}) {
  const [collabsExpand, setCollabsExpand] = useState(false);

  useEffect(() => {
    setCollabsExpand((preVal) => formInput.collabsExpanded);
  }, [formInput]);

  const handleExpand = () => {
    saveCollabsExpand(!collabsExpand);
  };

  return (
    <>
      <Collapse
        in={formInput.deetsExpanded}
        onExited={() => { document.getElementById(`taskDeets${formInput.localId}`).style.display = 'none'; }}
        onEnter={() => { document.getElementById(`taskDeets${formInput.localId}`).style.display = 'grid'; }}
          >
        <div id={`taskDeets${formInput.localId}`} style={{ display: 'none' }} className={collabsExpand ? 'taskDeetsExpand' : 'taskDeets'}>
          <div id="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div id="empty" />
            <div
              id="line"
              style={{
                borderLeft: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(251, 157, 80, .5)',
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                transition: '1.5s all ease',
              }}>
              <div style={{
                transition: '1.5s all ease',
                borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(251, 157, 80, .5)',
              }} />
            </div>
          </div>
          <div id="marginL2" style={{ display: collabsExpand ? 'none' : 'grid', gridTemplateRows: '1fr 1fr' }}>
            <div
              id="line"
              style={{
                transition: '1.5s all ease',
                borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(251, 157, 80, .5)',
              }} />
            <div id="empty" />
          </div>
          {/* -------card-body------------------------ */}
          <div
            id="whole-card"
            className="card"
            style={{
              height: '293px',
              backgroundColor: formInput.status === 'closed' ? 'grey' : '',
              border: 'none',
              margin: '3px 1.5px',
              display: 'flex', /* Add display:flex */
              flexDirection: 'column', /* Set flex-direction to column */
              transition: 'all 1.5s ease',
            }}>
            <div id="card-header" style={{ display: 'flex', flexDirection: 'column', padding: '3% 8%' }}>
              <div className="veritcalCenter" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div className="veritcalCenter" style={{ fontSize: '18px', fontWeight: '600' }}>
                  <label htmlFor={`planning${taskId}`}>Planning:</label>
                </div>
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
              </div>
              {/* -----------------header----------------------- */}
            </div>
            <div id="text area" style={{ padding: '0% 5% 5% 5%', flex: '1' }}> {/* Set flex: 1 to fill remaining space */}
              <textarea
                className="form-control"
                style={{
                  height: '100%', /* Set height to 100% */
                  border: formInput.status === 'closed' ? 'grey' : '1px solid lightgrey',
                  backgroundColor: formInput.status === 'closed' ? 'grey' : '',
                  transition: 'all 1.5s ease',
                }}
                id={`planning${taskId}`}
                name="planning"
                value={formInput.planning}
                onChange={handleChange}
                placeholder="Planning details..."
    />
            </div>
          </div>

          <div id="taskCollabs">
            <ViewTaskCollabsInProj formInput={formInput} taskId={taskId} collabsExpand={collabsExpand} saveCollabsExpand={saveCollabsExpand} />
          </div>
        </div>
      </Collapse>
    </>
  );
}
