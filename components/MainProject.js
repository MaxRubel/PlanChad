import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { useSaveContext } from '../utils/context/saveManager';
import DeleteProjectModal from './modals/DeleteProject';
import { useCollabContext } from '../utils/context/collabContext';
import ShareLinkModal from './modals/ShareLinkModal';
import { deleteAllInvitesOfProject, updateInvite } from '../api/invites';
import { useAuth } from '../utils/context/authContext';

export default function MainProjectView({ projectId }) {
  const [project, setProject] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [progressIsShowing, setProgressIsShowing] = useState(false);
  const [hideCompletedTasksChild, setHideCompletedTasksChild] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [animationPaused, setAnimationPaused] = useState(true);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);

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

  const { deleteAllProjCollabs } = useCollabContext();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  let timeout;

  const pauseAnimation = () => {
    setAnimationPaused(((preVal) => true));
    timeout = setTimeout(() => { setAnimationPaused(((preVal) => false)); }, 500);
  };

  useEffect(() => {
    pauseAnimation();
    const copy = [...saveInput.checkpoints];
    const sortedArr = copy.sort((a, b) => a.index - b.index);
    setCheckpoints(sortedArr);
  }, [refresh]);

  useEffect(() => {
    const invitesToCheck = [...saveInput.invites];
    const thisInvitee = invitesToCheck.find((item) => item.email === user.email);
    if (thisInvitee?.status === 'Pending') {
      const payload = {
        ...thisInvitee,
        status: 'Joined',
      };
      updateInvite(payload).then(() => {
        addToSaveManager(payload, 'update', 'invite');
      });
    }
  }, [saveInput.invites]);

  useEffect(() => {
    pauseAnimation();
    if (projectId && projectsLoaded) {
      cancelSaveAnimation();
      if (!singleProjectRunning) {
        const projectDetails = loadProject(projectId); // LOAD PROJECT
        setProject((preVal) => projectDetails.project);
        if (projectDetails?.project?.projectId) {
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
    return () => { clearTimeout(timeout); };
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
      lineColor: randomColor(),
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
      pauseAnimation();
      hideCompletedTasks();
      setHideCompletedTasksChild((preVal) => !preVal);
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };
  return (
    <>
      <ShareLinkModal show={shareLinkModalOpen} />
      <DeleteProjectModal
        handleDelete={() => {
          deleteAllProjCollabs(project.projectId);
          deleteAllInvitesOfProject(project.projectId);
          theBigDelete(project.projectId);
        }}
        closeModal={handleCloseModal}
        show={openDeleteModal}
      />
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
            {/* <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              style={{ color: 'rgb(200, 200, 200)' }}
              onClick={() => { setShareLinkModalOpen(true); }}
            >
              Share Link
            </button> */}
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
              padding: '1% 0%',
              display: 'grid',
              gridTemplateColumns: '30% 27.5% 42.5%',
            }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { addCheckpoint(); }}
              style={{
                maxWidth: '200px',
                margin: '1% 0%',
                color: 'rgb(200, 200, 200)',
                border: '1px solid rgb(100, 100, 100)',
              }}
            >
              Add A Phase
            </button>
            <div />
            <div className="verticalCenter" style={{ justifyContent: 'right', color: 'lightgrey', fontSize: '12px' }}>{saveInput?.project?.hideCompletedTasks && '(Completed Tasks are Hidden)'}</div>
          </div>
          <div id="dnd-container">
            <AnimatePresence initial={false}>
              <motion.div>
                <Reorder.Group
                  as="div"
                  axis="y"
                  values={checkpoints}
                  onReorder={reOrderCheckPoints}
                  positiontransition="true"
                  key="checkpointsReorder"
                  animate={false}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {checkpoints.map((checkP, index) => (
                      <Reorder.Item
                        as={motion.div}
                        key={checkP.localId}
                        value={checkP}
                        style={{ cursor: 'grab' }}
                        onDragStart={handleDragStart}
                        layoutId={null}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        transition={{ duration: animationPaused ? 0 : 0.4 }}
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
                          layoutId={null}
                        />
                      </Reorder.Item>
                    ))}
                  </div>
                </Reorder.Group>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

MainProjectView.propTypes = {
  projectId: PropTypes.string.isRequired,
};
