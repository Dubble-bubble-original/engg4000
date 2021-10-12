/* eslint-disable no-underscore-dangle */
const db = require('./dbLib');
const { User } = require('./dbSchema');

beforeAll(async () => db.connectTest());
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
    const testUserCheck = await User.findById(testUser1._id);

    expect(testUserCheck.name).toBe(testUser1.name);

    // Delete testUser1 from db
    await User.findByIdAndDelete(testUser1._id);
  });

  test('Updating and Reading a User Document', async () => {
    // Send testUser2 to db
    await testUser2.save();
    const update = { email: 'UserTest@unb.ca' };

    // Update testUser2's email
    await User.findByIdAndUpdate(testUser2._id, update);
    const testUserCheck = await User.findById(testUser2._id);

    expect(testUserCheck.email).toBe(update.email);

    // Delete testUser2 from db
    await User.findByIdAndDelete(testUser2._id);
  });
});

describe('Ensuring Clean DB After Tests', () => {
  test('Check User Collection', async () => {
    // Get the whole user collection
    const UserCollection = await User.find();

    expect(UserCollection).toEqual([]);
  });
});
