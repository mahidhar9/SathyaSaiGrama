import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Pending from '../../../src/screens/approval/Pending';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../../src/components/ApiRequest';

jest.mock('../../../src/components/ApiRequest', () => ({
  getDataWithIntAndString: jest.fn(),
}));

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
  getFormatedDate: jest.fn((date, format) => {
    // Mock implementation of getFormatedDate
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }),
}));
jest.mock('react-native-fs', () => ({
  RNFS: {
    writeFile: jest.fn(),
    Share: jest.fn(),
  },
}));

beforeEach(() => {
  jest.useFakeTimers();
})
afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});
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
  getAccessToken: jest.fn(),
  setPendingDataFetched: jest.fn(),
};

const mockPendingsData = [
  {
    ID: 1,
    Name_field: { first_name: 'John', last_name: 'Doe' },
    Date_of_Visit: '2022-01-01',
    Number_of_People: 3,
  },
  {
    ID: 2,
    Name_field: { first_name: 'Jane', last_name: 'Doe' },
    Date_of_Visit: '2022-02-02',
    Number_of_People: 2,
  },
];

describe('Pending Approvals', () => {
  test('Verify that L1 can approve or reject visitor applications', async () => {
    getDataWithIntAndString.mockResolvedValueOnce({ data: mockPendingsData });

    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <UserContext.Provider value={mockUserContextValue}>
          <Pending navigation={mockNavigation} />
        </UserContext.Provider>
      </NavigationContainer>
    );

    await waitFor(() => {
      mockPendingsData.forEach(item => {
        expect(getByText(`${item.Name_field.first_name} ${item.Name_field.last_name}`)).toBeTruthy();
        expect(getByText(`Date of visit : ${item.Date_of_Visit}`)).toBeTruthy();
        expect(getByText(`No. of people: ${item.Number_of_People}`)).toBeTruthy();
      });
    });

    fireEvent.press(getByTestId('approveButton'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Approved');
    });

    fireEvent.press(getByTestId('rejectButton'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Denied');
    });
  });
});