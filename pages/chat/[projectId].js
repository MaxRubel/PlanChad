import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import ViewChat from '../../components/views/ViewChat';
import { calendarIcon, peopleIcon } from '../../public/icons';
import {
  binoculars, chatIcon, saveIcon, shortBack,
} from '../../public/icons2';

export default function MessagesPage() {
  const router = useRouter();
  const { projectId } = router.query;

  return (
    <div id="chat page container" style={{ marginBottom: '15px' }}>
      <div id="project-top-bar" style={{ marginBottom: '10px', paddingBottom: '4px' }}>
        <button
          id="saveButton"
          type="button"
          className="clearButtonNoHover"
          onClick={() => {
            router.push(`/project/plan/${projectId}`);
          }}
        >
          {shortBack} Back To Project
        </button>
        <button
          id="manageCollaborators"
          type="button"
          className="clearButton"
          onClick={() => { router.push(`/collaborators/${projectId}`); }}
        >
          {peopleIcon} &nbsp;Collaborators
        </button>
      </div>
      <ViewChat projectId={projectId} />
    </div>
  );
}
