import { geocode } from '../../api/api.js';

const DEFAULT_LOCATION_STRING = 'Unknown Location';

// Get a location_string given lat/lng position
const geocodePosition = (pos, setErrorMsg, callback) => {
  // Call backend API
  geocode(pos.lat, pos.lng)
    .then(result => {
      if (result?.error) {
        // Too many requests error
        setErrorMsg(result?.message);
        callback(DEFAULT_LOCATION_STRING);
      }
      else {
        // Success
        setErrorMsg('');
        callback(result.locationString);
      }
    })
    .catch(() => {
      setErrorMsg('');
      callback(DEFAULT_LOCATION_STRING);
    });
}

export {
  geocodePosition,
  DEFAULT_LOCATION_STRING
};