/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useSaveContext } from '../utils/context/saveManager';
import CollabCardForTask from './CollabCardForTask';
import { useCollabContext } from '../utils/context/collabContext';

// eslint-disable-next-line react/prop-types
export default function ViewTaskCollabs({
  projectId,
  refreshProjCollabs,
  projectToAssign,
  setTaskToAssignChild,
}) {
  const {
    saveInput,
    allTasks,
  } = useSaveContext();
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
        className="card text-bg-dark mb-3"
        style={{
          width: '47%',
        }}
      >
        <div
          className="card-header"
          style={{
            color: 'rgb(200, 200, 200)',
            fontSize: '22px',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          <div style={{ marginBottom: '2%' }}>Task</div>
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
            >
              {tasks.map((task, index) => (
                <option key={task.localId} value={task.localId}>{task.name ? task.name : `Task ${index + 1}`}</option>
              ))}
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
                    refreshProjCollabs={refreshProjCollabs}
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
