// React
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

// Components
import LoadingSpinner from './LoadingSpinner';

function Search() {

  // State variables
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {

    // Todo: Get recent posts

    setLoading(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Render is loading page until get recent posts
  if(isLoading) {
    return (
      <Container className="outer-container" data-testid="home-page">
        <LoadingSpinner message="Looking for matching posts..." size="10rem"/>
      </Container>
    )
  }

  return (
    <Container className="outer-container" data-testid="search-page">
      {/* Temporary content (change me) */}
      <div data-testid="search-title" className="h4 mb-0">Select tags to search</div>
    </Container>
  )
}

export default Search;