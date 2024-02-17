/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Button } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import uniqid from 'uniqid';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { getCheckpointsOfProject } from '../api/checkpoint';
import { useSaveContext } from '../utils/context/saveManager';

export default function BigDaddyProject({ projectId }) {
  const [save, setSave] = useState(0);
  const [checkpoints, setCheckpoints] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [min, setMin] = useState(0);
  const [saveColor, setSaveColor] = useState(0);
  const [minColor, setMinColor] = useState(0);
  const [reOrdered, setReOrdered] = useState(0);
  const [init, setInit] = useState(true);
  const { addToSaveManager, saveInput } = useSaveContext();

  const saveAll = () => { // trigger save all
    setSave((prevVal) => prevVal + 1);
    const copy = [...saveInput.checkpoints];
    const ordered = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(ordered);
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
    if (init) { // grab from server
      console.log('grabbing checkpoints from server');
      getCheckpointsOfProject(projectId).then((data) => {
        const indexedData = data.map((item, index) => (
          {
            ...item,
            index,
          }
        ));
        checkpoints.forEach((item) => addToSaveManager(item));
        setCheckpoints(indexedData);
        setInit((preVal) => !preVal);
      });
    }
    if (!init) { // grab from client
      console.log('grabbing checkpoints from save manager:', saveInput.checkpoints);
      const sortedArr = saveInput.checkpoints.sort((a, b) => a.index - b.index);
      setCheckpoints(sortedArr);
    }
  }, [projectId, refresh]);

  const handleRefresh = () => {
    setRefresh((prevVal) => prevVal + 1);
  };

  const addCheckpoint = () => {
    const emptyChckP = {
      projectId,
      localId: uniqid(),
      leadId: '',
      name: '',
      startDate: '',
      deadline: '',
      description: '',
      index: checkpoints.length,
      expanded: false,
      fresh: true,
      checkpointId: null,
      dragId: uniqid(),
      tasks: false,
      type: 'checkpoint',
    };
    addToSaveManager(emptyChckP, 'create');
    handleRefresh();
  };

  const handleDragStart = () => {
    saveAll();
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    console.log('source', source.index);
    console.log('desination', destination.index);
    const reorderedChecks = [...checkpoints];
    const [reorderedCheckp] = reorderedChecks.splice(source.index, 1);
    reorderedChecks.splice(destination.index, 0, reorderedCheckp);

    // setCheckpoints(reorderedChecks);
    for (let i = 0; i < reorderedChecks.length; i++) {
      reorderedChecks[i].index = i;
      console.log(reorderedChecks[i]);
      addToSaveManager(reorderedChecks[i], 'update');
    }
    console.table(reorderedChecks);
    saveAll();
  };

  // const handleDragEnd = (result) => {
  //   const { destination, source, draggableId } = result;
  //   if (!destination) {
  //     return;
  //   }
  //   const reorderedCheckPs = [...checkpoints];
  //   const [removedCheckP] = reorderedCheckPs.splice(source.index, 1);
  //   reorderedCheckPs.splice(destination.index, 0, removedCheckP);
  //   const reOrderedFin = reorderedCheckPs.map((item, index) => (
  //     {
  //       ...item, index,
  //     }
  //   ));
  //   setCheckpoints(reOrderedFin);
  //   for (let i = 0; i < reOrderedFin.length; i++) {
  //     // if (reOrderedFin[i].localId === 'lspoinpe') {
  //     //   console.log(reOrderedFin[i].index);
  //     // }
  //     console.table(reOrderedFin);
  //     // addToSaveManager(reOrderedFin[i]);
  //   }
  //   setReOrdered((prevVal) => prevVal + 1);
  // };

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
            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <Droppable droppableId="checkPDrop">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {checkpoints.map((checkP, index) => (
                      <Checkpoint
                        key={checkP.checkpointId ? checkP.checkpointId : checkP.dragId}
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
