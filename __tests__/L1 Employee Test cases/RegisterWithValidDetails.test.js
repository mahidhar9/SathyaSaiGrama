import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../src/screens/Register';
import UserContext from '../../context/UserContext';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('../../src/auth/firebaseConfig', () => ({
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  sendEmailVerification: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/components/ApiRequest.js', () => ({
  getDataWithString: jest.fn().mockResolvedValue({
    data: [{ ID: 'user123', Name_field: 'John Doe', Accommodation_Approval: 'APPROVED' }],
  }),
  isResident: jest.fn().mockResolvedValue(true),
  isEmployee: jest.fn().mockResolvedValue(true),
  isTestResident: jest.fn().mockResolvedValue(true),
}));

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



test('Verify that user can Register with valid details', async () => {
  const { getByText, getByPlaceholderText,queryByText } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <Register navigation={mockNavigation} />
    </UserContext.Provider>
  );

  fireEvent.changeText(getByPlaceholderText('Name'), 'sasi');
  fireEvent.changeText(getByPlaceholderText('Email Address'), 'ks@gmail.com');
  fireEvent.changeText(getByPlaceholderText('Password'), '@Sa1234');
  fireEvent.changeText(getByPlaceholderText('Confirm Password'), '@Sa1234');
  fireEvent.press(getByText('Register'));

  // expect (Alert.alert).toHaveBeenCalledWith('Your data does not exist. Please contact Admin');
  await waitFor(() => {
    expect(mockNavigation.navigate).toHaveBeenCalledWith('VerificationNotice', {
      id: 'user123',
       email: 'ks@gmail.com',
      name: 'sasi',
     resident: true,
      employee: true,
      testResident: true,
    });
  });

  // await waitFor(() => {
  //   expect(Alert.alert).toHaveBeenCalledWith(
  //     'Your data does not exist. Please contact Admin'
  //   );
  // });
});

