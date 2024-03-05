/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useSaveContext } from '../utils/context/saveManager';
import { useCollabContext } from '../utils/context/collabContext';
import CollabCardforProject from './CollabCardForProject';

// eslint-disable-next-line react/prop-types
export default function ViewProjCollabs({
  // eslint-disable-next-line react/prop-types
  projectId, refreshProjCollabs, taskToAssign, setProjectToAssignChild,
}) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const [thisProject, setThisProject] = useState({});
  const [projectToAssign, setProjectToAssign] = useState('');
  const [selectInput, setSelectInput] = useState('');
  const [taskToAssign2, setTaskToAssign2] = useState('');
  const { allProjects } = useSaveContext();
  const { allCollabs, projCollabJoins } = useCollabContext();

  useEffect(() => {
    // load in either the projectId from the router query or let the user choose from dropdown
    if (projectId) {
      const runningProject = allProjects.find((item) => item.projectId === projectId);
      setThisProject((preVal) => runningProject);
      setSelectInput((preVal) => projectId);
      setProjectToAssignChild(projectId);
      setProjectToAssign((preVal) => projectId);
    }
  }, [projectId, allProjects]);

  useEffect(() => {
    if (projectId) {
      const thisProjCollabs = [];
      const copy = [...projCollabJoins];
      const thisProjCollabJoins = copy.filter((item) => item.projectId === thisProject?.projectId);
      const collabIds = thisProjCollabJoins.map((item) => item.collabId);
      for (let i = 0; i < allCollabs.length; i++) {
        if (collabIds.includes(allCollabs[i].collabId)) {
          thisProjCollabs.push(allCollabs[i]);
        }
      }
      setCollabsOfProj((preVal) => thisProjCollabs);
    }
  }, [projCollabJoins, projectId, selectInput, allCollabs, thisProject]);

  useEffect(() => {
    setTaskToAssign2(taskToAssign);
  }, [taskToAssign, projectId]);

  const changeProject = (e) => {
    const { value } = e.target;
    const project = allProjects.find((item) => item.projectId === value);
    setThisProject((preVal) => project);
    setSelectInput((preVal) => value);
    setProjectToAssignChild(value);
    setProjectToAssign((preVal) => value);
  };
  return (
    <div
      className="card"
      style={{
        // backgroundColor: 'rgb(31, 31, 31)',
        // color: 'rgb(204,204,204)',
        height: '35vh',
        width: '47%',
      }}
    >
      <div className="card-header" style={{ fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
        <div style={{ marginBottom: '2%' }}> Assigned to Project:</div>
        <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
          <Form.Select
            name="projects"
            id="projects"
            className="form-control shadow-none"
            value={selectInput}
            onChange={changeProject}
            style={{
              // backgroundColor: 'rgb(31, 31, 31)',
              // color: 'rgb(204,204,204)',
              // border: '1px solid rgb(204,204,204, .3)',
            }}
          >
            {allProjects.map((project) => (
              <option key={project.projectId} value={project.projectId}>{project.name}</option>
            ))}
          </Form.Select>
        </div>
      </div>
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            {collabsOfProj.length === 0 ? ('No one is assigned to this project...') : (collabsOfProj.map((collab) => (
              <CollabCardforProject
                taskToAssign={taskToAssign2}
                key={collab.collabId}
                collab={collab}
                ofProj
                refreshProjCollabs={refreshProjCollabs}
                projectId={projectId}
                projectToAssign={projectToAssign}
              />
            )))}
          </div>
        </div>
      </div>
    </div>
  );
}
