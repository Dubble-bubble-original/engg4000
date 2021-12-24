// React
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './components.css';

// Resources
import logo from '../resources/images/nota-logo.png';
import { getAuthToken } from '../api/api';

// Components
import TermsModal from './terms/termsModal';

function WelcomePage(props) {
  // State variables
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Handler function for the welcome button
  const enterButtonHandler = async () => {
    if (agree == true) {
      // Generate Auth Token
      await getAuthToken();
      props.setPage('homePage');
    }
  }

  let termsAndConditions = <span id="terms-conditions-link" className="clickable" onClick={() => setShowTerms(true)}>terms and conditions</span>;

  // This is the handler for the checkbox
  const checkBoxHandler = () => {
    setAgree(!agree);
  }

  return (
    <div className="container">
      <img className="logo" src={logo} alt="Logo" />
      <div className="terms-conditions" data-testid="terms-conditions">
        <p className="h5">By entering this website, you are ageering to our {termsAndConditions}.</p>
      </div>
      <div className="i-agree h5">
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

      <TermsModal show={showTerms} setShow={setShowTerms} />
    </div>
  );
}

WelcomePage.propTypes = {
  setPage: PropTypes.func
}

export default WelcomePage;