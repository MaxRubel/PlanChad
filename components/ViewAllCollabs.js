import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CollabCard from './CollabCard';
import { useCollabContext } from '../utils/context/collabContext';

export default function ViewAllCollabs({ projectToAssign }) {
  const [collabs, setCollabs] = useState([]);
  const { allCollabs, searchInput } = useCollabContext();
  const originalCollabs = useRef([]);

  useEffect(() => {
    setCollabs(allCollabs);
    originalCollabs.current = allCollabs;
  }, [allCollabs]);

  useEffect(() => {
    if (searchInput) {
      const collabsCopy = [...originalCollabs.current];
      const searchResult = collabsCopy
        .filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()));
      setCollabs(searchResult);
    } else {
      setCollabs(originalCollabs.current);
    }
  }, [searchInput]);

  return (
    <div
      className="card text-bg-dark mb-3"
      style={{
        color: 'rgb(200, 200, 200)',
        paddingBottom: '8px',
        height: '45vh',
        width: '100%',
        margin: '0px !important',
        // boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.2), 0 0 40px 20px rgba(255, 255, 255, 0.1), inset 0 0 20px 0px rgba(255, 255, 255, 0.5)',
      }}
    >
      <div
        className="card-header"
        style={{
          color: 'rgb(200, 200, 200)',
          fontSize: '22px',
          textAlign: 'center',
          fontWeight: '600',
          // borderBottom: '1px solid rgb(84, 84, 84)',
        }}
      >
        All Collaborators
      </div>
      <div className="card-body" style={{ paddingTop: '0px', overflow: 'auto' }}>
        <div className="card">
          <div className="card-body" style={{ border: 'none' }}>
            {collabs.length === 0 ? (
              <div>There are no collaborators...</div>
            ) : (
              collabs.map((collab) => (
                <CollabCard
                  key={collab.collabId}
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

ViewAllCollabs.propTypes = { projectToAssign: PropTypes.string.isRequired };
