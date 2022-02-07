// React
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types'
import { When } from 'react-if';

function LoadingSpinner(props) {

  return (
    <div className="text-center">
      <Spinner 
        animation="border"
        role="status"
        variant="primary"
        style={{width: props.size, height: props.size}}
      />
      <When condition={props.message}>
        <br/><br/>
        <span className="h4">{props.message}</span>
      </When>
    </div>
  )
}

LoadingSpinner.defaultProps = {
    message: '',
    size: '2rem'
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
    size: PropTypes.string
}

export default LoadingSpinner;