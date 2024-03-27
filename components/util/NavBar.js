/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { homeIcon } from '../../public/icons';
import { signOut } from '../../utils/auth';
import { useCollabContext } from '../../utils/context/collabContext';
import useSaveStore from '../../utils/stores/saveStore';
import DeleteAProjectModal from '../modals/DeleteAProject';

export default function NavBar() {
  const { clearCollabManager } = useCollabContext();
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);
  const clearAllLocalData = useSaveStore((state) => state.clearAllLocalData);
  const [deleteAProjectModal, setDeleteAProjectModal] = useState(false);

  const closeModal = () => {
    setDeleteAProjectModal((preVal) => false);
  };

  if (singleProjectRunning) {
    return (
      <Navbar collapseOnSelect expand="sm" bg="black" variant="dark" className="navBarShowing">
        <Container>
          <Link passHref href="/">
            <Navbar.Brand className="verticalCenter">planChad &nbsp; {homeIcon}</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
    );
  }

  if (!singleProjectRunning) {
    return (
      <>
        <DeleteAProjectModal
          show={deleteAProjectModal}
          closeModal={closeModal}
        />;
        <Navbar collapseOnSelect expand="sm" bg="black" variant="dark" className="navBarShowing">
          <Container>
            <Link passHref href="/">
              <Navbar.Brand>planChad</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Link passHref href="/project/new">
                  <Nav.Link>Create New Project</Nav.Link>
                </Link>
                <button
                  type="button"
                  className="clearButton navBarButton"
                  onClick={() => {
                    setDeleteAProjectModal((preVal) => true);
                  }}
                >
                  Delete A Project
                </button>
                <button
                  type="button"
                  className="clearButton"
                  style={{
                    color: 'rgb(155, 157, 158)',
                  }}
                  onClick={() => {
                    signOut();
                    clearAllLocalData();
                    clearCollabManager();
                  }}
                >Sign Out
                </button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>

    );
  }
}
