// React
import { Container, Image } from 'react-bootstrap';
import PropTypes from 'prop-types'

// Stylesheet
import './message.css';

// Resources
import Avatar from '../resources/images/avatar.jpg';
import PostImage from '../resources/images/postImage.jpg';
import PostLocation from '../resources/images/postLocation.jpg';

function Message() {

    const postBody = <text style={{ whiteSpace: 'pre-line' }}>
        {'The body of the message will be shown here. The font might need to be reduced ' +
        'so it contracts better with the title. If it goes on too long we can add elipses. ' +
        'This sentence is just here so that it can long enough to need something.<br/> It <br/> was <br/> awesome<br/>!!!'.split('<br/>').join('\n')}
    </text>

    return (
        <Container id="outer-container">
            <Container id="main-container">

                <Container id="profile">
                    <Image id="avatar" src={Avatar} roundedCircle/>
                    <p id="user-name">Nota User</p>
                </Container>

                <Container id="post">
                    <Container id="post-data">

                        <Container id="post-content">
                            <Container id="post-description">
                                <div id="title-section">
                                    <p id="post-title">Title Goes Here</p> 
                                    <p id="post-date">November 5, 2021</p>
                                </div>
                                <p id="post-body">{postBody}</p>
                            </Container>

                            <div id="tag-container">
                                <text id="tags">Nature</text>
                                <text id="tags">Hiking</text>
                                <text id="tags">Mountain</text>
                                <text id="tags">Tag</text>
                            </div>
                        </Container>

                        <Container id="post-location">
                            <div id="map">
                                <img src={PostLocation} />
                            </div>
                            <p id="map-description">New Brunswick, Canada</p>
                        </Container>
                    </Container>
                    <Image id="post-image" src={PostImage} />
                </Container>
            </Container>
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