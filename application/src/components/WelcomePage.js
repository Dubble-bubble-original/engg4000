import { useState } from 'react';
import './components.css';
import { Button, Form } from 'react-bootstrap';

// Welcome page component for the application
function WelcomePage(props) {

  // Handler function for the welcome button
  const buttonHandler = () => {
    if (agree == true) {
      props.data("home_page");
    }
  }

  // This variable will hold the terms and condition for the application
  var termsAndConditions = <a href="" target="_blank" rel="noreferrer">terms and conditions</a>;

  const [agree, setAgree] = useState(false);

  // This is the handler for the checkbox
  const checkBoxHandler = () => {
    setAgree(!agree)
  }

  return (
    <div>
      <div className="terms_and_conditions" data-testid="terms_conditions">
        By entering this website you are ageering to our {termsAndConditions} 
      </div>
      <div className="i-agree">
        <Form.Check
          type="checkbox"
          data-testid="agree_checkbox"
          label="I have read and accept the terms and conditions"
          onChange={checkBoxHandler}
        />
      </div>
      <Button data-testid="welcome_button" className="welcome" disabled={!agree} onClick={buttonHandler}>
        Enter Site
      </Button>
    </div>
  )
}

export default WelcomePage;