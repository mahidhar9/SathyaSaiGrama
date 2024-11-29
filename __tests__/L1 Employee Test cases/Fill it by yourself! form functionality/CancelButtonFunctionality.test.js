import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import PhoneInput from 'react-native-phone-number-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import { CalendarList } from 'react-native-calendars';
import Share from 'react-native-share';
import Dialog from 'react-native-dialog';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';

jest.mock('react-native-share', () => jest.fn());
jest.mock('react-native-dialog', () => jest.fn());
jest.mock('react-native-image-picker', () => jest.fn());
jest.mock('react-native-phone-number-input', () => jest.fn());
jest.mock('libphonenumber-js', () => jest.fn());
jest.mock('react-native-element-dropdown', () => jest.fn());
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  TouchableOpacity: ({ children }) => children,
  Swipeable: ({ children }) => children,
  DrawerLayout: ({ children }) => children,
  State: {},
  ScrollView: ({ children }) => children,
  PanGestureHandler: ({ children }) => children,
  BaseButton: ({ children }) => children,
  RectButton: ({ children }) => children,
  BorderlessButton: ({ children }) => children,
  FlatList: ({ children }) => children,
  gestureHandlerRootHOC: jest.fn(),
  Directions: {},
}));
jest.mock('react-native-fs', () => jest.fn());
jest.mock('@react-native-picker/picker', () => jest.fn());
jest.mock('react-native-modern-datepicker', () => jest.fn());
jest.mock('react-native-calendars', () => jest.fn());

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

describe('Visitor Information Form - Cancel Button', () => {
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
    expect(getByPlaceholderText('Name').props.value).toBe('');
    expect(getByPlaceholderText('Phone').props.value).toBe('');
    expect(getByPlaceholderText('Date of Visit').props.value).toBe('');
    expect(getByText('Single').props.selected).toBe(false);
    expect(getByText('Home').props.selected).toBe(false);
    expect(getByText('Male').props.selected).toBe(false);
    expect(getByPlaceholderText('Photo').props.value).toBe('');
    expect(getByPlaceholderText('Guest Category').props.value).toBe('');
    expect(getByPlaceholderText('Priority').props.value).toBe('');
    expect(getByPlaceholderText('Remark').props.value).toBe('');
  });
});