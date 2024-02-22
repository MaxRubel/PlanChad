/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getCollabsOfProject } from '../api/projCollab';
import CollabCard from './CollabCard';
import { getSingleCollab } from '../api/collabs';
import { useSaveContext } from '../utils/context/saveManager';

// eslint-disable-next-line react/prop-types
export default function ViewProjCollabs({ projectId, refreshProjCollabs, refreshProjCs }) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const { setProjCollabs, saveInput } = useSaveContext();

  useEffect(() => {
    getCollabsOfProject(projectId).then((data) => {
      const collabIds = [];
      for (let i = 0; i < data.length; i++) {
        collabIds.push(data[i].collabId);
      }
      const promArray = collabIds.map((collabId) => (getSingleCollab(collabId)));
      Promise.all(promArray).then((collabsData) => {
        setCollabsOfProj(collabsData);
        setProjCollabs(collabsData);
      });
    });
  }, [refreshProjCs, projectId]);

  return (
    <div className="card text-bg-info mb-3" style={{ width: '47%' }}>
      <div className="card-header" style={{ fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
        <div> Added to Project:</div>
        <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: '300' }}>{saveInput.project.name}</div>
      </div>
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            {collabsOfProj.map((collab) => (
              <CollabCard
                key={collab.collabId}
                collab={collab}
                ofProj
                refreshProjCollabs={refreshProjCollabs}
                projectId={projectId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
