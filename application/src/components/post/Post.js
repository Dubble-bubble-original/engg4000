// React
import { Container, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './post.css';

// Resources
import StaticMap from '../maps/StaticMap';
import { FRow, FCol } from '../FlexContainers';

function Post({postData}) {

  // Create Tags for rendering
  const tags = postData.tags.map(tag => {
    return <Button variant="outline-primary" className="tag" key={tag}>{tag}</Button>;
  });

  return (
    <Container className="outer-container">
      <FRow>
        <FCol>
          <img className="avatar" src={postData.avatar} />
          <div className="user-name">{postData.user}</div>
        </FCol>

        <FCol className="post-body">
          <FRow className="post-content">
            <FCol  className="post-description">
              <FRow className="title-section">
                <div className="post-title">{postData.title}</div> 
                <div className="text-muted">{postData.date}</div>
              </FRow>
              <div className="post-body">{postData.postBody}</div>
              <FRow className="tag-container">
                {tags}
              </FRow>
            </FCol>

            <FCol className="post-location">
              <StaticMap width={2000} height={200} position={postData.position}/>
              <div className="text-muted text-center">{postData.location}</div>
            </FCol>
          </FRow>
          <div>
            <img src={postData.postImage} />
          </div>
        </FCol>
      </FRow>
    </Container> 
  )
}

Post.propTypes = {
  postData: PropTypes.shape({
    user: PropTypes.string,
    avatar: PropTypes.url,
    title: PropTypes.string,
    date: PropTypes.string,
    postBody: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    position: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    location: PropTypes.string,
    postImage: PropTypes.url,
  })
}

export default Post;