import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Feedback from '../../../src/screens/Feedback';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { Alert } from 'react-native';
import { postDataWithInt } from '../../../src/components/ApiRequest';
import { Dropdown } from 'react-native-element-dropdown';



jest.mock('../../../src/components/ApiRequest', () => ({
  postDataWithInt: jest.fn().mockResolvedValue({
    message :'Data Added Successfully'
  }),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));



const mockNavigation = { navigate: jest.fn() };

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
  employee: { id: 'e789', name: 'Alice Employee' },
  setEmployee: jest.fn(),
  testResident: { id: 't987', name: 'Test Resident' },
  setTestResident: jest.fn(),
  departmentIds: ['d1', 'd2', 'd3'],
  setDepartmentIds: jest.fn(),
  userEmail: 'mockuser@example.com',
  getAccessToken: jest.fn(),
};

const mockAuthContextValue = {
  user: {email: 'mockuser@example.com' }
  setUser: jest.fn(),
};

describe('Feedback Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the To profile when click on Cancle', async () => {
    const { getByText,getAllByTestId, getByPlaceholderText, getByTestId ,queryAllByText} = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Feedback navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );
expect(getByText('Cancel')).toBeTruthy();  
fireEvent.press(getByText('Cancel'));
await waitFor(() => {
  expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
});
});
it('should allow the user to send feedback', async () => {
  const { getByText, getByPlaceholderText, getByTestId ,queryAllByText} = render(
    <AuthContext.Provider value={mockAuthContextValue}>
      <UserContext.Provider value={mockUserContextValue}>
        <Feedback navigation={mockNavigation} />
      </UserContext.Provider>
    </AuthContext.Provider>
  );
      expect(getByText('Pick a subject and provide your feedback')).toBeTruthy();
fireEvent.changeText(getByText('Pick a subject and provide your feedback'), 'Technical issue');

 fireEvent.changeText(getByText('Your feedback'), 'This is a test feedback.');
 
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
     
  });
  });
})