// React
import { Container } from 'react-bootstrap';

function Search() {

  return (
    <Container className="outer-container" data-testid="search-page">
      {/* Temporary content (change me) */}
      <div data-testid="search-title" className="h4 mb-0">Select tags to search</div>
    </Container>
  )
}

export default Search;