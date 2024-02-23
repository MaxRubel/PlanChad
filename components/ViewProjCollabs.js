/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getCollabsOfProject } from '../api/projCollab';
import CollabCard from './CollabCard';
import { getSingleCollab } from '../api/collabs';
import { useSaveContext } from '../utils/context/saveManager';
import { useCollabContext } from '../utils/context/collabContext';

// eslint-disable-next-line react/prop-types
export default function ViewProjCollabs({ projectId, refreshProjCollabs, refreshProjCs }) {
  const [collabsOfProj, setCollabsOfProj] = useState([]);
  const { saveInput } = useSaveContext();
  const {
    refreshAllCollabs, allCollabs, projCollabs, projCollabJoins,
  } = useCollabContext();

  useEffect(() => {
    // const thisProjCollabJoins = [];
    const thisProjCollabs = [];
    const copy = [...projCollabJoins];
    // for (let i = 0; i < projCollabJoins.length; i++) {
    //   if (projCollabJoins[i].projectId === projectId) {
    //     thisProjCollabJoins.push(projCollabJoins[i]);
    //   }
    // }
    const thisProjCollabJoins = copy.filter((item) => item.projectId === projectId);
    console.log(thisProjCollabJoins);
    const collabIds = thisProjCollabJoins.map((item) => item.collabId);
    console.log(collabIds);
    for (let i = 0; i < allCollabs.length; i++) {
      if (collabIds.includes(allCollabs[i].collabId)) {
        thisProjCollabs.push(allCollabs[i]);
      }
    }
    setCollabsOfProj((preVal) => thisProjCollabs);
  }, [projCollabJoins]);

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
