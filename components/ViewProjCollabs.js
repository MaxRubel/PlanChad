/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getCollabsOfProject } from '../api/projCollab';
import CollabCard from './CollabCard';
import { getSingleCollab } from '../api/collabs';
import { useSaveContext } from '../utils/context/saveManager';
import { useCollabContext } from '../utils/context/collabContext';
import CollabCardforProject from './CollabCardForProject';

// eslint-disable-next-line react/prop-types
export default function ViewProjCollabs({ projectId, refreshProjCollabs, setProjectToAssignChild }) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const [thisProject, setThisProject] = useState({});
  const [selectInput, setSelectInput] = useState('');
  const { saveInput, allProjects } = useSaveContext();
  const {
    refreshAllCollabs, allCollabs, projCollabJoins,
  } = useCollabContext();

  useEffect(() => {
    // load in either the projectId from the router query or let the user choose from dropdown
    if (projectId) {
      console.log('coming from a running project');
      const runningProject = allProjects.find((item) => item.projectId === projectId);
      setThisProject((preVal) => runningProject);
      setSelectInput((preVal) => runningProject.projectId);
      setProjectToAssignChild(projectId);
    }
  }, []);

  useEffect(() => {
    const thisProjCollabs = [];
    const copy = [...projCollabJoins];
    const thisProjCollabJoins = copy.filter((item) => item.projectId === thisProject.projectId);
    const collabIds = thisProjCollabJoins.map((item) => item.collabId);
    for (let i = 0; i < allCollabs.length; i++) {
      if (collabIds.includes(allCollabs[i].collabId)) {
        thisProjCollabs.push(allCollabs[i]);
      }
    }
    setCollabsOfProj((preVal) => thisProjCollabs);
  }, [projCollabJoins, selectInput]);

  const changeProject = (e) => {
    const { value } = e.target;
    const project = allProjects.find((item) => item.projectId === value);
    setThisProject((preVal) => project);
    setSelectInput((preVal) => value);
    setProjectToAssignChild(value);
  };

  return (
    <div className="card text-bg-info mb-3" style={{ width: '47%' }}>
      <div className="card-header" style={{ fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
        <div> Assigned to Project:</div>
        <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>
          <label htmlFor="projects">Chose a project:</label>
          <select
            name="projects"
            id="projects"
            className="form-control"
            value={selectInput}
            onChange={changeProject}
          >
            {allProjects.map((project) => (
              <option key={project.projectId} value={project.projectId}>{project.name}</option>
            ))}
          </select>
          {saveInput.project.name}
        </div>
      </div>
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            {collabsOfProj.map((collab) => (
              <CollabCardforProject
                key={collab.collabId}
                collab={collab}
                ofProj
                refreshProjCollabs={refreshProjCollabs}
                projectId={thisProject.projectId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
