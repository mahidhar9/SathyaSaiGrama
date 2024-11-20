import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Profile from '../../../src/screens/Profile';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';

const mockNavigation = { navigate: jest.fn() };

// Mock required libraries and dependencies
jest.mock('react-native-permissions', () => jest.fn());
jest.mock('react-native-image-picker', () => jest.fn());
jest.mock('react-native-toast-message', () => jest.fn());
jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(() => (props) => jest.fn()),
}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock context values
const mockUserValues = {
  user: { uid: '123', email: 'mockuser@example.com' },
  setUser: jest.fn(),
};

const mockUserContextValues = {
  getAccessToken: jest.fn(() => 'mockAccessToken'),
  userEmail: 'mockEmail@example.com',
  L1ID: 'mockL1ID',
  deviceToken: 'mockDeviceToken',
  loggedUser: 'mockUser',
  accessToken: 'mockAccessToken',
  setProfileImage: jest.fn(),
};

describe('Profile Screen', () => {
  it('should navigate to the Login screen when the "Logout" button is pressed', () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockUserValues}>
        <UserContext.Provider value={mockUserContextValues}>
          <Profile navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const logoutButton = getByText('Logout');
    fireEvent.press(logoutButton);

    // Verify navigation is called with "Login"
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});