import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Post from './Post';

// Resources
import Avatar from '../../resources/images/avatar.jpg';
import PostImage from '../../resources/images/postImage.jpg';
import PlaceholderAvatar from '../../resources/images/placeholder-avatar.png';

// Clear everything after test
afterEach(cleanup);

// Post Data
let postData = {
  author: {
    name: 'Test User',
    avatar_url: Avatar
  },
  body: 'Test Body',
  tags: ['Tag 3', 'Tag 1', 'Tag 2'],
  title: 'Unit Tests',
  img_url: PostImage,
  date_created: '2021-11-20T17:31:03.914+00:00',
  // date_created: Date.now(),
  location: {
    lat: 45.963589,
    lng: -66.643112
  },
  location_string: 'New Brunswick, Canada',
}

describe('Post Component', () => {
  test('render post component with all the values', () => {
    render(<Post postData={postData} />)

    expect(screen.getByTestId('post-body')).toBeVisible();
    expect(screen.getByTestId('map')).toBeVisible();

    // Check for avatar image
    let avatarImage = screen.getByTestId('avatar-image');
    expect(avatarImage).toBeVisible();
    expect(avatarImage).toHaveAttribute('src', Avatar);

    // Check for post image
    let postImage = screen.getByTestId('post-image');
    expect(postImage).toBeVisible();
    expect(postImage).toHaveAttribute('src', PostImage);
  });

  test('render post component with no avatar image provided', () => {
    const tempPostData = postData;
    delete tempPostData.author.avatar_url;

    render(<Post postData={tempPostData} />)

    expect(screen.getByTestId('post-body')).toBeVisible();
    expect(screen.getByTestId('map')).toBeVisible();

    // Check for avatar image
    let avatarImage = screen.getByTestId('avatar-image');
    expect(avatarImage).toBeVisible();
    expect(avatarImage).toHaveAttribute('src', PlaceholderAvatar);

    // Check for post image
    let postImage = screen.getByTestId('post-image');
    expect(postImage).toBeVisible();
    expect(postImage).toHaveAttribute('src', PostImage);
  });

  test('render post component with no post image provided', () => {
    const tempPostData = postData;
    delete tempPostData.img_url;

    render(<Post postData={tempPostData} />)

    expect(screen.getByTestId('post-body')).toBeVisible();
    expect(screen.getByTestId('map')).toBeVisible();
    expect(screen.queryByTestId('post-image')).not.toBeInTheDocument();

    // Check for avatar image
    let avatarImage = screen.getByTestId('avatar-image');
    expect(avatarImage).toBeVisible();
    expect(avatarImage).toHaveAttribute('src', PlaceholderAvatar);
  });

  test('check to see if the tags are displayed in sorted order', () => {
    render(<Post postData={postData} />)

    // Check for tags
    let tagContainer = screen.getByTestId('tags');
    expect(tagContainer).toMatchSnapshot();
  });
});