import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import VerifyDetails from '../../../src/screens/approval/VerifyDetails';
import UserContext from '../../../context/UserContext';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

jest.mock('react-native-share', () => ({
  open: jest.fn()
}));
jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
);

const mockOnShare = jest.fn();
const mockNavigation = { navigate: jest.fn() };
const mockRoute = {
    params: {
      stringified: false,
      user: {
        ID: '123',
        Referrer_Approval : 'APPROVED' ,
            L2_Approval_Status : 'APPROVED',
        Name_field: { zc_display_value: 'John Doe' },
        Phone_Number: '1234567890',
        Single_or_Group_Visit: 'Single',
        Date_of_Visit: '2023-09-20',
        Guest_Category: 'Corporate',
        Priority: 'High',
        Remarks: 'Important visitor',
        Gender: 'Male',
        Vehicle_Information: [{ zc_display_value: 'Car - ABC123' }], // Ensure this is an array
        Referrer_App_User_lookup: { zc_display_value: 'Referrer Name' },
        Department: { Department: 'Engineering' },
      },
    },
  };
const mockUserContextValue = {
  loading: false,
  onShare: jest.fn(),
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
  const BASE_APP_URL = 'http://example.com';
  const APP_OWNER_NAME = 'appOwner';
  const APP_LINK_NAME = 'appLink';
  test('test_onApprove_generates_qr_and_passcode', async () => {
    const { getByText ,getByTestId ,getAllByText,debug} = render(
      <UserContext.Provider value={mockUserContextValue}>
        <NavigationContainer>
          <VerifyDetails navigation={mockNavigation} route={mockRoute} loading={false}/>
        </NavigationContainer>
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(getByTestId('shareButton')).toBeTruthy();
    })
    fireEvent.press(getByText('Share'));
    
    await waitFor(() => {
      expect(RNFS.writeFile).toHaveBeenCalledWith(
        `${RNFS.DocumentDirectoryPath}/images.jpg`,
        expect.any(String),
        'base64'
      );
    });
  
});
})