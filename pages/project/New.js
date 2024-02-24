import NewProjectForm from '../../components/NewProjectForm';
import { useSaveContext } from '../../utils/context/saveManager';

export default function CreateNewProject() {
  const { clearSaveManager } = useSaveContext();
  clearSaveManager();

  return (
    <div className="homePage">
      <NewProjectForm />
    </div>
  );
}
