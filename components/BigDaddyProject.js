/* eslint-disable react/prop-types */
import { useState } from 'react';
import ProjectCard from './ProjectCard';

export default function BigDaddyProject({ projectId }) {
  const [save, setSave] = useState(0);

  const saveSuccess = () => {
    document.getElementById('saveButton').style.color = 'rgb(0, 204, 129)';
    setTimeout(() => {
      document.getElementById('saveButton').style.color = 'white';
    }, 1500);
  };

  return (
    <>
      <div id="project-top-bar">
        <button
          id="saveButton"
          type="button"
          className="clearButton"
          onClick={() => setSave((prevVal) => prevVal + 1)}
        >SAVE
        </button>
      </div>
      <div className="bigDad">
        <ProjectCard projectId={projectId} save={save} saveSuccess={saveSuccess} />
      </div>
    </>
  );
}
