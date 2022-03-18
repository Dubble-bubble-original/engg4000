/* eslint-disable no-unreachable */
import './App.css';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import { LoadScript } from '@react-google-maps/api';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  // The state that determines what page we are on
  return (
    <div >
      <Routes>
        <Route exact path="/" element={
          <div className="App" id="welcome-page">
            <WelcomePage />
          </div>
        }/>   
        <Route path="/main/*" element={
          <div className="App" id="main-page">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
              <MainPage />
            </LoadScript>
          </div>
        }>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
