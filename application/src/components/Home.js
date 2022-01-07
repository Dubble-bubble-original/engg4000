// React
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

// Resources
import Post from './post/Post';
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

  // Render is loading page until version gets its value
  if(isLoading) {
    return (
      <div className="home-page" data-testid="home-page">
        Loading...
      </div>
    )
  }

  return (
    <>
      <Container className="home-page outer-container" data-testid="home-page">
        <div className="h4 mb-0">Recent posts</div>
      </Container>
      <Post postData={postData}/>
    </>
  )
}

export default Home;