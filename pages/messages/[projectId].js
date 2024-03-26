import { useRouter } from 'next/router';
import ViewChat from '../../components/views/ViewChat';

export default function MessagesPage() {
  const router = useRouter();
  const { projectId } = router.query;

  return (
    <>
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
        >
          View Invites
        </button>
      </div>
      <ViewChat projectId={projectId} />
    </>
  );
}
