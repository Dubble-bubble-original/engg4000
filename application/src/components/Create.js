// React
import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Button, InputGroup, Spinner } from 'react-bootstrap';
import { When, If, Then, Else } from 'react-if';
import PropTypes from 'prop-types'

// Resources
import { MdErrorOutline, MdOutlineCheckCircle } from 'react-icons/md';
import LocationPickerMap from './maps/LocationPickerMap';
import PlaceholderAvatar from '../resources/images/placeholder-avatar.png';
import AvatarUploadButton from './upload/AvatarUploadButton';
import ImageUploadButton from './upload/ImageUploadButton';
import TagButtonGroup from './TagButtonGroup';
import Post from './post/Post';
import ConfirmationModal from './ConfirmationModal';
import CopyButton from './CopyButton';
import { TermsLink, TermsCheckbox } from './terms/Terms';
import LoadingSpinner from './LoadingSpinner';

// API
import { createFullPost, postImages, deleteImage, sendAccessKeyEmail } from '../api/api.js';
import { geocodePosition } from './maps/Geocoder.js';

function Number(props) {
  return (
    <span className="number-circle">
      <span>{props.num}</span>
    </span>
  );
}
Number.propTypes = {
  num: PropTypes.string.isRequired
}

function Section(props) {
  return (
    <Container className="outer-container">
      <div className="h4"><Number num={props.num}/> {props.title}</div>
      {props.children}
    </Container>
  );
}
Section.propTypes = {
  num: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node
}

function Optional() {
  return (<span className="text-muted"> [optional]</span>);
}

function Create(props) {
  // State variables
  const [position, setPosition] = useState(null);
  const [oldPosition, setOldPosition] = useState(null);
  const [locationString, setLocationString] = useState('');
  const [isTruePosition, setIsTruePosition] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [invalidTagsMsg, setInvalidTagsMsg] = useState();
  const [picture, setPicture] = useState(null);
  const [termsAgree, setTermsAgree] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [created, setCreated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isCreateError, setIsCreateError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailResult, setEmailResult] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Other variables
  const pictureFileInputRef = useRef(null);
  const errorFeedbackRef = useRef(null);
  const emailFormRef = useRef(null);
  const MAX_TAGS = 5;

  useEffect(() => {
    // Update the tags error message based on number of tags selected
    const numTags = tags.length;
    if (numTags > MAX_TAGS) setInvalidTagsMsg('You cannot select more than 5 tags. (Current total: '+numTags+')');
    else if (numTags == 0) setInvalidTagsMsg('You must select at least 1 tag.');
    else setInvalidTagsMsg('');
  }, [tags]);

  const isPostValid = () => {
    // Check if all required fields are filled and valid
    if (position === null) return false;
    if (name.trim() === '') return false;
    if (title.trim() === '') return false;
    if (body.trim() === '') return false;
    if (invalidTagsMsg) return false;
    return true;
  }

  const getPostData = () => {
    return {
      author: {
        name: name,
        avatar_url: getImageURL(avatarImg),
      },
      body: body,
      tags: tags,
      title: title,
      img_url: getImageURL(picture),
      date_created: new Date().toISOString(),
      location: position,
      location_string: locationString,
      true_location: isTruePosition
    };
  }

  const getImageURL = (image) => {
    return image ? URL.createObjectURL(image) : null;
  }

  const preventSubmit = (event) => {
    // Prevent default form submission
    event.preventDefault();
    event.stopPropagation();
  }

  const openModal = () => {
    setShowConfirmationModal(true);
    // Reset create error if was set
    setIsCreateError(false);
  }

  const createPost = async () => {
    // Upload images (if any)
    let imgResult = null;
    if (avatarImg || picture) {
      imgResult = await postImages(avatarImg, picture);
      if (!imgResult) {
        setIsCreateError(true);
        return;
      }
    }
    const avatarId = imgResult?.avatarId;
    const pictureId = imgResult?.pictureId;

    // Get user & post data (separate)
    const post = getPostData();
    const user = post.author;
    delete post.author;

    // Create post
    const result = await createFullPost(avatarId, pictureId, user, post);

    // Show feedback
    if (result) {
      setAccessKey(result.post.access_key);
      setCreated(true);
    }
    else {
      setIsCreateError(true);

      // Delete images (if any)
      if (avatarId) deleteImage(avatarId);
      if (pictureId) deleteImage(pictureId);
    }
  }

  const sendEmail = async () => {
    // Hide old message (if any)
    setEmailResult(null);
    
    // Basic validation
    if (!email || !emailFormRef.current.checkValidity()) return;

    // Add a little bit of loading to prevent flickering
    setEmailLoading(true);
    setTimeout(() => {setEmailLoading(false)}, 500);

    // Make API call
    const result = await sendAccessKeyEmail(accessKey, email, name, title);

    // Show feedback
    if (result) setEmailResult('sent');
    else setEmailResult('error');
  }

  useEffect(() => {
    // Scroll to the error 0.5s after it appears
    if (isCreateError) {
      setTimeout(() => errorFeedbackRef.current.scrollIntoView(true), 500);
    }
  }, [isCreateError]);

  const GEOCODE_UPDATE_TIME = 800;
  useEffect(() => {
    // Randomized load time (+-200ms)
    const loadTime = GEOCODE_UPDATE_TIME + Math.floor(Math.random()*400)-200;
    // Update locationString after a delay (if needed)
    const timerId = setTimeout(() => {
      if (positionChanged()) {
        geocodePosition(position, (locStr) => {
          setLocationString(locStr);
          setOldPosition(position);
        });
      }
    }, loadTime);
    // Stop the timer if the component unmounts
    return () => clearTimeout(timerId);
  }, [position, oldPosition]);
  
  const positionChanged = () => {
    return position?.lat !== oldPosition?.lat || position?.lng !== oldPosition?.lng;
  }

  const resetPage = () => {
    // Reset all state variables to default values
    setPosition(null);
    setAvatarImg(null);
    setName('');
    setTitle('');
    setBody('');
    setTags([]);
    setInvalidTagsMsg();
    setPicture(null);
    setTermsAgree(false);
    setShowConfirmationModal(false);
    setCreated(false);
    setAccessKey('');
    setIsCreateError(false);
    setEmail('');
    setEmailResult(null);
    setEmailLoading(false);
  }

  return (
    <>
      <Container className="outer-container" data-testid="create-page">
        <div className="h4 mb-0">Follow the steps below to create a new post</div>
      </Container>

      <If condition={!created}>
        <Then>
          <Form noValidate onSubmit={preventSubmit}>

            <Section num="1" title="Location">
              <div>Show us the location of your adventure!</div>
              <div className="mt-3 mb-3" style={{width:'100%', height:'350px'}}>
                <LocationPickerMap onPositionChange={setPosition} setIsTruePosition={setIsTruePosition} />
              </div>
              <InputGroup hidden={position === null}>
                <InputGroup.Text>Location:</InputGroup.Text>
                <InputGroup.Text>
                  <If condition={positionChanged()}>
                    <Then><Spinner animation="border" className="spinner-sm" /></Then>
                    <Else>{locationString}</Else>
                  </If>
                </InputGroup.Text>
              </InputGroup>
              <Alert
                variant="danger"
                className="mb-0 mt-3"
                hidden={position !== null}
              >
                <MdErrorOutline/> You must select a location.
              </Alert>
            </Section>

            <Section num="2" title="Avatar">
              <div>Tell us more about you!</div>
              <Row xs={1} sm={2} style={{rowGap: '0.75rem'}} className="mt-3" >
                <Col>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      isInvalid={!name.trim()}
                      required
                      type="text"
                      placeholder="What do people call you?"
                      value={name}
                      onChange={(e)=> {setName(e.target.value)}}
                    />
                    <Form.Control.Feedback type="invalid">
                      A name is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Row>
                    <Col id="avatar-preview">
                      <img src={getImageURL(avatarImg) ?? PlaceholderAvatar}></img>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Avatar<Optional/></Form.Label><br/>
                        <AvatarUploadButton setAvatarImg={setAvatarImg}/>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Section>

            <Section num="3" title="Content">
              <div>What would you like to share?</div>
              <Row sm={1} md={2} className="mt-3">
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    isInvalid={!title.trim()}
                    required
                    type="text"
                    placeholder="Give a title to your post"
                    value={title}
                    onChange={(e)=> {setTitle(e.target.value)}}
                  />
                  <Form.Control.Feedback type="invalid">
                    A title is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group className="mt-3">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  isInvalid={!body.trim()}
                  required
                  as="textarea"
                  rows={6}
                  placeholder="Share your thoughts!"
                  value={body}
                  onChange={(e)=> {setBody(e.target.value)}}
                />
                <Form.Control.Feedback type="invalid">
                  A body is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Section>

            <Section num="4" title="Tags">
              <div>Select up to 5 tags that relate to your post.</div>
              <Form.Group className="mt-3">
                <TagButtonGroup tags={tags} setTags={setTags}/>
                <Alert
                  variant="danger"
                  className="mb-0 mt-3"
                  hidden={!invalidTagsMsg}
                >
                  <MdErrorOutline/> {invalidTagsMsg}
                </Alert>
              </Form.Group>
            </Section>

            <Container className="outer-container">
              <Row xs={1} sm={2} style={{rowGap: '0.75rem'}}>
                <Col>
                  <div className="h4"><Number num="5"/> Picture <Optional/></div>
                  <div className="mb-3">A picture is worth a thousand words!</div>
                  <ImageUploadButton
                    setUploadedImg={setPicture}
                    fileInputRef={pictureFileInputRef}
                  >
                    Upload Picture
                  </ImageUploadButton>
                </Col>
                <Col hidden={!picture} className="img-preview">
                  <img src={getImageURL(picture)}/>
                </Col>
              </Row>
            </Container>

            <Section num="6" title="Preview">
              <div>See how your post will look before you publish!</div>
              <Alert
                variant="danger"
                className="mb-0 mt-3"
                hidden={isPostValid()}
              >
                <MdErrorOutline/> Some required fields are missing values.
              </Alert>
            </Section>

            <When condition={isPostValid()}>
              <Post postData={getPostData()}/>

              <Section num="7" title="Publish">
                <div className="mb-3">By publishing this post you are agreeing to our <TermsLink setShowTerms={props.setShowTerms}/>.</div>
                <TermsCheckbox
                  agree={termsAgree}
                  setAgree={setTermsAgree}
                />
                <Button
                  className="mt-3"
                  disabled={!termsAgree || !isPostValid()}
                  onClick={openModal}
                >
                  Publish
                </Button>
              </Section>
            </When>

          </Form>
        </Then>
        <Else>
          <Container className="outer-container">
            <Alert variant="success">
              <MdOutlineCheckCircle/> Post created successfully.
            </Alert>
            <div><b>Access code:</b> {accessKey} <CopyButton value={accessKey}/></div>
            <Form.Text>
              This access code can be used to delete the post you just created. Make sure to take note of it, as you won{'\''}t be able to see it again!<br/>
              <br/>
              You may enter your email below to send yourself a copy of the access code via email.<br/>
            </Form.Text>
            <br/>
            <Form noValidate onSubmit={preventSubmit} validated={!!email} ref={emailFormRef}>
              <Form.Group>
                <Form.Label>Email <Optional/></Form.Label>
                <Row xs={1} sm={2} style={{rowGap: '0.75rem'}}>
                  <Col style={{maxWidth: '400px'}} className="flex-grow-1">
                    <Form.Control
                      type="email"
                      placeholder="my.email@org.com"
                      value={email}
                      onChange={(e)=> {setEmail(e.target.value)}}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs="auto" sm="auto">
                    <If condition={emailLoading}>
                      <Then><LoadingSpinner /></Then>
                      <Else><Button onClick={sendEmail} type="submit">Send Email</Button></Else>
                    </If>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            <br/>
            <When condition={emailResult && !emailLoading}>
              <If condition={emailResult==='sent'}>
                <Then>
                  <Alert variant="success">
                    <MdOutlineCheckCircle/> Email sent successfully. <br/>Please check your spam folder if you don&apos;t see it in your inbox.
                  </Alert>
                </Then>
                <Else>
                  <Alert variant="danger">
                    <MdErrorOutline/> Email could not be sent.
                  </Alert>
                </Else>
              </If>
            </When>
            <Button onClick={resetPage}>Create a New Post</Button>
          </Container>
        </Else>
      </If>

      <When condition={isCreateError}>
        <Container className="outer-container" ref={errorFeedbackRef}>
          <Alert variant="danger" className="mb-0">
            <MdErrorOutline/> Post could not be created. Please try again later.
          </Alert>
        </Container>
      </When>
      
      <ConfirmationModal
        title="Confirmation"
        acceptString="Publish"
        cancelString="Cancel"
        acceptCallback={createPost}
        show={showConfirmationModal}
        setShow={setShowConfirmationModal}
      >
        Do you really want to publish this post?
      </ConfirmationModal>
    </>
  )
}
Create.propTypes = {
  setShowTerms: PropTypes.func
}

export default Create;