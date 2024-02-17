/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Button } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { createNewCheckpoint, getCheckpointsOfProject, updateCheckpoint } from '../api/checkpoint';

export default function BigDaddyProject({ projectId }) {
  const [save, setSave] = useState(0);
  const [checkpoints, setCheckpoints] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [min, setMin] = useState(0);
  const [saveColor, setSaveColor] = useState(0);
  const [minColor, setMinColor] = useState(0);
  const [reOrdered, setReOrdered] = useState(0);

  const saveAll = () => { // trigger save all
    setSave((prevVal) => prevVal + 1);
  };

  const saveSuccess = () => { // trigger save all animation
    setSaveColor((prevVal) => prevVal + 1);
  };

  useEffect(() => { // save animation
    let saveColorChange;
    if (saveColor > 0) {
      document.getElementById('saveButton').style.color = 'rgb(16, 197, 234)';
      saveColorChange = setTimeout(() => {
        document.getElementById('saveButton').style.color = 'rgb(200, 200, 200)';
      }, 1500);
    }
    return () => {
      clearTimeout(saveColorChange);
    };
  }, [saveColor]);

  useEffect(() => { // minimize animation
    let minColorChange;
    if (minColor > 0) {
      document.getElementById('minButton').style.color = 'rgb(16, 197, 234)';
      minColorChange = setTimeout(() => {
        document.getElementById('minButton').style.color = 'rgb(200, 200, 200)';
      }, 1000);
    }
    return () => {
      clearTimeout(minColorChange);
    };
  }, [minColor]);

  const minAll = () => { // trigger minAll and animation
    setMin((prevVal) => prevVal + 1);
    setMinColor((prevVal) => prevVal + 1);
  };

  useEffect(() => {
    getCheckpointsOfProject(projectId).then((data) => {
      const indexedData = data.map((item, index) => (
        {
          ...item,
          index,
        }
      ));
      setCheckpoints(indexedData);
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
      expanded: false,
      fresh: true,
    };
    saveAll();
    createNewCheckpoint(payload)
      .then(({ name }) => {
        updateCheckpoint({ checkpointId: name })
          .then(() => {
            handleRefresh();
          });
      });
  };

  const handleDragEnd = (result) => {
    saveAll();
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    const reorderedChecks = Array.from(checkpoints);
    const [reorderedCheckp] = reorderedChecks.splice(result.source.index, 1);
    reorderedChecks.splice(result.destination.index, 0, reorderedCheckp);
    const savedIndexes = reorderedChecks.map((item, index) => (
      {
        ...item, index,
      }
    ));
    setCheckpoints(savedIndexes);
    setReOrdered((prevVal) => prevVal + 1);
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
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => saveAll()}>
              SAVE
            </button>
            <button
              id="minButton"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => minAll()}>
              MINIMIZE All
            </button>
          </div>
          <ProjectCard
            projectId={projectId}
            save={save}
            saveSuccess={saveSuccess}
            min={min}
            minAll={minAll} />
          <div
            id="add-checkpt-button"
            style={{
              marginTop: '2%',
              // marginBottom: '.5%',
              paddingLeft: '0%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
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
          <div id="dnd-container">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="checkPDrop">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {checkpoints.map((checkP, index) => (
                      <Checkpoint
                        key={checkP.checkpointId}
                        checkP={checkP}
                        handleRefresh={handleRefresh}
                        save={save}
                        saveSuccess={saveSuccess}
                        saveAll={saveAll}
                        minAll={minAll}
                        min={min}
                        index={index}
                        reOrdered={reOrdered}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  );
}
