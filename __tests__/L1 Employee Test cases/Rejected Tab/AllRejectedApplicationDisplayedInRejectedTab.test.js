import React from 'react';
import { render, fireEvent ,waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import L2Denied from '../../../src/screens/L2-approval/L2Denied';
import UserContext from '../../../context/UserContext';
import PhoneInput from 'react-native-phone-number-input';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker'


jest.mock('react-native-modern-datepicker', () => {
  return {
    DatePicker: jest.fn(),
    getFormatedDate: jest.fn(),
  }});
jest.mock('react-native-phone-number-input', () => {
          return {
            phoneInput: jest.fn(),
          }
        })
describe('Rejected Applications Tab',() => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
  it('should display all L1 and L2 rejected applications in the Rejected tab', async () => {

    const mockRejectedApplications = [
      { id: 1, level: 'L1', applicant: 'John Doe', status: 'Rejected' },
      { id: 2, level: 'L2', applicant: 'Jane Smith', status: 'Rejected' },
    ];

    const mockUserContextValue = {
      userType: 'admin',
      setUserType: jest.fn(),
      accessToken: 'mockAccessToken123',
      setUserEmail: jest.fn(),
      setL1ID: jest.fn(),
      loggedUser: { name: 'John Doe', role: 'L2' }, 
      setLoggedUser: jest.fn(),
      deviceToken: 'mockDeviceToken456',
      resident: { id: 'r123', name: 'Jane Resident' },
      setResident: jest.fn(),
      setProfileImage: jest.fn(),
      setL2DeniedDataFetched: jest.fn(), 
        L2DeniedDataFetched: false,
    };
    const { getByText, getAllByText ,debug} = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <L2Denied navigation={{ navigate: jest.fn() }}/>
        </NavigationContainer>
      </UserContext.Provider>
    );
    debug();
    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
    });
  });
});
