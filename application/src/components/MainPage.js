// React
import { useState } from 'react';
import { Switch, Case, Default } from 'react-if';

// Resources
import './components.css';
import NavBar from './NavBar';
import Home from './Home';


// Homepage component for the application
function MainPage() {

  // State variables
  const [content, setContent] = useState('home');
  
  return (
    <div>
      <NavBar setContent={setContent} />
      <Switch>
        <Case condition={content === 'search'}>Search component goes here</Case>
        <Case condition={content === 'create'}>Create component goes here</Case>
        <Case condition={content === 'delete'}>Delete component goes here</Case>
        <Default><Home/></Default>
      </Switch>
    </div>
  )
}

export default MainPage;