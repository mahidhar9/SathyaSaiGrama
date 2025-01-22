// import React from 'react';
// import { render, fireEvent, waitFor ,act } from '@testing-library/react-native';
// import Edit from '../../../src/screens/Edit'; // Adjust the import path as necessary
// import UserContext from '../../../context/UserContext';
// import { AuthContext } from '../../../src/auth/AuthProvider';
// import { NavigationContainer } from '@react-navigation/native';
// import { patchDataWithInt } from '../../../src/components/ApiRequest';
// import { Alert } from 'react-native';
// import PhoneInput from 'react-native-phone-number-input';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// jest.mock('react-native-phone-number-input', () => ({
//   PhoneInput: jest.fn((props) => {
//     return props.children;
//   })
// }));

  
//   jest.mock('../../../src/components/ApiRequest', () => ({
//     patchDataWithInt: jest.fn().mockResolvedValue({
//       result: [{ code: 3000 }],
//     }),
//   }));
  
//   jest.mock('react-native/Libraries/Alert/Alert', () => ({
//     alert: jest.fn(),
//   }));
  
//   describe('Edit Personal Information', () => {
//     const mockNavigation = { navigate: jest.fn() };
  
//     const mockUserContextValue = {
//       userType: 'admin',
//       setUserType: jest.fn(),
//       accessToken: 'mockAccessToken123',
//       setUserEmail: jest.fn(),
//       setL1ID: jest.fn(),
//       loggedUser: {
//         userId: 'user123',
//         name: 'John Doe',
//         role: 'admin',
//         email: 'johndoe@example.com',
//         deptIds: ['d1', 'd2', 'd3'],
//         profilePhoto: 'profile.jpg',
//         resident: { id: 'r123', name: 'Jane Resident' },
//         employee: { id: 'e789', name: 'Alice Employee' },
//         testResident: { id: 't987', name: 'Test Resident' },
//       },
//       setLoggedUser: jest.fn(),
//       deviceToken: 'mockDeviceToken456',
//       setResident: jest.fn(),
//       setProfileImage: jest.fn(),
//       setEmployee: jest.fn(),
//       setTestResident: jest.fn(),
//       departmentIds: ['d1', 'd2', 'd3'],
//       setDepartmentIds: jest.fn(),
//       getAccessToken: jest.fn(),
    
//     };
  
//     const mockAuthContextValue = {
//       user: { email: 'mockuser@example.com' },
//       setUser: jest.fn(),
//     };
  
//     beforeEach(() => {
//       jest.clearAllMocks();
//       AsyncStorage.getItem.mockResolvedValue(
//         JSON.stringify({
//           userId: 'user123',
//           role: 'admin',
//           email: 'johndoe@example.com',
//           deptIds: ['d1', 'd2', 'd3'],
//           name: 'John Doe',
//           Gender: 'Male',
//           Name_field: 'John Doe',
//           Phone_Number: '1234567890',
//           profilePhoto: 'profile.jpg',
//           resident: { id: 'r123', name: 'Jane Resident' },
//           employee: { id: 'e789', name: 'Alice Employee' },
//           testResident: { id: 't987', name: 'Test Resident' },
//         })
//       );
//     });
  
//     // it('should edit name and gender, submit the form, and navigate to My Profile screen', async () => {
//     //   patchDataWithInt.mockResolvedValue({
//     //     result: [{ code: 3000 }],
//     //   });
  
//     //   const { getByTestId ,getAllByText,getByText,debug } = render(
//     //     <AuthContext.Provider value={mockAuthContextValue}>
//     //       <UserContext.Provider value={mockUserContextValue}>
//     //         <NavigationContainer>
//     //           <Edit
//     //             navigation={mockNavigation}
//     //             route={{
//     //               params: {
//     //                 formType: 'BasicInfo',
//     //                 ID: 'user123',
//     //                 userdata: {
//     //                   ID: 'user123', // Updated to match L1ID
//     //                   Name_field: 'John Doe',
//     //                   Secondary_Phone: '0987654321',
//     //                   Email: 'johndoe@example.com',
//     //                   Gender: 'Male',
//     //                 },
//     //               },
//     //             }}
//     //           />
//     //         </NavigationContainer>
//     //       </UserContext.Provider>
//     //     </AuthContext.Provider>
//     //   );
  
//     //   fireEvent.press(getByText('Cancel'));
  
//     //   expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProfile',
//     //      {
//     //     userInfo: [{
//     //       Email: 'johndoe@example.com',
//     //       Gender: 'Male',
//     //       ID: 'user123',
//     //       Name_field: 'John Doe',
//     //       Secondary_Phone: '0987654321'
//     //     }],
//     //     vehicleInfo: undefined
//     //   });
//     // });

//     it('should edit name and gender, submit the form, and navigate to My Profile screen', async () => {
//       patchDataWithInt.mockResolvedValue({
//         result: [{ code: 3000 }],
//       });
  
//       const { getByTestId ,getAllByText,getByText,debug } = render(
//         <AuthContext.Provider value={mockAuthContextValue}>
//           <UserContext.Provider value={mockUserContextValue}>
//             <NavigationContainer>
//               <Edit
//                 navigation={mockNavigation}
//                 route={{
//                   params: {
//                     formType: 'MemberBasicInfo',
                    
//                     userdata: {
//                       ID: 'user123', // Updated to match L1ID
//                       Name_field: 'John Doe',
//                       Secondary_Phone: '0987654321',
//                       Email: 'johndoe@example.com',
//                       Gender: 'Male',
//                     },
//                     // memberdata: {
//                     //   App_User_lookup: {
//                     //     // ID: 'user123',
//                     //     Name_field: 'John Doe',
//                     //     Email: 'johndoe@example.com',
//                     //     Phone_Number: '1234567890',
//                     //     ID: 'resident123',
//                     //     Gender:'Female'
//                     //   },
//                     //   Relationship_with_the_primary_contact: 'Sibling',
//                     // },
                    
//                   },
//                 }}
//               />
//             </NavigationContainer>
//           </UserContext.Provider>
//         </AuthContext.Provider>
//       );
//       expect(getByTestId('gender')).toBeTruthy();
//       fireEvent.changeText(getByTestId('gender'), 'Female');
//     await act(async () => {
//       fireEvent.press(getByText('Submit'));
//     })
//       expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProfile', {
//         userInfo: [{
//           Email: 'johndoe@example.com',
//           Gender: 'Female',
//           ID: 'user123',
//           Name_field: 'John Doe',
//           Secondary_Phone: '0987654321'
//         }],
//         vehicleInfo: undefined
//       });


  
   
  
//     });

//   });





import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import Edit from '../../../src/screens/Edit'; // Adjust the import path as necessary
import UserContext from '../../../context/UserContext';
import {AuthContext} from '../../../src/auth/AuthProvider';
import {NavigationContainer} from '@react-navigation/native';
import {patchDataWithInt} from '../../../src/components/ApiRequest';
import {Alert} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('react-native-phone-number-input', () => ({
  PhoneInput: jest.fn(props => {
    return props.children;
  }),
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
  loggedUser: {
    name: 'John Doe',
    userId: 1, // Ensure userId is present
    L1ID: 1, // Add L1ID as per your context
    // Include other necessary fields if required
  },
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
  dapartment: 'Engineering', // Added dapartment
  dapartmentExists: true, // Added dapartmentExists
  familyMembersData: [
    // Added familyMembersData
    {
      ID: 'family123',
      Building: 'Building A',
      Department: {ID: 'd1'},
      Flat: 'Flat 101',
      Relationship_with_the_primary_contact: 'Sibling',
      App_User_lookup: {Name_field: 'Jane Doe'},
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
  setFlat: jest.fn(),
  getAccessToken: jest.fn(),
};

const mockAuthContextValue = {
  user: {uid: '123', email: 'mockuser@example.com'},
  setUser: jest.fn(),
};
const initialVehicleData = [
  {
    ID: 'vehicle1',
    Vehicle_Type: '2-Wheeler',
    Vehicle_Number: 'KA 01 AB 1234',
    dapartment: 'Engineering',
    dapartmentExists: true,
    vehicledata: [
      {
        ID: 'vehicle1',
        Vehicle_Type: '2-Wheeler',
        Vehicle_Number: 'KA 01 AB 1234',
      },
    ],
  },
];
describe('Edit Screen - Update Vehicle Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update vehicle information and navigate to MyProfile screen', async () => {
    const {getByText, findByText, debug, getByTestId, getByDisplayValue} =
      render(
        <AuthContext.Provider value={mockAuthContextValue}>
          <UserContext.Provider value={mockUserContextValue}>
            <NavigationContainer>
              <Edit
                navigation={mockNavigation}
                route={{
                  params: {
                    formType: 'MemberBasicInfo',
                    userdata: {
                      ID: 'user123',
                      Name_field: 'John Doe',
                      Phone_Number: '0987654321',
                      Email: 'johndoe@example.com',
                      Gender: 'Male',
                    },
                    vehicledata: initialVehicleData,
                    familyMembersData: [],
                    flatExists: true,
                    flat: {},
                  },
                }}
              />
            </NavigationContainer>
          </UserContext.Provider>
        </AuthContext.Provider>,
      );
 fireEvent.changeText(getByTestId('gender'), 'Female');
    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });

    debug();
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProfile',{
        "dapartment": undefined,
        "dapartmentExists": undefined,
        "familyMembersData": undefined,
        "flat": undefined,
        "flatExists": {},
        "flatMember": undefined,
        "userInfo": [
          {
            "Email": "johndoe@example.com",
            "Gender": "Male",
            "ID": "user123",
            "Name_field": "John Doe",
            "Phone_Number": "0987654321"
          }
        ],
        "vehicleInfo": [
          {
            "ID": "vehicle1",
            "Vehicle_Number": "KA 01 AB 1234",
            "Vehicle_Type": "2-Wheeler",
            "dapartment": "Engineering",
            "dapartmentExists": true,
            "vehicledata": [
              {
                "ID": "vehicle1",
                "Vehicle_Number": "KA 01 AB 1234",
                "Vehicle_Type": "2-Wheeler"
              }
            ]
          }
        ]
      })
    });
  });
});
