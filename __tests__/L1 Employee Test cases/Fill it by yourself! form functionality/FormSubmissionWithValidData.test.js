import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import { GestureHandlerRootView , TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker'
import PhoneInput from 'react-native-phone-number-input';
import {launchImageLibrary} from 'react-native-image-picker';
import Share from 'react-native-share';
import Dialog from 'react-native-dialog';
import {CalendarList} from 'react-native-calendars';

jest.mock('react-native-calendars',()=>({
  CalendarList:jest.fn(),
}))
jest.mock('react-native-share',()=>({
  open:jest.fn(),
  Share:jest.fn()
}))

jest.mock('react-native-dialog',()=>({
  Dialog:jest.fn(),
}))
jest.mock('react-native-image-picker', () => {
  return {
    launchImageLibrary: jest.fn(),
  };
});
jest.mock('react-native-phone-number-input', () => {
  return {
    PhoneInput: jest.fn(),
    parsePhoneNumberFromString: jest.fn(),
  };
});
jest.mock('react-native-modern-datepicker', () => {
  return {
    DatePicker: jest.fn(),
  };
});
jest.mock('@react-native-picker/picker',()=>{
  return{
    Picker:jest.fn(),
  }
})
jest.mock('react-native-fs',()=>{
  return {
    RNFS: {
      writeFile: jest.fn(),
      Share: jest.fn(),
    },
  }
})
jest.mock('react-native-gesture-handler',()=>{
  return{
    GestureHandlerRootView:jest.fn(),
    TouchableOpacity:jest.fn(),
  }
})
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
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

describe('Form Submission with Valid Data', () => {
  test('Verify that the user can successfully submit the form with valid data', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <GestureHandlerRootView>
        <UserContext.Provider value={mockUserContextValue}>
          <FillByYourSelf navigation={mockNavigation} />
        </UserContext.Provider>
      </GestureHandlerRootView>
    );

    // Step 1: Fill in all the mandatory fields with valid data
    // fireEvent.changeText(getByPlaceholderText('Name'), 'mr Sai Teja');
    fireEvent.changeText(getByTestId('PhoneInput'), '+91 9876543210');
    fireEvent.changeText(getByPlaceholderText('Date of Visit'), '20-09-2024');
    fireEvent.press(getByText('Single'));
    fireEvent.press(getByText('Office'));
    fireEvent.press(getByText('Male'));
    fireEvent.press(getByText('Politician'));
    fireEvent.press(getByText('P1'));
    fireEvent.changeText(getByPlaceholderText('Vehicle Type'), 'Car');
    fireEvent.changeText(getByPlaceholderText('Vehicle Number'), 'Ts-09-1234');

    // Step 2: Click on the Submit button
    fireEvent.press(getByText('Submit'));

    // Step 3: Observe if the form is submitted successfully
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Form submitted successfully',
        [{ text: 'OK' }]
      );
    });
  });
});