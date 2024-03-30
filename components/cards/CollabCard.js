import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteCollab } from '../../api/collabs';
import { createNewProjCollab, deleteProjCollab, updateProjCollab } from '../../api/projCollab';
import { useCollabContext } from '../../utils/context/collabContext';
import { useAuth } from '../../utils/context/authContext';
import {
  plusIconSmol, editIcon, removeIcon, deleteIcon,
} from '../../public/icons';
import { deleteTaskCollab } from '../../api/taskCollab';
import { deleteCollabTT, editCollabTT, viewCollabDeetsTT } from '../util/toolTips';
import DeleteCollabModal from '../modals/DeleteCollab';
import useSaveStore from '../../utils/stores/saveStore';
import { deleteInvite, getInvitesByCollab } from '../../api/invites';

export default function CollabCard({ collab, ofProj, projectToAssign }) {
  const [expanded, setExpanded] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const {
    addToCollabManager,
    deleteFromCollabManager,
    projCollabJoins,
    taskCollabJoins,
    setUpdateCollab,
    allCollabs,
  } = useCollabContext();
  const { user } = useAuth();
  const projectName = useRef();
  const allProjects = useSaveStore((state) => state.allProjects);
  const deleteProjInviteByCollabId = useSaveStore((state) => state.deleteProjInviteByCollabId);

  useEffect(() => {
    const project = allProjects.find((item) => item.projectId === projectToAssign);
    projectName.current = project?.name;
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
    deleteProjInviteByCollabId(collab.collabId);
    getInvitesByCollab(collab.collabId).then((invitesData) => {
      const deleteInvitesOfCollab = invitesData.map((item) => (deleteInvite(item.inviteId)));
      Promise.all(deleteInvitesOfCollab).then(() => {
        const removeTaskJoinArray = theseTaskCollabsJoins
          .map((item) => deleteTaskCollab(item.taskCollabId));
        const removeProjoinArray = theseProjJoins
          .map((item) => deleteProjCollab(item.projCollabId));
        Promise.all([...removeTaskJoinArray, ...removeProjoinArray]).then(() => {
          deleteCollab(collab.collabId).then(() => {
            deleteFromCollabManager(collab.collabId, 'allCollabs');
            deleteFromCollabManager(collab.collabId, 'projCollabs');
          });
        });
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
      email: collab.email,
    };

    const copy = [...projCollabJoins];
    const copy2 = [...allCollabs];

    const thisProjCollab = copy2.find((item) => item.collabId === collab.collabId);
    const isAlreadyIn = copy.some((item) => item.collabId === collab.collabId);

    if (!isAlreadyIn) {
      createNewProjCollab(payload).then(({ name }) => { // Join Table
        const payload2 = { projCollabId: name };
        updateProjCollab(payload2);
        addToCollabManager({ ...payload, ...payload2 }, 'projCollabJoins', 'create');
        addToCollabManager(thisProjCollab, 'projCollabs', 'create');
      });
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal((prevVal) => false);
  };

  const addToProjTT = (
    <Tooltip id="editCollabTT">
      Add To Project &quot;{projectName.current}&quot;
    </Tooltip>
  );

  return (
    <>
      <DeleteCollabModal closeModal={handleCloseModal} show={openDeleteModal} handleDelete={handleDelete} />
      <div className="card white collab-card ">
        <div
          className="card-body white"
          style={{ padding: '0px' }}
        >
          <div id="row1" className="collab-card-main-line">
            <div id="col1" className="fullCenter">
              <OverlayTrigger placement="top" overlay={viewCollabDeetsTT} delay={{ show: 750, hide: 0 }}>
                <button
                  type="button"
                  className="clearButton collapse-button"
                  onClick={handleCollapse}
                >
                  {downIcon}
                </button>
              </OverlayTrigger>
            </div>
            <div id="col2" className="verticalCenter">
              {collab.name}
            </div>
            {ofProj ? (
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  className="clearButton collab-button"
                  style={{ color: 'black' }}
                  onClick={handleRemove}
                >
                  {removeIcon}
                </button>
              </div>
            ) : (
              <div id="col3">
                <div />
                <div className="verticalCenter collab-card-buttons-right">
                  <OverlayTrigger placement="top" overlay={addToProjTT} delay={{ show: 750, hide: 0 }}>
                    <button
                      type="button"
                      className="clearButtonDark collab-button"
                      style={{ marginBottom: '-2px', marginRight: '-5px' }}
                      onClick={handleAssignToProj}
                    >
                      {plusIconSmol}
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={editCollabTT} delay={{ show: 750, hide: 0 }}>
                    <button
                      id="update-collab"
                      type="button"
                      className="clearButton collab-button"
                      style={{ color: 'black', paddingRight: '1px' }}
                      onClick={handleUpdate}
                    >
                      {editIcon}
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={deleteCollabTT} delay={{ show: 750, hide: 0 }}>
                    <button
                      type="button"
                      className="clearButtonDark collab-button"
                      onClick={() => { setOpenDeleteModal((prevVal) => true); }}
                    >
                      {deleteIcon}
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
            )}
          </div>
          <Collapse in={expanded}>
            <div>
              <div className="grid3">
                <div />
                <div>Phone:</div>
                <div> {collab.phone}</div>
              </div>
              <div className="grid3">
                <div />
                Email:
                <div>{collab.email}</div>
              </div>
              <div className="grid3">
                <div />
                Notes:
                {collab.notes}
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </>
  );
}

CollabCard.propTypes = {
  collab: PropTypes.shape({
    name: PropTypes.string.isRequired,
    collabId: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  projectToAssign: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  ofProj: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([undefined]),
  ]),
};
