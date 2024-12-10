import React from 'react';
import { render, waitFor ,fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import VerifyDetails from '../../../src/screens/approval/VerifyDetails';
import UserContext from '../../../context/UserContext';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
);

jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve(true)),
  unlink: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

const mockNavigation = { navigate: jest.fn() };
const mockRoute = {
  params: {
    triggerDialog: true,
    user: {
      ID: '123',
      Referrer_Approval: 'APPROVED',
      L2_Approval_Status: 'APPROVED',
      Name_field: { zc_display_value: 'John Doe' },
      Phone_Number: '1234567890',
      Single_or_Group_Visit: 'Single',
      Date_of_Visit: '2023-09-20',
      Guest_Category: 'Corporate',
      Priority: 'High',
      Remarks: 'Important visitor',
      Gender: 'Male',
      Vehicle_Information: [{ zc_display_value: 'Car - ABC123' }],
      Referrer_App_User_lookup: { zc_display_value: 'Referrer Name' },
      Department: { Department: 'Engineering' },
    },
  },
};

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
  setEditData: jest.fn(),
};

describe('VerifyDetails Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('All pending approvals should be displayed with correct details', async () => {
    const mockPendingApprovals = [
      {
        ID: '1',
        Name_field: { zc_display_value: 'John Doe' },
        Phone_Number: '1234567890',
        Date_of_Visit: '2023-10-10',
        Guest_Category: 'VIP',
        Priority: 'High',
        Remarks: 'No remarks',
        Gender: 'Male',
        Vehicle_Information: [],
        Home_or_Office: 'Home',
      },
      {
        ID: '2',
        Name_field: { zc_display_value: 'Jane Smith' },
        Phone_Number: '0987654321',
        Date_of_Visit: '2023-10-11',
        Guest_Category: 'Business',
        Priority: 'Medium',
        Remarks: 'Important meeting',
        Gender: 'Female',
        Vehicle_Information: [{ zc_display_value: 'Car - XYZ789' }],
        Home_or_Office: 'Office',
      },
      {
        ID: '3',
        Name_field: { zc_display_value: 'Alice Johnson' },
        Phone_Number: '1122334455',
        Date_of_Visit: '2023-10-12',
        Guest_Category: 'Personal',
        Priority: 'Low',
        Remarks: 'Family visit',
        Gender: 'Female',
        Vehicle_Information: [{ zc_display_value: 'Bike - ABC123' }],
        Home_or_Office: 'Home',
      },
    ];

   
    const { getByText ,getAllByText,debug} = render(
        <UserContext.Provider value={mockUserContextValue}>
          <NavigationContainer>
            <VerifyDetails navigation={mockNavigation} route={mockRoute} />
          </NavigationContainer>
        </UserContext.Provider>
      );
    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
      expect(getAllByText('1234567890')).toHaveLength(1);
      expect(getByText('2023-09-20')).toBeTruthy();
      expect(getByText('Corporate')).toBeTruthy();
      expect(getByText('High')).toBeTruthy();
      expect(getByText('Remarks')).toBeTruthy();
      expect(getByText('Male')).toBeTruthy();
    });
  });
});