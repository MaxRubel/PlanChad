/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import { Reorder, m } from 'framer-motion';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { useSaveContext } from '../utils/context/saveManager';

export default function BigDaddyProject({ projectId }) {
  const [project, setProject] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [save, setSave] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsloading] = useState(true);
  const [progressIsShowing, setProgressIsShowing] = useState(false);
  const [hideCompletedTasksChild, setHideCompletedTasksChild] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [checkPBeingDragged, setcheckPBeingDragged] = useState(null);

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
    hideCompletedTasks,
  } = useSaveContext();

  const router = useRouter();

  useEffect(() => { // refresh checkpoint from save manager
    const copy = [...saveInput.checkpoints];
    const sortedArr = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(sortedArr);
  }, [refresh]);

  useEffect(() => { // on Mount
    if (projectId && projectsLoaded) {
      if (!singleProjectRunning) {
        const projectDetails = loadProject(projectId);
        setProject((preVal) => projectDetails.project);
        setHideCompletedTasksChild((preVal) => projectDetails.project.hideCompletedTasks);
        const checkpointsSorted = projectDetails.checkpoints.sort((a, b) => a.index - b.index);
        setCheckpoints(checkpointsSorted);
      } else {
        setProject((preVal) => saveInput.project);
        const checkpointsSorted = saveInput.checkpoints.sort((a, b) => a.index - b.index);
        setCheckpoints((preVal) => checkpointsSorted);
      }
    }
  }, [projectId, projectsLoaded]);

  const tellProjectIfProgressShowing = (value) => {
    setProgressIsShowing((preVal) => value);
  };

  const handleRefresh = () => { // retreive from save manager
    setRefresh((prevVal) => prevVal + 1);
  };

  useEffect(() => { // minimize animation
    let minColorChange;
    const minButton = document.getElementById('minButton');
    if (min > 0 && minButton) {
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

  useEffect(() => { // save button color animation
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
  };

  const handleDragStart = () => {
    setCheckpoints(saveInput.checkpoints);
    setIsDragging((preVal) => true);
  };

  const reOrderCheckPoints = (e) => {
    const reordered = e.map((item, index) => ({ ...item, index }));
    setCheckpoints((preVal) => reordered);
    addToSaveManager(reordered, 'update', 'checkpointsArr');
  };

  const handleChange = (e) => {
    if (e === 'minAll') {
      minAll();
    }
    if (e === 'showProgress') {
      setProgressIsShowing((preVal) => !preVal);
    }
    if (e === 'hideCompleted') {
      hideCompletedTasks();
      setHideCompletedTasksChild((preVal) => !preVal);
    }
  };

  return (
    <>

      <div className="bigDad">
        <div id="project-container" style={{}}>
          <div id="project-top-bar" style={{ marginBottom: '3%' }}>
            <button
              id="saveButton"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={sendToServer}>
              SAVE
            </button>
            <Dropdown
              style={{ outline: 'none' }}
              onSelect={handleChange}
            >
              <Dropdown.Toggle
                style={{ backgroundColor: 'transparent', border: 'none', color: 'rgb(200, 200, 200)' }}
                id="dropdown-view-options"
              >
                VIEW OPTIONS
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                <Dropdown.Item eventKey="minAll">Minimize All</Dropdown.Item>
                <Dropdown.Item eventKey="showProgress">{progressIsShowing ? 'Hide Progress' : 'Show Progress'}</Dropdown.Item>
                <Dropdown.Item eventKey="hideCompleted">{saveInput.project.hideCompletedTasks ? 'Show Completed Tasks' : 'Hide Completed Tasks'}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { router.push(`/collaborators/${projectId}`); }}>
              MANAGE COLLABORATORS
            </button>
          </div>
          <ProjectCard
            save={save}
            min={min}
            minAll={minAll}
            project={project}
            progressIsShowing={progressIsShowing}
            hideCompletedTasksChild={hideCompletedTasksChild}
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
              Add A Segment
            </button>
          </div>
          <div id="dnd-container">

            <Reorder.Group
              as="div"
              axis="y"
              values={checkpoints}
              onReorder={reOrderCheckPoints}>
              <div>
                {checkpoints.map((checkP, index) => (
                  <Reorder.Item
                    as="div"
                    key={checkP.localId}
                    value={checkP}
                    style={{ cursor: 'grab' }}
                    onDragStart={handleDragStart}>
                    <Checkpoint
                      refreshTasks={refreshTasks}
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
                      isDragging={isDragging}
                      checkPBeingDragged={checkPBeingDragged}
                    />
                  </Reorder.Item>
                ))}
              </div>
            </Reorder.Group>

          </div>
        </div>
      </div>
    </>
  );
}
