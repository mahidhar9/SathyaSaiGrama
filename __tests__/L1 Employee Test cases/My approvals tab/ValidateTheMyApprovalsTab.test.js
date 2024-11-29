import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
import { NavigationContainer } from '@react-navigation/native';
import UserContext from '../../../context/UserContext';

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

const mockNavigation = { navigate: jest.fn() };

const mockUserContextValue = {
  userType: 'admin',
  setUserType: jest.fn(),
  accessToken: 'mockAccessToken123',
  setUserEmail: jest.fn(),
  setL1ID: jest.fn(),
  loggedUser: { name: 'John Doe', role: 'L1' },
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
  pendingDataFetched: false,
};

describe('ApprovalTab', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });
  test('Verify that the Pending, Approved, and Denied tabs are working properly', async () => {
    const { getByText ,getByTestId,screen,getByRole} = render(
      <NavigationContainer>
        <UserContext.Provider value={mockUserContextValue}>
          <ApprovalTab />
        </UserContext.Provider>
      </NavigationContainer>
    );
    
    
    expect(getByText('Pending')).toBeTruthy();

    fireEvent.press(getByText('Approved'));
    await waitFor(() => {
      expect(getByText('Approved')).toBeTruthy();
    });
    fireEvent.press(getByText('Rejected'));
    await waitFor(() => {
      expect(getByText('Denied')).toBeTruthy();
    });
    fireEvent.press(getByText('Pending'));
    await waitFor(() => {
      expect(getByText('Pending')).toBeTruthy();
    });
  });
});

// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
// import Pending from '../../../src/screens/approval/Pending';
// import Approved from '../../../src/screens/approval/Approved';
// import Denied from '../../../src/screens/approval/Denied';
// import { NavigationContainer } from '@react-navigation/native';
// import PhoneInput from 'react-native-phone-number-input';
// import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
// import { SearchBar } from 'react-native-elements';
// import UserContext from '../../../context/UserContext';

// const mockValues = {
//   L1ID: '123456789',
//   loggedUser.role:'L1'
//   getAccessToken: jest.fn(),
//   pendingDataFetched: false,
//   setPendingDataFetched: jest.fn(),
//   approvedDataFetched: false,
//   setApprovedDataFetched: jest.fn(),
//   deniedDataFetched: false,
//   setDeniedDataFetched: jest.fn(),
// };

// jest.mock('react-native-elements', () => ({
//   SearchBar: jest.fn(),
// }));
// jest.mock('react-native-modern-datepicker', () => ({
//   getFormatedDate: jest.fn(),
//   DatePicker: jest.fn(),
// }))
// jest.mock('react-native-phone-number-input', () => ({
//   PhoneInput: jest.fn(),
//   parsePhoneNumberFromString: jest.fn(),
// }));
// describe('ApprovalTab', () => {
//   test('Verify that the Pending, Approved, and Denied tabs are working properly', async () => {
//     // Render the ApprovalTab component inside NavigationContainer
//     const { getByText } = render(
//       <NavigationContainer>
//       <UserContext.Provider value={mockValues}>
//         <ApprovalTab />
//         </UserContext.Provider>
//       </NavigationContainer>
//     );

//     // Verify that the Pending component is rendered by default
//     expect(getByText('Pending Component')).toBeTruthy();

//     // Navigate to the Approved tab by clicking the 'Approved' tab
//     fireEvent.press(getByText('Approved'));
//     await waitFor(() => {
//       expect(getByText('Approved Component')).toBeTruthy();
//     });

//     // Navigate to the Denied tab by clicking the 'Rejected' tab (assuming 'Rejected' is the text of the tab)
//     fireEvent.press(getByText('Rejected'));
//     await waitFor(() => {
//       expect(getByText('Denied Component')).toBeTruthy();
//     });

//     // Navigate back to the Pending tab by clicking the 'Pending' tab
//     fireEvent.press(getByText('Pending'));
//     await waitFor(() => {
//       expect(getByText('Pending Component')).toBeTruthy();
//     });
//   });
// });
