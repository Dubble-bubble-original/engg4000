// React
import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Resources
import LocationPickerMap from './maps/LocationPickerMap';
import PlaceholderAvatar from '../resources/images/placeholder-avatar.png';
import AvatarUploadButton from './upload/AvatarUploadButton';
import ImageUploadButton from './upload/ImageUploadButton';
import TagButtonGroup from './TagButtonGroup';

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

function Create() {
  // State variables
  const [position, setPosition] = useState(null);
  const [avatarImg, setAvatarImg] = useState(PlaceholderAvatar);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [invalidTagsMsg, setInvalidTagsMsg] = useState();
  const [picture, setPicture] = useState(null);
  const pictureFileInputRef = useRef(null);
  const MAX_TAGS = 5;

  useEffect(() => {
    const numTags = tags.length;
    if (numTags > MAX_TAGS) setInvalidTagsMsg('You cannot select more than 5 tags. (Current total: '+numTags+')');
    else if (numTags == 0) setInvalidTagsMsg('You must select at least 1 tag.');
    else setInvalidTagsMsg('');
  }, [tags]);

  const handleSubmit = (event) => {
    // Prevent default form submission
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <>
      <Container className="outer-container">
        <div className="h4 mb-0">Follow these steps to create a new post</div>
      </Container>

      <Form noValidate validated={false} onSubmit={handleSubmit}>

        <Section num="1" title="Location">
          <div>Show us the location of your adventure!</div>
          <br/>
          <div style={{width:'100%', height:'350px'}}>
            <LocationPickerMap onPositionChange={setPosition} />
          </div>
        </Section>

        <Section num="2" title="Avatar">
          <div>Tell everyone who you are!</div>
          <br/>
          <Row xs={1} sm={2} style={{rowGap: '0.75rem'}}>
            <Col>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
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
              required
              as="textarea"
              rows={6}
              placeholder="Share your thoughts!"
              value={body}
              onChange={(e)=> {setBody(e.target.value)}}
            />
          </Form.Group>
        </Section>

        <Section num="4" title="Tags">
          <div>Select up to 5 tags that relate to your post.</div>
          <br/>
          <Form.Group>
            <TagButtonGroup tags={tags} setTags={setTags} />
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
              <img src={picture ? URL.createObjectURL(picture) : null}/>
            </Col>
          </Row>
        </Container>

        <Section num="6" title="Preview">
        </Section>

        {/* <Post /> */}

        <Section num="7" title="Publish">
        </Section>

      </Form>
    </>
  )
}

export default Create;