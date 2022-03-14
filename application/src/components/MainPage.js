// React
import { useState } from 'react';
import Home from './Home';
import Search from './Search';
import Create from './Create';
import Delete from './Delete';
import { Route, Routes } from 'react-router-dom';

// Resources
import './components.scss';

// Components
import NavBar from './navbar/NavBar';
import { TermsModal } from './terms/Terms';

// Homepage component for the application
function MainPage() {

  // State variables
  const [content, setContent] = useState('home');
  const [showTerms, setShowTerms] = useState(false);

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