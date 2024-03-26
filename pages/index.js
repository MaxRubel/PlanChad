import { useEffect } from 'react';
import ProjectsTable from '../components/tables/ProjectsTable';
import { useSaveContext } from '../utils/context/saveManager';
import Loading from '../components/util/Loading';
import useSaveStore from '../utils/stores/saveStore';

export default function Home() {
  const { isFetchingUserData } = useSaveContext();

  const clearSaveStore = useSaveStore((state) => state.clearSaveStore);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);
  const sendToServer = useSaveStore((state) => state.sendToServer);
  const projectsHaveBeenLoaded = useSaveStore((state) => state.sendToServer);

  useEffect(() => {
    if (singleProjectRunning && projectsHaveBeenLoaded) {
      sendToServer();
    }
    clearSaveStore();
  }, []);

  if (isFetchingUserData) {
    return (<Loading />);
  }

  return (
    <div className="homePage">
      <div className="card text-bg-info mb-3">
        <div className="card-header" style={{ textAlign: 'center', fontSize: '22px' }}>
          <strong>Welcome to planChad!</strong>
        </div>
        <div className="card-body">
          <h5 className="card-title" style={{ marginTop: '2%' }}>Your Projects:</h5>
          <ProjectsTable />
        </div>
      </div>
    </div>
  );
}
