import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ViewAllCollabs from '../../components/views/ViewAllCollabs';
import ViewProjCollabs from '../../components/views/ViewProjCollabs';
import ViewTaskCollabs from '../../components/views/ViewTaskCollabs';
import { useSaveContext } from '../../utils/context/saveManager';
import { rightArrowWhite } from '../../public/icons';
import AddCollabForm2 from '../../components/modals/AddCollabForm2';
import { useCollabContext } from '../../utils/context/collabContext';
import InvitesModal from '../../components/modals/InvitesModal';
import useSaveStore from '../../utils/stores/saveStore';

export default function ManageCollaboratorsPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [refreshAllCs, setRefreshAllCs] = useState(0);
  const [refreshProjCs, setRefreshProjCs] = useState(0);
  const [projectToAssign, setProjectToAssign] = useState('');
  const [taskToAssign, setTaskToAssign] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [openInvitesModal, setOpenInvitesModal] = useState(false);
  const { updateCollaborator, setUpdateCollab, updateSearchInput } = useCollabContext();
  const allProjects = useSaveStore((state) => state.allProjects);
  const sendToServer = useSaveStore((state) => state.sendToServer);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);
  const loadASingleProject = useSaveStore((state) => state.loadASingleProject);

  useEffect(() => {
    sendToServer();
  }, []);

  useEffect(() => {
    if (!singleProjectRunning && projectsLoaded) {
      loadASingleProject(projectId);
    }
  }, [projectsLoaded, allProjects]);

  useEffect(() => {
    if (updateCollaborator) {
      setModalShow((preVal) => true);
    }
  }, [updateCollaborator]);

  const refreshAllColabs = () => {
    setRefreshAllCs((prevVal) => prevVal + 1);
  };

  const refreshProjCollabs = () => {
    setRefreshProjCs((prevVal) => prevVal + 1);
  };

  const setProjectToAssignChild = (value) => {
    setProjectToAssign((preVal) => value);
  };

  const setTaskToAssignChild = (value) => {
    setTaskToAssign((preVal) => value);
  };

  const handleClose = () => {
    setUpdateCollab(null);
    setModalShow((preVal) => false);
  };

  const handleCloseInvites = () => {
    setOpenInvitesModal((preVal) => false);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    updateSearchInput(value);
  };

  return (
    <>
      <InvitesModal show={openInvitesModal} closeModal={handleCloseInvites} />
      <div id="project-top-bar" style={{ marginBottom: '1%' }}>
        <button
          id="saveButton"
          type="button"
          className="clearButton"
          style={{ color: 'rgb(200, 200, 200)' }}
          onClick={() => {
            router.push(`/project/plan/${projectId}`);
          }}
        >
          Back to Project
        </button>
        <button
          id="showModal"
          type="button"
          className="clearButton"
          style={{ color: 'rgb(200, 200, 200)' }}
          onClick={() => setModalShow(true)}
        >
          Add A Collaborator
        </button>
        <button
          id="showModal"
          type="button"
          className="clearButton"
          style={{ color: 'rgb(200, 200, 200)' }}
          onClick={() => setOpenInvitesModal(true)}
        >
          View Invites
        </button>
        <div
          id="inputControl"
          style={{
            flex: '1', marginBottom: '8px',
          }}
        >
          <input
            className="form-control"
            id="collaborator-search-input"
            placeholder="Search collaborators..."
            onChange={handleSearch}
            style={{
              border: '3.5px solid rgb(16, 197, 234)',
              backgroundColor: 'rgb(225, 225, 225)',
            }}
          />
        </div>
      </div>
      <AddCollabForm2
        show={modalShow}
        handleClose={handleClose}
        onHide={() => setModalShow((preVal) => false)}
      />
      <div
        id="row1"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '3%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(180, 180, 180, .4)',
        }}
      >
        <ViewAllCollabs
          refreshAllColabs={refreshAllColabs}
          refreshProjCollabs={refreshProjCollabs}
          refreshAllCs={refreshAllCs}
          projectId={projectId}
          projectToAssign={projectToAssign}
        />
      </div>
      <div
        id="twoTableRow"
        style={{
          padding: '1% 0%',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1%',
        }}
      >
        <ViewProjCollabs
          projectId={projectId}
          refreshProjCollabs={refreshProjCollabs}
          refreshProjCs={refreshProjCs}
          setProjectToAssignChild={setProjectToAssignChild}
          taskToAssign={taskToAssign}
          projectToAssign={projectToAssign}
        />
        <div className="verticalCenter">
          {rightArrowWhite}
        </div>
        <ViewTaskCollabs
          projectId={projectId}
          refreshProjCollabs={refreshProjCollabs}
          refreshProjCs={refreshProjCs}
          projectToAssign={projectToAssign}
          setTaskToAssignChild={setTaskToAssignChild}
        />
      </div>
    </>
  );
}
