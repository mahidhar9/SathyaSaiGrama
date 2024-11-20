import React from 'react';
import Profile from '../../../src/screens/Profile';
import { render, fireEvent,waitFor } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import AuthProvider from '../../../src/auth/AuthProvider';
import UserContext from '../../../context/UserContext'; 


jest.mock('react-native-shimmer-placeholder', () => ({
    createShimmerPlaceholder: () => jest.fn(() => 'ShimmerPlaceholderMock'),
  }));
  
  jest.mock('react-native-linear-gradient', () => {
    const LinearGradient = jest.fn();
    return LinearGradient;
  });
  
jest.mock('react-native-permissions',()=>{
    return (jest.fn());
})
jest.mock('react-native-image-picker', () => {
    return (jest.fn());
})
jest.mock('react-native-toast-message',()=>{
    return (jest.fn());
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
  };


  describe('Profile', () => {
    it('should navigate to the MyProfilePage when the "My Profile" button is pressed', async () => {

      const { getByText } = render(
        <UserContext.Provider value={mockUserContextValue}>
        <Profile navigation={mockNavigation} />
      </UserContext.Provider>
      );
  
      const myProfileButton = getByText('My Profile');
      fireEvent.press(myProfileButton);
      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProfile');
      },{timeout: 5000})
    })
})