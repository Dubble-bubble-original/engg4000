/* eslint-disable no-unused-vars */
// React
import { useState, useEffect } from 'react';
import { If, Then } from 'react-if';

// Resources
import { getVersion } from '../api/api'
import './components.css';
import Post from './Post'
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

// Homepage component for the application
function HomePage() {

  // State variables
  const [isLoading, setLoading] = useState(true);
  const [version, setVersion] = useState(null);
  const [page, setPage] = useState('recent_posts');

  const fetchData = async () => {
    // Get app version
    let appVersion = await getVersion();
    setVersion(appVersion);
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
    <div id="home-page" data-testid="home-page">
      <If condition={page === 'recent_posts'}>
        <Then>
          <Post postData={postData}/>
        </Then>
      </If>
    </div>
  )
}

export default HomePage;