// React
import { Container, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { When } from 'react-if';
import { useState, useEffect } from 'react';

// Stylesheet
import './post.css';

// Resources
import StaticMap from '../maps/StaticMap';
import { FRow, FCol } from '../Containers';
import PlaceholderAvatar from '../../resources/images/placeholder-avatar.png';

// Show placeholder image if avatar image fails
function handleAvatarImgError(e) {
  if (e.target.src != PlaceholderAvatar) e.target.src = PlaceholderAvatar;
}

function Post({postData}) {
  const [imgURL, setImgURL] = useState(null);

  // Show no image if post picture fails
  const handlePictureImgError = () => {
    setImgURL(null);
  }

  useEffect(() => {
    // Update imgURL stat based on img_url prop
    setImgURL(postData.img_url);
  }, [postData.img_url]);

  const [postImageModal, setPostImageModal] = useState(false);
  const [avatarImageModal, setAvatarImageModal] = useState(false);

  // Create Tags for rendering
  const tags = postData.tags.sort().map(tag => {
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
              <img className="avatar" data-testid="avatar-image" src={postData.author.avatar_url ?? PlaceholderAvatar} onError={handleAvatarImgError} />
            </button>
            <div className="user-name text-center">{postData.author.name}</div>
          </FCol>

          <FCol className="post-body" data-testid="post-body">
            <FRow className="post-content">
              <FCol  className="post-description">
                <FRow className="title-section">
                  <div className="post-title">{postData.title}</div> 
                  <div className="text-muted">{date_string}</div>
                </FRow>
                <div className="post-body">{postData.body}</div>
                <FRow className="tag-container" data-testid="tags">
                  {tags}
                </FRow>
              </FCol>

              <FCol className="post-location" data-testid="map">
                <StaticMap width={2000} height={200} position={postData.location}/>
                <div className="text-muted text-center">{postData.location_string}</div>
              </FCol>
            </FRow>
            <When condition={imgURL}>
              <FRow className="post-image">
                <button className="image-button" onClick={() => setPostImageModal(true)}>
                  <img data-testid="post-image" className="clickable hover-outline" src={imgURL} onError={handlePictureImgError}/>
                </button>
              </FRow>
            </When>
          </FCol>
        </FRow>
      </Container>

      <Modal fullscreen show={postImageModal} onHide={() => setPostImageModal(false)}>
        <Modal.Header closeButton>{postData.title}</Modal.Header>
        <Modal.Body>
          <img className="modal-image" src={imgURL} />
        </Modal.Body>
      </Modal>

      <Modal fullscreen show={avatarImageModal} onHide={() => setAvatarImageModal(false)}>
        <Modal.Header closeButton>{postData.author.name}</Modal.Header>
        <Modal.Body>
          <img className="modal-image" src={postData.author.avatar_url ?? PlaceholderAvatar} onError={handleAvatarImgError} />
        </Modal.Body>
      </Modal>
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
    img_url: PropTypes.string,
    date_created: PropTypes.string,
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    location_string: PropTypes.string
  })
}

export default Post;