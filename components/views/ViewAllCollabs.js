import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CollabCard from '../cards/CollabCard';
import { useCollabContext } from '../../utils/context/collabContext';
import { useAuth } from '../../utils/context/authContext';

export default function ViewAllCollabs({ projectToAssign }) {
  const [collabs, setCollabs] = useState([]);
  const { allCollabs, searchInput } = useCollabContext();
  const originalCollabs = useRef([]);
  const { user } = useAuth();

  useEffect(() => {
    const allCollabsCopy = [...allCollabs];
    const filtered = allCollabsCopy.filter((item) => item.email !== user.email);
    setCollabs(filtered);
    originalCollabs.current = filtered;
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
      className="card text-bg-info mb-3"
      id="allCollabsCard"
      style={{
        opacity: '.9',
        width: '100%',
        height: '45vh',
        margin: '0px !important',
      }}
    >
      <div
        className="card-header"
        style={{
          fontSize: '22px',
          textAlign: 'center',
          fontWeight: '500',
          border: 'none',
        }}
      >
        Your Collaborators
      </div>
      <div
        className="card-body"
        id="1"
        style={{
          paddingTop: '0%',
          padding: '1% 2%',
          backgroundColor: 'rgb(225,225,225)',
          borderRadius: '10px',
          overflow: 'auto',
          margin: '1.5%',
          marginTop: '0%',
        }}
      >
        <div className="card" style={{ border: 'none' }}>
          {collabs.length === 0 ? (
            <div>There are no collaborators...</div>
          ) : (
            collabs.map((collab) => (
              <CollabCard
                key={collab.localId}
                collab={collab}
                projectToAssign={projectToAssign}
              />
            ))
          )}

        </div>
      </div>
    </div>
  );
}

ViewAllCollabs.propTypes = { projectToAssign: PropTypes.string.isRequired };
