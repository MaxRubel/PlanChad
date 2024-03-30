import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useCollabContext } from '../../utils/context/collabContext';
import CollabCardforProject from '../cards/CollabCardForProject';
import useSaveStore from '../../utils/stores/saveStore';
import { getInvitesByProject } from '../../api/invites';

export default function ViewProjCollabs({ projectId, taskToAssign, setProjectToAssignChild }) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const [thisProject, setThisProject] = useState({});
  const [projectToAssign, setProjectToAssign] = useState('');
  const [selectInput, setSelectInput] = useState('');
  const [taskToAssign2, setTaskToAssign2] = useState('');
  const {
    allCollabs,
    projCollabJoins,
    searchInput,
    loadProjectCollabs,
    projCollabs,
  } = useCollabContext();
  const originalProjCollabs = useRef([]);
  const allProjects = useSaveStore((state) => state.allProjects);
  const addBatchOfInvites = useSaveStore((state) => state.addBatchOfInvites);

  useEffect(() => {
    const runningProject = allProjects.find((item) => item.projectId === projectId);
    setThisProject((preVal) => runningProject);
    setSelectInput((preVal) => projectId);
    setProjectToAssignChild(projectId);
    setProjectToAssign((preVal) => projectId);
  }, [projectId, allProjects]);

  useEffect(() => {
    if (projectId) {
      setCollabsOfProj((preVal) => projCollabs);
      originalProjCollabs.current = projCollabs;
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
    getInvitesByProject(value).then((data) => {
      addBatchOfInvites(data);
    });
    loadProjectCollabs(value);
    setThisProject((preVal) => project);
    setSelectInput((preVal) => value);
    setProjectToAssignChild(value);
    setProjectToAssign((preVal) => value);
  };

  return (
    <div className="card white">
      <div className="card-header projectViewHeader">
        <div style={{ padding: '3px', marginBottom: '1%' }}>Project</div>
        <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
          <Form.Select
            name="projects"
            id="projects"
            className="form-control shadow-none"
            value={selectInput}
            onChange={changeProject}
            style={{ backgroundColor: 'rgb(225, 225, 225)' }}
          >
            {allProjects.map((project) => (
              <option
                key={project.projectId}
                value={project.projectId}
              >{project.name}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
      <div className="card-body" id="1">
        <div className="card">
          <div
            id="2"
            className="card-body white"
            style={{
              paddingTop: '2%',
              paddingBottom: '2%',
              height: '30vh',
              overflow: 'auto',
            }}
          >
            {collabsOfProj.length === 0 ? (
              'No one is assigned to this project...'
            ) : (
              collabsOfProj.map((collab) => (
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
