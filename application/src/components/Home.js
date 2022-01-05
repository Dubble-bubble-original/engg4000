// React
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

// Resources
import Post from './post/Post';
import Avatar from '../resources/images/avatar.jpg';
import PostImage from '../resources/images/postImage.jpg';

// Test Post Data
const postData = {
  user: 'Nota User',
  avatar: Avatar,
  title: 'Title Goes Here',
  date: 'November 20, 2021',
  postBody: 'The body of the message will be shown here. The font might need to be reduced so it contracts better with the title. If it goes on too long we can add elipses. This sentence is just here so that it can long enough to need something.',
  tags: ['Nature', 'Hiking', 'Mountain', 'Tag'],
  position: {
    lat: 45.963589,
    lng: -66.643112
  },
  location: 'New Brunswick, Canada',
  postImage: PostImage,
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
    <div className="home-page" data-testid="home-page">
      <Container>
        <br/>
        <b>Home Page goes here.</b><br/>
        <br/>
      </Container>
      <Post postData={postData}/>
    </div>
  )
}

export default Home;