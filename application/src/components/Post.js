/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
// React
import { Container, Image } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './post.css';

// Resources
import Avatar from '../resources/images/avatar.jpg';
import PostImage from '../resources/images/postImage.jpg';
import StaticMap from './maps/StaticMap';

function Message() {

    const postBody = <text style={{ whiteSpace: 'pre-line' }}>
        {'The body of the message will be shown here. The font might need to be reduced ' +
        'so it contracts better with the title. If it goes on too long we can add elipses. ' +
        'This sentence is just here so that it can long enough to need something.<br/> It <br/> was <br/> awesome<br/>!!!'.split('<br/>').join('\n')}
    </text>

    const position = {
        lat: 45.963589,
        lng: -66.643112
    }

    return (
        <Container id="outer-container">
            <div className="container-fluid" id="main-container">

                <div className="container-fluid" id="profile">
                    <Image id="avatar" src={Avatar} roundedCircle/>
                    <p id="user-name">Nota User</p>
                </div>

                <div className="container-fluid" id="post">
                    <div className="container-fluid" id="post-data">

                        <div className="container-fluid" id="post-content">
                            <div id="post-description">
                                <div id="title-section">
                                    <p id="post-title">Title Goes Here</p> 
                                    <p id="post-date">November 5, 2021</p>
                                </div>
                                <p id="post-body">{postBody}</p>
                            </div>

                            <div id="tag-container">
                                <text id="tags">Nature</text>
                                <text id="tags">Hiking</text>
                                <text id="tags">Mountain</text>
                                <text id="tags">Tag</text>
                            </div>

                        </div>

                        <div className="container-fluid" id="post-location">
                            <div id="map">
                                <StaticMap width={313} height={188} position={position}/>
                            </div>
                            <p id="map-description">New Brunswick, Canada</p>
                        </div>
                    </div>
                    <img className="img-fluid" id="post-image" src={PostImage} />
                </div>
            </div>
        </Container>
    )
}

Message.propTypes = {
    author: PropTypes.string,
    avatar: PropTypes.string,                   // URL for the avatar
    title: PropTypes.string,
    date_created: PropTypes.string,
    location: PropTypes.string,
    true_location: PropTypes.string,            // Map Component
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,                    // Image URL
}

export default Message;