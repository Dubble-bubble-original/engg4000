// React
import { useState, useEffect } from 'react';

// Resources
import { getVersion } from '../api/api';
import './components.css';
import {IconContext} from 'react-icons';
import {MdHome, MdSearch, MdAddLocation, MdRefresh, MdMoreHoriz} from 'react-icons/md';
import {FaHome, FaSearch, FaSearchLocation, FaRedoAlt, FaMapMarkerAlt, FaEllipsisH} from 'react-icons/fa';
import Post from './post/Post';
import Avatar from '../resources/images/avatar.jpg';
import PostImage from '../resources/images/postImage.jpg';
import MapDemo from './maps/MapDemo';

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
    <div className="home-page" data-testid="home-page">
      <br/>
      <br/>
      <Post postData={postData}/>
      <br/>
      <br/>
      <div>
        HomePage
        <p>version: {version}</p>
        <br/>
        <br/>
        <div style={{textAlign:'left'}}>
          <b>Sample Icons</b><br/>
          <IconContext.Provider value={{color:'#EC4038'}} style={{textAlign:'left'}}>
          <div>Material Design: <MdHome/><MdSearch/><MdAddLocation/><MdRefresh/><MdMoreHoriz/></div>
          <div>Fontawesome: <FaHome/><FaSearch/><FaSearchLocation/><FaMapMarkerAlt/><FaRedoAlt/><FaEllipsisH/></div>
          </IconContext.Provider>
        </div>
        <br/>
        <MapDemo />
      </div>
    </div>
  )
}

export default HomePage;