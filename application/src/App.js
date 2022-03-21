/* eslint-disable no-unreachable */
import './App.css';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import { LoadScript } from '@react-google-maps/api';
import { Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    <div >
      <Routes>
      <Route exact path="/" element={
        <Navigate to='/welcome'/>
      }></Route>
      <Route path="/*" element={
          <div className="App" id="main-page">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
              <MainPage />
            </LoadScript>
          </div>
        }></Route>
        <Route exact path="/welcome" element={
          <div className="App" id="welcome-page">
            <WelcomePage />
          </div>
        }/>  
      </Routes>
    </div>
  );
}

export default App;
