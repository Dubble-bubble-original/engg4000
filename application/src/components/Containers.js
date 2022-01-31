// React
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap';

// These FRow and FCol components are just container divs with a specific class attached to them.
// The "complicated stuff" is just so that it preserves props and classes given, and allow children within them.

function FRow(props) {
  const {children, className, ...otherProps} = props;
  return (
    <div className={'f-row ' + (className??'')} {...otherProps} >
        {children}
    </div>
  );
}

FRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

function FCol(props) {
  const {children, className, ...otherProps} = props;
  return (
    <div className={'f-col ' + (className??'')} {...otherProps} >
        {children}
    </div>
  );
}

FCol.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

function CenterContainer(props) {
  return (
    <div className="d-flex">
      <Container className="outer-container w-auto">
        {props.children}
      </Container>
    </div>
  );
}
CenterContainer.propTypes = {
  children: PropTypes.node
}

export {FRow, FCol, CenterContainer};