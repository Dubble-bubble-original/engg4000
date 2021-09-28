// Test file for util functions
const UTILS = require('../utils/utils');

// Tests for removeStaleTokens function
describe('removeStaleTokens', () => {
    global.auth_tokens = new Map();
    global.auth_tokens.set('a', 1);
    global.auth_tokens.set('b', 2);
    global.auth_tokens.set('c', 3);

    test('token is removed when it is in the map', () => {
        UTILS.removeStaleTokens('b');

        expect(global.auth_tokens.has('b')).toBe(false);
        expect(global.auth_tokens.size).toBe(2);
    });

    test('map is unchanged when token not in the map', () => {
        UTILS.removeStaleTokens('d');

        expect(global.auth_tokens.size).toBe(2);
    });
});

// Tests for isAuthTokenStale function
describe('isAuthTokenStale', () => {
    test('token is stale if is is older than 30 minutes', () => {
        const currentTime = Date.now();
        let result = UTILS.isAuthTokenStale(currentTime, currentTime-(30*60*1000));

        expect(result).toBe(true);
    });

    test('token is fresh if is is not older than 30 minutes', () => {
        const currentTime = Date.now();
        let result = UTILS.isAuthTokenStale(currentTime, currentTime-(25*60*1000));

        expect(result).toBe(false);
    });
});
