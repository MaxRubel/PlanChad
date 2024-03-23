/* eslint-disable react/prop-types */
import { Modal } from 'react-bootstrap';
import TaskForCal from '../calendar/TaskForCal';
import { closeIcon } from '../../public/icons';

export default function TaskModalForCalendar({ show, task, closeModal }) {
  return (
    <>
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header style={{
          height: '40px',
          display: 'flex',
          justifyContent: 'right',
          border: 'none',
        }}
        >
          <Modal.Title>
            <button type="button" className="clearButton" style={{ color: 'white' }} onClick={closeModal}>
              {closeIcon}
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '0px',
        }}
        >
          <TaskForCal task={task} closeModal={closeModal} />
        </Modal.Body>
      </Modal>
    </>
  );
}
