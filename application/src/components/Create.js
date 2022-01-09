// React
import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Resources
import LocationPickerMap from './maps/LocationPickerMap.js';
import PlaceholderAvatar from '../resources/images/placeholder-avatar.png';
import AvatarUploadButton from './AvatarUploadButton.js';

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
  const [name, setName] = useState('');
  const [avatarImg, setAvatarImg] = useState(PlaceholderAvatar);

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
                  <AvatarUploadButton setAvatarImg={setAvatarImg}/>
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Section>

      <Section num="3" title="Content">
      </Section>

      <Section num="4" title="Tags">
      </Section>

      <Section num="5" title={<span>Image<Optional/></span>}>
      </Section>

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