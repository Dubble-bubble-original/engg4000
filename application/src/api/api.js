import axios from 'axios';
import logger from '../logger/logger';

// Auth Token
let authToken;

// Get environment
require('dotenv').config();
const ENV = process.env;

// Retry Variables
const MAX_RETRY_LIMIT = 2;

// Get the service url from the environment file
const serviceUrl = ENV.REACT_APP_SERVICE_URL;

// Get Auth token
export const getAuthToken = async () => {
  try {
    const response = await axios({
      method: 'POST',
      url: serviceUrl+'/auth'
    })
    authToken = response.data.token;
  } catch(error) {
    logger.warn(error);
  }
}

// Get Versions
export const getVersion = async () => {
  return await requestWithToken(async() => {
      const response = await axios({
          method: 'GET',
          url: serviceUrl+'/version',
          headers: {
              token: authToken
          }
      });
      return response.data;
  });
}

const requestWithToken = async (request) => {
  for (let i=0; i<MAX_RETRY_LIMIT; i++) {
      try {
          // Make the given request
          return await request();
      } catch(error) {
          if(error?.response?.status === 401) {
              // Get New Auth Token and retry
              await getAuthToken();
          }
          else {
              // Don't retry if a different error occurs
              logger.warn(error);
              return null;
          }
      }
  }
  logger.warn('Unable to get auth token after '+MAX_RETRY_LIMIT+' tries.');
  return null;
}
