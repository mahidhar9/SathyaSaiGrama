import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import Invite from '../../../src/screens/Invite';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
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
const mockNavigation = { navigate: jest.fn() };
const mockAuthContextValue = {
  user: { email: 'test@example.com' },
  setUser: jest.fn(),
};
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});


test('Verify that the "Fill it by yourself!" button redirects to the correct form', async () => {
  const { getByText } = render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <UserContext.Provider value={mockUserContextValue}>
        <Invite navigation={mockNavigation} />
      </UserContext.Provider>
    </AuthContext.Provider>
  );

  for (let i = 0; i < 5; i++) {
    fireEvent.press(getByText('Fill it by yourself!'));
  }

  await waitFor(() => {
    expect(mockNavigation.navigate).toHaveBeenCalledWith('FillByYourSelf');
  });


});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test('Verify that the "Visitor fills the form" button opens the modal even when clicked rapidly', async () => {
  const { getByText, getByTestId } = render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <UserContext.Provider value={mockUserContextValue}>
        <Invite navigation={mockNavigation} />
      </UserContext.Provider>
    </AuthContext.Provider>
  );

    fireEvent.press(getByText('Visitor fills the form'));


  // Verify that the modal is visible
  await waitFor(() => {
    expect(getByTestId('modal')).toBeTruthy();
  });

  // Verify the content inside the modal
  expect(getByText('Share link with the visitor')).toBeTruthy();
});