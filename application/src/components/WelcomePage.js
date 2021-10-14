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

  // Thsi variable will hold the terms and condition for the application
  var termsAndConditions = "The terms and conditions will\ngo here.";

  const [agree, setAgree] = useState(false);
  // This is the handler for the checkbox
  const checkBoxHandler = () => {
    setAgree(!agree)
  }

  return (
    <div>
      <div className="terms_and_conditions" data-testid="terms_conditions"> {termsAndConditions} </div>
      <div className="i-agree">
        <Form.Check
          type="checkbox"
          data-testid="agree_checkbox"
          label="I agree"
          onChange={checkBoxHandler}
        />
      </div>
      <Button data-testid="welcome-button" className="welcome" disabled={!agree} onClick={buttonHandler}>
        Welcome to Nota!!
      </Button>
    </div>
  )
}

export default WelcomePage;