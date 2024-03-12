import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ViewTaskCollabsInProj from '../views/ViewTaskCollabsInProj';
import ViewTaskCollabsForCal from './ViewTaskCollabsForCal';

export default function TaskDeetsForCalendar({
  formInput, handleChange, taskId,
}) {
  return (

    <div>
      <div id={`taskDeets${formInput.localId}`} className="taskDeetsExpand">
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
          }}
        >
          <div
            id="text area"
            style={{
              padding: '22px 5%',
              flex: '1',
            }}
          >
            <div id="plan" style={{ paddingLeft: '6px', paddingBottom: '6px' }}><strong>Plan:</strong></div>
            <textarea
              className="form-control"
              style={{
                height: '88%',
                border: formInput.status === 'closed' ? 'grey' : '1px solid lightgrey',
                backgroundColor: formInput.status === 'closed' ? 'grey' : 'rgb(225, 225, 225)',
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
      </div>
    </div>
  );
}

TaskDeetsForCalendar.propTypes = {
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
