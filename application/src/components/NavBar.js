// React
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

// Stylesheet
import './components.css';

// Resources
import {IconContext} from 'react-icons';
import {MdHome, MdSearch, MdAddLocation } from 'react-icons/md';
import Logo from '../resources/images/nota-logo-no-text.png';

function NavBar(props) {

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <img
            src={Logo}
            style={{
              width: '40px', 
              height: '40px'
            }}
            alt="Nota logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <IconContext.Provider value={{color:'#EC4038'}}>
              <Nav.Link onClick={() => props.setContent('home')}>Home <MdHome/></Nav.Link>
              <Nav.Link onClick={() => props.setContent('search')}>Search <MdSearch/></Nav.Link>
              <Nav.Link onClick={() => props.setContent('create')}>Create <MdAddLocation/></Nav.Link>
            </IconContext.Provider>
          </Nav>
          <Nav className="justify-content-end">
            <NavDropdown align="end" title="..." id="basic-nav-dropdown">
              <NavDropdown.Item>Terms and Conditions / Privacy Policy</NavDropdown.Item>
              <NavDropdown.Item onClick={() => props.setContent('delete')}>Delete a post</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

NavBar.propTypes = {
  setContent: PropTypes.func
}

export default NavBar;