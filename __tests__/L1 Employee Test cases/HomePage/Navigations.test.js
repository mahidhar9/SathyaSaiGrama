import React from 'react';
import { Text as MockText}  from 'react-native';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native'; // Import Platform from react-native
import Profile from '../../../src/screens/Profile';
import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
import FooterTab from '../../../navigation/tab-navigation/FooterTab';
import UserContext from '../../../context/UserContext';
import {GestureHandlerRootView , TouchableOpacity} from 'react-native-gesture-handler'; 
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker'
import { SearchBar } from 'react-native-elements';
import Share from 'react-native-share';
import {CalendarList} from 'react-native-calendars'; 




jest.mock('../../../src/screens/approval/Pending', () => {
  return jest.fn().mockImplementation ((props) => {
      return (<MockText>Pending Screen</MockText>)
    })});
jest.mock('../../../src/screens/approval/Approved', () =>{
  return jest.fn().mockImplementation ((props) => {
      return (<MockText>Approved  Screen</MockText>)
    })});
jest.mock('../../../src/screens/approval/Denied', () => {
  return jest.fn().mockImplementation ((props) => {
      return (<MockText>Denied Screen</MockText>)
    })});

jest.mock('react-native-calendars',()=>({
  CalendarList:jest.fn(),
}))
jest.mock('react-native-share', () => jest.fn());
jest.mock('react-native-elements',()=>{
  return{
    SearchBar: jest.fn()
  }
})
jest.mock('react-native-modern-datepicker',()=>jest.fn({
    DatePicker: jest.fn(),
}))
jest.mock('@react-native-picker/picker', () => jest.fn({
  Picker: jest.fn(),
}));
jest.mock('react-native-fs',()=>{
  return {
    RNFS : jest.fn()
  }
})
jest.mock('react-native-gesture-handler',()=>{
  return{
    GestureHandlerRootView : jest.fn(),
    TouchableOpacity: jest.fn()
  }
})

jest.mock('react-native-toast-message', () => jest.fn());
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));
jest.mock('react-native-permissions', () => ({
  request: jest.fn(),
  PERMISSIONS: jest.fn().mockReturnValue('granted'),
}));
jest.mock('react-native-linear-gradient', () => jest.fn());
jest.mock('react-native-shimmer-placeholder', () => ({ createShimmerPlaceholder: jest.fn() }));
jest.mock('react-native-phone-number-input', () => jest.fn());
jest.mock('react-native-element-dropdown', () => jest.fn());
jest.mock('react-native-modern-datepicker', () => ({
  DatePicker: jest.fn(),
  getFormattedDate: jest.fn(),
}));
jest.mock('react-native-elements', () => ({ SearchBar: jest.fn() }));

// Mock the createBottomTabNavigator function to return the expected structure
jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    
    createBottomTabNavigator: jest.fn(() => ({
      Navigator: jest.fn(),
      Screen: jest.fn(),
    })),
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
};

describe('ApprovalTab Navigation Tests', () => {
  afterEach(cleanup);

  it('navigates to Pending tab by default', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <ApprovalTab />
        </NavigationContainer>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Pending Screen')).toBeTruthy();
    });
  });

  it('navigates to Approved tab when clicked', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <ApprovalTab />
        </NavigationContainer>
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Approved'));

    await waitFor(() => {
      expect(getByText('Approved Screen')).toBeTruthy();
    });
  });

  it('navigates to Denied tab when clicked', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <ApprovalTab />
        </NavigationContainer>
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Rejected'));

    await waitFor(() => {
      expect(getByText('Denied Screen')).toBeTruthy();
    });
  });
});