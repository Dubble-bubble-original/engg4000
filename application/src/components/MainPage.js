// React
import { useState } from 'react';
import { Switch, Case, Default } from 'react-if';

// Resources
import './components.css';
// import Post from './post/Post';
// import Avatar from '../resources/images/avatar.jpg';
// import PostImage from '../resources/images/postImage.jpg';
import ImageForm from './testing/ImageForm';

// Test Post Data
// const postData = {
//   user: 'Nota User',
//   avatar: Avatar,
//   title: 'Title Goes Here',
//   date: 'November 20, 2021',
//   postBody: 'The body of the message will be shown here. The font might need to be reduced so it contracts better with the title. If it goes on too long we can add elipses. This sentence is just here so that it can long enough to need something.',
//   tags: ['Nature', 'Hiking', 'Mountain', 'Tag'],
//   position: {
//     lat: 45.963589,
//     lng: -66.643112
//   },
//   location: 'New Brunswick, Canada',
//   postImage: PostImage,
// }

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
      <ImageForm></ImageForm>
    </div>
  )
}

export default MainPage;
