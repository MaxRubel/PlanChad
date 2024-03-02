/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { Collapse, OverlayTrigger } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { peopleIcon, rightArrowSmall } from '../public/icons';
import ViewTaskCollabsInProj from './ViewTaskCollabsInProj';
import { hideCollabsToolTips, viewCollabsToolTips } from './toolTips';

export default function TaskDeets({
  formInput, handleChange, taskId, saveCollabsExpand,
}) {
  const [collabsExpand, setCollabsExpand] = useState(false);

  const arrowSmall = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="currentColor"
      className={formInput.collabsExpanded ? 'arrowOpen' : 'arrowClosed'}
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0
      1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
      />
    </svg>
  );

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
        <div>
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
                }}
              >
                <div style={{
                  transition: '1.5s all ease',
                  borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(251, 157, 80, .5)',
                }}
                />
              </div>
            </div>
            <div id="marginL2" style={{ display: collabsExpand ? 'none' : 'grid', gridTemplateRows: '1fr 1fr' }}>
              <div
                id="line"
                style={{
                  transition: '1.5s border ease',
                  borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(251, 157, 80, .5)',
                }}
              />
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
                margin: '3px 0px',
                marginRight: collabsExpand ? '3px' : '',
                display: 'flex', /* Add display:flex */
                flexDirection: 'column', /* Set flex-direction to column */
                transition: 'all 1.5s ease',
              }}
            >
              <div
                id="card-header"
                style={{
                  display: 'flex', flexDirection: 'column', height: '43.89px', padding: '10px 30px',
                }}
              >
                <div className="veritcalCenter" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="veritcalCenter" style={{ fontSize: '18px', paddingTop: '1%', fontWeight: '600' }}>
                    <label htmlFor={`planning${taskId}`}>Planning:</label>
                  </div>
                  <div id="smallHeader" style={{ textAlign: 'right' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={formInput.collabsExpanded ? hideCollabsToolTips : viewCollabsToolTips}
                      trigger={['hover', 'focus']}
                      delay={500}
                    >
                      <button
                        type="button"
                        className="clearButton"
                        style={{ color: 'black' }}
                        onClick={handleExpand}
                      >
                        {peopleIcon} {arrowSmall}
                      </button>
                    </OverlayTrigger>
                  </div>
                </div>
                {/* -----------------header----------------------- */}
              </div>
              <div id="text area" style={{ padding: '0% 5% 3% 5%', flex: '1' }}> {/* Set flex: 1 to fill remaining space */}
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
            <div id="taskCollabs" style={{ marginLeft: '3px' }}>
              <ViewTaskCollabsInProj formInput={formInput} taskId={taskId} collabsExpand={collabsExpand} saveCollabsExpand={saveCollabsExpand} />
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
}
