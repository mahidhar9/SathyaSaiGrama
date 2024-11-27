import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Invite from '../../../src/screens/Invite';
import Home from '../../../src/screens/Home';
import MyApprovals from '../../../src/screens/MyApprovals';
import Account from '../../../src/screens/Account';
import UserContext from '../../../context/UserContext';

const Tab = createBottomTabNavigator();

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
        <Tab.Screen name="Invite" component={Invite} />
      </Tab.Navigator>
    </NavigationContainer>
  </UserContext.Provider>
);

test('Verify that the "Office" button is visible and clickable on the Invite page', async () => {
  const { getByText } = render(<AppNavigator />);

  // Step 1: Navigate to the "Invite" page
  fireEvent.press(getByText('Invite'));

  // Step 2: Click on the "Visitor fills the form" button
  fireEvent.press(getByText('Visitor fills the form'));

  // Step 3: Verify the "Office" button is displayed and clickable
  await waitFor(() => {
    expect(getByText('Office')).toBeTruthy();
  });

  // Step 4: Click on the "Office" button
  fireEvent.press(getByText('Office'));

  // Verify the expected behavior after clicking the "Office" button
  await waitFor(() => {
    expect(getByText('Share link with the visitor')).toBeTruthy();
  });
});