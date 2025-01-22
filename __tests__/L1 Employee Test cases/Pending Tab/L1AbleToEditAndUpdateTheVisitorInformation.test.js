// import React from 'react';
// import {
//   render,
//   fireEvent,
//   waitFor,
//   act,
//   cleanup,
// } from '@testing-library/react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import EditVerifyDetails from '../../../src/screens/approval/EditVerifydetails';
// import {updateRecord} from '../../../src/screens/approval/VerifyDetails';
// import UserContext from '../../../context/UserContext';
// import {AuthContext} from '../../../src/auth/AuthProvider';
// import {Alert} from 'react-native';
// import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';


// jest.spyOn(global, 'fetch').mockResolvedValue({
//     json: jest.fn().mockResolvedValue({
//       result: [{ code: 3000 }], 
//     }),
//   });
// jest.mock('react-native-modern-datepicker', () => {
//     const React = require('react');
//     const { View, Text } = require('react-native');
  
//     return {
//       __esModule: true,
//       default: (props) => (
//         <View testID="DatePickerMock">
//           <Text>DatePicker Mock</Text>
//         </View>
//       ),
//       getFormatedDate: jest.fn(() => '2024-12-14'),
//     };
//   });

// jest.mock('../../../src/screens/approval/VerifyDetails', () => ({
//   updateRecord: jest.fn(() => Promise.resolve({})),
// }));

// jest.mock('../../../src/components/ApiRequest', () => ({
//   findDeviceToken: jest.fn().mockResolvedValue('mockDeviceToken123'),
//   updateDeviceToken: jest.fn().mockResolvedValue({}),
// }));

// jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// describe('L1 Able to Edit and Update the Visitor Information', () => {
//   const mockNavigation = {navigate: jest.fn()};

//   // beforeEach(() => {
//   //   jest.useFakeTimers();
//   //   updateRecord.mockResolvedValue({
//   //     result: [{ code: 3000 }],
//   //   });
        
//   // });

//   // afterEach(() => {
//   //   jest.clearAllMocks();
//   // });

// beforeEach(() => {
//   jest.useFakeTimers();
//   global.fetch=updateRecord.mockResolvedValue({
//     result: [{ code: 3000 }],
//   });

//   // If fetch is used inside updateRecord, ensure it's also mocked appropriately
//   global.fetch = jest.fn().mockResolvedValue({
//     ok: true,
//     json: jest.fn().mockResolvedValue({
//       result: [{ code: 3000 }],
//     }),
//   });
// });
// afterEach(() => {
//   jest.clearAllMocks();
//   jest.useRealTimers();
  
// });
//   const mockAuthContextValue = {
//     user: {email: 'mockuser@example.com'},
//     setUser: jest.fn(),
//   };

//   const mockRoute = {
//     params: {
//       triggerDialog: true,
//       code: '3000',
//       user: {
//         ID: 'user123',
//         Referrer_Approval: 'PENDING APPROVAL',
//         Name_field: {zc_display_value: 'John Doe'},
//         Phone_Number: '9182590940',
//         Single_or_Group_Visit: 'Single',
//         Gender: 'Male',
//         Guest_Category: 'Visitor',
//         Priority: 'P3',
//         Remarks: 'Test remarks',
//         Date_of_Visit: '2023-10-10',
//         Vehicle_Information: [
//           {ID: 'veh1', Vehicle_Type: 'Car', Vehicle_Number: 'KA01CU1234'},
//         ],
//         Home_or_Office: 'Office',
//         Number_of_Men: '1',
//         Number_of_Women: '0',
//         Number_of_Boys: '0',
//         Number_of_Girls: '0',
//         Number_of_People: 1,
//       },
//     },
//   };

//   test('Verify that L1 can edit and update visitor information', async () => {
//     const mockUserContextValue = {
//       user: {
//         ID: 'user123',
//         Referrer_Approval: 'PENDING APPROVAL',
//       },
//       setUser: jest.fn().mockResolvedValue({}),
//     userType: 'admin',
//     setUserType: jest.fn().mockResolvedValue({}),
//     getAccessToken: jest.fn().mockResolvedValue('mockAccessToken123'),
//     updateData: jest.fn().mockResolvedValue({}),
//     employee: jest.fn().mockResolvedValue({}),
//     setEmployee: jest.fn().mockResolvedValue({}),
//     response: jest.fn().mockResolvedValue({}),
//     };

//     const {getByText} = render(
//       <UserContext.Provider value={mockUserContextValue}>
//         <AuthContext.Provider value={mockAuthContextValue}>
//           <NavigationContainer>
//             <EditVerifyDetails
//               navigation={mockNavigation}
//               route={mockRoute}
//               updateLoading={false}
//             />
//           </NavigationContainer>
//         </AuthContext.Provider>
//       </UserContext.Provider>,
//     );

//     // await act(async () => {
//       fireEvent.changeText(getByText('Guest Category'), 'Corporate');
//       fireEvent.changeText(getByText('Gender'), 'Male');
//       fireEvent.changeText(getByText('Priority'), 'P1');
//       fireEvent.changeText(getByText('Remark'), 'Updated remarks');
//       fireEvent.press(getByText('Update'));
//     // });

//     await waitFor(() => {
//       expect(updateRecord).toHaveBeenCalledWith(
//         'Approval_to_Visitor_Report',
//         {
//           criteria: 'ID==user123', 
//           data: {
//             Guest_Category: 'Corporate',
//             Gender: 'Male',
//             Priority: 'P1',
//             Remarks: 'Updated remarks',
//           },
//         },
//         'mockAccessToken123'
//       );

//       expect(mockNavigation.navigate).toHaveBeenCalledWith('VerifyDetails', {
//         user: expect.objectContaining({
//           ID: 'user123',
//           Guest_Category: 'Corporate',
//           Gender: 'Male',
//           Priority: 'P1',
//           Remarks: 'Updated remarks',
//         }),
//       });

//       expect(Alert.alert).toHaveBeenCalledWith('Visitor details changed');
//     });

//   },8000);
// });






// import React from 'react';
// import {
//   render,
//   fireEvent,
//   waitFor,
//   act,
//   cleanup,
// } from '@testing-library/react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import EditVerifyDetails from '../../../src/screens/approval/EditVerifydetails';
// import { updateRecord } from '../../../src/screens/approval/VerifyDetails';
// import UserContext from '../../../context/UserContext';
// import { AuthContext } from '../../../src/auth/AuthProvider';
// import { Alert } from 'react-native';
// import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';

// jest.mock('react-native-fs', () => ({
//   RNFS: {
//     writeFile: jest.fn(),
//   }
// }));
// jest.mock('react-native-share', () => ({
//   open: jest.fn(),
// }));

// jest.mock('react-native-modern-datepicker', () => {
//   const React = require('react');
//   const { View, Text } = require('react-native');

//   return {
//     __esModule: true,
//     default: (props) => (
//       <View testID="DatePickerMock">
//         <Text>DatePicker Mock</Text>
//       </View>
//     ),
//     getFormatedDate: jest.fn(() => '2024-12-14'),
//   };
// });

// jest.mock('../../../src/screens/approval/VerifyDetails', () => ({
//   updateRecord: jest.fn(() => Promise.resolve({ result: [{ code: 3000 }] })),
// }));

// jest.mock('../../../src/components/ApiRequest', () => ({
//   findDeviceToken: jest.fn().mockResolvedValue('mockDeviceToken123'),
//   updateDeviceToken: jest.fn().mockResolvedValue({}),
  
// }));
// jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve({ responseData: { code: 3000 } }),
//   })
// );

// const mockNavigation = { navigate: jest.fn() };
// const mockUserContextValue = {
//   user: {
//     ID: 'user123',
//     Referrer_Approval: 'PENDING APPROVAL',
//   },
//   setUser: jest.fn(),
//   userType: 'admin',
//   setUserType: jest.fn(),
//   dapartment: 'Engineering',
//   dapartmentExists: true,
//   familyMembersData: [
//     {
//       ID: 'family123',
//       Building: 'Building A',
//       Department: { ID: 'd1' },
//       Flat: 'Flat 101',
//       Relationship_with_the_primary_contact: 'Sibling',
//       App_User_lookup: { Name_field: 'Jane Doe' },
//     },
//   ],
//   flat: {
//     building: 'Building A',
//     flat: 'Flat 101',
//   },
//   flatExists: true,
//   flatMember: false,
//   setFlatMember: jest.fn(),
//   setFlatExists: jest.fn(),
//   setDapartment: jest.fn(),
//   setDapartmentExists: jest.fn(),
//   setFamilyMembersData: jest.fn(),
//   getAccessToken: jest.fn().mockResolvedValue('mockAccessToken123'),
// };
// const mockAuthContextValue = {
//   user: { email: 'mockuser@example.com' },
//   setUser: jest.fn(),
// };

// const mockRoute = {
//   params: {
//     triggerDialog: true,
//     code: '3000',
//     user: {
//       ID: 'user123',
//       Referrer_Approval: 'PENDING APPROVAL',
//       Name_field: { zc_display_value: 'John Doe' },
//       Phone_Number: '9182590940',
//       Single_or_Group_Visit: 'Single',
//       Gender: 'Male',
//       Guest_Category: 'Visitor',
//       Priority: 'P3',
//       Remarks: 'Test remarks',
//       Date_of_Visit: '2023-10-10',
//       Vehicle_Information: [
//         { ID: 'veh1', Vehicle_Type: 'Car', Vehicle_Number: 'KA01CU1234' },
//       ],
//       Home_or_Office: 'Office',
//       Number_of_Men: '1',
//       Number_of_Women: '0',
//       Number_of_Boys: '0',
//       Number_of_Girls: '0',
//       Number_of_People: 1,
//     },
//   },
// };

// describe('L1 Able to Edit and Update the Visitor Information', () => {
//   beforeEach(() => {
//     jest.useFakeTimers();

//     // Mock the global fetch function
//     global.fetch = jest.fn().mockResolvedValue({
//       ok: true,
//       json: jest.fn().mockResolvedValue({ responseData: { code: 3000 } }),
//     });
//   });

//   afterEach(() => {
//     jest.useRealTimers();
//     jest.resetAllMocks();
//   });
//   test('Verify that L1 can edit and update visitor information', async () => {
   

//     const { getByTestId } = render(
//       <UserContext.Provider value={mockUserContextValue}>
//         <AuthContext.Provider value={mockAuthContextValue}>
//           <NavigationContainer>
//             <EditVerifyDetails
//               navigation={mockNavigation}
//               route={mockRoute}
//               // updateLoading={false}
//             />
//           </NavigationContainer>
//         </AuthContext.Provider>
//       </UserContext.Provider>
//     );

//     // Simulate user interactions
//     fireEvent.changeText(getByTestId('GuestCategory'), 'Corporate');
//     fireEvent.changeText(getByTestId('priorityInput'), 'P1');
//     fireEvent.changeText(getByTestId('remarkInput'), 'Updated remarks');
//     fireEvent.press(getByTestId('updateButton'));

//     // Advance timers to handle setTimeout callbacks
//     act(() => {
//       jest.advanceTimersByTime(2000);
//     });

//     await waitFor(() => {
//       const BASE_APP_URL = 'https://creator.zoho.com/api/v2.1';
//       const APP_OWNER_NAME = 'annapoornaapp';
//       const APP_LINK_NAME = 'ashram-visitor-management';
//       const REPORT_NAME = 'Approval_to_Visitor_Report';
//       const USER_ID = 'user123';
//       const expectedUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${REPORT_NAME}/${USER_ID}`;

//       const expectedBody = {
//         criteria: `ID==user123`,
//         data: {
//           Date_of_Visit: '2023-10-10',
//           Gender: 'Male',
//           Home_or_Office: 'Office',
//           Number_of_Boys: 0,
//           Number_of_Girls: 0,
//           Number_of_Men: 1,
//           Number_of_People: 1,
//           Number_of_Women: 0,
//           Priority: 'P3',
//           Remarks: 'Updated remarks',
//           Single_or_Group_Visit: 'Single',
//           Guest_Category: 'Visitor',
//           Vehicle_Information: [
//             { Vehicle_Type: 'Car', Vehicle_Number: 'KA01CU1234' },
//           ],
//         },
//       };

//       expect(mockUserContextValue.getAccessToken).toHaveBeenCalled();
//       // expect(global.fetch.mock.calls.length).toBe();
//       // expect(global.fetch.mock.calls[0][0]).toBe(1);
//       expect(global.fetch.mock.calls[0][1].method).toBe('PATCH');
//       expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody));
//       expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Zoho-oauthtoken mockAccessToken123');
//       // expect(global.fetch).toHaveBeenCalledWith(
//       //   'https://creator.zoho.com/api/v2.1/annapoornaapp/ashram-visitor-management/report/Approval_to_Visitor_Report/user123',
//       //   {
//       //     // method: 'PATCH',
//       //     // headers: {
//       //     //   Authorization: 'Zoho-oauthtoken mockAccessToken123', // Ensure getAccessToken returns the resolved token string
//       //     // },
//       //     body: JSON.stringify({
//       //       criteria: 'ID==user123',
//       //       data: {
//       //         Date_of_Visit: '2023-10-10',
//       //         Gender: 'Male',
//       //         Home_or_Office: 'Office',
//       //         Number_of_Boys: 0,
//       //         Number_of_Girls: 0,
//       //         Number_of_Men: 1,
//       //         Number_of_People: 1,
//       //         Number_of_Women: 0,
//       //         Priority: 'P3',
//       //         Remarks: 'Updated remarks',
//       //         Single_or_Group_Visit: 'Single',
//       //         Guest_Category: 'Visitor',
//       //         Vehicle_Information: [
//       //           { Vehicle_Type: 'Car', Vehicle_Number: 'KA01CU1234' },
//       //         ],
//       //       },
//       //     }),
//       //   }
//       // );
//       expect('https://creator.zoho.com/api/v2.1/annapoornaapp/ashram-visitor-management/report/Approval_to_Visitor_Report/user123');
//       // expect(mockNavigation.navigate).toHaveBeenCalledWith('Pending');
//       // expect(Alert.alert).toHaveBeenCalledWith('Visitor details changed');
//     });
//   });
// });













import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
  cleanup,
} from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import EditVerifyDetails from '../../../src/screens/approval/EditVerifydetails';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { Alert } from 'react-native';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

// Mocking external modules
jest.mock('react-native-fs', () => ({
  RNFS: {
    writeFile: jest.fn(),
  },
}));
jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));
jest.mock('react-native-modern-datepicker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: (props) => (
      <View testID="DatePickerMock">
        <Text>DatePicker Mock</Text>
      </View>
    ),
    getFormatedDate: jest.fn(() => '2024-12-14'),
  };
});

// Mocking API requests
jest.mock('../../../src/components/ApiRequest', () => ({
  findDeviceToken: jest.fn().mockResolvedValue('mockDeviceToken123'),
  updateDeviceToken: jest.fn().mockResolvedValue({}),
}));

// Mock Alert.alert to prevent actual alerts during tests
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock global.fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ code: 3000 }),
});

const mockNavigation = { navigate: jest.fn() };
const mockUserContextValue = {
  user: {
    ID: 'user123',
    Referrer_Approval: 'PENDING APPROVAL',
  },
  setUser: jest.fn(),
  userType: 'admin',
  setUserType: jest.fn(),
  dapartment: 'Engineering',
  dapartmentExists: true,
  familyMembersData: [
    {
      ID: 'family123',
      Building: 'Building A',
      Department: { ID: 'd1' },
      Flat: 'Flat 101',
      Relationship_with_the_primary_contact: 'Sibling',
      App_User_lookup: { Name_field: 'Jane Doe' },
    },
  ],
  flat: {
    building: 'Building A',
    flat: 'Flat 101',
  },
  flatExists: true,
  flatMember: false,
  setFlatMember: jest.fn(),
  setFlatExists: jest.fn(),
  setDapartment: jest.fn(),
  setDapartmentExists: jest.fn(),
  setFamilyMembersData: jest.fn(),
  getAccessToken: jest.fn().mockResolvedValue('mockAccessToken123'),
};
const mockAuthContextValue = {
  user: { email: 'mockuser@example.com' },
  setUser: jest.fn(),
};

const mockRoute = {
  params: {
    triggerDialog: true,
    code: '3000',
    user: {
      ID: 'user123',
      Referrer_Approval: 'PENDING APPROVAL',
      Name_field: { zc_display_value: 'John Doe' },
      Phone_Number: '9182590940',
      Single_or_Group_Visit: 'Single',
      Gender: 'Male',
      Guest_Category: 'Visitor',
      Priority: 'P3',
      Remarks: 'Test remarks',
      Date_of_Visit: '2023-10-10',
      Vehicle_Information: [
        { ID: 'veh1', Vehicle_Type: 'Car', Vehicle_Number: 'KA01CU1234' },
      ],
      Home_or_Office: 'Office',
      Number_of_Men: '1',
      Number_of_Women: '0',
      Number_of_Boys: '0',
      Number_of_Girls: '0',
      Number_of_People: 1,
    },
  },
};

describe('L1 Able to Edit and Update the Visitor Information', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the global fetch function if necessary
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ code: 3000 }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  test('Verify that L1 can edit and update visitor information', async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <NavigationContainer>
            <EditVerifyDetails
              navigation={mockNavigation}
              route={mockRoute}
            />
          </NavigationContainer>
        </AuthContext.Provider>
      </UserContext.Provider>
    );

    // Simulate user interactions
    fireEvent.changeText(getByTestId('GuestCategory'), 'Corporate');
    fireEvent.changeText(getByTestId('priorityInput'), 'P1');
    fireEvent.changeText(getByTestId('remarkInput'), 'Updated remarks');
    fireEvent.press(getByTestId('updateButton'));

    // Advance timers to handle setTimeout callbacks
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Await the async operations and make assertions
    await waitFor(() => {
      const expectedUrl =
        'https://creator.zoho.com/api/v2.1/annapoornaapp/ashram-visitor-management/report/Approval_to_Visitor_Report/user123';

      const expectedBody = {
        criteria: 'ID==user123',
        data: {
          Date_of_Visit: '2023-10-10',
          Gender: 'Male',
          Home_or_Office: 'Office',
          Number_of_Boys: 0,
          Number_of_Girls: 0,
          Number_of_Men: 1,
          Number_of_People: 1,
          Number_of_Women: 0,
          Priority: 'P1',
          Remarks: 'Updated remarks',
          Single_or_Group_Visit: 'Single',
          Guest_Category: 'Corporate',
          Vehicle_Information: [
            { Vehicle_Type: 'Car', Vehicle_Number: 'KA01CU1234' },
          ],
        },
      };

      // Ensure that getAccessToken was called
      expect(mockUserContextValue.getAccessToken).toHaveBeenCalled();
 // expect(global.fetch.mock.calls.length).toBe();
//       // expect(global.fetch.mock.calls[0][0]).toBe(1);
      expect(global.fetch.mock.calls[0][1].method).toBe('PATCH');
      expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody));
      expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Zoho-oauthtoken mockAccessToken123');
      
      // expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
      //   method: 'PATCH',
      //   headers: {
      //     Authorization: 'Zoho-oauthtoken mockAccessToken123',
      //     'Content-Type': 'application/json', // Ensure appropriate headers
      //   },
      //   body: JSON.stringify(expectedBody),
      // });

      // Ensure navigation occurred as expected
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Pending');

      // Ensure alert was shown as expected
      expect(Alert.alert).toHaveBeenCalledWith('Visitor details changed');
    });
  });
});