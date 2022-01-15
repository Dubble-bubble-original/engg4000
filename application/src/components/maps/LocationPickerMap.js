// React
import PropTypes from 'prop-types'
import { useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api';

// Map size expands to fit its container's size
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default map center is new brunswick
const newBrunswick = {
  lat: 46.600410,
  lng: -66.329985,
  zoom: 6
}

function LocationPickerMap(props) {

  // Get the user's position using the broswer's geolocation API
  function getUserPosition(map) {
    // Try HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          updatePosition(pos);
          map.panTo(pos);
        },
        () => {
          handleLocationError(true, map);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map);
    }
  }

  // Show info box with error message if can't get user location
  function handleLocationError(browserHasGeolocation, map) {
    const infoWindow = new window.google.maps.InfoWindow();
    infoWindow.setPosition(map.getCenter());
    infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.' 
        : 'Error: Your browser doesn\'t support geolocation.'
    );
    infoWindow.open(map);
  }

  // Create a custom map control inside the given div
  function customControl(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '8px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to use your current location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Use Current Location';
    controlUI.appendChild(controlText);

    // Setup the click event listener
    controlUI.addEventListener('click', () => {
      getUserPosition(map);
    });
  }

  // Add the 'Use Current Location' button when map loads
  const handleOnLoad = map => {
    const centerControlDiv = document.createElement('div');
    customControl(centerControlDiv, map);
    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  };

  // Allow picking location by clicking on the map
  const [position, setPosition] = useState(null);
  function clickHandler(e) {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    updatePosition(newPosition);
  }

  function updatePosition(newPosition) {
    // Update state (update marker on the map)
    setPosition(newPosition);
    // Trigger the callback from the props (if given)
    if (props.onPositionChange) props.onPositionChange(newPosition);
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={newBrunswick}
      zoom={newBrunswick.zoom}
      clickableIcons={false}
      onClick={clickHandler}
      options={{
        mapTypeControl: false,
        streetViewControl: false
      }}
      onLoad={map => handleOnLoad(map)}
    >
      <Marker 
        position={position}
        draggable={true}
        onDragEnd={clickHandler}
      />
    </GoogleMap>
  );
}

LocationPickerMap.propTypes = {
  onPositionChange: PropTypes.func
}

export default LocationPickerMap;