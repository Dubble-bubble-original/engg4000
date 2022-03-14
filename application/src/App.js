/* eslint-disable no-unreachable */
import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import Search from './components/Search';
import Create from './components/Create';
import Delete from './components/Delete';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';

const App = () => {
  // The state that determines what page we are on
  const [page, setPage] = useState('welcomePage');
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route
          exact path="/"
          element={(page === 'welcomePage')
            ?<WelcomePage setPage={setPage}/>
            :<Navigate replace to="/main" />
          }
        />
        <Route path="/main" element={
          <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
            <MainPage setShowTerms={setShowTerms}/>
          </LoadScript>
        }/>
        <Route path="/search" element={<Search />}/>
        <Route path="/create" element={<Create setShowTerms={setShowTerms}/>}/>
        <Route path="/delete" element={<Delete />}/>
      </Routes>
    </div>
  );
}

export default App;
