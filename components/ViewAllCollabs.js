/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext';
import { getCollabsOfUser } from '../api/collabs';
import CollabCard from './CollabCard';
import { useCollabContext } from '../utils/context/collabContext';

export default function ViewAllCollabs({
  refreshAllCs, refreshProjCollabs, refreshAllColabs, projectId, projectToAssign,
}) {
  const [collabs, setCollabs] = useState([]);
  const { user } = useAuth();
  const { allCollabs } = useCollabContext();

  useEffect(() => {
    getCollabsOfUser(user.uid).then((data) => {
      setCollabs(data);
    });
  }, [refreshAllCs, user.uid]);

  useEffect(() => {
    setCollabs(allCollabs);
  }, [allCollabs]);

  return (
    <div
      className="card"
      style={{
        // backgroundColor: 'rgb(31, 31, 31)',
        // color: 'rgb(204,204,204)',
        paddingBottom: '16px',
        height: '45vh',
        width: '100%',
        // border: 'none',
      }}
    >
      <div
        className="card-header"
        style={{
          fontSize: '22px', textAlign: 'center', fontWeight: '600',
        }}
      >
        All Collaborators
      </div>
      <div className="card-body" style={{ overflow: 'auto' }}>
        <div className="card">
          <div className="card-body" style={{ border: 'none' }}>
            {collabs.length === 0 ? (
              <div>There are no collaborators...</div>
            ) : (
              collabs.map((collab) => (
                <CollabCard
                  key={collab.collabId}
                  projectId={projectId}
                  refreshProjCollabs={refreshProjCollabs}
                  refreshAllColabs={refreshAllColabs}
                  collab={collab}
                  projectToAssign={projectToAssign}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
