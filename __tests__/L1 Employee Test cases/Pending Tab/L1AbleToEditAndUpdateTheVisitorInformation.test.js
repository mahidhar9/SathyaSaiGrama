import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Pending from '../../../src/screens/approval/Pending';
import EditVerifyDetails from '../../../src/screens/approval/EditVerifydetails';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../../src/components/ApiRequest';
import VerifyDetails from '../../../src/screens/approval/VerifyDetails';
import FooterTab from '../../../navigation/tab-navigation/FooterTab'
import { SearchBar } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient'; 
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {GestureHandlerRootView, TouchableOpacity} from 'react-native-gesture-handler';

jest.mock('react-native-gesture-handler',()=>{
  return{
    GestureHandlerRootView:jest.fn(),
    TouchableOpacity:jest.fn(),
  }
})
jest.mock('react-native-shimmer-placeholder', () => ({
  createShimmerPlaceholder: jest.fn(),
}));
jest.mock('react-native-linear-gradient',()=>{
  return jest.fn().mockImplementation((props) => {
    return props.children;
  });
})
jest.mock('react-native-permissions', () => ({
  request: jest.fn(),
  PERMISSIONS: jest.fn().mockReturnValue('granted'),
}));
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  Toast: jest.fn(),
}));
jest.mock('react-native-elements',()=>{
  return{
    SearchBar:jest.fn(),
  }
})
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

jest.spyOn(global, 'fetch').mockResolvedValue({
    useFocusEffect: jest.fn().mockImplementation((callback) => callback()),
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
  setEditData: jest.fn(),
  Name_field : jest.fn(),
};

const mockUser = {
  ID: 1,
  Name_field: { first_name: 'John', last_name: 'Doe' },
  Date_of_Visit: '2022-01-01',
  Number_of_People: 2,
  Guest_Category: 'Corporate',
  Priority: 'P1',
  Remarks: 'Initial remarks',
  Referrer_App_User_lookup: {
    Name_field: 'Sasi',
    phone: '+919182590940',
  },
  Department: {
    Department: 'IT',
  },
};

const route = {
  params: {
    user: mockUser,
  },
};

const mockEditVerifyDetails = jest.fn();
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

describe('Pending Approvals', () => {
  test('Verify that L1 can edit and update visitor information',  async () => {
    // const mockPendingsData = jest.fn().mockResolvedValue([
    //     {
    //         Name_field: { first_name: 'Alice', last_name: 'Employee' },
    //         Date_of_Visit: '2022-01-01',
    //         Number_of_People: 3,
    //     },
    //     {
    //         Name_field: { first_name: 'Bob', last_name: 'Resident' },
    //         Date_of_Visit: '2022-02-02',
    //         Number_of_People: 2,
    //     },
    //     ]);

    // getDataWithIntAndString.mockResolvedValueOnce({ data: mockPendingsData });

    const { getByText,getByTestId } = render(
      <NavigationContainer>
        <UserContext.Provider value={mockUserContextValue}>
          <FooterTab navigation={mockNavigation} />
        </UserContext.Provider>
      </NavigationContainer>
    );
        fireEvent.press(getByTestId('editButton'));
    // Verify that the ApprovalComponent is rendered for each pending approval
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('EditVerifyDetails')
    });
  });
})


describe('VerifyDetails Screen', () => {
  test('should navigate to EditVerifyDetails screen with correct data', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
          <NavigationContainer>
            <UserContext.Provider value={mockUserContextValue}>
              <EditVerifyDetails  navigation={mockNavigation} />
            </UserContext.Provider>
          </NavigationContainer>
        );
      
   

    // Edit the visitor information
    fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Politician');
    fireEvent.changeText(getByPlaceholderText('Priority'), 'P2');
    fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');

    // Click on Update button
    fireEvent.press(getByText('Update'));

    // Verify that the updated visitor information is displayed correctly
    await waitFor(() => {
      expect(getByText('Politician')).toBeTruthy();
      expect(getByText('P2')).toBeTruthy();
      expect(getByText('Updated remarks')).toBeTruthy();
    });
  });
});

