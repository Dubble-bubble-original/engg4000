exports.removeStaleTokens = (token) => {
  // Clear the stale token
  if (auth_tokens.has(token)) {
    auth_tokens.delete(token);
  }

  // Never let auth token map grow larger than 50,000 entries
  if (auth_tokens.size >= 50000) {
    auth_tokens.clear();
  }
};

// Auth token is stale if it is >= 30 minutes old.
exports.isAuthTokenStale = (currentTime, timeStamp) => (
  Math.floor((currentTime - timeStamp) / 1000) / 60 >= 30
);

// Sorts the returned posts with most matching tags first
exports.sortPosts = (postData, providedTags) => {
  const postMap = new Map();

  postData.forEach((post) => {
    providedTags.forEach((tag) => {
      if (postMap.has(post)) {
        let value = postMap.get(post);
        if (post.tags.includes(tag)) {
          postMap.delete(post);
          value += 1;
          postMap.set(post, value);
        }
      }
      else if (post.tags.includes(tag)) {
        postMap.set(post, 1);
      }
    });
  });

  // Order the posts with most matching tags first
  const sortedPostMap = new Map([...postMap.entries()].sort((a, b) => b[1] - a[1]));
  const sortedPostData = [];

  // Update the postData with the new sorted posts
  for (const [key] of sortedPostMap.entries()) {
    sortedPostData.push(key);
  }

  return sortedPostData;
};
