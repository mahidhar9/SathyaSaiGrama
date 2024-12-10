// import React from 'react';
// import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import UserContext from '../../../context/UserContext';
// import EditVerifydetails from '../../../src/screens/approval/EditVerifydetails';
// import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';
// import {split} from 'path';

// jest.mock('react-native-modern-datepicker', () => {
//   return {
//     DatePicker: jest.fn(),
//     getFormatedDate: jest.fn(),
//   };
// })
// jest.mock('react-native-share', () => {
//   return {
//     Share: jest.fn(),
//   };
// });
// jest.mock('react-native-dialog', () => {
//   return {
//     Dialog: jest.fn(),
//   };
// });
// jest.mock('react-native-fs', () => {
//   return {
//     writeFile: jest.fn(),
//     RNFS: jest.fn(),
//     ExternalDirectoryPath: jest.fn(),
//   };
// });
// jest.spyOn(String.prototype, 'split').mockImplementation( (separator)=> {
//   return split(separator);
// });

// jest.mock('react-native-phone-number-input', () => {
//   return {
//     PhoneInput: jest.fn(),
//   };
// });

// const mockUserContextValue = {
//   userType: 'admin',
//   setUserType: jest.fn(),
//   accessToken: 'mockAccessToken123',
//   setUserEmail: jest.fn(),
//   setL1ID: jest.fn(),
//   loggedUser: { name: 'John Doe' },
//   setLoggedUser: jest.fn(),
//   deviceToken: 'mockDeviceToken456',
//   resident: { id: 'r123', name: 'Jane Resident' },
//   setResident: jest.fn(),
//   setProfileImage: jest.fn(),
//   getAccessToken: jest.fn(),
//   setPendingDataFetched: true,
// };

// const mockNavigation = { navigate: jest.fn() };
// describe('L1 Able to Edit and Update the Visitor Information', () => {
//   afterEach(cleanup);
  
//   test('Verify that L1 can edit and update visitor information', async () => {
//     const user = {
//       L2_Approval_Status: 'PENDING',
//       Guest_Category: 'Corporate',
//       Priority: 'P2',
//       Remarks: 'Initial remarks',
//       Date_of_Visit: '2023/09/20', // Provide a valid date string
//     };

//     const { getByText, getByPlaceholderText, getByTestId, queryByText, debug } = render(
//       <UserContext.Provider value={mockUserContextValue}>
//         <NavigationContainer>
//           <EditVerifydetails navigation={mockNavigation} route={{ params: { user } }} />
//         </NavigationContainer>
//       </UserContext.Provider>
//     );

//     debug();

//     await waitFor(() => {
//       expect(queryByText('Edit Visitor Info Screen')).toBeTruthy();
//     });

//     fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Govt Officials');
//     fireEvent.changeText(getByPlaceholderText('Priority'), 'P1');
//     fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');

//     fireEvent.press(getByText('Update'));

//     await waitFor(() => {
//       expect(queryByText('Updated visitor information is displayed correctly')).toBeTruthy();
//     });
//   });
// });


import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserContext from '../../../context/UserContext';
import EditVerifydetails from '../../../src/screens/approval/EditVerifydetails';
import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';


global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
);

jest.mock('react-native-modern-datepicker', () => {
  return {
    DatePicker: jest.fn(({ children }) => children),
    getFormatedDate: jest.fn(),
  };
});
jest.mock('react-native-share', () => {
  return {
    Share: jest.fn(),
  };
});
jest.mock('react-native-dialog', () => {
  return {
    Dialog: jest.fn(({ children }) => children),
  };
});
jest.mock('react-native-fs', () => {
  return {
    writeFile: jest.fn(),
    RNFS: {
      DocumentDirectoryPath: '/mock/path',
    },
    ExternalDirectoryPath: jest.fn(),
  };
});
jest.spyOn(String.prototype, 'split').mockImplementation((separator) => {
  return ['2023', '09', '20'];
});
jest.mock('react-native-phone-number-input', () => {
  return {
    PhoneInput: jest.fn(() => <div />),
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

describe('L1 Able to Edit and Update the Visitor Information', () => {
  afterEach(cleanup);

  test('Verify that L1 can edit and update visitor information', async () => {
    const user = {
      L2_Approval_Status: 'PENDING',
      Guest_Category: 'Corporate',
      Priority: 'P2',
      Remarks: 'Initial remarks',
      Date_of_Visit: '2023/09/20', // Provide a valid date string
    };

    const { getByText, getByPlaceholderText, queryByText, debug } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <EditVerifydetails navigation={mockNavigation} route={{ params: { user } }} />
        </NavigationContainer>
      </UserContext.Provider>
    );

    debug();

    // Verify that the Edit Visitor Info screen is displayed
    await waitFor(() => {
      expect(queryByText('Edit Visitor Info Screen')).toBeTruthy();
    });

    // Edit the visitor information
    fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Govt Officials');
    fireEvent.changeText(getByPlaceholderText('Priority'), 'P1');
    fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');

    // Click on the Update button
    fireEvent.press(getByText('Update'));

    // Verify that the updated visitor information is displayed correctly
    await waitFor(() => {
      expect(queryByText('Updated visitor information is displayed correctly')).toBeTruthy();
    });
  });
});