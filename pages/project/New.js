import { useEffect } from 'react';
import NewProjectForm from '../../components/forms/NewProjectForm';
import { useSaveContext } from '../../utils/context/saveManager';
import useSaveStore from '../../utils/stores/saveStore';

export default function CreateNewProject() {
  const { clearSaveManager, singleProjectRunning } = useSaveContext();
  const sendToServer = useSaveStore((state) => state.sendToServer);

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
