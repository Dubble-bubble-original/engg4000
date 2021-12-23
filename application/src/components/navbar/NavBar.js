// React
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

// Resources
import './navBar.css';
import {IconContext} from 'react-icons';
import {MdHome, MdSearch, MdAddLocation, MdMoreHoriz } from 'react-icons/md';
import Logo from '../../resources/images/nota-logo-no-text.png';

function NavBar(props) {

  return (
    <Navbar bg="light" expand="lg" id="navbar" className="h5 navbar-expand-sm">
      <Container>
        <Navbar.Brand>
          <img
            src={Logo}
            alt="Nota logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <IconContext.Provider value={{color:'#EC4038'}}>
            <Nav className="me-auto">
                <Nav.Link onClick={() => props.setContent('home')} className={props.content === 'home' ? 'active' : ''}>Home <MdHome/></Nav.Link>
                <Nav.Link onClick={() => props.setContent('search')} className={props.content === 'search' ? 'active' : ''}>Search <MdSearch/></Nav.Link>
                <Nav.Link onClick={() => props.setContent('create')} className={props.content === 'create' ? 'active' : ''}>Create <MdAddLocation/></Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              <NavDropdown align="end" title={<MdMoreHoriz/>} id="basic-nav-dropdown">
                <NavDropdown.Item>Terms and Conditions</NavDropdown.Item>
                <NavDropdown.Item onClick={() => props.setContent('delete')}>Delete a post</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </IconContext.Provider>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

NavBar.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func
}

export default NavBar;