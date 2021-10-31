import './components.css';
import {IconContext} from 'react-icons';
import {MdHome, MdSearch, MdAddLocation, MdRefresh, MdMoreHoriz} from 'react-icons/md';
import {FaHome, FaSearch, FaSearchLocation, FaRedoAlt, FaMapMarkerAlt, FaEllipsisH} from 'react-icons/fa';

// Homepage component for the application
function HomePage() {
  return (
    <div className="home-page" data-testid="home-page">
      HomePage
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