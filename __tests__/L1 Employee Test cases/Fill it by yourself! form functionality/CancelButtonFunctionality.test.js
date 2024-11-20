import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf'; // Replace with actual path
import {GestureHandlerRootView,TouchableOpacity,} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import PhoneInput from 'react-native-phone-number-input';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {Dropdown} from 'react-native-element-dropdown';
import {launchImageLibrary} from 'react-native-image-picker';
import {CalendarList} from 'react-native-calendars';
import Share from 'react-native-share';
import Dialog from 'react-native-dialog';
import UserContext from '../../../context/UserContext'; 
import AuthProvider from '../../../src/auth/AuthProvider';
jest.mock('react-native-share',()=>{return (jest.fn())})	
jest.mock('react-native-dialog',()=>{return (jest.fn())})
jest.mock('react-native-image-picker',()=>{return (jest.fn())})
jest.mock('react-native-phone-number-input',()=>{return (jest.fn())})
jest.mock('libphonenumber-js',()=>{return (jest.fn())})
jest.mock('react-native-element-dropdown',()=>{return (jest.fn())})
jest.mock('react-native-gesture-handler',()=>{return (jest.fn())})
jest.mock('react-native-fs',()=>{return (jest.fn())})
jest.mock('@react-native-picker/picker',()=>{return (jest.fn())})
jest.mock('react-native-modern-datepicker',()=>{return (jest.fn())})
jest.mock('react-native-calendars',()=>{return (jest.fn())})	



const mockNavigation = { navigate: jest.fn() };

// const mockUserContextValue = {
//   getAccessToken:jest.fn(() => 'mock-access-token'),
//   accessToken: 'mockAccessToken123',
//   loggedUser: { name: 'John Doe' },
//   setLoggedUser: jest.fn(),
//   testResident: { id: 't987', name: 'Test Resident' },
//   setApproveDataFetched:jest.fn(),
// };


const mockGetAccessToken = jest.fn(() => 'mock-access-token');
 
describe('Visitor Information Form - Cancel Button', () => {
  it('should clear all fields when the Cancel button is clicked', () => {
    const { getByPlaceholderText, getByText } = render(
    
    <FillByYourSelf getAccessToken={mockGetAccessToken} navigation={mockNavigation}/>

);   
    fireEvent.changeText(getByPlaceholderText('Name'),'John Doe');
    fireEvent.changeText(getByPlaceholderText('Phone Number'),'1234567890');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.press(getByText('Cancel'));

    // Assert all fields are cleared
    expect(nameField.props.value).toBe('');
    expect(phoneField.props.value).toBe(''); 
    expect(emailField.props.value).toBe('');
    expect(addressField.props.value).toBe('');
  });
});
