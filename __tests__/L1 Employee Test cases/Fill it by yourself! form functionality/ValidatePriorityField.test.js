import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import FillByYourSelf from '../../../src/screens/FillByYourSelf';
import UserContext from '../../../context/UserContext';
import { TextInput,TouchableOpacity as MockTouchableOpacity} from 'react-native';
import {  GestureHandlerRootView,   } from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

jest.spyOn(View.prototype, 'measureInWindow').mockImplementation(callback => {
  callback(100, 200, 300, 400);
});
jest.mock('react-native-modern-datepicker', () => {
  return {
    DatePicker: jest.fn((props)=>{
      return props.children
  }),
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
const renderComponent = (loggedUser) => {
    return render(
      <UserContext.Provider value={{ loggedUser }}>
        <FillByYourSelf navigation={mockNavigation} />
      </UserContext.Provider>
    );
  };
  

describe('Visitor Information Form', () => {
    test('Verify that the user can Validate guest category dropdown', async () => {
        const loggedUser = { resident: true, employee: true };
        const { getByText,getByTestId, queryAllByText,debug ,queryByText,getAllByText} = renderComponent(loggedUser);
        
        expect(getByTestId('Priority')).toBeTruthy();
        fireEvent.press(getByTestId('Priority'));
        fireEvent.press(getAllByText('...')[1]);
        fireEvent.press(getByText('P1'));
        await waitFor(() => {
            expect(getByText('P1')).toBeTruthy(); 
        })
        
        

    })
})
