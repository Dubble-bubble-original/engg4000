// React
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './components.css';

// Resources
import logo from '../resources/images/nota-logo.png';

function WelcomePage(props) {
  // State variables
  const [agree, setAgree] = useState(false);

  // Handler function for the welcome button
  const enterButtonHandler = () => {
    if (agree == true) {
      props.data('home_page');
    }
  }

  let termsAndConditions = <a href="" target="_blank" rel="noreferrer">terms and conditions</a>;

  // This is the handler for the checkbox
  const checkBoxHandler = () => {
    setAgree(!agree)
  }

  return (
    <div className="container">
      <img className="logo" src={logo} alt="Logo" />
      <div className="terms-conditions" data-testid="terms-conditions">
           <p>Carter-test</p>
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
    </div>
  )
}

WelcomePage.propTypes = {
  data: PropTypes.function
}

export default WelcomePage;
