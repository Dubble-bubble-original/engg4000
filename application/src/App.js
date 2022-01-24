/* eslint-disable no-unreachable */
import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import { If, Then, Else } from 'react-if';
import { LoadScript } from '@react-google-maps/api';

const App = () => {
  // The state that determines what page we are on
  const [page, setPage] = useState('welcomePage');

  return (
    <If condition={page === 'welcomePage'}>
      <Then>
        <div className="App" id="welcome-page" >
          <WelcomePage setPage={setPage} />
        </div>
      </Then>
      <Else>
        <div className="App" id="main-page">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
            <MainPage />
          </LoadScript>
        </div>
      </Else>
    </If>
  );
}

export default App;
