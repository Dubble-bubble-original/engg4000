/* eslint-disable no-unreachable */
import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import { LoadScript } from '@react-google-maps/api';
import { Route, Routes, Navigate } from 'react-router-dom';
import './components/components.scss';


const App = () => {
  // The state that determines what page we are on
  const [page, setPage] = useState('welcomePage');

  return (
    <div className="App">
      <Routes>
        <Route
          exact path="/"
          element={(page === 'welcomePage')
            ?<WelcomePage setPage={setPage}/>
            :<Navigate replace to="/main/home" />
          }
        />
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
