import axios from 'axios';
import logger from '../logger/logger';

// Use credentials for Axios (needed to send cookies needed for express-session)
axios.defaults.withCredentials = true

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
      url: serviceUrl + '/auth'
    })
    authToken = response.data.token;
  } catch(error) {
    logger.warn(error);
  }
}

// Get post by access key
export const getPostByAccessKey = async (accessKey) => {
  return await requestWithToken(async() => {
    const response = await axios({
        method: 'GET',
        url: serviceUrl + '/userpost/' + accessKey,
        headers: {
          'token': authToken
        }
    });
    return response.data;
  });
}

// Get posts by tags
export const getPostsByTags = async (tags, page) => {
  return await requestWithToken(async() => {
    const response = await axios({
        method: 'POST',
        url: serviceUrl + '/userposts',
        data: { tags, page },
        headers: {
          'token': authToken,
          'Content-Type': 'application/json',
        }
    });
    return response.data;
  });
}

// Get recent posts
export const getRecentPosts = async (date) => {
  return await requestWithToken(async() => {
    const response = await axios({
        method: 'POST',
        url: serviceUrl + '/recentposts',
        data: { date },
        headers: {
          'token': authToken,
          'Content-Type': 'application/json',
        }
    });
    return response.data;
  });
}

// Delete post
export const deletePostByID = async (_id) => {
  return await requestWithToken(async() => {
    const response = await axios({
        method: 'DELETE',
        url: serviceUrl + '/post/' + _id,
        headers: {
          'token': authToken
        }
    });
    return response.data;
  });
}

// Create an image
export const postImage = async (file) => {
  return await requestWithToken(async() => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios({
      method: 'POST',
      url: serviceUrl + '/image',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'token': authToken
      }
    });
    return response.data;
  });
}

// Get an image
export const getImage = async (id) => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'GET',
      url: serviceUrl + '/image/' + id,
      headers: {
        'token': authToken
      }
    });
    return response.data;
  });
}

// Delete an image
export const deleteImage = async (id) => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'DELETE',
      url: serviceUrl + '/image/' + id,
      headers: {
        'token': authToken
      }
    });
    return response.data
  });
}

// Upload images required for user and user post
export const postImages = async (avatar, picture) => {
  return await requestWithToken(async() => {
    const formData = new FormData();
    if (avatar) formData.append('avatar', avatar);
    if (picture) formData.append('picture', picture);

    const response = await axios({
      method: 'POST',
      url: serviceUrl + '/postimages',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'token': authToken
      }
    });
    return response.data;
  });
}

// Create a user and user post
export const createFullPost = async (avatarId, pictureId, user, post, captchaToken) => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'POST',
      url: serviceUrl + '/post',
      data: {
        avatarId,
        pictureId,
        user,
        post
      },
      headers: {
        'Content-Type': 'application/json',
        'token': authToken,
        'captcha-token': captchaToken
      }
    });
    return response.data;
  });
}

// Create captcha
export const createCaptcha = async () => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'GET',
      url: serviceUrl + '/captcha/create',
      headers: {
        'token': authToken
      }
    });
    return response.data;
  });
}

// Verify captcha
export const verifyCaptcha = async (resp, trail) => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'POST',
      url: serviceUrl + '/captcha/verify',
      data: {
        response: resp,
        trail: trail
      },
      headers: {
        'Content-Type': 'application/json',
        'token': authToken
      }
    });
    return response.data;
  });
}

// Send email with access key
export const sendAccessKeyEmail = async (access_key, to_email, author_name, post_title) => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'POST',
      url: serviceUrl + '/akemail',
      data: {
        access_key,
        to_email,
        author_name,
        post_title
      },
      headers: {
        'Content-Type': 'application/json',
        'token': authToken
      }
    });
    return response.data;
  });
}

// Send email with access key
export const sendAccessKeyEmail = async (access_key, to_email, author_name, post_title) => {
  return await requestWithToken(async() => {
    const response = await axios({
      method: 'POST',
      url: serviceUrl + '/akemail',
      data: {
        access_key,
        to_email,
        author_name,
        post_title
      },
      headers: {
        'Content-Type': 'application/json',
        'token': authToken
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
      else if (error?.response?.status === 403) {
        return {status: 403};
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
