import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import { TouchableOpacity as MockTouchableOpacity } from 'react-native';

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
  })
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

describe('FillByYourSelf Component', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockUserContext = {
    getAccessToken: jest.fn(),
    loggedUser: { resident: true, employee: true, name: 'Test User', userId: '123', role: 'L1' },
    setLoggedUser: jest.fn(),
    testResident: false,
    accessToken: 'mockAccessToken',
    setApproveDataFetched: jest.fn(),
  };

  it('test_validate_phone_number_country_code_selection', async () => {
    const { getByTestId, getByText } = render(
      <UserContext.Provider value={mockUserContext}>
        <FillByYourSelf navigation={mockNavigation} />
      </UserContext.Provider>
    );

    const phoneInput = getByTestId('phoneInput');
    fireEvent.changeText(phoneInput, '+61 9876543210');

    const submitButton = getByTestId('submitButton');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Invalid phone number')).toBeTruthy();
    });
  });
})