import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserContext from '../../../context/UserContext';
import EditVerifydetails from '../../../src/screens/approval/EditVerifydetails';
import Dialog from 'react-native-dialog';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';

jest.mock('react-native-modern-datepicker', () => ({
  DatePicker: jest.fn(),
  getFormatedDate: jest.fn((date, format) => `${date} formatted as ${format}`),
}));

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve({ data: 'mocked data' }),
//     arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
//   })
// );

jest.mock('react-native-share', () => ({
  Share: jest.fn(),
}));
jest.mock('react-native-dialog', () => ({
  Dialog: jest.fn(({ children }) => <>{children}</>),
}));
// jest.mock('react-native-fs', () => ({
//   writeFile: jest.fn(),
//   RNFS: jest.fn(),
// }));
// jest.mock('react-native-phone-number-input', () => ({
//   PhoneInput: jest.fn((props)=>{
//     return props.children
//   }),
// }));

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
      triggerDialog: true,
      L2_Approval_Status: 'PENDING',
      Name_field: { zc_display_value: 'John Doe' },
      Vehicle_Information: [
        { Vehicle_Type: 'Car', Vehicle_Number: 'KA01AB1234', ID: '1' },
        { Vehicle_Type: 'Bike', Vehicle_Number: 'KA02CD5678', ID: '2' },
      ],
    };


    const { getByText, getByPlaceholderText, queryByText, debug } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <EditVerifydetails navigation={mockNavigation}  route={{ params: { user } }}/>
        </NavigationContainer>
      </UserContext.Provider>
    );

    debug();

    await waitFor(() => {
      expect(queryByText('Edit Visitor Info Screen')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Govt Officials');
    fireEvent.changeText(getByPlaceholderText('Priority'), 'P1');
    fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');

    fireEvent.press(getByText('Update'));

    await waitFor(() => {
      expect(queryByText('Updated visitor information is displayed correctly')).toBeTruthy();
    });
  });
});

// import React from 'react';
// import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import UserContext from '../../../context/UserContext';
// import EditVerifydetails from '../../../src/screens/approval/EditVerifydetails';
// import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';
// import Dialog from 'react-native-dialog';


// jest.mock('react-native-dialog',()=>{
//   return {
//     Dialog: jest.fn(({children})=>children),
//     Titile : jest.fn(({children})=>children),
//     Description : jest.fn(({children})=>children),
//     Button : jest.fn(({children})=>children),

//   }
// })
// jest.mock('react-native-modern-datepicker', () => {
//   return {
//     DatePicker: jest.fn((props)=>props.children),
//     getFormatedDate: jest.fn((date, format) => `${date} formatted as ${format}`),
//   };
// });


// jest.mock('react-native-share', () => {
//   return {
//     Share: jest.fn(),
//   };
// });
// jest.mock('react-native-dialog', () => {
//   return {
//     Dialog: jest.fn(({ children }) => children),
//   };
// });
// jest.mock('react-native-fs', () => {
//   return {
//     writeFile: jest.fn(),
//     RNFS:jest.fn(),
//   };
// });

// jest.mock('react-native-phone-number-input', () => {
//   return {
//     PhoneInput: jest.fn((porps) =>{
//       return porps.children
//     })
//   }
// })

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
//       Date_of_Visit: '20-nov-2024',
//       Name_field: { zc_display_value: 'John Doe' },
//       Vehicle_Information: [
//         { Vehicle_Type: 'Car', Vehicle_Number: 'KA01AB1234', ID: '1' },
//         { Vehicle_Type: 'Bike', Vehicle_Number: 'KA02CD5678', ID: '2' },
//       ],
//     };

//     const { getByText, getByPlaceholderText, queryByText, debug } = render(
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

//     // Edit the visitor information
//     fireEvent.changeText(getByPlaceholderText('Guest Category'), 'Govt Officials');
//     fireEvent.changeText(getByPlaceholderText('Priority'), 'P1');
//     fireEvent.changeText(getByPlaceholderText('Remarks'), 'Updated remarks');

//     // Click on the Update button
//     fireEvent.press(getByText('Update'));

//     // Verify that the updated visitor information is displayed correctly
//     // await waitFor(() => {
//     //   expect(queryByText('Updated visitor information is displayed correctly')).toBeTruthy();
//     // });
//   });
// });