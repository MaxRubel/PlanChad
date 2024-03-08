import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSaveContext } from '../../utils/context/saveManager';
import { useCollabContext } from '../../utils/context/collabContext';
import CollabCardforProject from '../cards/CollabCardForProject';

export default function ViewProjCollabs({ projectId, taskToAssign, setProjectToAssignChild }) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const [thisProject, setThisProject] = useState({});
  const [projectToAssign, setProjectToAssign] = useState('');
  const [selectInput, setSelectInput] = useState('');
  const [taskToAssign2, setTaskToAssign2] = useState('');
  const { allProjects } = useSaveContext();
  const { allCollabs, projCollabJoins, searchInput } = useCollabContext();
  const originalProjCollabs = useRef([]);

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
      originalProjCollabs.current = thisProjCollabs;
    }
  }, [projCollabJoins, projectId, selectInput, allCollabs, thisProject]);

  useEffect(() => {
    setTaskToAssign2(taskToAssign);
  }, [taskToAssign, projectId]);

  useEffect(() => {
    if (searchInput) {
      const collabsCopy = [...originalProjCollabs.current];
      const searchResult = collabsCopy
        .filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()));
      setCollabsOfProj((preVal) => searchResult);
    } else {
      setCollabsOfProj((preVal) => originalProjCollabs.current);
    }
  }, [searchInput]);

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
      className="card text-bg-dark mb-3"
      style={{
        width: '47%',
      }}
    >
      <div
        className="card-header"
        style={{
          fontSize: '22px',
          color: 'rgb(200, 200, 200)',
          textAlign: 'center',
          fontWeight: '600',
          botderBottom: '1px solid rgb(84,84,84)',
        }}
      >
        <div style={{ marginBottom: '2%' }}>Project</div>
        <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
          <Form.Select
            name="projects"
            id="projects"
            className="form-control shadow-none"
            value={selectInput}
            onChange={changeProject}
            style={{
              backgroundColor: 'rgb(225, 225, 225)',
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
          <div
            className="card-body"
            style={{
              height: '30vh',
              overflow: 'auto',
            }}
          >
            {collabsOfProj.length === 0 ? ('No one is assigned to this project...') : (collabsOfProj.map((collab) => (
              <CollabCardforProject
                taskToAssign={taskToAssign2}
                key={collab.collabId}
                collab={collab}
                ofProj
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

ViewProjCollabs.propTypes = {
  taskToAssign: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  setProjectToAssignChild: PropTypes.func.isRequired,
};
