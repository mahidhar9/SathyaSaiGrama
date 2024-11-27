import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import Invite from '../../../src/screens/Invite';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import { Platform, NativeModules } from 'react-native';
import {GestureHandlerRootView,TouchableOpacity,} from 'react-native-gesture-handler';
test('Validate behavior for iOS platform', () => {
  jest.spyOn(Platform, 'select').mockImplementation((options) => options.ios);
  Platform.OS = 'ios';

  const { getByText } = render(<Invite />);
  expect(getByText('Some iOS-specific text')).toBeTruthy();
});

test('Validate behavior for Android platform', () => {
  jest.spyOn(Platform, 'select').mockImplementation((options) => options.android);
  Platform.OS = 'android';

  const { getByText } = render(<Invite />);
  expect(getByText('Some Android-specific text')).toBeTruthy();
});


jest.mock('react-native-gesture-handler', () => {
  const GestureHandler = jest.requireActual('react-native-gesture-handler');
  return {
    ...GestureHandler,
    GestureHandlerRootView: ({ children }) => children,
    TouchableOpacity: GestureHandler.TouchableOpacity,
    Swipeable: jest.fn(),
    DrawerLayout: jest.fn(),
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
  employee: { id: 'e789', name: 'Alice Employee' },
  setEmployee: jest.fn(),
  testResident: { id: 't987', name: 'Test Resident' },
  setTestResident: jest.fn(),
  departmentIds: ['d1', 'd2', 'd3'],
  setDepartmentIds: jest.fn(),
};

const AppNavigator = () => (
  <UserContext.Provider value={mockUserContextValue}>
    <Invite />
  </UserContext.Provider>
);



test('Verify that the "Fill it by yourself!" button redirects to the correct form', async () => {
  const { getByText } = render(<AppNavigator />);

  // Step 1: Click on the "Fill it by yourself!" button
  fireEvent.press(getByText('Fill it by yourself!'));

  // Step 2: Verify the redirection to the form page
  await waitFor(() => {
    expect(getByText('Fill By Yourself Form')).toBeTruthy();
  });
});