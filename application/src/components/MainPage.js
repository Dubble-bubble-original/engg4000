// React
import { useState } from 'react';

// Resources
import './components.scss';

// Components
import NavBar from './navbar/NavBar';
import { TermsModal } from './terms/Terms';
import Home from './Home';
import Search from './Search';
import Create from './Create';
import Delete from './Delete';

//React Router
import { Route, Routes, Navigate } from 'react-router-dom';

// Global State
import {useGlobalState} from './globalState';

// Homepage component for the application
function MainPage() {

  // State variables
  const [content, setContent] = useState('home');
  const [showTerms, setShowTerms] = useState(false);

  if('false' === useGlobalState('termsChecked')[0]){
    return (
      <div>
        <Navigate redirect to="/"/>
      </div>
    )
  }

  return (
    <div>
      <NavBar content={content} setContent={setContent} setShowTerms={setShowTerms} />
      <TermsModal show={showTerms} setShow={setShowTerms} />
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/create" element={<Create/>}/>
        <Route path="/delete" element={<Delete/>}/>
      </Routes>

    </div>
  )
}

export default MainPage;