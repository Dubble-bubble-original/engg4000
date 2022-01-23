// React
import { Container, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Switch, Case } from 'react-if';
import { useState } from 'react';

// Stylesheet
import './post.css';

// Resources
import StaticMap from '../maps/StaticMap';
import { FRow, FCol } from '../FlexContainers';

const imgStyle = {
  width:'100%', 
  height: '100%', 
  objectFit:'contain', 
  backgroundColor:'lightgray'
};

function Post({postData}) {

  const [postImageModal, setPostImageModal] = useState(false);
  const [avatarImageModal, setAvatarImageModal] = useState(false);

  // Create Tags for rendering
  const tags = postData.tags.map(tag => {
    return <Button variant="outline-primary" className="tag" key={tag}>{tag}</Button>;
  });

  // Format the given date
  const date = new Date(postData.date_created);
  const date_string = format(date, 'MMMM d, yyyy');

  return (
    <>
      <Container className="outer-container">
        <FRow>
          <FCol>
            <button className="image-button avatar clickable hover-outline" onClick={() => setAvatarImageModal(true)}>
              <img className="avatar" src={postData.author.avatar_url} />
            </button>
            <div className="user-name text-center">{postData.author.name}</div>
          </FCol>

          <FCol className="post-body">
            <FRow className="post-content">
              <FCol  className="post-description">
                <FRow className="title-section">
                  <div className="post-title">{postData.title}</div> 
                  <div className="text-muted">{date_string}</div>
                </FRow>
                <div className="post-body">{postData.body}</div>
                <FRow className="tag-container">
                  {tags}
                </FRow>
              </FCol>

              <FCol className="post-location">
                <StaticMap width={2000} height={200} position={postData.location}/>
                <div className="text-muted text-center">{postData.location_string}</div>
              </FCol>
            </FRow>
            <div>
              <button className="image-button" onClick={() => setPostImageModal(true)}>
                <img className="clickable hover-outline" src={postData.img_URL} />
              </button>
            </div>
          </FCol>
        </FRow>
      </Container>

      <Switch>
        <Case condition={postImageModal === true}>
          <Modal size='xl' scrollable show={postImageModal} onHide={() => setPostImageModal(false)}>
            <Modal.Header closeButton>Post Image</Modal.Header>
            <Modal.Body style={{width:'100%'}}>
            {/* <Modal.Body style={{width:'100%', height:window.innerHeight}}> */}
              <img style={imgStyle} src={postData.img_URL} />
            </Modal.Body>
          </Modal>
        </Case>

        <Case condition={avatarImageModal === true}>
          <Modal size='xl' scrollable show={avatarImageModal} onHide={() => setAvatarImageModal(false)}>
            <Modal.Header closeButton>Avatar Image</Modal.Header>
            <Modal.Body style={{width:'100%'}}>
            {/* <Modal.Body style={{width:'100%', height:window.innerHeight}}> */}
              <img style={imgStyle} className="avatar" src={postData.author.avatar_url} />
            </Modal.Body>
          </Modal>
        </Case>
      </Switch>
    </>
  )
}

Post.propTypes = {
  postData: PropTypes.shape({
    author: PropTypes.shape({
      name: PropTypes.string,
      avatar_url: PropTypes.url,
    }),
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    img_URL: PropTypes.string,
    date_created: PropTypes.string,
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    location_string: PropTypes.string
  })
}

export default Post;