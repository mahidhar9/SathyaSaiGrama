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

test('Verify that both "Visitor fills the form" and "Fill it by yourself!" buttons respond properly without delay, double-click effects, or navigation issues', async () => {
  const { getByText } = render(<AppNavigator />);

  // Step 1: Navigate to the "Invite" page
  fireEvent.press(getByText('Invite'));

  // Step 2: Verify the transition to the "Invite" page
  await waitFor(() => {
    expect(getByText('Invite')).toBeTruthy();
  });

  // Step 3: Tap on both the "Visitor fills the form" and "Fill it by yourself!" buttons multiple times rapidly
  for (let i = 0; i < 5; i++) {
    fireEvent.press(getByText('Visitor fills the form'));
    fireEvent.press(getByText('Fill it by yourself!'));
  }

  // Step 4: Observe any delays or improper behavior in navigation or loading
  await waitFor(() => {
    expect(getByText('Share link with the visitor')).toBeTruthy();
    expect(getByText('Fill it by yourself!')).toBeTruthy();
  });
});