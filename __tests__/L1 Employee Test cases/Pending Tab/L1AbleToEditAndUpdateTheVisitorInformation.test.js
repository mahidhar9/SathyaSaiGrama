import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserContext from '../../../context/UserContext';
import EditVerifydetails from '../../../src/screens/approval/EditVerifydetails';
import Dialog from 'react-native-dialog';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import RNFS from 'react-native-fs';


jest.mock('react-native-fs', () => ({
  RNFS: {
    writeFile: jest.fn(),
  },
}));
jest.mock('react-native-modern-datepicker', () => ({
  __esModule: true,
  DatePicker:jest.fn(),
  default: jest.fn(() => null), 
  getFormatedDate: jest.fn(),
}));


global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: true, code: 3000 }), 
  })
);

jest.mock('react-native-share', () => ({
  Share: jest.fn(),
}));
jest.mock('react-native-dialog', () => ({
  __esModule: true,
  default: {
    Container: ({ visible, children }) => (visible ? children : null),
    Title: ({ children }) => <>{children}</>,
    Description: ({ children }) => <>{children}</>,
    Button: ({ label, onPress }) => <button onClick={onPress}>{label}</button>,
  },
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
};

const mockNavigation = { navigate: jest.fn() };

describe('L1 Able to Edit and Update the Visitor Information', () => {
  afterEach(cleanup);

  test('Verify that L1 can edit and update visitor information', async () => {
    const user = {
      triggerDialog: true,
      L2_Approval_Status: 'PENDING',
      Name_field: { zc_display_value: 'John Doe' },
      Vehicle_Information: [
        { Vehicle_Type: 'Car', Vehicle_Number: 'KA01AB1234', ID: '1' },
        { Vehicle_Type: 'Bike', Vehicle_Number: 'KA02CD5678', ID: '2' },
      ],
    };


    const { getByText, getByPlaceholderText, queryByText, debug } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <EditVerifydetails navigation={mockNavigation}  route={{ params: { user } }}/>
        </NavigationContainer>
      </UserContext.Provider>
    );


    await waitFor(() => {
      expect(queryByText('Edit Visitor Info Screen')).toBeTruthy();
    });
    fireEvent.changeText(getByPlaceholderText('31-12-2024', 'DD-MM-YYYY'));
    fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Govt Officials');
    fireEvent.changeText(getByPlaceholderText('Priority'), 'P1');
    fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');

    fireEvent.press(getByText('Update'));

    await waitFor(() => {
      expect(queryByText('Updated visitor information is displayed correctly')).toBeTruthy();
    });
  });
});
