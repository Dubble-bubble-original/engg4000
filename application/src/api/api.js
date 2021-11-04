/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import logger from '../logger/logger';

// Auth Token
let authToken;

// Get environment
require('dotenv').config();
const ENV = process.env;

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
    logger.info(error);
  }
}

// Get Versions
export const getVersion = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: serviceUrl+'/version',
      headers: {
        token: authToken
      }
    });

    return response.data;
  } catch(error) {
    console.log(error);
    if(error.response.status === 401) {
      // Get New Auth Token
      await getAuthToken();
      return null;
    }
  }
}
