// React
import { useState, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import AvatarEditor from 'react-avatar-editor'

// Resources
import ImageUploadButton from './ImageUploadButton';

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
  const fileInputRef = useRef(null);

  const clearFileUpload = () => fileInputRef.current.value = '';

  const handleImgChange = (img) => {
    setUploadedImg(img);
    if (img) setShowUploadModal(true);
    else props.setAvatarImg(props.defaultImg);
  }

  const closeUploadModal = () => {
    setShowUploadModal(false);
    clearFileUpload();
  }

  return (
    <>
      <ImageUploadButton
        setUploadedImg={handleImgChange}
        fileInputRef={fileInputRef}
      >
        Upload Image
      </ImageUploadButton>

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
  setAvatarImg: PropTypes.func.isRequired,
  defaultImg: PropTypes.object
}

export default AvatarUploadButton;