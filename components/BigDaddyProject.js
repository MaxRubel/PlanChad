/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Button } from '@mui/material';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { createNewCheckpoint, getCheckpointsOfProject, updateCheckpoint } from '../api/checkpoint';

export default function BigDaddyProject({ projectId }) {
  const [save, setSave] = useState(0);
  const [checkpoints, setCheckpoints] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const saveSuccess = () => {
    document.getElementById('saveButton').style.color = 'rgb(16, 197, 234)';
    setTimeout(() => {
      document.getElementById('saveButton').style.color = 'white';
    }, 1500);
  };

  const saveAll = () => {
    setSave((prevVal) => prevVal + 1);
  };

  useEffect(() => {
    getCheckpointsOfProject(projectId).then((data) => {
      setCheckpoints(data);
    });
  }, [projectId, refresh]);

  const handleRefresh = () => {
    setRefresh((prevVal) => prevVal + 1);
  };

  const addCheckpoint = () => {
    const payload = {
      projectId,
      leadId: '',
      name: '',
      startDate: '',
      deadline: '',
      description: '',
      listIndex: '',
      expanded: true,
      fresh: true,
    };
    createNewCheckpoint(payload)
      .then(({ name }) => {
        updateCheckpoint({ checkpointId: name })
          .then(() => {
            handleRefresh();
          });
      });
  };

  return (
    <>
      <div className="bigDad">
        <div id="project-container">
          <div id="project-top-bar" style={{ marginBottom: '3%' }}>
            <button
              id="saveButton"
              type="button"
              className="clearButton"
              onClick={() => saveAll()}>
              SAVE
            </button>
          </div>
          <ProjectCard
            projectId={projectId}
            save={save}
            saveSuccess={saveSuccess} />
          <div id="add-checkpt-button" style={{ marginTop: '2%', paddingLeft: '0%' }}>
            <Button
              variant="outlined"
              onClick={addCheckpoint}
              style={{
                margin: '1% 0%',
                color: 'rgb(200, 200, 200)',
                border: '1px solid rgb(100, 100, 100)',
              }}>
              Add A Checkpoint
            </Button>
          </div>
          {checkpoints.map((checkP) => (
            <Checkpoint
              key={checkP.checkpointId}
              checkP={checkP}
              handleRefresh={handleRefresh}
              save={save}
              saveSuccess={saveSuccess}
              saveAll={saveAll}
            />
          ))}

        </div>
      </div>
    </>
  );
}
