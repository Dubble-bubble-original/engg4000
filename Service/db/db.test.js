const db = require('./dbUtils');
const { User } = require('./dbSchema');
const dbName = db.generateDBName();

beforeAll(async () => db.connectTest(dbName));
afterAll(async () => db.deleteDatabase());

describe('CRUD User Collection Tests', () => {
  const testUser = new User({
    name: 'Test User1',
    avatar_url: '/images/avatars/G57HA12K55L23S_12.png',
    email: 'TestUser1@unb.ca',
    access_key: '7f3a187f-115b-455d-892b-d8465e3167ea'
  });

  // TODO: Add tests for creating, getting, and deleting user post document

  test('Creating and Reading a User Document', async () => {
    await testUser.save();
    const testUserCheck = await User.findById(testUser._id);

    expect(testUserCheck.name).toBe(testUser.name);
  });

  test('Deleting a User Document', async () => {
    await User.findByIdAndDelete(testUser._id);
    const testUserCheck = await User.findById(testUser._id);

    expect(testUserCheck).toBe(null);
  });
});
