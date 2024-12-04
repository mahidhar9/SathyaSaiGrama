// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import Profile from '../../../src/screens/Profile';
// import UserContext from '../../../context/UserContext';
// import { AuthContext } from '../../../src/auth/AuthProvider';
// import { Alert } from 'react-native';
// import { patchDataWithInt } from '../../../src/components/ApiRequest';
// import {
//     signOut,
//     deleteUser,
//     reauthenticateWithCredential,
//     EmailAuthProvider,
//   } from 'firebase/auth';

// jest.mock('firebase/auth',()=>({
//     getReactNativePersistence: jest.fn().mockResolvedValue('local'),
//     initializeAuth: jest.fn(),
//     signOut: jest.fn(),
//     deleteUser: jest.fn(),
//     reauthenticateWithCredential: jest.fn(),
//     EmailAuthProvider: {
//         credential: jest.fn(),
//             // userEmail: '19211314310mca2@gmail.com',
//             // password: '123456',

//     },
// }))
// jest.mock('react-native-toast-message', () => ({
//   show: jest.fn(),
// }));
// jest.mock('react-native-image-picker',()=>{
//   return{
//     launchImageLibrary: jest.fn(),
//     launchCamera: jest.fn(),
//   }
// })
// jest.mock('react-native-permissions',()=>{
//     return {
//         check: jest.fn().mockResolvedValue('granted'),
//         request: jest.fn().mockResolvedValue('granted'),
//         PERMISSIONS: {
//             IOS: {
//                 CAMERA: 'camera',
//                 PHOTO_LIBRARY: 'photo',
//             },
//             ANDROID: {
//                 CAMERA: 'camera',
//                 READ_EXTERNAL_STORAGE: 'read_external_storage',
//             },
//         },
//     }
// })
// jest.mock('../../../src/components/ApiRequest', () => ({
//   patchDataWithInt: jest.fn().mockResolvedValue({
//     result: [{ code: 3000 }],
//   }),
// }));

// jest.mock('react-native/Libraries/Alert/Alert', () => ({
//   alert: jest.fn(),
// }));

// const mockNavigation = { navigate: jest.fn() };

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
//   employee: { id: 'e789', name: 'Alice Employee' },
//   setEmployee: jest.fn(),
//   testResident: { id: 't987', name: 'Test Resident' },
//   setTestResident: jest.fn(),
//   departmentIds: ['d1', 'd2', 'd3'],
//   setDepartmentIds: jest.fn(),
//   userEmail: 'mockuser@example.com', // Mock user email
// };

// const mockAuthContextValue = {
//   user: { uid: '123', email: 'mockuser@example.com' },
//   setUser: jest.fn(),
// };

// beforeEach(() => {
//   jest.useFakeTimers();
//   jest.spyOn(global, 'fetch').mockResolvedValue({
//     json: jest.fn().mockResolvedValue({
//       result: [{ code: 3000 }],
//     }),
//   });
// });

// afterEach(() => {
//   jest.clearAllTimers();
//   jest.restoreAllMocks();
// });
// jest.mock('react-native-linear-gradient',()=>{
//     return {
//         LinearGradient: 'LinearGradient'
//     }
// })
// jest.mock('react-native-shimmer-placeholder', () => ({
//   createShimmerPlaceholder: () => jest.fn(() => 'ShimmerPlaceholderMock'),
// }))
// describe('Profile Screen', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should allow the user to edit and save vehicle details', async () => {
//     const { getByText, getByPlaceholderText, getByTestId } = render(
//       <AuthContext.Provider value={mockAuthContextValue}>
//         <UserContext.Provider value={mockUserContextValue}>
//           <Profile navigation={mockNavigation} />
//         </UserContext.Provider>
//       </AuthContext.Provider>
//     );

//     // Step 1: Navigate to the My Profile section
//     fireEvent.press(getByText('My Profile'));

//     // Step 2: Click the Edit button in the Vehicle Info section
//     fireEvent.press(getByText('Edit'));

//     // Step 3: Add or modify vehicle details
//     fireEvent.changeText(getByPlaceholderText('Vehicle Type'), 'Car');
//     fireEvent.changeText(getByPlaceholderText('Vehicle Number'), 'TS12PQ1234');

//     // Step 4: Save the changes
//     fireEvent.press(getByText('Save'));

//     // Verify that the vehicle details are updated and the success message is displayed
//     await waitFor(() => {
//       expect(patchDataWithInt).toHaveBeenCalledWith(
//         'All_Vehicle_Information',
//         expect.objectContaining({
//           data: expect.objectContaining({
//             Vehicle_Type: 'Car',
//             Vehicle_Number: 'TS12PQ1234',
//           }),
//         }),
//         'mockAccessToken123'
//       );
//       expect(Alert.alert).toHaveBeenCalledWith('Success', 'Vehicle details updated successfully');
//       expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
//     });
//   });
// });

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import MyProfile from '../../../src/screens/MyProfile';
import UserContext from '../../../context/UserContext';
import {AuthContext} from '../../../src/auth/AuthProvider';
import {Alert} from 'react-native';
import {patchDataWithInt} from '../../../src/components/ApiRequest';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-elements',()=>{
    return {
        Avatar: 'Avatar',
        Image : 'Image',
    }
})
jest.mock('../../../src/components/ApiRequest', () => ({
  patchDataWithInt: jest.fn().mockResolvedValue({
    result: [{code: 3000}],
  }),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn().mockResolvedValue('granted'),
  request: jest.fn().mockResolvedValue('granted'),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'camera',
      PHOTO_LIBRARY: 'photo',
    },
    ANDROID: {
      CAMERA: 'camera',
      READ_EXTERNAL_STORAGE: 'read_external_storage',
    },
  },
}));

jest.mock('../../../src/components/ApiRequest', () => ({
  patchDataWithInt: jest.fn().mockResolvedValue({
    result: [{code: 3000}],
  }),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const mockNavigation = {navigate: jest.fn()};

const mockUserContextValue = {
  userType: 'admin',
  setUserType: jest.fn(),
  accessToken: 'mockAccessToken123',
  setUserEmail: jest.fn(),
  setL1ID: jest.fn(),
  loggedUser: {name: 'John Doe'},
  setLoggedUser: jest.fn(),
  deviceToken: 'mockDeviceToken456',
  resident: {id: 'r123', name: 'Jane Resident'},
  setResident: jest.fn(),
  setProfileImage: jest.fn(),
  employee: {id: 'e789', name: 'Alice Employee'},
  setEmployee: jest.fn(),
  testResident: {id: 't987', name: 'Test Resident'},
  setTestResident: jest.fn(),
  departmentIds: ['d1', 'd2', 'd3'],
  setDepartmentIds: jest.fn(),
  userEmail: 'mockuser@example.com', // Mock user email
};

const mockAuthContextValue = {
  user: {uid: '123', email: 'mockuser@example.com'},
  setUser: jest.fn(),
};

describe('MyProfile Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the user to edit and save vehicle details', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <MyProfile
            navigation={mockNavigation}
            route={{
              params: {
                userInfo: [
                  {
                    Name_field: 'John Doe',
                    Phone_Number: '1234567890',
                    Email: 'john.doe@example.com',
                    Gender: 'Male',
                  },
                ],
                vehicleInfo: [
                  { Vehicle_Type: 'Car', Vehicle_Number: 'TS12PQ1234' },
                ],
                familyMembersData: [],
                flatExists: false,
                flatMember: false,
                flat: {},
                dapartment: 'IT',
                dapartmentExists: true,
              },
            }}
          />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    // Step 1: Click the Edit button in the Vehicle Info section
    fireEvent.press(getByTestId('edit'));


    // Verify that the vehicle details are updated and the success message is displayed
    await waitFor(() => {
      expect(patchDataWithInt).toHaveBeenCalledWith(
        'All_Vehicle_Information',
        expect.objectContaining({
          data: expect.objectContaining({
            Vehicle_Type: 'Car',
            Vehicle_Number: 'TS12PQ1234',
          }),
        }),
        'mockAccessToken123'
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Vehicle details updated successfully'
      );
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });
  });
});