import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import Header from './components/HeaderComponent';
import HomePage from './components/HomePage';
import { If, Then, Else } from 'react-if';

const App = () => {
  // The state that determines what page we are on
  const [page, setPage] = useState('welcome_page');

  return (
    <div className="App">
      <If condition={page === 'home_page'}>
        <Then>
          <Header />
        </Then>
      </If>
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
