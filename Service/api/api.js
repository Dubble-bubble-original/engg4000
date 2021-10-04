const uuidv4 = require('uuid').v4;
const UTILS = require('../utils/utils');

exports.createAuthToken = (req, res) => {
    let uuid = uuidv4();
    let timestamp = Date.now();
    auth_tokens.set(uuid, timestamp);
    
    let response = {token: uuid, timestamp: timestamp};
    return res.send(response);
}

exports.verifyAuthToken = (req, res, next) => {
    const token = req.header('token');
    const currentTime = Date.now();

    // No auth token provided
    if (!token) {
        logger.info('No Authentication Token Provided');
        return res.status(401).send('No Authentication Token Provided');
    }

    const timeStamp = auth_tokens.get(token);

    // Invalid auth token or stale
    if (!timeStamp || UTILS.isAuthTokenStale(currentTime, timeStamp)) {
        UTILS.removeStaleTokens(token);
        logger.info('Invalid Authentication Token Provided');
        return res.status(401).send('Invalid Authentication Token Provided');
    } else {
        next();
    }
}

exports.version = (req, res, next) => {
    const VERSION = process.env.VERSION;
    return res.send(`Service v${VERSION}`);
};
