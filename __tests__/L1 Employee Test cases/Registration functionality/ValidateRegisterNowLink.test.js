import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native'; 
import Login from '../../../src/screens/Login';
import Register from '../../../src/screens/Register';
import UserContext from '../../../context/UserContext'; 
import { auth } from '../../../src/auth/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

test('Verify the Register now link redirects to the registration page.', () => {
  const { getByText,  } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <Login navigation={mockNavigation} />
    </UserContext.Provider>
  );

  // Step 1: Open the application and click on "Register now"
  const link = getByText('Register now');
  fireEvent.press(link);
  expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
});
