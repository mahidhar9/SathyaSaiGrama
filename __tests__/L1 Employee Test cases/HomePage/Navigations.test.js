import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../../src/screens/Home';
import MyApprovals from '../../../src/screens/MyApprovals';
import Account from '../../../src/screens/Account';
import UserContext from '../../../context/UserContext';

const Tab = createBottomTabNavigator();

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

const AppNavigator = () => (
  <UserContext.Provider value={mockUserContextValue}>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="My Approvals" component={MyApprovals} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
    </NavigationContainer>
  </UserContext.Provider>
);

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

  // Step 5: Navigate to the "Home" tab
  fireEvent.press(getByText('Home'));

  // Step 6: Verify the transition to the "Home" page
  await waitFor(() => {
    expect(getByText('Home Page')).toBeTruthy();
  });
});