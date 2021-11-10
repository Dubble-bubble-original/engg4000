import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import { If, Then, Else } from 'react-if';

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
        <MainPage />
      </Else>
      </If>
    </div>
  );
}

export default App;
