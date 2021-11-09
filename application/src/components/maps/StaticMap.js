// React
import PropTypes from 'prop-types'
import { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Modal } from 'react-bootstrap';
import '../components.css';

// Map size expands to fit its container's size
const containerStyle = {
  width: '100%',
  height: '100%'
};
const defaultZoom = 6;

function StaticMap(props) {
  const [showModal, setShowModal] = useState(false);
  const zoom = props.zoom ? props.zoom : defaultZoom;

  const baseURL = 'https://maps.googleapis.com/maps/api/staticmap?';
  const parameters = [
    'zoom='+zoom,
    'size='+props.width+'x'+props.height,
    'markers='+props.position?.lat+','+props.position?.lng,
    'key='+process.env.REACT_APP_MAPS_API_KEY
  ];
  const URL = encodeURI(baseURL + parameters.join('&'));

  return (
    <div>
      <img src={URL} onClick={() => setShowModal(true)} className="clickable"></img>

      <Modal size='xl' scrollable show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body style={{width:'100%', height:window.innerHeight}}>
          <DynamicMap position={props.position} zoom={zoom} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

StaticMap.propTypes = {
  zoom: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  position: PropTypes.object
}

function DynamicMap(props) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={props.position}
      zoom={props.zoom}
      clickableIcons={false}
      options={{
        mapTypeControl: false,
        streetViewControl: false
      }}
    >
      <Marker 
        position={props.position}
      />
    </GoogleMap>
  );
}

DynamicMap.propTypes = {
  position: PropTypes.object,
  zoom: PropTypes.number
}

export default StaticMap;