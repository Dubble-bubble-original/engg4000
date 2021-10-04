import './App.css';
import Button from 'react-bootstrap/Button';
import logger from './logger/logger';

function App() {

  const message = () => {
    logger.info("Info logger");
    logger.warn("Warning logger");
    logger.error("Error logger");
    logger.debug("Debug logger");
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Frontend for the product
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br/>
        <Button onClick={message}>Bootsrap button</Button>
      </header>
    </div>
  );
}

export default App;
