import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CopyButton from './CopyButton';
import React from 'react';

// Clear everything after each test
afterEach(cleanup);

// props
const value = 'access_key';

// Mock Navigation Clipboard writeText function
global.navigator.clipboard = { writeText: jest.fn() }

describe('CopyButton Component', () => {
  test('render copy button component', () => {
    render(<CopyButton value={value} />);

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toBeCalledTimes(0);
  });

  test('click the copy button', () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((init) => [init, jest.fn()]);

    render(<CopyButton value={value} />);

    const copyButton = screen.getByTestId('copy-button');
    userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toBeCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value);
  });
});
