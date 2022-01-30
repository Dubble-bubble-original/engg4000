import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Post from './Post';

// Resources
import Avatar from '../../resources/images/avatar.jpg';
import PostImage from '../../resources/images/postImage.jpg';

// Clear everything after each clean up
afterEach(cleanup);

// Post Data
let postData = {
  author: {
    name: 'Test User',
    avatar_url: Avatar
  },
  body: 'Test Body',
  tags: ['Tag 1', 'Tag 2'],
  title: 'Unit Tests',
  img_url: PostImage,
  date_created: '2021-11-20T17:31:03.914+00:00',
  location: {
    lat: 45.963589,
    lng: -66.643112
  },
  location_string: 'New Brunswick, Canada',
}

describe('Post Component', () => {
  test('render post component with all the values', () => {
    render(<Post postData={postData} />)

    expect(screen.getByTestId('avatar-image')).toBeVisible();
    expect(screen.getByTestId('post-body')).toBeVisible();
    expect(screen.getByTestId('map')).toBeVisible();
    expect(screen.getByTestId('post-image')).toBeVisible();
  });

  // test('render post component with no post image provided', () => {
  //   const tempPostData = postData;
  //   delete tempPostData.img_url;

  //   render(<Post postData={tempPostData} />)

  //   expect(screen.getByTestId('avatar-image')).toBeVisible();
  //   expect(screen.getByTestId('post-body')).toBeVisible();
  //   expect(screen.getByTestId('map')).toBeVisible();
  //   expect(screen.getByTestId('post-image')).not.toBeVisible();
  // });

  test('render post component with no avatar image provided', () => {
    const tempPostData = postData;
    delete tempPostData.author.avatar_url;

    render(<Post postData={tempPostData} />)

    expect(screen.getByTestId('avatar-image')).toBeVisible();
    expect(screen.getByTestId('post-body')).toBeVisible();
    expect(screen.getByTestId('map')).toBeVisible();
    expect(screen.getByTestId('post-image')).toBeVisible();
  });
  
});