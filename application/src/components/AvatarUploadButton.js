// React
import { useState, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import AvatarEditor from 'react-avatar-editor'

function AvatarUploadModal(props) {
    // State variables
    const [scale, setScale] = useState(0);
    const avatarEditor = useRef(null);
  
    const saveImage = () => {
      props.closeModal();
      const imageURL = avatarEditor.current.getImage().toDataURL();
      props.setAvatarImg(imageURL);
    }
  
    const cancel = () => {
      props.closeModal();
      props.clearImg();
    }
  
    return (
      <Modal
        size="sm"
        aria-labelledby="image-upload-modal-title"
        centered
        show={props.show}
        onHide={cancel}
      >
        <Modal.Header closeButton>
          <Modal.Title id="image-upload-modal-title">
            Avatar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AvatarEditor
            ref={avatarEditor}
            image={props.image}
            width={500}
            height={500}
            style={{
              width: '100%',
              height: 'auto'
            }}
            border={50}
            borderRadius={500}
            color={[0, 0, 0, 0.6]}
            scale={(scale/25)+1}
          />
          <br/>
          <br/>
          <Form.Label>Zoom</Form.Label>
          <Form.Range value={scale} onChange={(e)=>{setScale(e.target.value)}} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>Cancel</Button>
          <Button variant="primary" onClick={saveImage}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  AvatarUploadModal.propTypes = {
    image: PropTypes.object,
    show: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    setAvatarImg: PropTypes.func.isRequired,
    clearImg: PropTypes.func.isRequired
  }

function AvatarUploadButton(props) {
  const [uploadedImg, setUploadedImg] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [invalidFileMsg, setInvalidFileMsg] = useState(null);
  const fileInputElement = useRef(null);
  const imageFeedbackElement = useRef(null);

  const closeUploadModal = () => {
    setShowUploadModal(false);
    clearFileUpload();
  }

  const clearFileUpload = () => {
    fileInputElement.current.value = '';
  }

  const fileUploadChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verify file extension
    const ext = file.name.match(/\.([^.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        setInvalidFileMsg(null);
        break;
      default:
        // Invalid file type
        setInvalidFileMsg('Invalid file type. Accepted: jpg, jpeg, png.');
        clearFileUpload();
        return;
    }

    // Verify file size
    if (!checkFileSize(event.target, file)) return;

    // Open edit modal
    setUploadedImg(file);
    setShowUploadModal(true);
  }

  const checkFileSize = (inputElement, file) => {
    if (file.size > 15 * 1024 * 1024) {
      setInvalidFileMsg('File must not be larger than 15 MB');
      clearFileUpload();
      return false;
    }
    return true;
  }

  return (
    <>
      <Form.Control
        isInvalid={invalidFileMsg}
        hidden
        type="file"
        accept=".png, .jpg, .jpeg"
        ref={fileInputElement}
        onChange={fileUploadChange}
      />
      <Button onClick={()=>{fileInputElement.current.click()}}>
        Upload Image
      </Button>
      <Form.Control.Feedback type="invalid" ref={imageFeedbackElement}>
        {invalidFileMsg}
      </Form.Control.Feedback>

      <AvatarUploadModal
        image={uploadedImg}
        show={showUploadModal}
        closeModal={closeUploadModal}
        setAvatarImg={props.setAvatarImg}
        clearImg={clearFileUpload}
      />
    </>
  );
}

AvatarUploadButton.propTypes = {
  setAvatarImg: PropTypes.func.isRequired
}

export default AvatarUploadButton;