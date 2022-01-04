// React
import { Button, Modal, Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Components
import TermsAndConditions from './termsAndConditions/TermsAndConditions';
import PrivacyPolicy from './privacyPolicy/PrivacyPolicy';

function TermsModal(props) {

  return (
    <Modal size='xl' scrollable show={props.show} onHide={() => props.setShow(false)}>
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
        <Button data-testid="close-btn" id="close-btn" onClick={() => props.setShow(false)}>
        Close
        </Button>
    </Modal.Footer>
    </Modal>
  );
}

TermsModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func
}

export default TermsModal;