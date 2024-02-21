/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
import {
  useState, useEffect, useRef, useLayoutEffect,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Button } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import uniqid from 'uniqid';
import Router, { useRouter } from 'next/router';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { useSaveContext } from '../utils/context/saveManager';
import fetchAll2 from '../utils/fetchAll';

export default function BigDaddyProject({ projectId }) {
  const [project, setProject] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [save, setSave] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [minColor, setMinColor] = useState(0);
  const [isLoading, setIsloading] = useState(true);
  const {
    addToSaveManager,
    saveInput,
    sendToServer,
    clearSaveManager,
    min,
    minAll,
  } = useSaveContext();
  const router = useRouter();

  const saveIndexes = () => { // send all to save manager
    setSave((prevVal) => prevVal + 1);
    const copy = [...saveInput.checkpoints];
    const ordered = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(ordered);
  };

  const handleRefresh = () => { // retreive from save manager
    setRefresh((prevVal) => prevVal + 1);
  };

  useEffect(() => { // refresh checkpoint from save manager
    if (!isLoading) {
      const copy = [...saveInput.checkpoints];
      const sortedArr = copy.sort((a, b) => a.index - b.index);
      setCheckpoints(sortedArr);
    }
  }, [refresh]);

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

  useEffect(() => {
    clearSaveManager();
    setIsloading(true);
    fetchAll2(projectId).then((data) => {
      setProject(data.project);
      const sortedCheckpoints = data.checkpoints.sort((a, b) => a.index - b.index);
      data.checkpoints.forEach((checkP) => { // add all the tasks to save manager
        addToSaveManager(checkP.tasks, 'create', 'tasksArr');
      });
      addToSaveManager(data.project, '', 'project'); // add project data
      addToSaveManager(data.checkpoints, 'create', 'checkpointsArr'); // add to save manager
      setCheckpoints(sortedCheckpoints);
      setIsloading(false);
    });
  }, []);

  // (-------for testing purposes----)
  const tryFetch = (projId) => {
    setIsloading(true);
    clearSaveManager();
    fetchAll2(projId).then((data) => {
      setProject(data.project);
      const sortedCheckpoints = data.checkpoints.sort((a, b) => a.index - b.index);
      data.checkpoints.forEach((checkP) => { // add all the tasks to save manager
        addToSaveManager(checkP.tasks, 'create', 'tasksArr');
      });
      addToSaveManager(data.project, '', 'project'); // add project data
      addToSaveManager(data.checkpoints, 'create', 'checkpointsArr'); // add to save manager
      setCheckpoints(sortedCheckpoints);
      setIsloading(false);
    });
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
      tasks: '[]',
    };
    addToSaveManager(emptyChckP, 'create', 'checkpoint');
    handleRefresh();
    saveIndexes();
  };

  const handleDragStart = () => {
    saveIndexes();
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
    setCheckpoints(reorderedChecks);
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
              onClick={sendToServer}>
              SAVE
            </button>
            <button
              id="minButton"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={minAll}>
              MINIMIZE All
            </button>
            <button
              id="minButton"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { router.push(`/collaborators/${projectId}`); }}>
              MANAGE COLLABORATORS
            </button>
            <button
              id="minButton"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { tryFetch(projectId); }}>
              RESTART
            </button>
          </div>
          <ProjectCard
            save={save}
            min={min}
            minAll={minAll}
            project={project}
          />
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
              onClick={() => { addCheckpoint(); }}
              style={{
                margin: '1% 0%',
                color: 'rgb(200, 200, 200)',
                border: '1px solid rgb(100, 100, 100)',
              }}>
              Add A Checkpoint
            </Button>
          </div>
          <div id="dnd-container">
            <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <Droppable droppableId="checkPDrop">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {checkpoints.map((checkP, index) => (
                      <Checkpoint
                        key={checkP.localId}
                        checkP={checkP}
                        handleRefresh={handleRefresh}
                        save={save}
                        // saveIndexes={saveIndexes}
                        minAll={minAll}
                        min={min}
                        index={index}
                        refresh={refresh}
                        isLoading={isLoading}
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
