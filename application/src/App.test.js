import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Clear the setup before each test
afterEach(cleanup);

let checkBox = null, welcomeButton = null;

describe('Welcome Page', () => {
  test("renders 'i agree' checkbox", () => {
    render(<App />);
    checkBox = screen.getByTestId("agree_checkbox");
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).not.toBeChecked();
  });

  test("renders terms and conditions", () => {
    render(<App />);
    const terms_conditions = screen.getByTestId("terms_conditions");
    expect(terms_conditions).toBeInTheDocument();
  });

  test("renders 'Welcome to Nota' button", () => {
    render(<App />);
    welcomeButton = screen.getByText("Welcome to Nota!!");
    expect(welcomeButton).toBeInTheDocument();
  });

  test("when checkbox is not selected and welcome button is pressed", () => {
    render(<App />);
    checkBox = screen.getByTestId("agree_checkbox");
    welcomeButton = screen.getByTestId("welcome-button");
    
    // Click the Welcome button
    fireEvent.click(welcomeButton);

    // If the checkbox is not selected the welcome button should still be on the page
    expect(checkBox).not.toBeChecked();
    expect(welcomeButton).toBeInTheDocument();
  });

  test("select the checkbox", () => {
    render(<App />);
    checkBox = screen.getByTestId("agree_checkbox");
    
    // Click the checkbox
    userEvent.click(checkBox);
    // Check to see if the checkbox is selected
    expect(checkBox).toBeChecked();
  });
})

describe('HomePage', () => {

  beforeEach(() => {
    render(<App />);
    checkBox = screen.getByTestId("agree_checkbox");
    welcomeButton = screen.getByTestId("welcome-button");
    userEvent.click(checkBox);
  })

  test("when checkbox is selected and welcome button is pressed", () => {    
    // Click the button
    fireEvent.click(welcomeButton);
    // After the button is pressed it should not be on the screen
    expect(welcomeButton).not.toBeInTheDocument();

    // Get homepage components from the screen
    const homepage = screen.getByTestId("home_page");
    // Check to see if the "Homepage" is on the screen
    expect(homepage).toBeInTheDocument();
  });

  test("check to see if the NavBar is rendered in the homepage", () => {    
    // Click the button
    fireEvent.click(welcomeButton);
    // After the button is pressed it should not be on the screen
    expect(welcomeButton).not.toBeInTheDocument();

    // Get NavBar components from the screen
    const navBar = screen.getByTestId("nav_bar");
    // Check to see if the "NavBar" is on the screen
    expect(navBar).toBeInTheDocument();
  });
})
