/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
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
  const [minColor, setMinColor] = useState(0);
  const [init, setInit] = useState(true);
  const {
    addToSaveManager, saveInput, hasMemory, sendToServer, serverRefresh,
  } = useSaveContext();
  const isInitialRender = useRef(true);

  const saveAll = () => { // send all to save manager
    setSave((prevVal) => prevVal + 1);
    const copy = [...saveInput.checkpoints];
    const ordered = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(ordered);
  };

  const handleRefresh = () => { // retreive from save manager
    setRefresh((prevVal) => prevVal + 1);
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      getCheckpointsOfProject(projectId).then((data) => {
        for (let i = 0; i < data.length; i++) {
          addToSaveManager(data[i], 'create', 'checkpoint');
        }
        handleRefresh();
      });
    }
  }, [serverRefresh]);

  useEffect(() => { // first mount...
    if (init) { // initializing...
      console.log('initializing...');
      if (hasMemory) { // hydrating from memory...
        console.log('hydrating from memory...');
        setInit((preVal) => !preVal);
        handleRefresh();
      } else { // hydrating from server...
        console.log('hydrating from server...');
        getCheckpointsOfProject(projectId).then((data) => {
          for (let i = 0; i < data.length; i++) {
            addToSaveManager(data[i], 'create', 'checkpoint');
          }
          setInit((preVal) => !preVal);
          handleRefresh();
        });
      }
    }
    if (!init) { // syncing with save manager...
      console.log('retreiving checkpoints from save manager');
      const sortedArr = saveInput.checkpoints.sort((a, b) => a.index - b.index);
      setCheckpoints(sortedArr);
    }
  }, [refresh]);

  // const saveSuccess = () => { // trigger save all animation
  //   setSaveColor((prevVal) => prevVal + 1);
  // };

  // useEffect(() => { // save animation
  //   let saveColorChange;
  //   if (saveColor > 0) {
  //     document.getElementById('saveButton').style.color = 'rgb(16, 197, 234)';
  //     saveColorChange = setTimeout(() => {
  //       document.getElementById('saveButton').style.color = 'rgb(200, 200, 200)';
  //     }, 1500);
  //   }
  //   return () => {
  //     clearTimeout(saveColorChange);
  //   };
  // }, [saveColor]);

  useEffect(() => { // minimize button color animation
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

  // useEffect(() => () => {
  //   sendToServer();
  //   clearSaveManager();
  // }, []);

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
    };
    addToSaveManager(emptyChckP, 'create', 'checkpoint');
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
    const reorderedChecks = [...checkpoints];
    const [reorderedCheckp] = reorderedChecks.splice(source.index, 1);
    reorderedChecks.splice(destination.index, 0, reorderedCheckp);

    for (let i = 0; i < reorderedChecks.length; i++) { // add new array to save manager
      reorderedChecks[i].index = i;
      addToSaveManager(reorderedChecks[i], 'update', 'checkpoint');
    }
    saveAll();
  };

  const doTheBigSave = () => {
    sendToServer();
    // clearSaveManager();
    // setInit(true);
    // handleRefresh();
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
              onClick={doTheBigSave}>
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
            // saveSuccess={saveSuccess}
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
                        key={checkP.localId}
                        checkP={checkP}
                        handleRefresh={handleRefresh}
                        save={save}
                        // saveSuccess={saveSuccess}
                        saveAll={saveAll}
                        minAll={minAll}
                        min={min}
                        index={index}
                        refresh={refresh}
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
