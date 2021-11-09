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
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
      >
        <If condition={page === 'welcome_page'}>
          <Then>
            <WelcomePage data={setPage}/>
          </Then>
        <Else>
          <HomePage />
        </Else>
        </If>
      </LoadScript>
    </div>
  );
}

export default App;
