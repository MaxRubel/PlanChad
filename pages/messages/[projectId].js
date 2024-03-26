import { useRouter } from 'next/router';
import ViewChat from '../../components/views/ViewChat';

export default function MessagesPage() {
  const router = useRouter();
  const { projectId } = router.query;

  return (
    <div id="chat page container" style={{ marginBottom: '15px' }}>
      <div id="project-top-bar" style={{ marginBottom: '15px' }}>
        <button
          id="saveButton"
          type="button"
          className="clearButton"
          style={{ color: 'white' }}
          onClick={() => {
            router.push(`/project/plan/${projectId}`);
          }}
        >
          Back to Project
        </button>
      </div>
      <ViewChat projectId={projectId} />
    </div>
  );
}
