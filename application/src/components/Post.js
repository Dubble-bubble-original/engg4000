// React
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './post.css';

// Resources
import StaticMap from './maps/StaticMap';

function Message({postData}) {

  // Create Tags for rendering
  const tags = postData.tags.map(tag => {
    return <text id="tags" key={tag}>{tag}</text>;
  });

  return (
    <Container id="outer-container">
      <Row auto>
        <Col xs={{ order: 0 }} id="profile">
          <img id="avatar" src={postData.avatar} />
          <p id="user-name">{postData.user}</p>
        </Col>

        <Col id="post">
          <Row className="justify-content-md-center">
            <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 1 }} id="post-description">
              <div id="title-section">
                <p id="post-title">{postData.title}</p> 
                <p id="post-date">{postData.date}</p>
              </div>
              <p id="post-body">{postData.postBody}</p>
              <div id="tag-container-sm">
                {tags}
              </div>
            </Col>

            <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 2 }} id="post-location" className="col-md-5 mx-auto">
              <div id="map">
                <StaticMap width={313} height={188} position={postData.position}/>
              </div>
              <p id="map-description">{postData.location}</p>
            </Col>
          </Row>

          <Row>
            <div id="tag-container">
                {tags}
            </div>
            <div className="col-md-5 mx-auto" id="post-image-container">
              <img src={postData.postImage} />
            </div>
          </Row>
        </Col>
      </Row>
    </Container> 
  )
}

Message.propTypes = {
  postData: PropTypes.objectOf({
    user: PropTypes.string,
    avatar: PropTypes.url,
    title: PropTypes.string,
    date: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    position: PropTypes.objectOf({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    location: PropTypes.string,
    postImage: PropTypes.url,
  })
}

export default Message;