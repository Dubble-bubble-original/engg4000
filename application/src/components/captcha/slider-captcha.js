import { useState } from 'react';
import PropTypes from 'prop-types';
import Anchor from './anchor';
import Theme from './theme';

const fetchCaptcha = (create) => () =>
  (create instanceof Function)
    ? create() // Use provided promise for getting background and slider
    : fetch(create, {
        // Use create as API URL for fetch
        method: 'GET',
        credentials: 'include',
      }).then((message) => message.json());

const fetchVerification = (verify) => (response, trail) =>
  (verify instanceof Function)
    ? verify(response, trail) // Use provided promise for verifying captcha
    : fetch(verify, {
        // Verification API URL provided instead
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response,
          trail,
        }),
      }).then((message) => message.json());

const SliderCaptcha = ({
  callback,
  create,
  verify,
  onError,
  text,
  refObject
}) => {
  const [verified, setVerified] = useState(false);
  refObject.current.reset = () => setVerified(false);
  const submitResponse = (response, trail) =>
    new Promise((resolve) => {
      fetchVerification(verify)(response, trail)
        .then((verification) => {
          if (verification?.error) {
            onError(verification?.message);
            resolve(false);
          }
          else if (
            !verification.result ||
            verification.result !== 'success' ||
            !verification.token
          ) {
            resolve(false);
          } else {
            setTimeout(() => {
              callback(verification.token);
              setVerified(true);
            }, 500);
            resolve(true);
          }
        });
    });
  return (
    <div className="scaptcha-container">
      <Theme/>
      <Anchor
        text={text}
        fetchCaptcha={fetchCaptcha(create)}
        onError={onError}
        submitResponse={submitResponse}
        verified={verified}
      />
    </div>
  );
};

SliderCaptcha.propTypes = {
  callback: PropTypes.func,
  onError: PropTypes.func,
  create: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  verify: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  text: PropTypes.shape({
    anchor: PropTypes.string,
    challenge: PropTypes.string,
  }),
  refObject: PropTypes.object
};

SliderCaptcha.defaultProps = {
  callback: (token) => console.log(token), // eslint-disable-line no-console
  create: 'captcha/create',
  verify: 'captcha/verify',
  text: {
    anchor: 'I\'m not a robot',
    challenge: 'Slide to finish the puzzle',
  },
  refObject: {current: {}}
};

export default SliderCaptcha;
