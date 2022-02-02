import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from './NavBar';

// Clear everything after each clean up
afterEach(cleanup);

const props = {
  content: 'home',
  setContent: jest.fn(),
  setShowTerms: jest.fn(),
  closePopup: jest.fn()
}

describe('Nav Bar Tests', () => {
  test('render NavBar', () => {
    render(< NavBar content={ props.content } setContent={ props.setContent } setShowTerms={ props.setShowTerms }/>);
    expect(screen.getByTestId('nav-home-btn')).toBeVisible();
    expect(screen.getByTestId('nav-search-btn')).toBeVisible();
    expect(screen.getByTestId('nav-create-btn')).toBeVisible();
  });
  
});
