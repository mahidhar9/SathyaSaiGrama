import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../../src/screens/Profile';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Toast from 'react-native-toast-message';


jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn().mockResolvedValue('local'),
  initializeAuth: jest.fn(),
  signOut: jest.fn(),
  deleteUser: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
}));

jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(() => 'ShimmerPlaceholder'),

}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(() => {
    type: 'success'
  }),
  hide: jest.fn(),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.fn((props) => {
    return props.children;
  }),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
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




jest.mock('../../../src/components/ApiRequest', () => ({
  getDataWithInt: jest.fn(() => Promise.resolve({
    data: [{ ID: 'flat123', Building: 'Building A', Flat: 'Flat 101' }],
  })),
  getDataWithoutStringAndWithInt: jest.fn(() => Promise.resolve({
    data: [{ ID: 'family123', Flats_lookup: { Building: 'Building A', Flat: 'Flat 101' } }],
  })),
  getDataWithString: jest.fn(() => Promise.resolve({
    data: [{ ID: 'family123', Flats_lookup: { Building: 'Building A', Flat: 'Flat 101', Department: { ID: 'd1' } } }],
  })),
  getDataWithEmployee: jest.fn(() => Promise.resolve({
    data: [{ Office_lookup: { Department: 'd1', Employee: 'e123' } }],
  })),
}));


describe('Profile Component', () => {
  const mockNavigation = { navigate: jest.fn() };
  
const mockUserContextValue = {
  getAccessToken: jest.fn().mockReturnValue('mockAccessToken'),
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
};

const toMyprofile = jest.fn(() => {
  mockNavigation.navigate('MyProfile');
});
afterEach(() => {
  jest.clearAllMocks();
});
  const mockAuthContextValue = {
    user: {email: 'mockuser@example.com' },
    setUser: jest.fn(),
  };
  it('test_navigation_to_my_profile', async () => {
    const { getByText,queryByText , getAllByText,debug} = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Profile navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    )
    expect(getByText('Logout')[4])
  fireEvent.press(queryByText('Logout')[4]);
  //   debug();

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

 
  
});