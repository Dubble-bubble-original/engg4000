import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

// The Header component for the application.
function Header() {
  return (
    <NavBar bg="dark" variant="dark" expand="lg" data-testid="nav_bar">
      <Container>
        <NavBar.Brand href="#home">Nota</NavBar.Brand>
        <NavBar.Toggle aria-controls="basic-navbar-nav" />
        <NavBar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#search">Search</Nav.Link>
          </Nav>
        </NavBar.Collapse>
      </Container>
    </NavBar>
  )
}

export default Header;