/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { homeIcon } from '../../public/icons';
import { signOut } from '../../utils/auth';
import { useSaveContext } from '../../utils/context/saveManager';
import { useCollabContext } from '../../utils/context/collabContext';

export default function NavBar() {
  const { singleProjectRunning, clearAllLocalData } = useSaveContext();
  const { clearCollabManager } = useCollabContext();

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
      <Navbar collapseOnSelect expand="sm" bg="black" variant="dark" className="navBarShowing">
        <Container>
          <Link passHref href="/">
            <Navbar.Brand>planChad</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link passHref href="/">
                <Nav.Link>Home</Nav.Link>
              </Link>
              <Link passHref href="/project/new">
                <Nav.Link>Create New Project</Nav.Link>
              </Link>
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
    );
  }
}
