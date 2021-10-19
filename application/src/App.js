import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import { If, Then, Else } from 'react-if';

const App = () => {
  // The state that determines what page we are on
  const [page, setPage] = useState('welcome_page');

  return (
    <div className="App">
      <header className="App-header">
        <If condition={page === 'welcome_page'}>
          <Then>
            <WelcomePage data={setPage}/>
          </Then>
        <Else>
          <HomePage />
        </Else>
        </If>
      </header>
    </div>
  );
}

export default App;
