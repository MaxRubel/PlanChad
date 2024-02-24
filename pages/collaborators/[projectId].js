import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AddCollabForm from '../../components/AddCollabForm';
import ViewAllCollabs from '../../components/ViewAllCollabs';
import { rightArrow } from '../../public/icons';
import ViewProjCollabs from '../../components/ViewProjCollabs';
import { fetchProjectCollabs } from '../../utils/fetchAll';
import { useCollabContext } from '../../utils/context/collabContext';
import { getCollabsOfUser } from '../../api/collabs';
import { useAuth } from '../../utils/context/authContext';
import ViewTaskCollabs from '../../components/ViewTaskCollabs';

export default function ManageCollaboratorsPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [refreshAllCs, setRefreshAllCs] = useState(0);
  const [refreshProjCs, setRefreshProjCs] = useState(0);
  const { user } = useAuth();
  const [projectToAssign, setProjectToAssign] = useState('');

  const refreshAllColabs = () => {
    setRefreshAllCs((prevVal) => prevVal + 1);
  };

  const refreshProjCollabs = () => {
    setRefreshProjCs((prevVal) => prevVal + 1);
  };

  const setProjectToAssignChild = (value) => {
    setProjectToAssign((preVal) => value);
    console.log(value);
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
      </div>

      <AddCollabForm refreshAllColabs={refreshAllColabs} />
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
        style={{ display: 'flex', justifyContent: 'center', gap: '3%' }}
      >
        <ViewProjCollabs
          projectId={projectId}
          refreshProjCollabs={refreshProjCollabs}
          refreshProjCs={refreshProjCs}
          setProjectToAssignChild={setProjectToAssignChild}
        />
        <ViewTaskCollabs
          projectId={projectId}
          refreshProjCollabs={refreshProjCollabs}
          refreshProjCs={refreshProjCs}
        />
      </div>

    </>
  );
}
