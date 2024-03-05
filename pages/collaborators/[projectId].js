import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ViewAllCollabs from '../../components/ViewAllCollabs';
import ViewProjCollabs from '../../components/ViewProjCollabs';
import ViewTaskCollabs from '../../components/ViewTaskCollabs';
import { useSaveContext } from '../../utils/context/saveManager';
import { rightArrowWhite } from '../../public/icons';
import AddCollabForm2 from '../../components/AddCollabForm2';

export default function ManageCollaboratorsPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [refreshAllCs, setRefreshAllCs] = useState(0);
  const [refreshProjCs, setRefreshProjCs] = useState(0);
  const [projectToAssign, setProjectToAssign] = useState('');
  const [taskToAssign, setTaskToAssign] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const { sendToServer } = useSaveContext();

  useEffect(() => {
    sendToServer();
  }, []);

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

  return (
    <>
      <div id="project-top-bar" style={{ marginBottom: '3%' }}>
        <button
          id="saveButton"
          type="button"
          className="clearButton"
          style={{ color: 'rgb(200, 200, 200)' }}
          onClick={() => { router.push(`/project/plan/${projectId}`); }}
        >
          BACK TO PROJECT
        </button>
        <button
          id="saveButton"
          type="button"
          className="clearButton"
          style={{ color: 'rgb(200, 200, 200)' }}
          onClick={() => setModalShow(true)}
        >
          ADD A COLLABORATOR
        </button>
      </div>
      {/* <AddCollabForm refreshAllColabs={refreshAllColabs} /> */}
      <AddCollabForm2
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <div
        id="row1"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '3%',
          margin: '3% 0%',
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
        {/* <div className="verticalCenter">{rightArrow}</div> */}
      </div>
      <div
        id="twoTableRow"
        style={{ display: 'flex', justifyContent: 'space-between', gap: '2%' }}
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
