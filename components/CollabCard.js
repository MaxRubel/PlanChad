/* eslint-disable react/prop-types */
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { deleteCollab } from '../api/collabs';
import {
  createNewProjCollab, deleteProjCollab, updateProjCollab,
} from '../api/projCollab';
import { useCollabContext } from '../utils/context/collabContext';
import { useAuth } from '../utils/context/authContext';
import { plusIconSmol } from '../public/icons';
import { deleteTaskCollab } from '../api/taskCollab';
import { deleteCollabTT, editCollabTT, viewCollabDeetsTT } from './toolTips';
import { useSaveContext } from '../utils/context/saveManager';

export default function CollabCard({
  collab,
  ofProj,
  projectToAssign,
}) {
  const [expanded, setExpanded] = useState(false);
  const {
    addToCollabManager,
    deleteFromCollabManager,
    projCollabJoins,
    taskCollabJoins,
    setUpdateCollab,
  } = useCollabContext();
  const { allProjects } = useSaveContext();
  const { user } = useAuth();
  const projectName = useRef();

  useEffect(() => {
    const allProjCop = [...allProjects];
    const project = allProjCop.find((item) => item.projectId === projectToAssign);
    projectName.current = project.name;
  }, [projectToAssign]);

  const downIcon = (
    <svg
      className={expanded ? 'icon-up' : 'icon-down'}
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 0 320 512"
    >
      <path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6
    9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9L188.5
    256 34.5 101.3c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4
    24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z"
      />
    </svg>
  );
  const editIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1
       0 .706L14.459 3.69l-2-2L13.502.646a.5.5
        0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
      />
      <path
        fillRule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5
      1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
      />
    </svg>
  );

  const rightArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-arrow-right"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0
      1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
      />
    </svg>
  );

  const deleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5
      0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2
      2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0
      1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058
       0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
      />
    </svg>
  );

  const removeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1
      .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
      />
    </svg>
  );

  const handleCollapse = () => {
    setExpanded((prevVal) => !prevVal);
  };

  const handleUpdate = () => {
    setUpdateCollab(collab);
  };

  const handleDelete = () => {
    const projCollabJoinsCopy = [...projCollabJoins];
    const taskCollabJoinsCopy = [...taskCollabJoins];

    const theseProjJoins = projCollabJoinsCopy.filter((item) => item.collabId === collab.collabId);
    const theseTaskCollabsJoins = taskCollabJoinsCopy.filter((item) => item.collabId === collab.collabId);

    const theseProjJoinIds = theseProjJoins.map((item) => item.projCollabId);
    const theseTaskCollabsJoinsIds = theseTaskCollabsJoins.map((item) => item.taskCollabId);

    for (let i = 0; i < theseProjJoinIds.length; i++) {
      deleteFromCollabManager(theseProjJoinIds[i], 'projCollabJoin');
    }
    for (let i = 0; i < theseTaskCollabsJoinsIds.length; i++) {
      deleteFromCollabManager(theseTaskCollabsJoinsIds[i], 'taskCollabJoin');
    }

    const removeTaskJoinArray = theseTaskCollabsJoins.map((item) => deleteTaskCollab(item.taskCollabId));
    const removeProjoinArray = theseProjJoins.map((item) => deleteProjCollab(item.projCollabId));

    Promise.all([...removeTaskJoinArray, ...removeProjoinArray]).then(() => {
      deleteCollab(collab.collabId).then(() => {
        deleteFromCollabManager(collab.collabId, 'allCollabs');
      });
    });
  };

  const handleRemove = () => {
    const copy = [...projCollabJoins];
    const thisProjJoin = copy.filter((item) => item.projectId === projectToAssign);
    const delItem = thisProjJoin.find((item) => item.collabId === collab.collabId);
    deleteProjCollab(delItem.projCollabId).then(() => {
      deleteFromCollabManager(delItem.projCollabId, 'projCollabJoin');
    });
  };

  const handleAssignToProj = () => {
    const payload = {
      projectId: projectToAssign,
      collabId: collab.collabId,
      userId: user.uid,
    };
    let isAlreadyIn = false;
    const copy = [...projCollabJoins];
    const thisProjCopy = copy.filter((item) => item.projectId === projectToAssign);
    for (let i = 0; i < thisProjCopy.length; i++) {
      if (payload.collabId === thisProjCopy[i].collabId) {
        isAlreadyIn = true;
      }
    }
    if (!isAlreadyIn) {
      createNewProjCollab(payload).then(({ name }) => { // JOIN TABLE
        const payload2 = { projCollabId: name };
        updateProjCollab(payload2);
        addToCollabManager({ ...payload, ...payload2 }, 'projCollabJoins', 'create');
      });
    }
  };

  const addToProjTT = (
    <Tooltip id="editCollabTT">
      Add To Project &quot;{projectName.current}&quot;
    </Tooltip>
  );

  return (
    <div className="card" style={{ margin: '1% 0%' }}>
      <div
        className="card-body"
        style={{
          padding: '.5%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div id="col1">
          <OverlayTrigger placement="top" overlay={viewCollabDeetsTT} delay={500}>
            <button type="button" style={{ marginRight: '3%' }} className="clearButton" onClick={handleCollapse}>
              {downIcon}
            </button>
          </OverlayTrigger>
          {collab.name}
        </div>
        {ofProj ? (
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              className="clearButton"
              style={{ color: 'black' }}
              onClick={handleRemove}
            >
              {removeIcon}
            </button>
          </div>
        ) : (
          <div id="col2" style={{ textAlign: 'right' }}>
            <OverlayTrigger placement="top" overlay={addToProjTT} delay={500}>
              <button
                type="button"
                className="clearButton"
                style={{ color: 'black' }}
                onClick={handleAssignToProj}
              >
                {plusIconSmol}
              </button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={editCollabTT} delay={500}>
              <button
                id="update-collab"
                type="button"
                className="clearButton"
                style={{ color: 'black' }}
                onClick={handleUpdate}
              >
                {editIcon}
              </button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={deleteCollabTT} delay={500}>
              <button
                type="button"
                className="clearButton"
                style={{ color: 'black' }}
                onClick={handleDelete}
              >
                {deleteIcon}
              </button>
            </OverlayTrigger>
          </div>
        )}

        <Collapse in={expanded}>
          <div>
            <div className="grid3">
              <div />
              <div>Phone:</div>
              {collab.phone}
            </div>
            <div className="grid3">
              <div />
              <div>Email:</div>
              {collab.email}
            </div>
            <div className="grid3">
              <div />
              <div>Notes:</div>
              {collab.notes}
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
