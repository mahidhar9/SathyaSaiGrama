import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ViewDetails from '../../../src/screens/L2-approval/ViewDetails';
import UserContext from '../../../context/UserContext';
import RNFS from 'react-native-fs';



jest.mock('react-native-share', () => ({
  open: jest.fn()
}));
jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(),
  RNSF:jest.fn()
}));


global.fetch = jest.fn((url) => {
  if (url.includes('generate-image')) {
    return Promise.resolve({
      ok: true,
      blob: () => Promise.resolve(new Blob(['mockBlobData'], { type: 'image/png' })),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
  });
});

global.FileReader = jest.fn(() => ({
  readAsDataURL: jest.fn(),
  onloadend: jest.fn(),
  onerror: jest.fn(),
  result: 'data:image/png;base64',
}));


const mockOnShare = jest.fn();
const mockNavigation = { navigate: jest.fn() };

const user = {
  L2_Approval_Status: 'PENDING',
  Guest_Category: 'Corporate',
  Priority: 'P2',
  Remarks: 'Initial remarks',
  Date_of_Visit: '2023/09/20',
  Name_field: JSON.stringify({ zc_display_value: 'John Doe' }),
  Referrer_App_User_lookup: JSON.stringify({ Name_field: 'Referrer Name', Email: 'referrer@example.com' }),
  Department: JSON.stringify({ Department: 'Engineering' }),
  Vehicle_Information: JSON.stringify([
    { Vehicle_Type: 'Car', Vehicle_Number: 'KA01AB1234', ID: '1' },
    { Vehicle_Type: 'Bike', Vehicle_Number: 'KA02CD5678', ID: '2' },
  ]),
};
const mockRoute = {
  params: {
    stringified: true,
    user: JSON.stringify(user),
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


  it('test_onApprove_generates_qr_and_passcode', async () => {
    
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <ViewDetails navigation={mockNavigation} route={mockRoute} loading={false}/>
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(RNFS.writeFile).toHaveBeenCalledWith(
        `data:image/png;base64,${base64Data}`,
        expect.any(String),
      );
    });
  
  });
});