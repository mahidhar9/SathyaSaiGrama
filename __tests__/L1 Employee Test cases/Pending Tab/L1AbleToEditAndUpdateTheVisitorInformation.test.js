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
// jest.mock('react-native-modern-datepicker', () => ({
//   __esModule: true,
//   DatePicker:jest.fn(),
//   default: jest.fn(() => null), 
//   getFormatedDate: jest.fn(),
// }));
jest.mock('react-native-modern-datepicker', () => ({
  DatePicker: jest.fn((props) => props.children ),
  getFormatedDate: jest.fn(() => '2024-12-14'),
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
  Dialog: jest.fn((props) => props.children),
  Container: jest.fn((props) => props.children),
  Title: jest.fn((props) => props.children),
  Description: jest.fn((props) => props.children),
  Button: jest.fn(( props) => props.children),
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
    const mockRoute = {
      params: {
        triggerDialog: true,
        code:'3000',
        user: {
          ID: '123',
          Referrer_Approval: 'PENDING APPROVAL',
          L2_Approval_Status: 'Pending Approval',
          Name_field: { zc_display_value: 'John Doe' },
          Phone_Number: '9182590940',
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
    

    const { getByText,getAllByText, getByPlaceholderText, queryByText, debug } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <EditVerifydetails navigation={mockNavigation}  route={mockRoute}/>
        </NavigationContainer>
      </UserContext.Provider>
    );

    fireEvent.changeText(getByText('Guest Category'), 'Govt Officials');
    fireEvent.changeText(getByText('Male','Gender'));
    fireEvent.changeText(getByPlaceholderText('KA 01 AB 1234','Vehicle Number'));

    // fireEvent.changeText(getByPlaceholderText('2023-10-12','Date of visit'));
    // fireEvent.changeText(getByPlaceholderText('Priority'), 'P1');
    // fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');
    fireEvent.press(getByText('Update'));
 
    await waitFor(() => {
      expect(getAllByText('Visitor details changed')).toBeTruthy();
    });
  });
});
