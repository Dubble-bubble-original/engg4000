/* eslint-disable no-unused-vars */
// React
import { useState, useEffect } from 'react';
import { If, Then, Else } from 'react-if';

// Resources
import { getVersion } from '../api/api'
import './components.css';
import Message from './Message'

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
          <Message />
        </Then>
      </If>
    </div>
  )
}

export default HomePage;