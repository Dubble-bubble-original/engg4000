import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import { If, Then, Else } from 'react-if';
import { LoadScript } from '@react-google-maps/api';

const App = () => {
  // The state that determines what page we are on
  const [page, setPage] = useState('welcome_page');

  return (
    <div className="App">
      <If condition={page === 'welcome_page'}>
        <Then>
          <WelcomePage data={setPage}/>
        </Then>
        <Else>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
          >
            <HomePage />
          </LoadScript>
        </Else>
      </If>
    </div>
  );
}

export default App;
