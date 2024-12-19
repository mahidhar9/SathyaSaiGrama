jest.mock('../../../src/components/ApiRequest', () => ({
  findDeviceToken: jest.fn().mockResolvedValue(),
 updateDeviceToken: jest.fn().mockResolvedValue(),
}));

jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn().mockResolvedValue('local'),
  initializeAuth: jest.fn((props) => props.children),
  signOut: jest.fn().mockResolvedValue((props) => props.children),
  deleteUser:jest.fn().mockResolvedValue((props) => props.children),
  reauthenticateWithCredential: jest.fn().mockResolvedValue((props) => props.children),
  EmailAuthProvider: {
    credential:jest.fn().mockResolvedValue((props) => props.children),
  },
}));

jest.mock('react-native-restart', () => ({
  Restart: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(() => 'ShimmerPlaceholder'),
}));

jest.mock('react-native-permissions', () => ({
  request: jest.fn(),
  PERMISSIONS: {
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
  },
}));
jest.mock('../../../src/auth/firebaseConfig', () => ({
  auth: {
    currentUser: {
      uid: 'user123',
      email: 'test@example.com',
    },
  },
}));

import React from 'react';
import {View} from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../../src/screens/Profile';
import { AuthContext } from '../../../src/auth/AuthProvider';
import UserContext from '../../../context/UserContext';
import { signOut } from 'firebase/auth';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findDeviceToken, updateDeviceToken } from '../../../src/components/ApiRequest';
import { Alert } from 'react-native';

describe('Profile Component - Logout Functionality', () => {
  const mockNavigation = { navigate: jest.fn() };

  const mockUserContextValue = {
    accessToken: jest.fn(),
    loggedUser:jest.fn(), 
    setIsLogOutIndicator: jest.fn(),
  };
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const mockAuthContextValue = {
    user: jest.fn(),
    setUser: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  signOut.mockResolvedValue();
  it('should logout and restart the app when Logout is pressed', async () => {
    const { getByText,getAllByText, getByTestId, debug } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Profile navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );
    const logoutButton = getByText('Logout'); 
    fireEvent.press(logoutButton);
    await waitFor(() => {
      expect(getByText("Are you sure you want to logout? You'll need to login again to the app.")).toBeTruthy();
      expect(getAllByText('Logout')).toBeTruthy();
      fireEvent.press(getAllByText('Logout')[2]);
    });
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    })
    
  });
});