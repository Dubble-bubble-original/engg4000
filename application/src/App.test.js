import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Clear the setup before each test
afterEach(cleanup);

let checkBox = null, welcomeButton = null;

describe('Welcome Page', () => {

  beforeEach(() => {
    render(<App />);
    checkBox = screen.getByTestId('agree-checkbox');
    welcomeButton = screen.getByTestId('enter-btn');
  })

  test('renders the checkbox', () => {
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).not.toBeChecked();
  });

  test('renders terms and conditions', () => {
    const terms_conditions = screen.getByTestId('terms-conditions');
    expect(terms_conditions).toBeInTheDocument();
  });

  test('renders \'Enter Site\' button', () => {
    expect(welcomeButton).toBeInTheDocument();
  });

  test('check to see the \'Enter Site\' button is disabled when the checkbox is not selected', () => {
    expect(welcomeButton).toBeDisabled();
  });

  test('check to see the \'Enter Site\' button is enabled when the checkbox is selected', () => {
    // Click the checkbox
    userEvent.click(checkBox);

    // Check to see if the checkbox is selected
    expect(checkBox).toBeChecked();
    // Check to see if the 'Enter Site' button is enabled
    expect(welcomeButton).toBeEnabled();
  });

  test('when checkbox is not selected and enter site button is pressed', () => {
    // Click the Welcome button
    fireEvent.click(welcomeButton);

    // If the checkbox is not selected the welcome button should still be on the page
    expect(checkBox).not.toBeChecked();
    expect(welcomeButton).toBeInTheDocument();
  });
})
