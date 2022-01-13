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
    config.baseUrl = 'http://localhost:9000';
  } else if (env == 'ci') {
    // customize
  } else if (env == 'prod') {
    // customize
  }

  // Create a global user and post
  var result = karate.callSingle('classpath:./utils/global_user_post.feature', config);
  // Set Post ID
  config.postID = result.response.post._id;
  // Set Author ID
  config.authorID = result.response.author._id;

  return config;
}
