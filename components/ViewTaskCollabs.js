/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { getCollabsOfProject } from '../api/projCollab';
import CollabCard from './CollabCard';
import { getSingleCollab } from '../api/collabs';
import { useSaveContext } from '../utils/context/saveManager';
import { plusIcon } from '../public/icons';
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
    openAssigneesModal,
    allTasks,
  } = useSaveContext();
  const { taskCollabJoins, allCollabs } = useCollabContext();
  const [collabsOfTask, setCollabsOfTask] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    setCollabsOfTask((preVal) => []);
    const theseTaskCollabJoins = taskCollabJoins.filter((item) => item.taskId === taskId);
    const theseCollabs = [];
    for (let i = 0; i < theseTaskCollabJoins.length; i++) {
      const collab = allCollabs.find((item) => item.collabId === theseTaskCollabJoins[i].collabId);
      theseCollabs.push(collab);
    }
    setCollabsOfTask((preVal) => theseCollabs);
    console.log(theseCollabs);
  }, [taskCollabJoins, taskId]);

  useEffect(() => {
    const val = document.getElementById('tasks').value;
    setTaskToAssignChild(val);
    setTaskId(((preVal) => val));
    console.log('value:', val);
  }, [tasks]);

  const handleChange = (e) => {
    const { value } = e.target;
    setTaskId((preVal) => value);
    setTaskToAssignChild(value);
  };

  useEffect(() => {
    // console.log('from assigned to task viewer: ', projectToAssign);
    if (projectToAssign === projectId) {
      console.log('you are working on this project currently');
      setTasks((preVal) => saveInput.tasks);
    } else {
      console.log(allTasks);
      const thisProjectsTasks = allTasks.filter((item) => item.projectId === projectToAssign);
      setTasks((preVal) => thisProjectsTasks);
    }
  }, [projectToAssign]);

  return (
    <>
      {/* <Collapse in={collabsExpand} dimension="width"> */}
      <div className="card text-bg-info mb-3" style={{ width: '47%' }}>
        <div className="card-header" style={{ fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
          <div> Assigned to Task:</div>
          <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
            <select name="tasks" id="tasks" className="form-control" onChange={handleChange}>
              {tasks.map((task) => (
                <option key={task.localId} value={task.localId}>{task.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="card">
            <div className="card-body">
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
      {/* </Collapse> */}
    </>
  );
}
