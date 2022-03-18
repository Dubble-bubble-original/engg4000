// React
import { useState } from 'react';
import { Button } from 'react-bootstrap';

// Router
import { useNavigate } from 'react-router-dom';

// Stylesheet
import './components.scss';

// Resources
import logo from '../resources/images/nota-logo.png';
import { getAuthToken } from '../api/api';

// Components
import { TermsModal, TermsLink, TermsCheckbox } from './terms/Terms';

// Global State
import {setGlobalState} from './globalState';

function WelcomePage() {
  // State variables
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  // Handler function for the welcome button
  const enterButtonHandler = async () => {
    if (agree == true) {
      // Generate Auth Token
      await getAuthToken();
      
      setGlobalState('termsChecked', agree);
      navigate('/main/home');
    }
  }

  return (
    <div className="container text-center">
      <img className="large-logo mt-5 mb-4" src={logo} alt="Logo" />
      <div className="terms-conditions h5 mb-5" data-testid="terms-conditions-form">
        By entering this website, you are ageering to our <TermsLink setShowTerms={setShowTerms}/>.
      </div>
      <div className="i-agree h5 mb-3">
        <TermsCheckbox agree={agree} setAgree={setAgree} />
      </div>
      <Button data-testid="enter-btn" className="mb-4" disabled={!agree} onClick={enterButtonHandler}>
        Enter Site
      </Button>

      <TermsModal show={showTerms} setShow={setShowTerms} />
    </div>
  );
}

export default WelcomePage;
