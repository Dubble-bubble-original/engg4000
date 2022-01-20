// React
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types'

function LoadingSpinner(props) {

  return (
    <div className="loading-spinner">
        <Spinner className="m-3" animation="border" role="status" variant="primary" style={{width: props.size, height: props.size}}/>
        <br/>
        <span className="h4">{props.message}</span>
    </div>
  )
}

LoadingSpinner.defaultProps = {
    message: 'Loading...',
    size: '10rem'
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
    size: PropTypes.string
}

export default LoadingSpinner;