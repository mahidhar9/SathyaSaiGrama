import React from 'react';
import { render, waitFor , fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import VerifyDetails from '../../../src/screens/approval/VerifyDetails';
import UserContext from '../../../context/UserContext';
import Dialog from 'react-native-dialog';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'mocked data' }),
    })
);

jest.mock('react-native-share', () => ({
    open: jest.fn(),
  }));
jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve(true)),
  unlink: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-dialog', () => ({
  Dialog: jest.fn((props) => props.children),
  Container: jest.fn((props) => props.children),
  Title: jest.fn((props) => props.children),
  Description: jest.fn((props) => props.children),
  Button: jest.fn((props) => props.children),
}));
const mockNavigation = { navigate: jest.fn() };
const mockRoute = {
  params: {
    triggerDialog: true,
    user: {
      ID: '123',
      Referrer_Approval: 'APPROVED',
      L2_Approval_Status: 'APPROVED',
      Name_field: { zc_display_value: 'John Doe' },
      Phone_Number: '1234567890',
      Single_or_Group_Visit: 'Single',
      Date_of_Visit: '2023-09-20',
      Guest_Category: 'Corporate',
      Priority: 'High',
      Remarks: 'Important visitor',
      Gender: 'Male',
      Vehicle_Information: [{ zc_display_value: 'Car - ABC123' }],
      Referrer_App_User_lookup: { zc_display_value: 'Referrer Name' },
      Department: { Department: 'Engineering' },
    },
  },
};

const mockUserContextValue = {
  userType: 'admin',
  setUserType: jest.fn(),
  accessToken: jest.fn(),
  setUserEmail: jest.fn(),
  setL1ID: jest.fn(),
  loggedUser: { name: 'John Doe' },
  setLoggedUser: jest.fn(),
  deviceToken: 'mockDeviceToken456',
  resident: { id: 'r123', name: 'Jane Resident' },
  setResident: jest.fn(),
  setProfileImage: jest.fn(),
  setEditData: jest.fn(),
  
};

describe('VerifyDetails Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Verify that the L1 can able to reject the application after L2 approved', async () => {
    const { getByText ,queryAllByText} = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <VerifyDetails navigation={mockNavigation} route={mockRoute} />
        </NavigationContainer>
      </UserContext.Provider>
    );

    expect(getByText('Reject')).toBeTruthy();
    fireEvent.press(getByText('Reject'));
    await waitFor(() => {
       expect(mockNavigation.navigate('Denied'));
    });
})
});