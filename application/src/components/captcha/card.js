import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingIcon } from './icons';
import Challenge from './challenge';

const Card = ({ text, fetchCaptcha, submitResponse, onError }) => {
  const [key, setKey] = useState(Math.random());
  const [captcha, setCaptcha] = useState(false);
  const isMounted = useRef(false);

  const refreshCaptcha = () => {
    fetchCaptcha().then((newCaptcha) => {
      setTimeout(() => {
        if (newCaptcha?.error) {
          onError(newCaptcha?.message);
          return;
        }
        if (!isMounted.current) return;
        setKey(Math.random());
        setCaptcha(newCaptcha);
      }, 300);
    });
  };
  const completeCaptcha = (response, trail) =>
    new Promise((resolve) => {
      submitResponse(response, trail).then((verified) => {
        if (verified) {
          resolve(true);
        } else {
          refreshCaptcha();
          resolve(false);
        }
      });
    });

  useEffect(() => {
    isMounted.current = true;
    refreshCaptcha();
    return () => { isMounted.current = false; };
  }, []);

  return (
    <div className="scaptcha-card-container scaptcha-card-element">
      {captcha ? (
        <Challenge
          key={key}
          text={text}
          captcha={captcha}
          completeCaptcha={completeCaptcha}
        />
      ) : (
        <div className="scaptcha-card-loading scaptcha-card-element">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  fetchCaptcha: PropTypes.func.isRequired,
  submitResponse: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  text: PropTypes.shape({
    anchor: PropTypes.string,
    challenge: PropTypes.string,
  }).isRequired,
};

export default Card;
