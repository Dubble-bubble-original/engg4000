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
    email: 'TestUser1@unb.ca',
    access_key: '7f3a187f-115b-455d-892b-d8465e3167ea'
  });

  test('Creating and Reading a User Document', async () => {
    // Send testUser1 to db
    await testUser1.save();
    const testUserCheck = await User.findById(testUser1._id);

    expect(testUserCheck.name).toBe(testUser1.name);
  });

  test('Deleting a User Document', async () => {
    await User.findByIdAndDelete(testUser1._id);
    const testUserCheck = await User.findById(testUser1._id);

    expect(testUserCheck).toBe(null);
  });
});
