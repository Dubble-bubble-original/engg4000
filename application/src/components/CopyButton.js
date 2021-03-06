// React
import { useEffect, useState } from 'react';
import { Button, FormText } from 'react-bootstrap';
import { MdContentCopy } from 'react-icons/md';
import PropTypes from 'prop-types'

// Resources
import logger from '../logger/logger';

function CopyButton(props) {
  const [isCopied, setIsCopied] = useState(false);
  const [timeoutID, setTimeoutID] = useState(null);

  async function copyTextToClipboard(text) {
    // Try to use clipboard API
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    }
    else {
      // Use this as last resort (deprecated)
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(props.value)
      .then(() => {
        // Show feedback on success
        setIsCopied(true);
        // Hide it after a few seconds
        setTimeoutID(
          setTimeout(() => {
            setIsCopied(false);
          }, 1500)
        );
      })
      .catch((err) => {
        logger.warn('Could not copy to clipboard: '+err);
      });
  }

  useEffect(() => {
    // Stop the timer if the component unmounts
    return () => clearTimeout(timeoutID);
  });

  return (
    <>
      <Button 
        title="Copy"
        onClick={handleCopyClick}
        data-testid="copy-button"
        style={{
          padding: '0.2rem',
          lineHeight: 0
        }}
      >
        <MdContentCopy/>
      </Button>
      <FormText muted>
        {isCopied ? ' Copied!' : ''}
      </FormText>
    </>
  );
}

CopyButton.propTypes = {
  value: PropTypes.string
}

export default CopyButton;