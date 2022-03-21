// React
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';

// Resources
import './navBar.scss';
import { IconContext } from 'react-icons';
import { MdHome, MdSearch, MdAddLocation, MdMoreHoriz } from 'react-icons/md';
import Logo from '../../resources/images/nota-logo-no-text.png';
import { FRow } from '../Containers'
import { useNavigate } from 'react-router-dom';

function NavLinks(props) {
  // Handler to call closePopup() if it was given when clicking a link
  const navigate = useNavigate();

  function clickHandler(content) {
    navigate('/'+ content);
    props.setContent(content);
  }

  function clickHandlerTC() {
    if (props.closePopup) props.closePopup();
  }

  return (
    <IconContext.Provider value={{color:'var(--bs-primary)'}}>
      <Nav className="me-auto">
          <Nav.Link data-testid="nav-home-btn" onClick={() => clickHandler('home')} className={props.content === 'home' ? 'active' : ''}>Home <MdHome/></Nav.Link>
          <Nav.Link data-testid="nav-search-btn" onClick={() => clickHandler('search')} className={props.content === 'search' ? 'active' : ''}>Search <MdSearch/></Nav.Link>
          <Nav.Link data-testid="nav-create-btn" onClick={() => clickHandler('create')} className={props.content === 'create' ? 'active' : ''}>Create <MdAddLocation/></Nav.Link>
      </Nav>
      <Nav className="justify-content-end">
        <NavDropdown align="end" title={<MdMoreHoriz/>} id="basic-nav-dropdown" data-testid="nav-dropdown">
          <NavDropdown.Item data-testid="nav-terms-conditions-btn" onClick={() => clickHandlerTC(props.setShowTerms(true))}>Terms and Conditions</NavDropdown.Item>
          <NavDropdown.Item data-testid="nav-delete-btn" onClick={() => clickHandler('delete')}>Delete a post</NavDropdown.Item>
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
    props.setContent('home');
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
            href="/home"
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