import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

jest.spyOn(global, 'fetch').mockImplementation((url, options) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ ok: true }),
  });
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
  test('Verify that validation messages appear below all mandatory fields when left empty', async () => {
    const { getByText } = render(
      <GestureHandlerRootView>
        <UserContext.Provider value={mockUserContextValue}>
          <FillByYourSelf navigation={mockNavigation} />
        </UserContext.Provider>
      </GestureHandlerRootView>
    );

    // Step 1: Click on the Submit button without filling any fields
    fireEvent.press(getByText('Submit'));

    // Step 2: Observe if validation messages are shown
    await waitFor(() => {
      expect(getByText('Prefix, First Name and Last Name are required')).toBeTruthy();
      expect(getByText('Phone number is required')).toBeTruthy();
      expect(getByText('Date of visit is required')).toBeTruthy();
    });
  });
});