// React
import { useState, useEffect } from 'react';
import { Button, Container, Alert, Fade } from 'react-bootstrap';
import { MdErrorOutline, MdRefresh } from 'react-icons/md';
import { When } from 'react-if';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Components
import Post from './post/Post';
import { FRow, FCol, CenterContainer } from './Containers';
import LoadingSpinner from './LoadingSpinner';

// API
import { getRecentPosts } from '../api/api.js';

// Home component for the application
function Home() {

  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [numResults, setNumResults] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [loadingTimerId, setLoadingTimerId] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error429Message, setError429Message] = useState(null);

  const refreshPosts = () => {
    // Call getPost even if the lastDate hasn't changed
    if (lastDate === null) getPosts();
    // Else reset the lastDate (which will trigger getPosts)
    else setLastDate(null);
  }

  const loadMorePosts = () => {
    // Update the last date (which will trigger getPosts)
    const lastPost = posts[posts.length-1];
    setLastDate(lastPost.date_created);
  }

  const getPosts = async () => {
    // Reset
    setIsError(false);
    setError429Message(null)
    setNumResults(0);

    // Add a minimum load time
    if (lastDate) fakeLoading(setIsPaginating);
    else fakeLoading(setIsLoading);

    // Call API
    let result = await getRecentPosts(lastDate);
    if (!result?.error) {
      // Success
      setNumResults(result.totalCount);
      if (lastDate) addPosts(result.posts);
      else setPosts(result.posts);
    }
    else {
      // Error occured
      setIsError(true);
      setError429Message(result.message)
    }

    setShowResults(true);
  }

  const addPosts = (newPosts) => {
    setPosts(posts.concat(newPosts));
  }

  // Get recent posts on page load & whenever lastDate changes
  useEffect(getPosts, [lastDate]);

  const LOAD_DURATION = 800;
  // Set the isLoading state for the given duration
  const fakeLoading = (setLoad) => {
    // Randomize duration (+-200ms)
    const duration = LOAD_DURATION + Math.floor(Math.random()*400)-200;
    // Stop any previous loading (if any)
    clearTimeout(loadingTimerId);
    // Start loading
    setLoad(true);
    // Stop loading after the given duration
    setLoadingTimerId(
      setTimeout(() => {
        setLoad(false);
      }, duration)
    );
  }

  return (
    <>
      <Container className="home-page outer-container" data-testid="home-page">
        <FRow className="h4 mb-0" data-testid="home-title">
          <FCol className="w-100">Recent posts</FCol>
          <FCol>
            <MdRefresh 
              className="clickable hover-outline rounded h2 mb-0" 
              style={{color:'var(--bs-primary)'}} 
              onClick={refreshPosts}
            />
          </FCol>
        </FRow>
      </Container>

      <When condition={isError && !isPaginating}>
        <Container className="outer-container">
          <Alert
            variant="danger"
            className="mb-0"
          >
            <MdErrorOutline/> {(error429Message)?error429Message:'Recent posts could not be retrieved. Please try again later.'}
          </Alert>
        </Container>
      </When>

      <Fade in={showResults && (!isLoading || isPaginating)}>
        <div hidden={!(showResults && (!isLoading || isPaginating))}>
          <TransitionGroup>
            {
              posts.map((post, index) =>
                <CSSTransition
                  key={index}
                  timeout={150}
                  classNames="fade-in"
                >
                  <Post
                    postData={post}
                  />
                </CSSTransition>
              )
            }
          </TransitionGroup>

          <When condition={posts.length < numResults && !isPaginating}>
            <CenterContainer>
              <Button onClick={loadMorePosts}>Load More</Button>
            </CenterContainer>
          </When>
        </div>
      </Fade>

      <When condition={!showResults || isLoading || isPaginating}>
        <CenterContainer>
          <LoadingSpinner/>
        </CenterContainer>
      </When>
    </>
  )
}

export default Home;