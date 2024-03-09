import { Collapse, OverlayTrigger } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { peopleIcon } from '../public/icons';
import ViewTaskCollabsInProj from './views/ViewTaskCollabsInProj';
import { hideCollabsToolTips, viewCollabsToolTips } from './util/toolTips';

export default function TaskDeets({
  formInput, handleChange, taskId, saveCollabsExpand,
}) {
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
    console.log(formInput.collabsExpanded);
  }, [formInput]);
  return (
    <>
      <Collapse
        in={formInput.deetsExpanded}
        onExited={() => { document.getElementById(`taskDeets${formInput.localId}`).style.display = 'none'; }}
        onEnter={() => { document.getElementById(`taskDeets${formInput.localId}`).style.display = 'grid'; }}
      >
        <div>
          <div id={`taskDeets${formInput.localId}`} style={{ display: 'none' }} className={formInput.collabsExpanded ? 'taskDeetsExpand' : 'taskDeets'}>
            <div id="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div id="empty" />
              <div
                id="line"
                style={{
                  borderLeft: '2px solid rgb(255, 117, 26, .5)',
                  display: 'grid',
                  gridTemplateRows: '1fr 1fr',
                  transition: '1.5s all ease',
                }}
              >
                <div style={{
                  transition: '1.5s all ease',
                  borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(255, 117, 26, .5)',
                }}
                />
              </div>
            </div>
            <div id="marginL2" style={{ display: formInput.collabsExpanded ? 'none' : 'grid', gridTemplateRows: '1fr 1fr' }}>
              <div
                id="line"
                style={{
                  transition: '1.5s border ease',
                  borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(255, 117, 26, .5)',
                }}
              />
              <div id="empty" />
            </div>
            {/* -------card-body------------------------ */}
            <div
              id="whole-card"
              className="card"
              style={{
                height: '250px',
                backgroundColor: formInput.status === 'closed' ? 'grey' : '',
                border: 'none',
                margin: '3px 0px',
                marginRight: formInput.collabsExpanded ? '3px' : '',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 1.5s ease',
              }}
            >
              <div id="text area" style={{ padding: '3% 5%', flex: '1' }}>
                <div id="plan" style={{ paddingBottom: '1%' }}><strong>Plan:</strong></div>
                <textarea
                  className="form-control"
                  style={{
                    height: '88%',
                    border: formInput.status === 'closed' ? 'grey' : '1px solid lightgrey',

                    backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
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
              <ViewTaskCollabsInProj formInput={formInput} taskId={taskId} collabsExpand={formInput.collabsExpanded} saveCollabsExpand={formInput.collabsExpanded} />
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
}

TaskDeets.propTypes = {
  formInput: PropTypes.shape({
    collabsExpanded: PropTypes.bool.isRequired,
    localId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    planning: PropTypes.string.isRequired,
    deetsExpanded: PropTypes.bool.isRequired,
    progressIsShowing: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf([undefined]),
    ]),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
  saveCollabsExpand: PropTypes.func.isRequired,
};
