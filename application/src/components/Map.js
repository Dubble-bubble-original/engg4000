// React
import PropTypes from 'prop-types'
import { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};
 
function Map() {
  
  const [currentLocation, setCurrentLocation] = useState({lat: 0, lng: 0});

  // FIX THIS vvvvvvvvv
  
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              console.log('Got position!', currentLocation);
            },
            () => {
              console.log('Could not get location');
            }
          );
        } else {
          // Browser doesn't support Geolocation
          console.log('Browser does not support Geolocation');
        }

  const [position, setPosition] = useState({lat: 0, lng: 0});
  function clickHandler(e) {
    setPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={5}
        onClick={clickHandler}
        options={{
          mapTypeControl: false,
          streetViewControl: false
        }}
      >
        <Marker 
          position={position}
          draggable={true}
        />
      </GoogleMap>
    </LoadScript>
  );
}

Map.propTypes = {
  data: PropTypes.func
}

export default Map;