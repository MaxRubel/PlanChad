/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { homeIcon } from '../../public/icons';
import { signOut } from '../../utils/auth';
import { useSaveContext } from '../../utils/context/saveManager';

export default function NavBar() {
  const { singleProjectRunning } = useSaveContext();
  // console.log(singleProjectRunning);

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
              {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
              <Link passHref href="/">
                <Nav.Link>Home</Nav.Link>
              </Link>
              <Link passHref href="/project/new">
                <Nav.Link>Create New Project</Nav.Link>
              </Link>
              {/* <Link passHref href="/404">
              <Nav.Link>Collaborators</Nav.Link>
            </Link> */}
              <button
                type="button"
                className="clearButton"
                style={{
                  color: 'rgb(155, 157, 158)',
                }}
                onClick={signOut}
              >Sign Out
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
