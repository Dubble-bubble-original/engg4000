// React
import { useEffect, useState } from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { When } from 'react-if';
import PropTypes from 'prop-types'

// Resources
import { MdErrorOutline, MdRefresh } from 'react-icons/md';
import { FRow, FCol } from './FlexContainers';
import TagButtonGroup from './TagButtonGroup';
import Post from './post/Post';

// API
import { getPostsByTags } from '../api/api.js';

function CenterContainer(props) {
  return (
    <div className="d-flex">
      <Container className="outer-container" style={{width:'auto'}}>
        {props.children}
      </Container>
    </div>
  );
}
CenterContainer.propTypes = {
  children: PropTypes.node
}


function Search() {
  // State variables
  const [tags, setTags] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [numResults, setNumResults] = useState(0);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimerId, setLoadingTimerId] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchPosts = () => {
    // Call getPost even if the tags haven't changed
    if (tagsEqual() && page===1) getPosts();
    // Else update tags & page (which will trigger getPosts)
    else {
      setSearchTags(tags);
      setPage(1);
    }
  }

  const refreshPosts = () => {
    // Call getPost even if the page hasn't changed
    if (page === 1) getPosts();
    // Else reset the page (which will trigger getPosts)
    else setPage(1);
  }

  const loadMorePosts = () => {
    setPage(page+1);
  }

  const getPosts = async () => {
    // Should not work if called without any tag selected
    if (searchTags.length === 0) return;

    // Reset UI
    if (page===1) {
      setShowResults(false);
      setNumResults(0);
    }

    // Add a minimum load time
    if (page>1) fakeLoading(setIsPaginating);
    else fakeLoading(setIsLoading);

    // Call API
    const result = await getPostsByTags(searchTags, page);
    if (result) {
      // Success
      setNumResults(result.totalCount);
      if (page>1) addPosts(result.posts);
      else setPosts(result.posts);
    }
    else {
      // Error occured
      setPosts([]);
    }

    setShowResults(true);
  }

  // Get posts when searched tags are updated
  useEffect(getPosts, [searchTags, page]);

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

  const tagsEqual = () => {
    if (tags.length !== searchTags.length) return false;
    const a1 = tags.sort();
    const a2 = searchTags.sort();
    let result = true;
    a1.forEach((e, i) => {
      if (e !== a2[i]) result = false;
    })
    return result;
  }

  const addPosts = (newPosts) => {
    setPosts(posts.concat(newPosts));
  }

  return (
    <>
      <Container className="outer-container" data-testid="search-page">
        <div data-testid="search-title" className="h4">Select tags to search</div>
        <TagButtonGroup tags={tags} setTags={setTags} />
        <Alert
          variant="danger"
          className="mb-0 mt-3"
          hidden={tags.length}
        >
          <MdErrorOutline/> You must select at least one tag.
        </Alert>
        <Button 
          className="mt-3"
          disabled={!tags.length}
          onClick={searchPosts}
        >
          Search
        </Button>
      </Container>

      <When condition={searchTags.length>0}>
        <When condition={showResults && (!isLoading || isPaginating)}>
          <Container className="outer-container" data-testid="search-page">
            <FRow className="h4">
              <FCol style={{width:'100%'}}>Results ({numResults})</FCol>
              <FCol>
                <MdRefresh 
                  className="clickable hover-outline rounded h2 mb-0" 
                  style={{color:'var(--bs-primary)'}} 
                  onClick={refreshPosts}
                />
              </FCol>
            </FRow>
            <FRow>
              <FCol>Tags:</FCol>
              <FCol style={{width:'100%'}}>
                <div className="tag-container">
                  {
                    searchTags.sort().map(tag => 
                      <Button 
                        variant="outline-primary" 
                        className="tag" 
                        key={tag}
                      >
                        {tag}
                      </Button>
                    )
                  }
                </div>
              </FCol>
            </FRow>
          </Container>

          <When condition={posts.length > 0}>
            <div>
              {
                posts.map((post, index) => 
                  <Post 
                    postData={post}
                    key={index}
                  />
                )
              }
            </div>
            
            <When condition={posts.length < numResults && !isPaginating}>
              <CenterContainer>
                <Button onClick={loadMorePosts}>Load More</Button>
              </CenterContainer>
            </When>
          </When>
        </When>

        <When condition={!showResults || isLoading || isPaginating}>
          <CenterContainer>
            <Spinner animation="border" variant="primary" />
          </CenterContainer>
        </When>
      </When>
    </>
  )
}

export default Search;