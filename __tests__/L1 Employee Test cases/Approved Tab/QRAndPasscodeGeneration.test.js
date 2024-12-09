import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ViewDetails from '../../../src/screens/L2-approval/ViewDetails';
import UserContext from '../../../context/UserContext';

jest.mock('react-native-dialog', () => {
    return {
        Dialog: jest.fn((props)=>{
            return <></>
        }),
    };
});
jest.mock('base64-arraybuffer', () => ({
  encode: jest.fn(() => 'mockBase64'),
}));


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: {}, code: 3000 }),
    ok: true,
  })
);

describe('ViewDetails Component', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockRoute = {
    params: {
      stringified: false,
      user: {
        ID: '123',
        L2_Approval_Status: 'PENDING APPROVAL',
        Name_field: { zc_display_value: 'John Doe' },
        Referrer_App_User_lookup: { zc_display_value: 'Referrer' },
        Department: { Department: 'IT' },
        Phone_Number: '1234567890',
        Single_or_Group_Visit: 'Single',
        Date_of_Visit: '2023-10-10',
        Guest_Category: 'VIP',
        Priority: 'High',
        Remarks: 'No remarks',
        Gender: 'Male',
        Vehicle_Information: [],
        Home_or_Office: 'Home',
      },
    },
  };

  const mockContextValue = {
    accessToken: 'mockToken',
    setL2DeniedDataFetched: jest.fn(),
    setL2ApproveDataFetched: jest.fn(),
    setL2PendingDataFetched: jest.fn(),
  };

  it('test_onApprove_generates_qr_and_passcode', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockContextValue}>
        <ViewDetails navigation={mockNavigation} route={mockRoute} />
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Approve'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('L2Approved');
      expect(mockContextValue.setL2PendingDataFetched).toHaveBeenCalledWith(false);
      expect(mockContextValue.setL2ApproveDataFetched).toHaveBeenCalledWith(false);
    });
  });

  it('test_onApprove_prevents_redundant_updates', async () => {
    mockRoute.params.user.L2_Approval_Status = 'APPROVED';

    const { getByText } = render(
      <UserContext.Provider value={mockContextValue}>
        <ViewDetails navigation={mockNavigation} route={mockRoute} />
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Reject'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('L2Denied');
      expect(mockContextValue.setL2ApproveDataFetched).toHaveBeenCalledWith(false);
    });
  });

  it('test_generateQR_handles_errors', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network Error'))
    );

    const { getByText } = render(
      <UserContext.Provider value={mockContextValue}>
        <ViewDetails navigation={mockNavigation} route={mockRoute} />
      </UserContext.Provider>
    );

    fireEvent.press(getByText('Approve'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error capturing and uploading QR code:',
        expect.any(Error)
      );
    });
  });
});