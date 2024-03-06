'use client';

import { useEffect } from 'react';
import ProjectsTable from '../components/ProjectsTable';
import { useSaveContext } from '../utils/context/saveManager';

export default function Home() {
  const { clearSaveManager, singleProjectRunning, sendToServer } = useSaveContext();

  useEffect(() => {
    if (singleProjectRunning) {
      sendToServer();
    }
    clearSaveManager();
  }, []);
  document.documentElement.style.setProperty('--background1', `
  linear-gradient(0deg, rgba(34, 193, 195, 1) 0%, rgba(46, 45, 253, 1) 100%)
`);

  return (
    <div className="homePage">
      <div className="card text-bg-info mb-3" style={{ boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.2), 0 0 40px 20px rgba(255, 255, 255, 0.1), inset 0 0 20px 0px rgba(255, 255, 255, 0.5)' }}>
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
