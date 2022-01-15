// React
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './components.scss';

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

  let termsAndConditions = <a id="terms-conditions-link" className="clickable" onClick={() => setShowTerms(true)}>terms and conditions</a>;

  // This is the handler for the checkbox
  const checkBoxHandler = () => {
    setAgree(!agree);
  }

  return (
    <div className="container text-center">
      <img className="large-logo mt-5 mb-4" src={logo} alt="Logo" />
      <div className="terms-conditions h5 mb-5" data-testid="terms-conditions">
        By entering this website, you are ageering to our {termsAndConditions}.
      </div>
      <div className="i-agree h5 mb-3">
        <Form.Check
          data-testid="agree-checkbox"
          id="agree-checkbox"
          type="checkbox"
          label="I have read and accept the terms and conditions"
          onChange={checkBoxHandler}
        />
      </div>
      <Button data-testid="enter-btn" id="enter-btn" className="mb-4" disabled={!agree} onClick={enterButtonHandler}>
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
