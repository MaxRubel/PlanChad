import { useRouter } from 'next/router';
import { useState } from 'react';
import AddCollabForm from '../../components/AddCollabForm';
import ViewAllCollabs from '../../components/ViewAllCollabs';
import { rightArrow } from '../../public/icons';
import ViewProjCollabs from '../../components/ViewProjCollabs';

export default function ManageCollaboratorsPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [refreshAllCs, setRefreshAllCs] = useState(0);
  const [refreshProjCs, setRefreshProjCs] = useState(0);

  const refreshAllColabs = () => {
    setRefreshAllCs((prevVal) => prevVal + 1);
  };

  const refreshProjCollabs = () => {
    setRefreshProjCs((prevVal) => prevVal + 1);
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
      <div className="homePage" style={{ minWidth: '960px', paddingTop: '3%' }}>
        <AddCollabForm refreshAllColabs={refreshAllColabs} />
        <div
          id="row2"
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
          />
          <div className="verticalCenter">{rightArrow}</div>
          <ViewProjCollabs
            projectId={projectId}
            refreshProjCollabs={refreshProjCollabs}
            refreshProjCs={refreshProjCs}
          />
        </div>
      </div>
    </>
  );
}
