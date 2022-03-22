// React
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';

// Resources
import './navBar.scss';
import { IconContext } from 'react-icons';
import { MdHome, MdSearch, MdAddLocation, MdMoreHoriz } from 'react-icons/md';
import Logo from '../../resources/images/nota-logo-no-text.png';
import { FRow } from '../Containers'
import { useNavigate, useLocation } from 'react-router-dom';

function NavLinks(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // Handler to call closePopup() if it was given when clicking a link
  function clickHandler() {
    if (props.closePopup) props.closePopup();
  }

  return (
    <IconContext.Provider value={{color:'var(--bs-primary)'}}>
      <Nav className="me-auto">
          <Nav.Link data-testid="nav-home-btn" onClick={() => clickHandler(navigate('/home'))} className={location.pathname.includes('home') ? 'active' : ''}>Home <MdHome/></Nav.Link>
          <Nav.Link data-testid="nav-search-btn" onClick={() => clickHandler(navigate('search'))} className={location.pathname.includes('search') ? 'active' : ''}>Search <MdSearch/></Nav.Link>
          <Nav.Link data-testid="nav-create-btn" onClick={() => clickHandler(navigate('create'))} className={location.pathname.includes('create') ? 'active' : ''}>Create <MdAddLocation/></Nav.Link>
      </Nav>
      <Nav className="justify-content-end">
        <NavDropdown align="end" title={<MdMoreHoriz/>} id="basic-nav-dropdown" data-testid="nav-dropdown">
          <NavDropdown.Item data-testid="nav-terms-conditions-btn" onClick={() => clickHandler(props.setShowTerms(true))}>Terms and Conditions</NavDropdown.Item>
          <NavDropdown.Item data-testid="nav-delete-btn" onClick={() => clickHandler(navigate('delete'))}>Delete a post</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </IconContext.Provider>
  );
}

function NavBar(props) {
  const navigate = useNavigate();

  // Function to close the offcanvas popup
  function closePopup() {
    document.querySelector('body > .offcanvas-backdrop').click();
  }

  function redirectToHome() {
    navigate('/home');
  }

  return (
    <Navbar bg="light" expand="lg" data-testid="navbar" id="navbar" className="h5 navbar-expand-sm">
      <Container>
        <Navbar.Brand>
          <img
            src={Logo}
            alt="Nota logo"
            className="clickable"
            onClick={redirectToHome}
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
  setShowTerms: PropTypes.func,
  closePopup: PropTypes.func
}

NavBar.propTypes = {
  setShowTerms: PropTypes.func
}

export default NavBar;