import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../../../src/screens/Profile';
import MyApprovals from '../../../src/screens/MyApprovals';
import FooterTab from '../../../navigation/tab-navigation/FooterTab';
import UserContext from '../../../context/UserContext';

const Tab = createBottomTabNavigator();

jest.mock('../../../navigation/tab-navigation/FooterTab', () => (props) => <div {...props} />);

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
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <FooterTab {...props} />}>
        <Tab.Screen name="Account" component={Profile} />
        <Tab.Screen name="My Approvals" component={MyApprovals} />
      </Tab.Navigator>
    </NavigationContainer>
  </UserContext.Provider>
);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('Verify that the user can navigate between tabs', async () => {
  const { getByText } = render(<AppNavigator />);

  // Step 1: Navigate to the "Account" tab
  fireEvent.press(getByText('Account'));

  // Step 2: Verify the transition to the "Account" page
  await waitFor(() => {
    expect(getByText('Account Page')).toBeTruthy();
  });

  // Step 3: Navigate to the "My Approvals" tab
  fireEvent.press(getByText('My Approvals'));

  // Step 4: Verify the transition to the "My Approvals" page
  await waitFor(() => {
    expect(getByText('My Approvals Page')).toBeTruthy();
  });
});