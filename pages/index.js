import { useEffect } from 'react';
import ProjectsTable from '../components/ProjectsTable';
import { getCollabsOfUser } from '../api/collabs';
import { useAuth } from '../utils/context/authContext';
import { useCollabContext } from '../utils/context/collabContext';

export default function Home() {
  const { user } = useAuth();
  const { allCollabs, addToCollabManager } = useCollabContext();
  document.documentElement.style.setProperty('--background1', `
  linear-gradient(0deg, rgba(34, 193, 195, 1) 0%, rgba(46, 45, 253, 1) 100%)
`);

  useEffect(() => {
    if (allCollabs.legth !== 0) {
      getCollabsOfUser(user.uid).then((data) => {
        addToCollabManager(data, 'allCollabs', 'create');
      });
    }
  }, []);

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
