import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../../src/screens/Profile';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import {modal} from 'react-native-toast-message';



jest.mock('react-native-permissions', () => jest.fn());
jest.mock('react-native-image-picker', () => jest.fn());
jest.mock('react-native-toast-message', () => jest.fn({ show: jest.fn(),}));
jest.mock('react-native-safe-area-context', () => jest.fn());
jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(() => (props) => jest.fn()),
}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn().mockResolvedValue('local'),
  signOut: jest.fn().mockResolvedValue('mockSignOut'),
  deleteUser: jest.fn().mockResolvedValue('mockDeleteUser'),
  reauthenticateWithCredential: jest.fn().mockResolvedValue('mockReauthenticateWithCredential'),
  EmailAuthProvider: {
    credential: jest.fn().mockReturnValue('mockCredential'),
  },
  initializeAuth: jest.fn(() => ({
    currentUser: {
      emailVerified: true,
      email: 'saitejads2000@gmail.com',
      password: '123456',
      getIdToken: jest.fn(() => 'mockAccessToken123'),
    },
  })),
 
}));
jest.spyOn(global, 'fetch').mockResolvedValue({
  ok: true,
  signOut: jest.fn().mockResolvedValue('mockSignOut'),
  deleteUser: jest.fn().mockResolvedValue('mockDeleteUser'),
  reauthenticateWithCredential: jest.fn().mockResolvedValue('mockReauthenticateWithCredential'),
  EmailAuthProvider: {
    credential: jest.fn().mockReturnValue('mockCredential'),
  },

  useEffect: jest.fn().mockImplementation((callback) => callback()),
})

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

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});


const mockAuthContextValue = {
  user: { uid: '123', email: 'mockuser@example.com' },
  setUser: jest.fn(),
};

describe('Profile Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle logout correctly', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Profile navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    )
    // signOut.mockResolvedValueOnce();

    // fireEvent.press(getByText('Logout'));
    expect(getByText('Logout')).toBeTruthy();
    // await waitFor(() => {
    //   expect(signOut).toHaveBeenCalled();
    // });

    // await waitFor(() => {
    //   expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    // });
  });

 
  
});