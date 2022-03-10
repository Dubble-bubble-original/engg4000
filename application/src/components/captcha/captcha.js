// React
import PropTypes from 'prop-types'

// Resources
// Note: this slider captcha was taken from https://github.com/adrsch/slider-captcha
import SliderCaptcha from './slider-captcha';

// API
import { createCaptcha, verifyCaptcha } from '../../api/api.js';

function Captcha(props) {
  return (
    <SliderCaptcha 
      create={createCaptcha}
      verify={verifyCaptcha}
      callback={props.captchaSuccess}
      onError={props.captchaError}
      refObject={props.refObject}
    />
  );
}

Captcha.propTypes = {
  captchaSuccess: PropTypes.func.isRequired,
  captchaError: PropTypes.func.isRequired,
  refObject: PropTypes.object
}

export default Captcha;