import PropTypes from 'prop-types';
import React from 'react';

// Import CSS
import '../tooltip/ToolTip.css'

function ToolTip({ text, children, ...otherprops }) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="tooltip-container">
      <div className={show ? 'tooltip-box visible' : 'tooltip-box'}>{text}
        {/* <span className="tooltip-arrow" /> */}
      </div>
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} {...otherprops}>{children}</div>
    </div>
  );
}

ToolTip.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node
}

export default ToolTip;