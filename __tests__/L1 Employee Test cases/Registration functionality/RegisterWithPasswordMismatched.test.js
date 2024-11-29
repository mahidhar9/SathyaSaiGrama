import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../../src/screens/Register';
import UserContext from '../../../context/UserContext';

const mockNavigation = { navigate: jest.fn() };

const mockUserContextValue = {
  userType: 'admin',
  setUserType: jest.fn(),
  accessToken: 'mockAccessToken123',
  setUserEmail: jest.fn(),
  setL1ID: jest.fn(),
  loggedUser: { name: 'John Doe' },
  setLoggedUser: jest.fn(),
  deviceToken: 'mockDeviceToken456',
  resident: { id: 'r123', name: 'Jane Resident' },
  setResident: jest.fn(),
  setProfileImage: jest.fn(),
};

describe('Register Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows an error message when the passwords do not match', async () => {
    const validatePasswordMock = jest.fn().mockReturnValue(true);
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <Register navigation={mockNavigation} validatePassword={validatePasswordMock} />
      </UserContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'Teja');
    fireEvent.changeText(getByPlaceholderText('Email Address'), 'saitejads2000@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123457');
    fireEvent.press(getByText('Register'));

    // Use waitFor to wait for the error message to appear
    await waitFor(() => {
      expect(getByTestId('Passwords do not match')).toBeTruthy();
    });
  },20000);
});