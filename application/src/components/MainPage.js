// React
import { useState } from 'react';
import { Switch, Case, Default } from 'react-if';

// Resources
import './components.scss';

// Components
import NavBar from './navbar/NavBar';
import Home from './Home';
import Search from './Search';
import Create from './Create';
import Delete from './Delete';
import TermsModal from './terms/termsModal';

// Homepage component for the application
function MainPage() {

  // State variables
  const [content, setContent] = useState('home');
  const [showTerms, setShowTerms] = useState(false);
  
  return (
    <div>
      <NavBar content={content} setContent={setContent} setShowTerms={setShowTerms} />
      <Switch>
        <Case condition={content === 'search'}><Search/></Case>
        <Case condition={content === 'create'}><Create/></Case>
        <Case condition={content === 'delete'}><Delete/></Case>
        <Default><Home/></Default>
      </Switch>
      <TermsModal show={showTerms} setShow={setShowTerms} />
    </div>
  )
}

export default MainPage;