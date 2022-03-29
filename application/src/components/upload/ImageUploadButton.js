// React
import { useState } from 'react';
import { Form, Button, CloseButton } from 'react-bootstrap';
import PropTypes from 'prop-types'

const MAX_FILE_SIZE = 5 * 1000 * 1000; // 5 MB

function ImageUploadButton(props) {
  const [invalidFileMsg, setInvalidFileMsg] = useState(null);
  const [hasFile, setHasFile] = useState(false);

  const clearFileUpload = () => props.fileInputRef.current.value = '';

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

    // Valid image
    props.setUploadedImg(file);
    setHasFile(true);
  }

  const checkFileSize = (inputElement, file) => {
    if (file.size > MAX_FILE_SIZE) {
      setInvalidFileMsg('File must not be larger than 5 MB');
      clearFileUpload();
      return false;
    }
    return true;
  }

  const clearImage = () => {
    clearFileUpload();
    props.setUploadedImg(null);
    setHasFile(false);
  }

  return (
    <>
      <Form.Control
        isInvalid={invalidFileMsg}
        hidden
        type="file"
        accept=".png, .jpg, .jpeg"
        ref={props.fileInputRef}
        onChange={fileUploadChange}
      />
      <Button onClick={()=>{props.fileInputRef.current.click()}}>
        {props.children}
      </Button>
      <CloseButton 
        hidden={!hasFile}
        onClick={clearImage}
        className="ms-1 align-middle"
        title="Remove image"
      />
      <Form.Control.Feedback type="invalid">
        {invalidFileMsg}
      </Form.Control.Feedback>
    </>
  );
}

ImageUploadButton.propTypes = {
    setUploadedImg: PropTypes.func.isRequired,
    fileInputRef: PropTypes.object.isRequired,
    children: PropTypes.node
}

export default ImageUploadButton;