// React
import { useState } from 'react';
import { Button, Form, Modal, Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './components.css';

// Resources
import logo from '../resources/images/nota-logo.png';
import { getAuthToken } from '../api/api';

// Components
import TermsAndConditions from './termsAndConditions/TermsAndConditions';
import PrivacyPolicy from './privacyPolicy/PrivacyPolicy';

function WelcomePage(props) {
  // State variables
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);

  // Handler function for the welcome button
  const enterButtonHandler = async () => {
    if (agree == true) {
      // Generate Auth Token
      await getAuthToken();
      props.data('home_page');
    }
  }

  let termsAndConditions = <span id="terms-conditions-link" className="clickable" onClick={() => setShow(true)}>terms and conditions</span>;

  // This is the handler for the checkbox
  const checkBoxHandler = () => {
    setAgree(!agree);
  }

  return (
    <div className="container">
      <img className="logo" src={logo} alt="Logo" />
      <div className="terms-conditions" data-testid="terms-conditions">
        <p>By entering this website, you are ageering to our {termsAndConditions}.</p>
      </div>
      <div className="i-agree">
        <Form.Check
          data-testid="agree-checkbox"
          id="agree-checkbox"
          type="checkbox"
          label="I have read and accept the terms and conditions"
          onChange={checkBoxHandler}
        />
      </div>
      <Button data-testid="enter-btn" id="enter-btn" disabled={!agree} onClick={enterButtonHandler}>
        Enter Site
      </Button>

      <Modal size='xl' scrollable show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <Tabs defaultActiveKey="termsandconditions" id="tabs" className="mb-3">
          <Tab eventKey="termsandconditions" title="Terms and Conditions">
            <TermsAndConditions id="terms-conditions"/>
          </Tab>
          <Tab eventKey="privacypolicy" title="Privacy Policy">
            <PrivacyPolicy id="privacy-policy"/>
          </Tab>
        </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button data-testid="close-btn" id="close-btn" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

WelcomePage.propTypes = {
  data: PropTypes.func
}

export default WelcomePage;