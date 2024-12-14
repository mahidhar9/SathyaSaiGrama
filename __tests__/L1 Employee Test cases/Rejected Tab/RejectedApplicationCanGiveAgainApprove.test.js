import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ViewDetails from '../../../src/screens/L2-approval/ViewDetails';
import UserContext from '../../../context/UserContext';

const mockNavigation = {
  navigate: jest.fn(),
};
const mockRoute = {
  params: {
    stringified: true,
    user: JSON.stringify({
      ID: '123',
      setapprovingLoading: false,
      Name_field: JSON.stringify({ zc_display_value: 'John Doe' }),
      Referrer_App_User_lookup: JSON.stringify({ zc_display_value: 'Jane Doe', Name_field: 'Jane Doe', Email: 'jane@example.com' }),
      Department: JSON.stringify({ Department: 'IT' }),
      Phone_Number: '1234567890',
      Single_or_Group_Visit: 'Single',
      Date_of_Visit: '2023-10-01',
      Guest_Category: 'VIP',
      Priority: 'High',
      Remarks: 'No remarks',
      Gender: 'Male',
      Number_of_Men: 1,
      Number_of_Women: 0,
      Number_of_Boys: 0,
      Number_of_Girls: 0,
      Vehicle_Information: JSON.stringify([{ zc_display_value: 'Car' }]),
      Home_or_Office: 'Home',
      L2_Approval_Status: 'DENIED',
    }),
  },
};
global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: true, code: 3000 }), 
    })
  );
  
const mockUserContext = {
    user:jest.fn(),
  accessToken: jest.fn(),
  setL2DeniedDataFetched: jest.fn(),
  setL2ApproveDataFetched: jest.fn(),
  setL2PendingDataFetched: jest.fn(),
};



jest.mock('react-native-dialog', () => ({
  __esModule: true,
  default: {
    Container: ({ visible, children }) => (visible ? children : null),
    Title: ({ children }) => <>{children}</>,
    Description: ({ children }) => <>{children}</>,
    Button: ({ label, onPress }) => <button onClick={onPress}>{label}</button>,
  },
}));

describe('ViewDetails', () => {
  it('should set status to APPROVED when approve button is clicked', async () => {
    const { getByText ,getByTestId } = render(
      <UserContext.Provider value={mockUserContext}>
        <ViewDetails navigation={mockNavigation} route={mockRoute} />
      </UserContext.Provider>
    );

  expect(getByTestId('AfterDenyApprove')).toBeTruthy();
    fireEvent.press(getByTestId('AfterDenyApprove'));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('L2Approved');
    });
  });
});
