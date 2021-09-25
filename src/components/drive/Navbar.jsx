import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'


export default function NavbarComponent() {
  return (
    <Navbar bg="light" expand="true" className="px-4">
      <Navbar.Brand as={Link} to="/">
        Appwrite Drive
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
      </Nav>
    </Navbar>
  )
}
