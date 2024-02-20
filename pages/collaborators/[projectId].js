import { useRouter } from 'next/router';
import AddCollabForm from '../../components/AddCollabForm';
import ViewAllCollabs from '../../components/ViewAllCollabs';
import ViewCollabsOfProject from '../../components/ViewCollabsOfProj';
import { rightArrow } from '../../public/icons';

export default function ManageCollaboratorsPage() {
  const router = useRouter();
  const { projectId } = router.query;
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
      <div className="homePage" style={{ paddingTop: '3%' }}>
        <AddCollabForm />
        <div
          id="row2"
          style={{
            display: 'flex', flexDirection: 'row', gap: '3%', margin: '3% 0%', color: 'rgb(180, 180, 180, .4)',
          }}
        >
          <ViewAllCollabs />
          <div className="verticalCenter">{rightArrow}</div>
          <ViewCollabsOfProject />
        </div>
      </div>
    </>
  );
}
