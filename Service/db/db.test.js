/* eslint-disable no-underscore-dangle */
const db = require('./dbUtils');
const { User } = require('./dbSchema');
const dbName = db.generateDBName();

beforeAll(async () => db.connectTest(dbName));
afterAll(async () => db.deleteDatabase());

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
    const testUserCheck = await User.findById(testUser1._id);

    expect(testUserCheck.name).toBe(testUser1.name);
  });

  test('Updating and Reading a User Document', async () => {
    // Send testUser2 to db
    await testUser2.save();
    const update = { email: 'UserTest@unb.ca' };

    // Update testUser2's email
    await User.findByIdAndUpdate(testUser2._id, update);
    const testUserCheck = await User.findById(testUser2._id);

    expect(testUserCheck.email).toBe(update.email);
  });

  test('Deleting a User Document', async () => {
    await User.findByIdAndDelete(testUser1._id);
    const testUserCheck = await User.findById(testUser1._id);

    expect(testUserCheck).toBe(null);
  });
});
