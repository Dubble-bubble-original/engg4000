function fn() {
  var env = karate.env;
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'dev';
  }

  // config has all global variables for tests
  var config = {
    env: env
  }

  if (env == 'dev') {
    config.baseUrl = 'http://localhost:3001';
    config.frontendUrl = 'http://localhost:3000';
  } else if (env == 'ci') {
    // customize
  } else if (env == 'prod') {
    config.frontendUrl = 'https://notasocial.ca';
  }

  return config;
}
