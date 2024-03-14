import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import { Reorder } from 'framer-motion';
import PropTypes from 'prop-types';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { useSaveContext } from '../utils/context/saveManager';
import DeleteProjectModal from './modals/DeleteProject';

export default function MainProjectView({ projectId }) {
  const [project, setProject] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [progressIsShowing, setProgressIsShowing] = useState(false);
  const [hideCompletedTasksChild, setHideCompletedTasksChild] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
    theBigDelete,
    cancelSaveAnimation,
  } = useSaveContext();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => { // refresh checkpoint from save manager
    const copy = [...saveInput.checkpoints];
    console.log(copy);
    const sortedArr = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(sortedArr);
  }, [refresh]);

  useEffect(() => { // on Mount
    if (projectId && projectsLoaded) {
      cancelSaveAnimation();
      if (!singleProjectRunning) {
        console.log(projectId);
        const projectDetails = loadProject(projectId);
        setProject((preVal) => projectDetails.project);
        if (projectDetails.project.projectId) {
          setHideCompletedTasksChild((preVal) => projectDetails?.project.hideCompletedTasks);
        }
        const checkpointsSorted = projectDetails.checkpoints.sort((a, b) => a.index - b.index);
        setCheckpoints(checkpointsSorted);
      } else {
        setProject((preVal) => saveInput.project);
        setHideCompletedTasksChild((preVal) => saveInput.project?.hideCompletedTasks);
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
    // cancelSaveAnimation();
    let saveColorChange;
    const saveButton = document.getElementById('saveButton');
    if (!isSaving) {
      saveButton.style.color = 'rgb(200, 200, 200)';
    }
    if (isSaving) {
      saveButton.style.color = 'rgb(16, 197, 234)';
      saveColorChange = setTimeout(() => {
        saveButton.style.color = 'rgb(200, 200, 200)';
      }, 1000);
    }
    return () => {
      clearTimeout(saveColorChange);
    };
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
      dragId: uniqid(),
    };
    console.log(emptyChckP);
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

  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };
  return (
    <>
      <DeleteProjectModal handleDelete={() => { theBigDelete(project.projectId); }} closeModal={handleCloseModal} show={openDeleteModal} />

      <div className="bigDad">
        <div id="project-container">
          <div id="project-top-bar" style={{ marginBottom: '1%' }}>
            <button
              id="saveButton"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={sendToServer}
            >
              Save
            </button>
            <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { router.push(`/calendar/view/${projectId}`); }}
            >
              Calendar
            </button>
            <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { router.push(`/collaborators/${projectId}`); }}
            >
              Collaborators
            </button>
            <Dropdown
              style={{ outline: 'none' }}
              onSelect={handleChange}
            >
              <Dropdown.Toggle
                style={{ backgroundColor: 'transparent', border: 'none', color: 'rgb(200, 200, 200)' }}
                id="dropdown-view-options"
              >
                View Options
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ backgroundColor: 'rgb(0,0,0, .85)', color: 'white' }}>
                <Dropdown.Item eventKey="minAll">Minimize All</Dropdown.Item>
                <Dropdown.Item eventKey="showProgress">{progressIsShowing ? 'Hide Progress' : 'Show Progress'}</Dropdown.Item>
                <Dropdown.Item eventKey="hideCompleted">{saveInput.project?.hideCompletedTasks ? 'Show Completed Tasks' : 'Hide Completed Tasks'}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { setOpenDeleteModal((preVal) => true); }}
            >
              Delete This Project
            </button>
          </div>
          <div id="projectCard-container" className="fullCenter">
            <ProjectCard
              min={min}
              minAll={minAll}
              project={project}
              progressIsShowing={progressIsShowing}
              hideCompletedTasksChild={hideCompletedTasksChild}
              tellProjectIfProgressShowing={tellProjectIfProgressShowing}
            />
          </div>
          <div
            id="add-checkpt-button"
            style={{
              paddingLeft: '0%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { addCheckpoint(); }}
              style={{
                margin: '1% 0%',
                color: 'rgb(200, 200, 200)',
                border: '1px solid rgb(100, 100, 100)',
              }}
            >
              Add A Segment
            </button>
          </div>
          <div id="dnd-container">

            <Reorder.Group
              as="div"
              axis="y"
              values={checkpoints}
              onReorder={reOrderCheckPoints}
            >
              <div>
                {checkpoints.map((checkP, index) => (
                  <Reorder.Item
                    as="div"
                    key={checkP.localId}
                    value={checkP}
                    style={{ cursor: 'grab' }}
                    onDragStart={handleDragStart}
                  >
                    <Checkpoint
                      key={checkP.localId}
                      checkP={checkP}
                      handleRefresh={handleRefresh}
                      minAll={minAll}
                      min={min}
                      index={index}
                      refresh={refresh}
                      progressIsShowing={progressIsShowing}
                      isDragging={isDragging}
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

MainProjectView.propTypes = {
  projectId: PropTypes.string.isRequired,
};
