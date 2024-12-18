import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../../src/screens/Profile'; 
import UserContext from '../../../context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import { AuthContext } from '../../../src/auth/AuthProvider';
import Toast from 'react-native-toast-message';
import {Text as MockText} from 'react-native';

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

jest.mock("react-native-toast-message", () => {
  return   jest.fn().mockImplementation ((props) => {
    return (<MockText>onLogout</MockText>)
  })
});

jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(() => 'ShimmerPlaceholder'),

}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

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
    data: [
      {
        Office_lookup: {
          Department: 'Engineering',
          Employee: 'e123',
        },
        Building: 'Building A', // Directly under the main object
        Flat: 'Flat 101',
        ID: 'flat123',
      },
    ],
  })),
  
  getDataWithoutStringAndWithInt: jest.fn(() => Promise.resolve({
    data: [{
      ID: 'family123',
      Building: 'Building A', // Directly under the main object
      Flat: 'Flat 101',
      Department: { ID: 'd1' },
    }],
  })),
  
  getDataWithString: jest.fn(() => Promise.resolve({
    data: [{
      ID: 'family123',
      Building: 'Building A', // Directly under the main object
      Flat: 'Flat 101',
      Department: { ID: 'd1' },
    }],
  })),
  
  getDataWithEmployee: jest.fn(() => Promise.resolve({
    data: [{
      Office_lookup: {
        Department: 'Engineering',
        Employee: 'e123',
      },
    }],
  })),
}));
const mockNavigation = { navigate: jest.fn() };
  
const mockUserContextValue = {
  getAccessToken: jest.fn(),
  userEmail: 'test@example.com',
  L1ID: 1,
  deviceToken: 'testDeviceToken',
  loggedUser: { name: 'Test User', userId: 1 },
  accessToken: 'testAccessToken',
  profileImage: null,
  setProfileImage: jest.fn(),
  userType: 'admin',
  setUserType: jest.fn(),
  setUserEmail: jest.fn(),
  setL1ID: jest.fn(),
  setLoggedUser: jest.fn(),
  setAccessToken: jest.fn(),
  setDeviceToken: jest.fn(),
  setResident: jest.fn(),
  resident: { id: 'r123', name: 'Jane Resident' },
  setEmployee: jest.fn(),
  employee: { id: 'e789', name: 'Alice Employee' },
  setTestResident: jest.fn(),
  testResident: { id: 't987', name: 'Test Resident' },
  setDepartmentIds: jest.fn(),
  Office_lookup: { Department: 'd1', Employee: 'e123' },
  departmentIds: ['d1', 'd2', 'd3'],
};
  
  const mockAuthContextValue = {
    user: {email: 'mockuser@example.com' },
    setUser: jest.fn(),
  };



describe('Profile Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })
  it('test_navigation_to_my_profile', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Profile navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    )

    fireEvent.press(getByText('My Profile'));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProfile', {
        dapartment: 'Engineering',
        dapartmentExists: true,
        familyMembersData: [{
          Building: 'Building A',
          Department: { ID: 'd1' },
          Flat: 'Flat 101',
          ID: 'family123',
        }],
        flat: {
          building: 'Building A',
          flat: 'Flat 101',
        },
        flatExists: true,
        flatid: 'flat123',
        userInfo: [{
          Building: 'Building A',
          Department: { ID: 'd1' },
          Flat: 'Flat 101',
          ID: 'family123',
        }],
        vehicleInfo: [{
          Building: 'Building A',
          Flat: 'Flat 101',
          ID: 'flat123',
          Office_lookup: {
            Department: 'Engineering',
            Employee: 'e123',
          },
        }],
      });
    });
  });

});