// React
import { useState } from 'react';
import { Switch, Case, Default } from 'react-if';

// Resources
import './components.css';
import NavBar from './navbar/NavBar';
import Home from './Home';
import Search from './Search';
import Create from './Create';
import Delete from './Delete';


// Homepage component for the application
function MainPage() {

  // State variables
  const [content, setContent] = useState('home');
  
  return (
    <div>
      <NavBar style={{width: '100%'}} content={content} setContent={setContent} />
      <Switch>
        <Case condition={content === 'search'}><Search/></Case>
        <Case condition={content === 'create'}><Create/></Case>
        <Case condition={content === 'delete'}><Delete/></Case>
        <Default><Home/></Default>
      </Switch>
    </div>
  )
}

export default MainPage;