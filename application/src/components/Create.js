// React
import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { When, If, Then, Else } from 'react-if';
import PropTypes from 'prop-types'

// Resources
import LocationPickerMap from './maps/LocationPickerMap';
import PlaceholderAvatar from '../resources/images/placeholder-avatar.png';
import AvatarUploadButton from './upload/AvatarUploadButton';
import ImageUploadButton from './upload/ImageUploadButton';
import TagButtonGroup from './TagButtonGroup';
import Post from './post/Post';
import ConfirmationModal from './ConfirmationModal';
import CopyButton from './CopyButton';
import { TermsLink, TermsCheckbox } from './terms/Terms';

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
  const [avatarImg, setAvatarImg] = useState(PlaceholderAvatar);
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

  // Other variables
  const pictureFileInputRef = useRef(null);
  const errorFeedbackRef = useRef(null);
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

  const getPictureURL = () => {
    return picture ? URL.createObjectURL(picture) : null;
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

  const createPost = () => {
    // todo Call API
    const result = true;

    // Show feedback
    if (result) {
      // todo: change this temp access-key
      setAccessKey('f01466b4-478a-4f8f-ae8c-cae5fd40a6e5');
      setCreated(true);
    }
    else {
      setIsCreateError(true);
    }
  }

  useEffect(() => {
    // Scroll to the error when it appears
    if (isCreateError) {
      errorFeedbackRef.current.scrollIntoView(true);
    }
  }, [isCreateError]);

  const resetPage = () => {
    // Reset all state variables to default values
    setPosition(null);
    setAvatarImg(PlaceholderAvatar);
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
  }

  return (
    <>
      <Container className="outer-container" data-testid="create-page">
        <div className="h4 mb-0">Follow these steps to create a new post</div>
      </Container>

      <If condition={!created}>
        <Then>
          <Form noValidate onSubmit={preventSubmit}>

            <Section num="1" title="Location">
              <div>Show us the location of your adventure!</div>
              <br/>
              <div style={{width:'100%', height:'350px'}}>
                <LocationPickerMap onPositionChange={setPosition} />
              </div>
              <Alert
                variant="danger"
                className="mb-0 mt-3"
                hidden={position !== null}
              >
                You must select a location.
              </Alert>
            </Section>

            <Section num="2" title="Avatar">
              <div>Tell everyone who you are!</div>
              <br/>
              <Row xs={1} sm={2} style={{rowGap: '0.75rem'}}>
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
                      <img  src={avatarImg}></img>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Avatar<Optional/></Form.Label><br/>
                        <AvatarUploadButton setAvatarImg={setAvatarImg} defaultImg={PlaceholderAvatar}/>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Section>

            <Section num="3" title="Content">
              <div>What do you want to share?</div>
              <br/>
              <Row sm={1} md={2}>
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
              <br/>
              <Form.Group>
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
              <br/>
              <Form.Group>
                <TagButtonGroup tags={tags} setTags={setTags}/>
                <Alert
                  variant="danger"
                  className="mb-0 mt-3"
                  hidden={!invalidTagsMsg}
                >
                  {invalidTagsMsg}
                </Alert>
              </Form.Group>
            </Section>

            <Container className="outer-container">
              <Row xs={1} sm={2} style={{rowGap: '0.75rem'}}>
                <Col>
                  <div className="h4"><Number num="5"/> Picture <Optional/></div>
                  <div>A picture is worth a thousand words!</div>
                  <br/>
                  <ImageUploadButton
                    setUploadedImg={setPicture}
                    fileInputRef={pictureFileInputRef}
                  >
                    Upload Picture
                  </ImageUploadButton>
                </Col>
                <Col hidden={!picture} className="img-preview">
                  <img src={getPictureURL()}/>
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
                Some required fields are missing values.
              </Alert>
            </Section>

            <When condition={isPostValid()}>
              <Post
                postData={{
                  author: {
                    name: name,
                    avatar_url: avatarImg
                  },
                  body: body,
                  tags: tags,
                  title: title,
                  img_url: getPictureURL(),
                  date_created: new Date(),
                  location: position,
                  location_string: 'WIP'
                }}
              />

              <Section num="7" title="Publish">
                <div>By publishing this post you are agreeing to our <TermsLink setShowTerms={props.setShowTerms}/>.</div>
                <br/>
                <TermsCheckbox
                  agree={termsAgree}
                  setAgree={setTermsAgree}
                />
                <br/>
                <Button
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
              Post created successfully.
            </Alert>
            <div><b>Access code:</b> {accessKey} <CopyButton value={accessKey}/></div>
            <Form.Text>
              This access code can be used to delete the post you just created. Make sure to take note of it, as you won{'\''}t be able to see it again!
            </Form.Text>
            <br/>
            <br/>
            <Button onClick={resetPage}>Create a New Post</Button>
          </Container>
        </Else>
      </If>

      <When condition={isCreateError}>
        <Container className="outer-container" ref={errorFeedbackRef}>
          <Alert variant="danger" className="mb-0">
            Post could not be created. Please try again later.
          </Alert>
        </Container>
      </When>
      
      <ConfirmationModal
        title="Confirmation"
        body={
          <div>
            Do you really want to publish this post?
          </div>
        }
        acceptString="Publish"
        cancelString="Cancel"
        acceptCallback={createPost}
        show={showConfirmationModal}
        setShow={setShowConfirmationModal}
      />
    </>
  )
}
Create.propTypes = {
  setShowTerms: PropTypes.func
}

export default Create;