import { useEffect } from 'react';
import NewProjectForm from '../../components/NewProjectForm';
import { useSaveContext } from '../../utils/context/saveManager';

export default function CreateNewProject() {
  const { clearSaveManager, singleProjectRunning, sendToServer } = useSaveContext();

  useEffect(() => {
    if (singleProjectRunning) {
      sendToServer();
    }
    clearSaveManager();
  }, []);

  return (
    <div className="homePage">
      <NewProjectForm />
    </div>
  );
}
