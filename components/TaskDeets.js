import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { memo } from 'react';
import ViewTaskCollabsInProj from './views/ViewTaskCollabsInProj';

const TaskDeets = memo(({ formInput, handleChange, taskId }) => (
  <>
    <Collapse
      in={formInput.deetsExpanded}
      style={{ transition: 'none' }}
      onExited={() => { document.getElementById(`taskDeets${formInput.localId}`).style.display = 'none'; }}
      onEnter={() => { document.getElementById(`taskDeets${formInput.localId}`).style.display = 'grid'; }}
    >
      <div>
        <div
          id={`taskDeets${formInput.localId}`}
          style={{ display: 'none' }}
          className={formInput.collabsExpanded
            ? 'taskDeetsExpand'
            : 'taskDeets'}
        >
          <div className="hide">
            <div
              id="marginL"
              className="hey"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <div id="empty" />
              <div
                className="small-orange-line-left"
              >
                <div style={{
                  transition: '1.5s all ease',
                  borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(255, 117, 26, .5)',
                }}
                />
              </div>
            </div>
            <div
              id="marginL2"
              style={{ display: formInput.collabsExpanded ? 'none' : 'grid', gridTemplateRows: '1fr 1fr' }}
            >
              <div
                id="line"
                style={{
                  transition: '1.5s border ease',
                  borderBottom: formInput.status === 'closed' ? '2px solid grey' : '2px solid rgb(255, 117, 26, .5)',
                }}
              />
              <div id="empty" />
            </div>
          </div>
          {/* -------card-body------------------------ */}
          <div className="show" />
          <div
            className="card planning-box"
            style={{ backgroundColor: formInput.status === 'closed' ? 'grey' : '' }}
          >
            <div className="planning-text">
              <div id="plan" style={{ paddingLeft: '6px', paddingBottom: '6px' }}><strong>Plan:</strong></div>
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
                onPointerDownCapture={(e) => e.stopPropagation()}
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
));

export default TaskDeets;

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
};
