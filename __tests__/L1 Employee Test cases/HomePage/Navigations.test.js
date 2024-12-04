
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import FooterTab from '../../../navigation/tab-navigation/FooterTab';
import UserContext from '../../../context/UserContext';
import { Text } from 'react-native';
import Toast from 'react-native-toast-message';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder'
import Invite from '../../../src/screens/Invite';
import Profile from '../../../src/screens/Profile';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import Share from 'react-native-share';
import {CalendarList} from 'react-native-calendars';

jest.mock('react-native-calendars', () => {
  return {
    CalendarList: jest.fn(),
  };
});
jest.mock('react-native-fs', () => {
  return {
    RNFS: {
      readDir: jest.fn(),
    },
  };
});
jest.mock('@react-native-picker/picker', () => {
  return {
    Picker: jest.fn(),
  };
});
jest.mock('react-native-modern-datepicker', () => {
  return {
    DatePicker: jest.fn(),
  };
});
jest.mock('react-native-share', () => {
  return {
    Share: jest.fn(),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    TouchableOpacity: View,
  };
});
jest.mock('react-native-shimmer-placeholder', () => ({
  
  ShimmerPlaceholder : jest.fn({
    createShimmerPlaceholder : jest.fn({
      LinearGradient : jest.fn(),

    }),
  })
}));
jest.mock('react-native-linear-gradient', () => ({
 
  LinearGradient : jest.fn()
}));
jest.mock('react-native-permissions', () => {
  return {
    PERMISSIONS: {
      CAMERA: 'camera',
      PHOTO_LIBRARY: 'photo',
    },
    check: jest.fn().mockResolvedValue('granted'),
    request: jest.fn().mockResolvedValue('granted'),
  };
});
jest.mock('react-native-image-picker',()=>({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn()
}))
jest.mock('react-native-toast-message', () => ({
  default: jest.fn(),
  Toast:jest.fn()
}))
jest.mock('../../../src/screens/Invite.js', () => {
  const {Text} = require('react-native');
  return () => <Text>Invite Screen</Text>;
});
jest.mock('../../../src/screens/approval/ApprovalTab.js', () => {
  const {Text} = require('react-native');
  return () => <Text>ApprovalTab Screen</Text>;
});
jest.mock('../../../src/screens/Profile.js', () => {
  const {Text} = require('react-native');
  return () => <Text>Account Screen</Text>;
});


jest.mock('react-native-modern-datepicker', () => {	
  return {
    default: jest.fn(),
    getFormatedDate: jest.fn(),
    DatePicker : jest.fn(),
  }
  });

jest.mock('react-native-phone-number-input', () => {	
  const { TextInput } = require('react-native');
  return {
    default: jest.fn(),
    TextInput,
  };
});
jest.mock('react-native-elements', () => {
  return {
    SearchBar: jest.fn(),
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

describe('FooterTab Navigation Tests', () => {
  afterEach(cleanup);

  it('navigates to Invite screen by default', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <FooterTab />
        </NavigationContainer>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Invite Screen')).toBeTruthy();
    });
  });

  it('navigates to My Approvals tab and shows Pending screen by default', async () => {
    const { getByText,getAllByRole } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <FooterTab />
        </NavigationContainer>
      </UserContext.Provider>
    );
    expect(getAllByRole('button')).toHaveLength(2);
   
    // Simulate navigating to the My Approvals tab
    fireEvent.press(getAllByRole('button')[1]);

    await waitFor(() => {
      expect(getByText('Pending Screen')).toBeTruthy();
    });
  });

  it('navigates to Account tab and shows Account screen', async () => {
    const { getByText,getAllByRole } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <FooterTab />
        </NavigationContainer>
      </UserContext.Provider>
    );
     expect(getAllByRole('button')).toHaveLength(2);
    // Simulate navigating to the Account tab
    fireEvent.getAllByRole(getByText('button')[1]);

    await waitFor(() => {
      expect(getByText('Account Screen')).toBeTruthy();
    });
  });

  // it('ensures tabs respond properly without delay or double-click effects', async () => {
  //   const { getByText } = render(
  //     <UserContext.Provider value={mockUserContextValue}>
  //       <NavigationContainer>
  //         <FooterTab />
  //       </NavigationContainer>
  //     </UserContext.Provider>
  //   );

  //   // Simulate rapid clicks on the tabs
  //   for (let i = 0; i < 5; i++) {
  //     fireEvent.press(getByText('Invite'));
  //     fireEvent.press(getByText('My Approvals'));
  //     fireEvent.press(getByText('Account'));
  //   }

  //   await waitFor(() => {
  //     expect(getByText('Invite Screen')).toBeTruthy();
  //     expect(getByText('Pending Screen')).toBeTruthy();
  //     expect(getByText('Account Screen')).toBeTruthy();
  //   });
  // });
});