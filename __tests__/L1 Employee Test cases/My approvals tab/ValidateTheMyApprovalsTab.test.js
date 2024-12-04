// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
// import { NavigationContainer } from '@react-navigation/native';
// import UserContext from '../../../context/UserContext';
// import { Text } from 'react-native';
// import Approved from '../../../src/screens/approval/Approved';
// import Denied from '../../../src/screens/approval/Denied';
// import Pending from '../../../src/screens/approval/Pending';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// const Tab = createMaterialTopTabNavigator();


// jest.mock('@react-navigation/material-top-tabs', () => {
//   return {
//     createMaterialTopTabNavigator: jest.fn(() => {
//       return {
//         Navigator: jest.fn(),
//         Screen: jest.fn(),
//       };
//     }),
//   };
// });
// jest.mock('react-native/Libraries/Alert/Alert', () => ({
//   alert: jest.fn(),
// }));
// jest.mock('react-native-elements', () => ({
//   SearchBar: jest.fn(),
// }));
// jest.mock('react-native-modern-datepicker', () => ({
//   getFormatedDate: jest.fn(),
//   DatePicker: jest.fn(),
// }));
// jest.mock('react-native-phone-number-input', () => ({
//   PhoneInput: jest.fn(),
//   parsePhoneNumberFromString: jest.fn(),
// }));

// jest.mock('react-native-fs', () => ({
//   RNFS: {
//     writeFile: jest.fn(),
//     Share: jest.fn(),
//   },
// }));
// jest.mock('../../../src/screens/approval/Pending', () => {
//   return {
//     someFunction: jest.fn(() => 'Pending'),
//   };
// });

// jest.mock('../../../src/screens/approval/Approved', () => {
//   return {
//     someFunction: jest.fn(() => 'Approved'), 
//   };
// });

// jest.mock('../../../src/screens/approval/Denied', () => {
//   return {
//     someFunction: jest.fn(() => 'Denied'),
//   };
// });

// const mockNavigation = { navigate: jest.fn() };

// const mockUserContextValue = {
//   userType: 'admin',
//   setUserType: jest.fn(),
//   accessToken: 'mockAccessToken123',
//   setUserEmail: jest.fn(),
//   setL1ID: jest.fn(),
//   loggedUser: { name: 'John Doe', role: 'L1' },
//   setLoggedUser: jest.fn(),
//   deviceToken: 'mockDeviceToken456',
//   resident: { id: 'r123', name: 'Jane Resident' },
//   setResident: jest.fn(),
//   setProfileImage: jest.fn(),
//   employee: { id: 'e789', name: 'Alice Employee' },
//   setEmployee: jest.fn(),
//   testResident: { id: 't987', name: 'Test Resident' },
//   setTestResident: jest.fn(),
//   departmentIds: ['d1', 'd2', 'd3'],
//   setDepartmentIds: jest.fn(),
// };

// beforeEach(() => {
//   jest.useFakeTimers();
// });

// afterEach(() => {
//   jest.clearAllTimers();
//   jest.restoreAllMocks();
// });


// const MyTabs=()=>{
  
//     <Tab.Navigator>
//       <Tab.Screen name="Pending" component={required('../../../src/screens/approval/Pending.js').default} />
//       <Tab.Screen name="Approved" component={required('../../../src/screens/approval/Approved').default} />
//       <Tab.Screen name="Denied" component={required('../../../src/screens/approval/Denied').default} />
//     </Tab.Navigator>
  
// }

// describe('ApprovalTab', () => {
//   test('Verify that the Pending, Approved, and Denied tabs are working properly', async () => {
//     const { getByText } = render(
//       <NavigationContainer>
//         <UserContext.Provider value={mockUserContextValue}>
//           <MyTabs />
//         </UserContext.Provider>
//       </NavigationContainer>
//     );
//     // expect(getByText('Pending')).toBeTruthy();
//       expect(Tab.Screen).toHaveBeenCalledWith('Pending');
//     fireEvent.press(getByText('Approved'));
//     await waitFor(() => {
//       expect(getByText('Approved')).toBeTruthy();
//     });

//     fireEvent.press(getByText('Rejected'));
//     await waitFor(() => {
//       expect(getByText('Denied')).toBeTruthy();
//     });

//     fireEvent.press(getByText('Pending'));
//     await waitFor(() => {
//       expect(getByText('Pending')).toBeTruthy();
//     });
//   });
// });

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserContext from '../../../context/UserContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from '../../../src/screens/approval/Pending';
import Approved from '../../../src/screens/approval/Approved';
import Denied from '../../../src/screens/approval/Denied';

const Tab = createMaterialTopTabNavigator();
jest.mock('../../../src/screens/approval/Pending', () => {
    return {
      someFunction: jest.fn(() => 'Pending'),
    };
  });
  
  jest.mock('../../../src/screens/approval/Approved', () => {
    return {
      someFunction: jest.fn(() => 'Approved'), 
    };
  });
  
  jest.mock('../../../src/screens/approval/Denied', () => {
    return {
      someFunction: jest.fn(() => 'Denied'),
    };
  });
const MyTabs = () => (
  <Tab.Navigator>
   <Tab.Screen
      name="Pending"
      component={require('../../../src/screens/approval/Pending').default}
      options={{
        tabBarActiveTintColor: '#FFBE65',
        tabBarInactiveTintColor: 'gray',
      }}
    />
    <Tab.Screen name="Pending" component={Pending} />
    <Tab.Screen name="Approved" component={Approved} />
    <Tab.Screen name="Denied" component={Denied} />
  </Tab.Navigator>
);

jest.mock('@react-navigation/material-top-tabs', () => {
    return {
      createMaterialTopTabNavigator: jest.fn(() => {
        return {
          Navigator: jest.fn(),
          Screen: jest.fn(),
        };
      }),
    };
  });
  jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
  }));
  jest.mock('react-native-elements', () => ({
    SearchBar: jest.fn(),
  }));
  jest.mock('react-native-modern-datepicker', () => ({
    getFormatedDate: jest.fn(),
    DatePicker: jest.fn(),
  }));
  jest.mock('react-native-phone-number-input', () => ({
    PhoneInput: jest.fn(),
    parsePhoneNumberFromString: jest.fn(),
  }));
  
  jest.mock('react-native-fs', () => ({
    RNFS: {
      writeFile: jest.fn(),
      Share: jest.fn(),
    },
  }));
const mockUserContextValue = {
  userType: 'admin',
  setUserType: jest.fn(),
  accessToken: 'mockAccessToken123',
  loggedUser: { name: 'John Doe', role: 'L1' },
  setLoggedUser: jest.fn(),
  deviceToken: 'mockDeviceToken456',
};
const mockNavigation = { navigate: jest.fn() };
describe('ApprovalTab', () => {
  test('Verify navigation between Pending, Approved, and Denied tabs', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserContext.Provider value={mockUserContextValue}>
          <MyTabs />
        </UserContext.Provider>
      </NavigationContainer>
    );

    // expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    // Navigate to Approved
    fireEvent.press(getByText('Approved'));
    expect(getByText('Approved Screen')).toBeTruthy();

    // Navigate to Denied
    fireEvent.press(getByText('Denied'));
    expect(getByText('Denied Screen')).toBeTruthy();

    // Navigate back to Pending
    fireEvent.press(getByText('Pending'));
    expect(getByText('Pending Screen')).toBeTruthy();
  });
});
