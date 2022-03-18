/* eslint-disable no-unreachable */
import './App.css';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import { LoadScript } from '@react-google-maps/api';
import { Route, Routes } from 'react-router-dom';


const App = () => {
  // The state that determines what page we are on

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<WelcomePage />}/>
        <Route path="/main/*" element={
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
            <MainPage />
          </LoadScript>
        }>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
