import { useEffect } from 'react';
import NewProjectForm from '../../components/forms/NewProjectForm';
import useSaveStore from '../../utils/stores/saveStore';

export default function CreateNewProject() {
  const sendToServer = useSaveStore((state) => state.sendToServer);
  const clearSaveStore = useSaveStore((state) => state.clearSaveStore);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);

  useEffect(() => {
    if (singleProjectRunning) {
      sendToServer();
    }
    clearSaveStore();
  }, []);

  return (
    <div className="homePage">
      <NewProjectForm />
    </div>
  );
}
