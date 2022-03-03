import { geocode } from '../../api/api.js';

const DEFAULT_LOCATION_STRING = 'Unknown Location';

// Get a location_string given lat/lng position
const geocodePosition = (pos, callback) => {
  // Call backend API
  geocode(pos.lat, pos.lng)
    .then(result => {
      callback(result.locationString);
    })
    .catch(() => {
      callback(DEFAULT_LOCATION_STRING);
    });
}

export {
  geocodePosition
};