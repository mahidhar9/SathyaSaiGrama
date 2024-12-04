import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
import UserContext from '../../../context/UserContext';
import { Text } from 'react-native';
import { SearchBar } from 'react-native-elements';
import PhoneInput from 'react-native-phone-number-input';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker'

jest.mock('react-native-modern-datepicker', () => {	
  return {
    default: jest.fn(),
    getFormatedDate: jest.fn(),
    DatePicker : jest.fn(),
  }
  });

jest.mock('react-native-phone-number-input', () => {	
  const { TextInput } = require('react-native');
  return {
    default: jest.fn(),
    TextInput,
  };
});
jest.mock('react-native-elements', () => {
  return {
    SearchBar: jest.fn(),
  };
});
jest.mock('../../../src/screens/approval/Pending', () => {
  const { Text } = require('react-native');
  return () => <Text>Pending Screen</Text>;
});
jest.mock('../../../src/screens/approval/Approved', () => {
  const { Text } = require('react-native');
  return () => <Text>Approved Screen</Text>;
});
jest.mock('../../../src/screens/approval/Denied.js', () => {
  const { Text } = require('react-native');
  return () => <Text>Denied Screen</Text>;
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
};

describe('ApprovalTab Navigation Tests', () => {
  afterEach(cleanup);

  it('navigates to Pending tab by default', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <ApprovalTab />
        </NavigationContainer>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Pending Screen')).toBeTruthy();
    });
  });

  it('navigates to Approved tab when clicked', async () => {
    const { getByText  , getByLabelText ,getAllByRole} = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <ApprovalTab />
        </NavigationContainer>
      </UserContext.Provider>
    );
expect(getAllByRole('tab')).toHaveLength(3);

    fireEvent.press(getAllByRole('tab')[1]);

    await waitFor(() => {
      expect(getByText('Approved Screen')).toBeTruthy();
    });
  });

  it('navigates to Denied tab when clicked', async () => {
    const { getByText,getAllByRole } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <ApprovalTab />
        </NavigationContainer>
      </UserContext.Provider>
    );
expect(getAllByRole('tab')).toHaveLength(3);
    fireEvent.press(getAllByRole('tab')[2]);

    await waitFor(() => {
      expect(getByText('Denied Screen')).toBeTruthy();
    });
  });

 
});



























