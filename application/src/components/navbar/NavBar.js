// React
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';

// Resources
import './navBar.scss';
import { IconContext } from 'react-icons';
import { MdHome, MdSearch, MdAddLocation, MdMoreHoriz } from 'react-icons/md';
import Logo from '../../resources/images/nota-logo-no-text.png';
import { FRow } from '../FlexContainers'

function NavLinks(props) {
  // Handler to call closePopup() if it was given when clicking a link
  function clickHandler() {
    if (props.closePopup) props.closePopup();
  }

  return (
    <IconContext.Provider value={{color:'#EC4038'}}>
      <Nav className="me-auto">
          <Nav.Link data-testid="nav-home-btn" onClick={() => clickHandler(props.setContent('home'))} className={props.content === 'home' ? 'active' : ''}>Home <MdHome/></Nav.Link>
          <Nav.Link data-testid="nav-search-btn" onClick={() => clickHandler(props.setContent('search'))} className={props.content === 'search' ? 'active' : ''}>Search <MdSearch/></Nav.Link>
          <Nav.Link data-testid="nav-create-btn" onClick={() => clickHandler(props.setContent('create'))} className={props.content === 'create' ? 'active' : ''}>Create <MdAddLocation/></Nav.Link>
      </Nav>
      <Nav className="justify-content-end">
        <NavDropdown align="end" title={<MdMoreHoriz/>} id="basic-nav-dropdown" data-testid="nav-dropdown">
          <NavDropdown.Item data-testid="nav-terms-conditions-btn" onClick={() => clickHandler(props.setShowTerms(true))}>Terms and Conditions</NavDropdown.Item>
          <NavDropdown.Item data-testid="nav-delete-btn" onClick={() => clickHandler(props.setContent('delete'))}>Delete a post</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </IconContext.Provider>
  );
}

function NavBar(props) {

  // Function to close the offcanvas popup
  function closePopup() {
    document.querySelector('body > .offcanvas-backdrop').click();
  }

  return (
    <Navbar bg="light" expand="lg" data-testid="navbar" id="navbar" className="h5 navbar-expand-sm">
      <Container>
        <Navbar.Brand>
          <img
            src={Logo}
            alt="Nota logo"
          />
        </Navbar.Brand>

        <FRow id="nav-link-container" className="basic-navbar-nav">
          <NavLinks {...props}/>
        </FRow>

        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="navbar-light"
        >
          <Offcanvas.Body id="nav-link-container" className="h5">
            <NavLinks {...props} closePopup={closePopup}/>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

NavLinks.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func,
  setShowTerms: PropTypes.func,
  closePopup: PropTypes.func
}

NavBar.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func,
  setShowTerms: PropTypes.func
}

export default NavBar;