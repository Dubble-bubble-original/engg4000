// import axios from 'axios';
// import logger from '../../logger/logger';

import { geocode } from '../../api/api.js';

// const GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json';
const DEFAULT_LOCATION_STRING = 'Unknown Location';

// Get a location_string given lat/lng position
const geocodePosition = (pos, callback) => {

  geocode(pos.lat, pos.lng)
    .then(result => {
      callback(result.locationString);
    })
    .catch(() => {
      callback(DEFAULT_LOCATION_STRING);
    });

  // axios.get(GEOCODE_API, {
  //   params: { 
  //     latlng: pos.lat+','+pos.lng,
  //     language: 'en',
  //     result_type: 'country|administrative_area_level_1|locality',
  //     key: process.env.REACT_APP_GEO_API_KEY 
  //   }
  // })
  // .then((response) => {
  //   const status = response.data.status;
  //   if (status === 'OK') {
  //     const location_string = extractGeocodeResult(response.data.results);
  //     callback(location_string);
  //   }
  //   else {
  //     // Return default for all other status:
  //     // OVER_QUERY_LIMIT, ZERO_RESULTS, REQUEST_DENIED, INVALID_REQUEST, UNKNOWN_ERROR
  //     logger.error('Geocoding failed: ' + status)
  //     callback(DEFAULT_LOCATION_STRING);
  //   }
  // })
  // .catch((e) => {
  //   logger.error('Geocoding error: ' + e.message)
  //   callback(DEFAULT_LOCATION_STRING);
  // });
}

// const extractGeocodeResult = (results) => {
//   // Extract the country, province, city (if possible)
//   let country, province, city;
//   const foundAll = () => country && province && city;
//   for (let i=results.length-1; i>=0 && !foundAll(); i--) {
//     let components = results[i].address_components;
//     for (let j=0; j<components.length && !foundAll(); j++) {
//       let component = components[j];
//       if (!country && component.types.includes('country')) {
//         country = component;
//       }
//       if (!province && component.types.includes('administrative_area_level_1')) {
//         province = component;
//       }
//       if (!city && component.types.includes('locality')) {
//         city = component;
//       }
//     }
//   }

//   let location_string = DEFAULT_LOCATION_STRING;
//   if (country) {
//     location_string = country.long_name;
//     if (province) {
//       if (city) {
//         // If city found, use short name for province
//         location_string = city.long_name + ', ' + province.short_name + ', ' + location_string;
//       }
//       else {
//         // Else use long name for province
//         location_string = province.long_name + ', ' + location_string;
//       }
//     }
//   }
//   return location_string;
// }

export {
  geocodePosition
};