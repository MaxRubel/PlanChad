import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSaveContext } from '../../utils/context/saveManager';
import CollabCardForTask from '../cards/CollabCardForTask';
import { useCollabContext } from '../../utils/context/collabContext';

export default function ViewTaskCollabs({ projectId, projectToAssign, setTaskToAssignChild }) {
  const { saveInput, allTasks } = useSaveContext();
  const { taskCollabJoins, allCollabs, searchInput } = useCollabContext();
  const [collabsOfTask, setCollabsOfTask] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const OGCollabsOfTask = useRef([]);

  useEffect(() => {
    setCollabsOfTask((preVal) => []);
    const theseTaskCollabJoins = taskCollabJoins.filter((item) => item.taskId === taskId);
    const theseCollabs = [];
    for (let i = 0; i < theseTaskCollabJoins.length; i++) {
      const collab = allCollabs.find((item) => item.collabId === theseTaskCollabJoins[i].collabId);
      theseCollabs.push(collab);
    }
    setCollabsOfTask((preVal) => theseCollabs);
    OGCollabsOfTask.current = theseCollabs;
  }, [taskCollabJoins, allCollabs, taskId]);

  useEffect(() => {
    const val = document.getElementById('tasks').value;
    setTaskToAssignChild(val);
    setTaskId(((preVal) => val));
  }, [tasks]);

  useEffect(() => {
    if (searchInput) {
      const collabsCopy = [...OGCollabsOfTask.current];
      const searchResult = collabsCopy
        .filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()));
      setCollabsOfTask((preVal) => searchResult);
    } else {
      setCollabsOfTask((preVal) => OGCollabsOfTask.current);
    }
  }, [searchInput]);

  const handleChange = (e) => {
    const { value } = e.target;
    setTaskId((preVal) => value);
    setTaskToAssignChild(value);
  };

  useEffect(() => {
    if (projectToAssign === projectId) {
      if (!saveInput.project.projectId) {
        const copy = [...allTasks];
        const thisProjectsTasks = copy.filter((item) => item.projectId === projectToAssign);
        setTasks((preVal) => thisProjectsTasks);
      } else {
        setTasks((preVal) => saveInput.tasks);
      }
    } else {
      const copy = [...allTasks];
      const thisProjectsTasks = copy.filter((item) => item.projectId === projectToAssign);
      setTasks((preVal) => thisProjectsTasks);
    }
  }, [projectToAssign, projectId, allTasks, taskCollabJoins]);

  return (
    <>
      <div
        className="card"
        style={{
          width: '47%',
          backgroundColor: 'lightgray',
        }}
      >
        <div
          className="card-header"
          style={{
            fontSize: '22px',
            padding: '16px',
            paddingTop: '1%',
            textAlign: 'center',
            fontWeight: '500',
            botderBottom: '1px solid rgb(84,84,84)',
          }}
        >
          <div style={{ padding: '3px', marginBottom: '1%' }}>Task</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
            <Form.Select
              style={{
                backgroundColor: 'rgb(225, 225, 225)',
              }}
              name="tasks"
              id="tasks"
              className="form-control shadow-none"
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = 'none';
              }}
            >{tasks.length > 0 ? (tasks.map((task, index) => (
              <option key={task.localId} value={task.localId}>{task.name ? task.name : `Task ${index + 1}`}</option>
            ))) : (<option key={1} value={null}>No tasks have been created...</option>)}

            </Form.Select>
          </div>
        </div>
        <div className="card-body">
          <div className="card">
            <div
              className="card-body"
              style={{
                height: '30vh',
                overflow: 'auto',
              }}
            >
              {collabsOfTask.length === 0 ? (
                'No one is assigned to this task...'
              ) : (
                collabsOfTask.map((collab) => (
                  <CollabCardForTask
                    key={collab.collabId}
                    taskId={taskId}
                    collab={collab}
                    ofProj
                    projectId={projectId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ViewTaskCollabs.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectToAssign: PropTypes.string.isRequired,
  setTaskToAssignChild: PropTypes.func.isRequired,
};
