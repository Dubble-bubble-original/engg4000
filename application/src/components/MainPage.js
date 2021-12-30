// React
import { useState, useEffect } from 'react';
import { If, Then } from 'react-if';

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

// Homepage component for the application
function MainPage() {

  // State variables
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(null);

  const fetchData = async () => {
    // API Calls will come here
    setPage('recent_posts');
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Render is loading page until version gets its value
  if(isLoading) {
    return (
      <div className="home-page" data-testid="home-page">
        Loading...
      </div>
    )
  }

  return (
    <div id="home-page" data-testid="home-page">
      <If condition={page === 'recent_posts'}>
        <Then>
          {/*<Post postData={postData}/> */}
          <ImageForm></ImageForm>
        </Then>
      </If>
    </div>
  )
}

export default MainPage;