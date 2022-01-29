// React
import { useState, useEffect } from 'react';
import { Container, Fade } from 'react-bootstrap';
import { If, Then } from 'react-if';

// Components
import Post from './post/Post';
import LoadingSpinner from './LoadingSpinner';

// Resources
import Avatar from '../resources/images/avatar.jpg';
import PostImage from '../resources/images/postImage.jpg';

// Test Post Data
const postData = {
  author: {
    name: 'Nota User',
    avatar_url: Avatar,
  },
  body: 'The body of the message will be shown here. The font might need to be reduced so it contracts better with the title. If it goes on too long we can add elipses. This sentence is just here so that it can long enough to need something.',
  tags: ['Nature', 'Hiking', 'Mountain', 'Tag'],
  title: 'Title Goes Here',
  img_URL: PostImage,
  date_created: '2021-11-20T17:31:03.914+00:00',
  location: {
    lat: 45.963589,
    lng: -66.643112
  },
  location_string: 'New Brunswick, Canada',
}

// Home component for the application
function Home() {

  // State variables
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {

    // Todo: Get recent posts

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <If condition={isLoading}>
        <Then>
        <Container className="home-page outer-container" data-testid="home-page">
          <LoadingSpinner message="Looking for recent posts..." size="10rem"/>
        </Container>
        </Then>
      </If>

      <Fade in={!isLoading}>
        <div id="fade-in">
          <Container className="home-page outer-container" data-testid="home-page">
            <div data-testid="home-title" className="h4 mb-0">Recent posts</div>
          </Container>
          <Post postData={postData}/>
        </div>
      </Fade>
    </>
  )
}

export default Home;