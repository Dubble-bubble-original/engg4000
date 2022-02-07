import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from './NavBar';

// Clear everything after each clean up
afterEach(cleanup);

const props = {
  setContent: jest.fn(),
  setShowTerms: jest.fn(),
  closePopup: jest.fn()
}

describe('Nav Bar Tests', () => {
  test('render NavBar', () => {
    render(< NavBar content={ 'home' } setContent={ props.setContent } setShowTerms={ props.setShowTerms }/>);
    expect(screen.getByTestId('nav-home-btn')).toBeVisible();
    expect(screen.getByTestId('nav-search-btn')).toBeVisible();
    expect(screen.getByTestId('nav-create-btn')).toBeVisible();
  });

  test('check home page is active', () => {
    render(< NavBar content={ 'home' } setContent={ props.setContent } setShowTerms={ props.setShowTerms }/>);
    expect(screen.getByTestId('nav-home-btn')).toHaveClass('active');
    expect(screen.getByTestId('nav-search-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-create-btn')).not.toHaveClass('active');
  });

  test('check search page is active', () => {
    render(< NavBar content={ 'search' } setContent={ props.setContent } setShowTerms={ props.setShowTerms }/>);
    expect(screen.getByTestId('nav-home-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-search-btn')).toHaveClass('active');
    expect(screen.getByTestId('nav-create-btn')).not.toHaveClass('active');
  });

  test('check create page is active', () => {
    render(< NavBar content={ 'create' } setContent={ props.setContent } setShowTerms={ props.setShowTerms }/>);
    expect(screen.getByTestId('nav-home-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-search-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-create-btn')).toHaveClass('active');
  });
});
