import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Feedback from '../../../src/screens/Feedback';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { Alert } from 'react-native';
import { postDataWithInt } from '../../../src/components/ApiRequest';
import { Dropdown } from 'react-native-element-dropdown';
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('../../../src/components/ApiRequest', () => ({
  postDataWithInt: jest.fn().mockResolvedValue({
    message: 'Data Added Successfully',
  }),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
jest.mock('react-native-element-dropdown', () => ({
    Dropdown: jest.fn(({ data, value, onChange, testID }) => {
      // Log the testID to verify it's being passed.
      console.log(`Mock Dropdown testID: ${testID}`);
      return (
        <select
          data-testid={testID} // Ensure this is assigned correctly.
          value={value}
          onChange={e => onChange(data.find(item => item.value === e.target.value))}
        >
          {data.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      );
    }),
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
  userEmail: 'mockuser@example.com', // Mock user email
};

const mockAuthContextValue = {
  user: { uid: '123', email: 'mockuser@example.com' },
  setUser: jest.fn(),
};

describe('Feedback Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the user to send feedback', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Feedback navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.change(getByTestId('SelectOption'), {
        target: { value: 'Technical issue' },
      });

    fireEvent.changeText(getByPlaceholderText('Your feedback'), 'This is a test feedback.');

    fireEvent.press(getByTestId('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Feedback Submitted');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });
  });
});