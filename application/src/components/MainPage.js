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
import { TermsModal } from './terms/Terms';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'

// Homepage component for the application
function MainPage(props) {

  // State variables
  const [content, setContent] = useState('home');
  return (
    <div>
      <NavBar content={content} setContent={setContent} setShowTerms={props.setShowTerms} />
      <Switch>
        <Case condition={content === 'search'}><Navigate replace to="/search" /></Case>
        <Case condition={content === 'create'}><Navigate replace to="/create" /></Case>
        <Case condition={content === 'delete'}><Navigate replace to="/delete" /></Case>
        <Default><Home/></Default>
      </Switch>
      <TermsModal show={props.showTerms} setShow={props.setShowTerms} />
    </div>
  )
}

MainPage.propTypes = {
  setShowTerms: PropTypes.func,
}

export default MainPage;