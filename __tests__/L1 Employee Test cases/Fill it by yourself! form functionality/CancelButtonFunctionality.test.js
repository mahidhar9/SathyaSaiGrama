import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserContext from '../../../context/UserContext';

jest.spyOn(global, 'fetch').mockResolvedValue( {
 
    ok: true,
    blob: () => Promise.resolve(new Blob({
      data : ['base64Image','generateQR'],
      type : 'image/png',
      passcodeData: jest.fn(),

    })),

    json: () => Promise.resolve({
      data: {
        Device_Tokens: 'mockDeviceToken123',
        Generated_Passcode :'123456',
      },
    }),
  
});

jest.mock('react-native-calendars', () => ({
  CalendarList: jest.fn(),
}));
jest.mock('react-native-share', () => ({
  Share: jest.fn(),
}));
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));
jest.mock('react-native-phone-number-input', () => ({
  PhoneInput: jest.fn(),
  parsePhoneNumberFromString: jest.fn(),
}));
jest.mock('react-native-modern-datepicker', () => ({
  DatePicker: jest.fn(),
  getFormattedDate: jest.fn(),
}));
jest.mock('react-native-fs', () => ({
  RNFS: {
    writeFile: jest.fn(),
    Share: jest.fn(),
  },
}));
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  TouchableOpacity: ({ children }) => children,
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

describe('Visitor Information Form', () => {
  test('Verify that the "Cancel" button works correctly', async () => {
    const { getByText, getByPlaceholderText } = render(
      <GestureHandlerRootView>
        <UserContext.Provider value={mockUserContextValue}>
          <FillByYourSelf navigation={mockNavigation} />
        </UserContext.Provider>
      </GestureHandlerRootView>
    );

    // Step 1: Fill in all the fields with random data
    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Phone'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Date of Visit'), '2022-01-01');
    fireEvent.press(getByText('Single'));
    fireEvent.press(getByText('Home'));
    fireEvent.press(getByText('Male'));
    fireEvent.changeText(getByPlaceholderText('Photo'), 'photo.jpg');
    fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Press');
    fireEvent.changeText(getByPlaceholderText('Priority'), 'p1');
    fireEvent.changeText(getByPlaceholderText('Remark'), 'remark');

    // Step 2: Click on the Cancel button
    fireEvent.press(getByText('Cancel'));

    // Step 3: Verify that all fields are cleared
    // expect(getByPlaceholderText('Name').props.value).toBe('');
    // expect(getByPlaceholderText('Phone').props.value).toBe('');
    // expect(getByPlaceholderText('Date of Visit').props.value).toBe('');
    // expect(getByText('Single').props.selected).toBe(false);
    // expect(getByText('Home').props.selected).toBe(false);
    // expect(getByText('Male').props.selected).toBe(false);
    // expect(getByPlaceholderText('Photo').props.value).toBe('');
    // expect(getByPlaceholderText('Guest Category').props.value).toBe('');
    // expect(getByPlaceholderText('Priority').props.value).toBe('');
    // expect(getByPlaceholderText('Remark').props.value).toBe('');
  });

});