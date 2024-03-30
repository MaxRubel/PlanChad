import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CollabCardForTask from '../cards/CollabCardForTask';
import { useCollabContext } from '../../utils/context/collabContext';
import { useAuth } from '../../utils/context/authContext';
import useSaveStore from '../../utils/stores/saveStore';

export default function ViewTaskCollabs({ projectId, projectToAssign, setTaskToAssignChild }) {
  const {
    taskCollabJoins,
    searchInput,
    projCollabs,
  } = useCollabContext();
  const [collabsOfTask, setCollabsOfTask] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const OGCollabsOfTask = useRef([]);
  const storedProject = useSaveStore((state) => state.project);
  const storedTasks = useSaveStore((state) => state.tasks);
  const allTasks = useSaveStore((state) => state.allTasks);

  useEffect(() => {
    setCollabsOfTask((preVal) => []);

    const theseTaskCollabJoins = taskCollabJoins
      .filter((item) => item.taskId === taskId);

    const theseCollabs = [];
    for (let i = 0; i < theseTaskCollabJoins.length; i++) {
      const collab = projCollabs.find((item) => item.collabId === theseTaskCollabJoins[i].collabId);
      theseCollabs.push(collab);
    }

    setCollabsOfTask((preVal) => theseCollabs);
    OGCollabsOfTask.current = theseCollabs;
  }, [taskCollabJoins, projCollabs, taskId]);

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
      if (!storedProject?.projectId) {
        const thisProjectsTasks = allTasks.filter((item) => item.projectId === projectToAssign);
        setTasks((preVal) => thisProjectsTasks);
      } else {
        setTasks((preVal) => storedTasks);
      }
    } else {
      const thisProjectsTasks = allTasks.filter((item) => item.projectId === projectToAssign);
      setTasks((preVal) => thisProjectsTasks);
    }
  }, [projectToAssign, projectId, allTasks, taskCollabJoins]);

  return (
    <>
      <div className="card white">
        <div className="card-header tasksViewHeader">
          <div style={{ padding: '3px', marginBottom: '1%' }}>Task</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
            <Form.Select
              name="tasks"
              id="tasks"
              className="form-control shadow-none white"
              onChange={handleChange}
              style={{ backgroundColor: 'rgb(225, 225, 225)' }}
              onFocus={(e) => {
                e.target.style.borderColor = 'none';
              }}
            >{tasks.length > 0 ? (tasks.map((task, index) => (
              <option
                key={task.localId}
                value={task.localId}
              >{task.name ? task.name : `Task ${index + 1}`}
              </option>
            ))) : (
              <option
                key={1}
                value={null}
              >No tasks have been created...
              </option>
            )}

            </Form.Select>
          </div>
        </div>
        <div className="card-body white">
          <div className="card white">
            <div
              className="card-body white"
              style={{
                paddingTop: '2%',
                height: '30vh',
                overflow: 'auto',
              }}
            >
              {collabsOfTask.length === 0 ? (
                'No one is assigned to this task...'
              ) : (
                collabsOfTask.map((collab) => (
                  <CollabCardForTask
                    key={collab?.collabId}
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
