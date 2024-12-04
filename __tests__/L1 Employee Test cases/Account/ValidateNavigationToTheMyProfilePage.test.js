import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../../src/screens/Profile';
import MyProfile from '../../../src/screens/MyProfile';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-elements', () => ({
  SearchBar: jest.fn(),
  Image : 'Image',
}));
jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(() => (props) => jest.fn()),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn().mockResolvedValue('granted'),
  request: jest.fn().mockResolvedValue('granted'),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'camera',
      PHOTO_LIBRARY: 'photo',
    },
    ANDROID: {
      CAMERA: 'camera',
      READ_EXTERNAL_STORAGE: 'read_external_storage',
    },
  },
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

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
  employee: { id: 'e789', name: 'Alice Employee' },
  setEmployee: jest.fn(),
  testResident: { id: 't987', name: 'Test Resident' },
  setTestResident: jest.fn(),
  departmentIds: ['d1', 'd2', 'd3'],
  setDepartmentIds: jest.fn(),
  userEmail: 'mockuser@example.com', // Mock user email
};

const mockAuthContextValue = {
  user: { uid: '123', email: 'mockuser@example.com' },
  setUser: jest.fn(),
};


describe('Profile Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to the My Profile section when the "My Profile" button is pressed', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Profile navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.press(getByText('My Profile'));

    await waitFor(() => {
      expect(getByText('Personal Info')).toBeTruthy();
    });
  });
});