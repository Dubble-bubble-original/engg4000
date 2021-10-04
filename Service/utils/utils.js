exports.removeStaleTokens = (token) => {
    // Clear the stale token
    if (auth_tokens.has(token)) {
        auth_tokens.delete(token);
    }

    // Never let auth token map grow larger than 50,000 entries
    if (auth_tokens.size >= 50000) {
        auth_tokens.clear();
    }
}

exports.isAuthTokenStale = (currentTime, timeStamp) => {
    // Auth token is stale if it is >= 30 minutes old.
    return Math.floor((currentTime - timeStamp)/1000)/60 >= 30;
}
