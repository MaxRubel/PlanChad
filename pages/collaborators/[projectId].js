import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ViewAllCollabs from '../../components/views/ViewAllCollabs';
import ViewProjCollabs from '../../components/views/ViewProjCollabs';
import ViewTaskCollabs from '../../components/views/ViewTaskCollabs';
import { rightArrowWhite } from '../../public/icons';
import AddCollabForm2 from '../../components/modals/AddCollabForm2';
import { useCollabContext } from '../../utils/context/collabContext';
import InvitesModal from '../../components/modals/InvitesModal';
import useSaveStore from '../../utils/stores/saveStore';
import { getInvitesByProject } from '../../api/invites';
import { addPersonMed, envelopeIcon, shortBack } from '../../public/icons2';

export default function ManageCollaboratorsPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [refreshAllCs, setRefreshAllCs] = useState(0);
  const [refreshProjCs, setRefreshProjCs] = useState(0);
  const [projectToAssign, setProjectToAssign] = useState('');
  const [taskToAssign, setTaskToAssign] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [openInvitesModal, setOpenInvitesModal] = useState(false);
  const {
    updateCollaborator,
    setUpdateCollab,
    updateSearchInput,
    loadProjectCollabs,
  } = useCollabContext();
  const allProjects = useSaveStore((state) => state.allProjects);
  const sendToServer = useSaveStore((state) => state.sendToServer);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);
  const loadASingleProject = useSaveStore((state) => state.loadASingleProject);
  const updateInvitesOfProjectBatch = useSaveStore((state) => state.updateInvitesOfProjectBatch);

  useEffect(() => {
    sendToServer();
  }, [projectId]);

  useEffect(() => {
    if (!singleProjectRunning && projectsLoaded) {
      loadASingleProject(projectId);
      loadProjectCollabs(projectId);
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
    getInvitesByProject(value).then((data) => {
      updateInvitesOfProjectBatch(data);
    });
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
      <InvitesModal projectId={projectToAssign} show={openInvitesModal} closeModal={handleCloseInvites} />
      <div id="project-top-bar" style={{ marginBottom: '1%' }}>
        <button
          id="saveButton"
          type="button"
          className="clearButton"
          onClick={() => {
            router.push(`/project/plan/${projectId}`);
          }}
        >
          {shortBack} Back to Project
        </button>
        <button
          id="showModal"
          type="button"
          className="clearButton"
          onClick={() => setModalShow(true)}
        >
          {addPersonMed}&nbsp; Add A Collaborator
        </button>
        <button
          id="showModal"
          type="button"
          className="clearButton"
          onClick={() => setOpenInvitesModal(true)}
        >
          {envelopeIcon}&nbsp; View Invites
        </button>
        <div
          id="inputControl"
          style={{ flex: '1', marginBottom: '8px' }}
        >
          <input
            className="form-control collabsSearch "
            id="collaborator-search-input"
            placeholder="Search collaborators..."
            style={{ backgroundColor: 'rgb(225, 225, 225)' }}
            onChange={handleSearch}
          />
        </div>
      </div>
      <AddCollabForm2
        show={modalShow}
        handleClose={handleClose}
        onHide={() => setModalShow((preVal) => false)}
      />
      <div className="container">
        <div className="row">
          <div className="col mb-2">
            <ViewAllCollabs
              refreshAllColabs={refreshAllColabs}
              refreshProjCollabs={refreshProjCollabs}
              refreshAllCs={refreshAllCs}
              projectId={projectId}
              projectToAssign={projectToAssign}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-2">
            <ViewProjCollabs
              projectId={projectId}
              refreshProjCollabs={refreshProjCollabs}
              refreshProjCs={refreshProjCs}
              setProjectToAssignChild={setProjectToAssignChild}
              taskToAssign={taskToAssign}
              projectToAssign={projectToAssign}
            />
          </div>
          {/* <div className="col-lg-2 col-md-1 mb-2 fullCenter">
            <div className="fullCenter">
              {rightArrowWhite}
            </div>
          </div> */}
          <div className="col-lg-6 col-md-12 mb-4">
            <ViewTaskCollabs
              projectId={projectId}
              refreshProjCollabs={refreshProjCollabs}
              refreshProjCs={refreshProjCs}
              projectToAssign={projectToAssign}
              setTaskToAssignChild={setTaskToAssignChild}
            />
          </div>
        </div>
      </div>
    </>
  );
}
