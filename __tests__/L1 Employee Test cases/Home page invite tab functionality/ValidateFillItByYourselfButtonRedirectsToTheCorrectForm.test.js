import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import Invite from '../../../src/screens/Invite';
import UserContext from '../../../context/UserContext';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

jest.mock('react-native-gesture-handler', () => ({

    GestureHandlerRootView: ({ children }) => <>{children}</>,
    TouchableOpacity: ({ children }) => <>{children}</>,
  
}));
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

afterEach(cleanup);

test('Verify that the "Fill it by yourself!" button redirects to the correct form', async () => {
  const { getByText } = render(

    <UserContext.Provider value={mockUserContextValue}>
    
      <Invite />
    </UserContext.Provider>
  );

  // Click the "Fill it by yourself!" button
  fireEvent.click(getByText('Fill it by yourself!'));

  // Verify the redirection to the form page
  await waitFor(() => {
    expect(getByText('Fill By Yourself Form')).toBeTruthy();
  });
});