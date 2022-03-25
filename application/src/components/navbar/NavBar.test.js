import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import NavBar from './NavBar';
import { HashRouter as Router } from 'react-router-dom'

// Clear everything after each clean up
afterEach(cleanup);

const props = {
  setContent: jest.fn(),
  setShowTerms: jest.fn(),
  closePopup: jest.fn()
}

describe('Nav Bar Tests', () => {
  test('render NavBar', () => {
    render(<Router>< NavBar setShowTerms={ props.setShowTerms }/></Router>);
    expect(screen.getByTestId('nav-home-btn')).toBeVisible();
    expect(screen.getByTestId('nav-search-btn')).toBeVisible();
    expect(screen.getByTestId('nav-create-btn')).toBeVisible();
  });

  test('check home page is active', () => {
    render(<Router>< NavBar setShowTerms={ props.setShowTerms }/></Router>);
    userEvent.click(screen.getByTestId('nav-home-btn'));
    expect(screen.getByTestId('nav-home-btn')).toHaveClass('active');
    expect(screen.getByTestId('nav-search-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-create-btn')).not.toHaveClass('active');
  });

  test('check search page is active', () => {
    render(<Router>< NavBar setShowTerms={ props.setShowTerms }/></Router>);
    userEvent.click(screen.getByTestId('nav-search-btn'));
    expect(screen.getByTestId('nav-home-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-search-btn')).toHaveClass('active');
    expect(screen.getByTestId('nav-create-btn')).not.toHaveClass('active');
  });

  test('check create page is active', () => {
    render(<Router>< NavBar setShowTerms={ props.setShowTerms }/></Router>);
    userEvent.click(screen.getByTestId('nav-create-btn'));
    expect(screen.getByTestId('nav-home-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-search-btn')).not.toHaveClass('active');
    expect(screen.getByTestId('nav-create-btn')).toHaveClass('active');
  });
});
