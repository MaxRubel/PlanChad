import { useState, useEffect, useCallback } from 'react';
import uniqid from 'uniqid';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import { Reorder, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import ProjectCard from './ProjectCard';
import Checkpoint from './Checkpoint';
import { getInvitesByProject, updateInvite } from '../api/invites';
import { useAuth } from '../utils/context/authContext';
import useSaveStore from '../utils/stores/saveStore';
import useAnimationStore from '../utils/stores/animationsStore';
import useSaveButtonColorAnimation from '../utils/hooks/useSaveButtonAnimation';
import { binoculars, chatIcon, saveIcon } from '../public/icons2';
import { calendarIcon, peopleIcon } from '../public/icons';
import { getTaskCollabsOfProject } from '../api/taskCollab';
import { getSingleCollab } from '../api/collabs';

export default function MainProjectView({ projectId }) {
  const [project, setProject] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();
  const { user } = useAuth();
  const storedCheckpoints = useSaveStore((state) => state.checkpoints);
  const storedProject = useSaveStore((state) => state.project);
  const invitesOfProject = useSaveStore((state) => state.invitesOfProject);
  const updateInviteZus = useSaveStore((state) => state.updateInvite);
  const createNewCheckpoint = useSaveStore((state) => state.createNewCheckpoint);
  const saveNewArray = useSaveStore((state) => state.loadCheckpoints);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);
  const sendToServer = useSaveStore((state) => state.sendToServer);
  const pauseReorder = useAnimationStore((state) => state.pauseReorder);
  const reorderPaused = useAnimationStore((state) => state.reorderPaused);
  const minimizeAll = useAnimationStore((state) => state.minimizeAll);
  const minAll = useAnimationStore((state) => state.minAll);
  const hideCompletedTasks = useAnimationStore((state) => state.hideCompletedTasks);
  const hideCompletedTasksProjectData = useSaveStore((state) => state.hideCompletedTasksProjectData);
  const loadASingleProject = useSaveStore((state) => state.loadASingleProject);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);
  const updateInvitesOfProjectBatch = useSaveStore((state) => state.updateInvitesOfProjectBatch);
  const showProgress = useAnimationStore((state) => state.showProgress);
  const checkpointsAreBeingDragged = useAnimationStore((state) => state.checkpointsAreBeingDragged);
  const checkpointsAreNotBeingDragged = useAnimationStore((state) => state.checkpointsAreNotBeingDragged);
  const updateTaskCollaboratorsBatch = useSaveStore((state) => state.updateTaskCollaboratorsBatch);
  const updateTaskCollaboratorJoinsBatch = useSaveStore((state) => state.updateTaskCollaboratorJoinsBatch);
  const [isSaving, setIsSaving] = useState(0);

  useEffect(() => {
    pauseReorder();
    if (projectId && projectsLoaded) {
      if (!singleProjectRunning) {
        loadASingleProject(projectId);
      } else {
        setProject(storedProject);
        pauseReorder();
        setCheckpoints((preVal) => storedCheckpoints);
      }
      getInvitesByProject(projectId).then((projectInvites) => {
        updateInvitesOfProjectBatch(projectInvites);
      });
      getTaskCollabsOfProject(projectId).then((taskCollabJoins) => {
        const promiseArray = taskCollabJoins.map((item) => getSingleCollab(item.collabId));
        Promise.all(promiseArray).then((data) => {
          updateTaskCollaboratorJoinsBatch(taskCollabJoins);
          updateTaskCollaboratorsBatch(data);
        });
      });
    }
  }, [projectId, projectsLoaded, singleProjectRunning]);

  useEffect(() => {
    pauseReorder();
    setCheckpoints(storedCheckpoints);
  }, [refresh]);

  useEffect(() => {
    const thisInvitee = invitesOfProject?.find((item) => item.email === user.email);
    if (thisInvitee?.status === 'Pending') {
      const payload = {
        ...thisInvitee,
        status: 'Joined',
      };
      updateInvite(payload).then(() => {
        updateInviteZus(payload);
      });
    }
  }, [invitesOfProject]);

  const handleRefresh = useCallback(() => {
    setRefresh((prevVal) => prevVal + 1);
  }, []);

  useSaveButtonColorAnimation(isSaving);

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
    createNewCheckpoint(emptyChckP);
    handleRefresh();
  };

  const handleDragStart = (e) => {
    setCheckpoints(storedCheckpoints);
    checkpointsAreBeingDragged();
  };

  const handleDragEnd = (e) => {
    checkpointsAreNotBeingDragged();
    saveNewArray(checkpoints);
  };

  const reOrderCheckPoints = (e) => {
    const reordered = e.map((item, index) => ({ ...item, index }));
    setCheckpoints(reordered);
  };

  const handleChange = (e) => {
    if (e === 'minAll') {
      pauseReorder();
      minimizeAll();
    }
    if (e === 'showProgress') {
      showProgress();
    }
    if (e === 'hideCompleted') {
      pauseReorder();
      hideCompletedTasks();
      hideCompletedTasksProjectData();
    }
  };

  const saveAnimation = () => {
    setIsSaving((preVal) => preVal + 1);
  };

  return (
    <>
      <div className="bigDad">
        <div id="project-container">
          <div id="project-top-bar" style={{ marginBottom: '10px' }}>
            <button
              id="saveButton"
              type="button"
              className="clearButtonNoHover"
              onClick={() => {
                sendToServer();
                saveAnimation();
              }}
            >
              {saveIcon} &nbsp; Save
            </button>
            <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              onClick={() => { router.push(`/calendar/view/${projectId}`); }}
            >
              {calendarIcon} &nbsp;Calendar
            </button>
            <button
              id="manageCollaborators"
              type="button"
              className="clearButton"
              onClick={() => { router.push(`/collaborators/${projectId}`); }}
            >
              {peopleIcon} &nbsp;Collaborators
            </button>
            <button
              id="saveButton"
              type="button"
              className="clearButton"
              onClick={() => {
                sendToServer();
                router.push(`/chat/${projectId}`);
              }}
            >
              {chatIcon} &nbsp;Chat
            </button>
            <Dropdown
              className="clearButton"
              id="yo"
              style={{ display: 'flex', flexWrap: 'c' }}
              onSelect={handleChange}
            >
              <Dropdown.Toggle
                id="dropdown-view-options fullCenter"
              >
                {binoculars}&nbsp; View
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="dropdown-menu"
              >
                <Dropdown.Item eventKey="minAll" style={{ color: 'white' }}>Minimize All</Dropdown.Item>
                <Dropdown.Item eventKey="showProgress" style={{ color: 'white' }}>{storedProject.progressIsShowing ? 'Hide Progress' : 'Show Progress'}</Dropdown.Item>
                <Dropdown.Item eventKey="hideCompleted" style={{ color: 'white' }}>{storedProject.hideCompletedTasks ? 'Show Completed Tasks' : 'Hide Completed Tasks'}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div id="projectCard-container" className="fullCenter">
            <ProjectCard
              project={project}
              progressIsShowing={storedProject.progressIsShowing}
            />
          </div>
          <div className="add-checkpt-button-row">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { addCheckpoint(); }}
              style={{
                maxWidth: '200px',
                color: 'white',
                border: '1px solid rgb(100, 100, 100)',
              }}
            >
              Add A Phase
            </button>
            <div />
            <div className="verticalCenter" style={{ justifyContent: 'right', color: 'lightgrey', fontSize: '12px' }}>{storedProject?.hideCompletedTasks && '(Completed Tasks are Hidden)'}</div>
          </div>
          <div id="dnd-container">
            <Reorder.Group
              as="div"
              axis="y"
              values={checkpoints}
              onReorder={reOrderCheckPoints}
              positiontransition="true"
              key="checkpointsReorder"
              animate={false}
            >
              <div className="flexColumn">
                {checkpoints.map((checkP, index) => (
                  <Reorder.Item
                    as={motion.div}
                    key={checkP.localId}
                    value={checkP}
                    style={{ cursor: 'grab' }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    layoutId={null}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: reorderPaused ? 0 : 0.2 }}
                  >
                    <Checkpoint
                      key={checkP.localId}
                      checkP={checkP}
                      handleRefresh={handleRefresh}
                      minAll={minAll}
                      index={index}
                      refresh={refresh}
                      progressIsShowing={storedProject.progressIsShowing}
                      layoutId={null}
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
