import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import { TextInput,TouchableOpacity as MockTouchableOpacity} from 'react-native';
import {  GestureHandlerRootView,   } from 'react-native-gesture-handler';

import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';


jest.mock('react-native-modern-datepicker', () => {
  return {
    DatePicker: jest.fn(),
  };
});
jest.mock('@react-native-picker/picker', () => {
  return {
    Picker: jest.fn(),
  }
});
jest.mock('react-native-fs', () => {
  return {
    RNFS: {
      writeFile: jest.fn(),
    },
  };
});


jest.mock('react-native-gesture-handler',()=>{
  return {
    GestureHandlerRootView : jest.fn((props)=>{
      console.log(props)
      return props.children
      
    }),
    
    TouchableOpacity:jest.fn((props)=>{
      
      console.log(props)
      return <MockTouchableOpacity {...props}/>
      
    }),
  }
})
jest.mock('react-native-calendars', () => ({
  
  CalendarList: jest.fn((props)=>{
    return props.children
  }),
}));
jest.mock('react-native-share', () => ({
  Share: jest.fn(),
}));
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));
jest.mock('react-native-phone-number-input', () => {
  const { TextInput } = require('react-native');
  return {
    __esModule: true,
    default: ({ onChangeFormattedText }) => (
      <TextInput
        testID="phoneInput"
        onChangeText={onChangeFormattedText}
        placeholder="Phone Input"
      />
    ),
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

const mockNavigation = { navigate: jest.fn() };
  
describe('Visitor Information Form', () => {
  afterEach(cleanup);
  const renderComponent = (loggedUser) => {
    return render(
      <UserContext.Provider value={{ loggedUser }}>
        <FillByYourSelf navigation={mockNavigation} />
      </UserContext.Provider>
    );
  };

  test('Verify that validation messages appear below all mandatory fields when left empty', async () => {
    const loggedUser = { resident: true, employee: true };
    const { getByText,queryAllByText, getByTestId,getAllByText, debug } = renderComponent(loggedUser);

  
debug();
await waitFor(() => {
    expect(getByText('Group')).toBeTruthy();
  });
  fireEvent.press(getByText('Male'));
  expect(getByText('Male')).toBeTruthy();
  fireEvent.press(getByText('Group'));
    expect(queryAllByText('Number of Men')).toBeTruthy();
    expect(queryAllByText('Number of Women')).toBeTruthy();
    expect(queryAllByText('Number of Boys')).toBeTruthy();
    expect(queryAllByText('Number of Girls')).toBeTruthy();
 

  fireEvent.press(getByText('Submit'));

  // Verify that an error message is displayed
  await waitFor(() => {
    expect(queryAllByText('The selected gender is Male. Please enter a valid number.')).toBeTruthy();
  });

  })
})