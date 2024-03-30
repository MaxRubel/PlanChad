import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ViewChat from '../../components/views/ViewChat';
import { peopleIcon } from '../../public/icons';
import { shortBack } from '../../public/icons2';
import { useCollabContext } from '../../utils/context/collabContext';
import useSaveStore from '../../utils/stores/saveStore';

export default function MessagesPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const { loadProjectCollabs } = useCollabContext();
  const loadASingleProject = useSaveStore((state) => state.loadASingleProject);
  const allProjects = useSaveStore((state) => state.allProjects);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);

  useEffect(() => {
    if (!singleProjectRunning && projectsLoaded) {
      loadASingleProject(projectId);
      loadProjectCollabs(projectId);
    }
  }, [projectsLoaded, allProjects]);

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
