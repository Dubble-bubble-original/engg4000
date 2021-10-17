/* eslint-disable no-underscore-dangle */
const db = require('./dbLib');
const { User } = require('./dbSchema');
const dbName = db.generateDBName();
const testUserIDs = [];

beforeAll(async () => db.connectTest(dbName));
afterEach(async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const id of testUserIDs) {
    // eslint-disable-next-line no-await-in-loop
    await User.findByIdAndDelete(id);
  }
});
afterAll(async () => db.closeDatabase());

describe('CRUD User Collection Tests', () => {
  // Create Users for the tests (One for each test)
  const testUser1 = new User({
    name: 'Test User1',
    avatar_url: '/images/avatars/G57HA12K55L23S_12.png',
    email: 'TestUser1@unb.ca'
  });
  const testUser2 = new User({
    name: 'Test User2',
    avatar_url: '/images/avatars/G57HA12K55L23S_12.png',
    email: 'TestUser2@unb.ca'
  });

  test('Creating and Reading a User Document', async () => {
    // Send testUser1 to db
    await testUser1.save();
    testUserIDs.push(testUser1._id);
    const testUserCheck = await User.findById(testUser1._id);

    expect(testUserCheck.name).toBe(testUser1.name);
  });

  test('Updating and Reading a User Document', async () => {
    // Send testUser2 to db
    await testUser2.save();
    testUserIDs.push(testUser2._id);
    const update = { email: 'UserTest@unb.ca' };

    // Update testUser2's email
    await User.findByIdAndUpdate(testUser2._id, update);
    const testUserCheck = await User.findById(testUser2._id);

    expect(testUserCheck.email).toBe(update.email);
  });
});
