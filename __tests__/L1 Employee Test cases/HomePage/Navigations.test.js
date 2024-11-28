import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native'; // Import Platform from react-native
import Profile from '../../../src/screens/Profile';
import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
import FooterTab from '../../../navigation/tab-navigation/FooterTab';
import UserContext from '../../../context/UserContext';


jest.mock('react-native-toast-message', () => jest.fn());
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));
jest.mock('react-native-permissions', () => ({
  request: jest.fn(),
  PERMISSIONS: jest.fn().mockReturnValue('granted'),
}));
jest.mock('react-native-linear-gradient', () => jest.fn());
jest.mock('react-native-shimmer-placeholder', () => ({ createShimmerPlaceholder: jest.fn() }));
jest.mock('react-native-phone-number-input', () => jest.fn());
jest.mock('react-native-element-dropdown', () => jest.fn());
jest.mock('react-native-modern-datepicker', () => ({
  DatePicker: jest.fn(),
  getFormattedDate: jest.fn(),
}));
jest.mock('react-native-elements', () => ({ SearchBar: jest.fn() }));

// Mock the createBottomTabNavigator function to return the expected structure
jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    
    createBottomTabNavigator: jest.fn(() => ({
      Navigator: jest.fn(),
      Screen: jest.fn(),
    })),
  };
});

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

describe('Navigation Tests', () => {
  afterEach(cleanup);

  it('navigates to Profile screen', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <FooterTab />
        </NavigationContainer>
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Profile'));

    await waitFor(() => {
      expect(getByText('Profile Screen')).toBeTruthy();
    });
  });

  // Add more tests as needed
});