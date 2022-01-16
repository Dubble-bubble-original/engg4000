// React
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'

function ConfirmationModal(props) {

  // Event handling functions
  const handleClose = () => props.setShow(false);

  const accept = () => {
    handleClose();
    if(props.acceptCallback) {
      props.acceptCallback();
    }
  }

  const cancel = () => {
    handleClose();
    if (props.cancelCallback) {
      props.cancelCallback();
    }
  }

  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancel}>{props.cancelString}</Button>
        <Button variant="primary" onClick={accept}>{props.acceptString}</Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmationModal.defaultProps = {
  title: 'Confirmation',
  body: 'Are you sure?',
  acceptString: 'Yes',
  cancelString: 'Cancel',
}

ConfirmationModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  acceptString: PropTypes.string,
  acceptCallback: PropTypes.func,
  cancelString: PropTypes.string,
  cancelCallback: PropTypes.func,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
}

export default ConfirmationModal;