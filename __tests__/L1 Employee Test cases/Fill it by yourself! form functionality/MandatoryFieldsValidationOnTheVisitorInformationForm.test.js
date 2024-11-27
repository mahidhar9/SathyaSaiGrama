import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import PhoneInput from 'react-native-phone-number-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import Share from 'react-native-share';
import Dialog from 'react-native-dialog';
import { CalendarList } from 'react-native-calendars';
import { Platform } from 'react-native'; // Import Platform
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
const mockNavigation = { navigate: jest.fn() };

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => <>{children}</>,
  TouchableOpacity: ({ children }) => <>{children}</>,
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => <>{children}</>,
}));
jest.mock('react-native-fs', () => jest.fn());
jest.mock('@react-native-picker/picker', () => jest.fn());
jest.mock('react-native-modern-datepicker', () => jest.fn());
jest.mock('react-native-element-dropdown', () => jest.fn());
jest.mock('react-native-share', () => jest.fn());
jest.mock('react-native-dialog', () => jest.fn());
jest.mock('react-native-calendars', () => jest.fn());
jest.mock('react-native-image-picker', () => jest.fn());
jest.mock('react-native-phone-number-input', () => jest.fn());
jest.mock('libphonenumber-js', () => jest.fn());
jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return {
    ...actualReactNative,
    Platform: { OS: 'ios' },
  };
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

    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
      expect(getByText('Phone is required')).toBeTruthy();
      expect(getByText('Date of visit is required')).toBeTruthy();
    });
  });
});