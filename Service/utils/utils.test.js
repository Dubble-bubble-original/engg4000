// Test file for util functions
const UTILS = require('./utils');

// Tests for removeStaleTokens function
describe('removeStaleTokens', () => {
  beforeEach(() => {
    global.auth_tokens = new Map();
    global.auth_tokens.set('a', 1);
    global.auth_tokens.set('b', 2);
    global.auth_tokens.set('c', 3);
  });

  test('token is removed when it is in the map', () => {
    UTILS.removeStaleTokens('b');

    expect(global.auth_tokens.has('b')).toBe(false);
    expect(global.auth_tokens.size).toBe(2);
  });

  test('map is unchanged when token not in the map', () => {
    UTILS.removeStaleTokens('d');

    expect(global.auth_tokens.size).toBe(3);
  });

  test('map is cleared when size is larger than 50,000', () => {
    for (let i = 0; i < 50000; i++) {
      global.auth_tokens.set(i, 1);
    }

    UTILS.removeStaleTokens('a');

    expect(global.auth_tokens.size).toBe(0);
  });
});

// Tests for isAuthTokenStale function
describe('isAuthTokenStale', () => {
  test('token is stale if is is older than 30 minutes', () => {
    const currentTime = Date.now();
    const result = UTILS.isAuthTokenStale(currentTime, currentTime - (30 * 60 * 1000));

    expect(result).toBe(true);
  });

  test('token is fresh if is is not older than 30 minutes', () => {
    const currentTime = Date.now();
    const result = UTILS.isAuthTokenStale(currentTime, currentTime - (25 * 60 * 1000));

    expect(result).toBe(false);
  });
});

// Tests for toLowerCaseTags function
describe('toLowerCaseTags', () => {
  test('tags are all upper case', () => {
    const tags = ['FOREST', 'NATURE', 'SUNSET'];
    const expectedResult = ['forest', 'nature', 'sunset'];
    const result = UTILS.toLowerCaseTags(tags);

    expect(result).toEqual(expectedResult);
  });

  test('tags are all lower case', () => {
    const tags = ['forest', 'nature', 'sunset'];
    const expectedResult = ['forest', 'nature', 'sunset'];
    const result = UTILS.toLowerCaseTags(tags);

    expect(result).toEqual(expectedResult);
  });

  test('tags contain upper and lower case letters', () => {
    const tags = ['Forest', 'Nature', 'Sunset'];
    const expectedResult = ['forest', 'nature', 'sunset'];
    const result = UTILS.toLowerCaseTags(tags);

    expect(result).toEqual(expectedResult);
  });
});

// Tests for getImageID function
describe('getImageID', () => {
  test('get image id with file extension from S3 object url', () => {
    const imageUrl = 'https://senior-design-img-bucket.s3.amazonaws.com/image.jpg';
    const expectedResult = 'image.jpg';
    const result = UTILS.getImageID(imageUrl);

    expect(result).toEqual(expectedResult);
  });

  test('get image id with no file extension from S3 object url', () => {
    const imageUrl = 'https://senior-design-img-bucket.s3.amazonaws.com/image';
    const expectedResult = 'image';
    const result = UTILS.getImageID(imageUrl);

    expect(result).toEqual(expectedResult);
  });
});

// Tests for cleanString function
describe('cleanString', () => {
  test('clean string containing bad words', () => {
    const string = 'This Fuck String Shit is Damn clean hell now!';
    const expectedResult = 'This **** String **** is **** clean **** now!';
    const result = UTILS.cleanString(string);

    expect(result).toEqual(expectedResult);
  });

  test('clean string containing no bad words', () => {
    const string = 'This String is clean!';
    const expectedResult = 'This String is clean!';
    const result = UTILS.cleanString(string);

    expect(result).toEqual(expectedResult);
  });
});
