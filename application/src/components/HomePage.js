// React
import { useState, useEffect } from 'react';

// Resources
import { getVersion } from '../api/api'
import './components.css';
import {IconContext} from 'react-icons';
import {MdHome, MdSearch, MdAddLocation, MdRefresh, MdMoreHoriz} from 'react-icons/md';
import {FaHome, FaSearch, FaSearchLocation, FaRedoAlt, FaMapMarkerAlt, FaEllipsisH} from 'react-icons/fa';

// Homepage component for the application
function HomePage() {

  // State variables
  const [isLoading, setLoading] = useState(true);
  const [version, setVersion] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      // Get app version
      let appVersion = await getVersion();
      setVersion(appVersion);
      setLoading(false);
    }

    fetchData();
  }, [version, isLoading]);

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
    </div>
  )
}

export default HomePage;