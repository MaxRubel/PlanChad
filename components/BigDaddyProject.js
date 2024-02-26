/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import uniqid from 'uniqid';
import { useRouter } from 'next/router';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { useSaveContext } from '../utils/context/saveManager';
import AddAsigneeModal from './AddAsigneeModal';

export default function BigDaddyProject({ projectId }) {
  const [project, setProject] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [save, setSave] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [minColor, setMinColor] = useState(0);
  const [isLoading, setIsloading] = useState(true);
  const [progressIsShowing, setProgressIsShowing] = useState(false);

  const {
    addToSaveManager,
    saveInput,
    sendToServer,
    min,
    minAll,
    loadProject,
    projectsLoaded,
    singleProjectRunning,
    isSaving,
  } = useSaveContext();

  const router = useRouter();

  useEffect(() => { // refresh checkpoint from save manager
    // console.log('refreshing...');
    const copy = [...saveInput.checkpoints];
    const sortedArr = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(sortedArr);
  }, [refresh]);

  useEffect(() => { // on Mount
    if (projectId && projectsLoaded) {
      if (!singleProjectRunning) {
        const projectDetails = loadProject(projectId);
        setProject((preVal) => projectDetails.project);
        setCheckpoints((preVal) => projectDetails.checkpoints);
      } else {
        setProject((preVal) => saveInput.project);
        setCheckpoints((preVal) => saveInput.checkpoints);
      }
    }
  }, [projectId, projectsLoaded]);

  const saveIndexes = () => { // send all to save manager
    setSave((prevVal) => prevVal + 1);
    const copy = [...saveInput.checkpoints];
    const ordered = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(ordered);
  };

  const tellProjectIfProgressShowing = (value) => {
    setProgressIsShowing((preVal) => value);
  };

  const handleRefresh = () => { // retreive from save manager
    setRefresh((prevVal) => prevVal + 1);
  };

  useEffect(() => {
    let minColorChange;
    const minButton = document.getElementById('minButton');
    if (min > 0 && minButton) {
      console.log('fire min');
      minButton.style.color = 'rgb(16, 197, 234)';
      minColorChange = setTimeout(() => {
        minButton.style.color = 'rgb(200, 200, 200)';
      }, 1000);
    }
    return () => {
      if (minColorChange) {
        clearTimeout(minColorChange);
      }
    };
  }, [min]);

  useEffect(() => { // minimize button color animation
    let saveColorChange;
    if (isSaving) {
      const saveButton = document.getElementById('saveButton');
      saveButton.style.color = 'rgb(16, 197, 234)';
      saveColorChange = setTimeout(() => {
        saveButton.style.color = 'rgb(200, 200, 200)';
      }, 1000);
    }
  }, [isSaving]);

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
      <AddAsigneeModal />
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
              onClick={() => { setProgressIsShowing((preVal) => !preVal); }}>
              {progressIsShowing ? 'HIDE PROGRESS' : 'SHOW PROGRESS'}
            </button>
          </div>
          <ProjectCard
            save={save}
            min={min}
            minAll={minAll}
            project={project}
            progressIsShowing={progressIsShowing}
            tellProjectIfProgressShowing={tellProjectIfProgressShowing}
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

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { addCheckpoint(); }}
              style={{
                margin: '1% 0%',
                color: 'rgb(200, 200, 200)',
                border: '1px solid rgb(100, 100, 100)',
              }}>
              Add A Checkpoint
            </button>
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
                        minAll={minAll}
                        min={min}
                        index={index}
                        refresh={refresh}
                        isLoading={isLoading}
                        progressIsShowing={progressIsShowing}
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
