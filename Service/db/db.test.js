const { ObjectId } = require('mongoose').Types;
const db = require('./dbUtils');
const { User, UserPost } = require('./dbSchema');
const dbName = db.generateDBName();

beforeAll(async () => db.connectTest(dbName));
afterAll(async () => db.deleteDatabase());

describe('CRUD User Collection Tests', () => {
  const testUser = new User({
    name: 'Test User1',
    avatar_url: '/images/avatars/G57HA12K55L23S_12.png',
    access_key: '7f3a187f-115b-455d-892b-d8465e3167ea'
  });

  const testUserPost = new UserPost({
    author: '5349b4ddd2781d08c09890f3',
    body: 'Went hiking in a beautiful trail in Cape Breton with the family.',
    tags: ['nature', 'hiking', 'fall'],
    title: 'Gorgeous Trail!',
    img_url: 'https://senior-design-img-bucket.s3.amazonaws.com/elmo.gif',
    date_created: 1644543150830,
    location: {
      lat: 0,
      lng: 0
    },
    location_string: 'New Brunswick, Canada',
    true_location: true,
    flagged: false,
    access_key: '7f3a187f-115b-455d-892b-d8465e3167ea',
    uid: new ObjectId()
  });

  test('Creating and Reading a User Document', async () => {
    await testUser.save();
    const testUserCheck = await User.findById(testUser._id);

    expect(testUserCheck.name).toBe(testUser.name);
  });

  test('Creating and Reading a UserPost Document', async () => {
    await testUserPost.save();
    const testUserPostCheck = await UserPost.findById(testUserPost._id);

    expect(testUserPostCheck.title).toBe(testUserPost.title);
  });

  test('Deleting a User Document', async () => {
    await User.findByIdAndDelete(testUser._id);
    const testUserCheck = await User.findById(testUser._id);

    expect(testUserCheck).toBe(null);
  });

  test('Deleting a UserPost Document', async () => {
    await UserPost.findByIdAndDelete(testUserPost._id);
    const testUserPostCheck = await UserPost.findById(testUserPost._id);

    expect(testUserPostCheck).toBe(null);
  });
});
