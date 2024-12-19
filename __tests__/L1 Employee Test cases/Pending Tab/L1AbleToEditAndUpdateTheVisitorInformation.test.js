import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import EditVerifyDetails from '../../../src/screens/approval/EditVerifydetails';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { Alert } from 'react-native';
import { findDeviceToken, updateDeviceToken } from '../../../src/components/ApiRequest';
import { signOut } from 'firebase/auth';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies **before** importing components
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

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));

jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(),
}));

jest.mock('../../../src/components/ApiRequest', () => ({
  findDeviceToken: jest.fn(),
  updateDeviceToken: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('react-native-restart', () => ({
  Restart: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
);

// Set up Alert mock
jest.spyOn(Alert, 'alert');

afterEach(cleanup);

describe('L1 Able to Edit and Update the Visitor Information', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockRoute = {
    params: {
      triggerDialog: true,
      code: '3000',
      user: {
        ID: '123',
        Referrer_Approval: 'PENDING APPROVAL',
        L2_Approval_Status: 'Pending Approval',
        Name_field: { zc_display_value: 'John Doe' },
        Phone_Number: '9182590940',
        Single_or_Group_Visit: 'Single',
        Date_of_Visit: '2023-09-20',
        Guest_Category: 'Corporate',
        Priority: 'High',
        Remarks: 'Important visitor',
        Gender: 'Male',
        Vehicle_Information: [{ id: 'veh1', zc_display_value: 'Car - ABC123' }],
        Referrer_App_User_lookup: { zc_display_value: 'Referrer Name' },
        Department: { Department: 'Engineering' },
      },
    },
  };

  const mockVehicleInformation = [
    { id: 'veh1', zc_display_value: 'Car - ABC123' },
    { id: 'veh2', zc_display_value: 'Bike - XYZ789' },
  ];

  const mockUserContextValue = {
    userType: 'admin',
    setUserType: jest.fn(),
    accessToken: 'mockAccessToken123',
    setUserEmail: jest.fn(),
    setL1ID: jest.fn(),
    loggedUser: {
      userId: 'user123',
      name: 'John Doe',
      vehicles: mockVehicleInformation,
    },
    setLoggedUser: jest.fn(),
    deviceToken: 'mockDeviceToken456',
    // ...other context values
  };

  const mockAuthContextValue = {
    user: { email: 'mockuser@example.com' },
    setUser: jest.fn(),
  };

  test('Verify that L1 can edit and update visitor information', async () => {
    // Mock API responses
    findDeviceToken.mockResolvedValue({
      data: {
        Device_Tokens: 'deviceToken123||',
      },
    });

    updateDeviceToken.mockResolvedValue({
      data: {},
    });

    // Render component
    const { getByPlaceholderText, getByText, getByTestId, getAllByText } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <NavigationContainer>
            <EditVerifyDetails navigation={mockNavigation} route={mockRoute} />
          </NavigationContainer>
        </AuthContext.Provider>
      </UserContext.Provider>
    );

    // Update Guest Category
    const guestCategoryInput = getByText('Enter Guest Category');
    fireEvent.changeText(guestCategoryInput, 'Corporate');

    // Update Gender
    const genderInput = getByText('Enter Gender');
    fireEvent.changeText(genderInput, 'Male');

    // Update Vehicle Number
    // const vehicleNumberInput = getByPlaceholderText('Enter Vehicle Number');
    // fireEvent.changeText(vehicleNumberInput, 'KA 01 AB 1234');

    // Update Date of Visit
    // const dateOfVisitInput = getByPlaceholderText('Enter Date of Visit');
    // fireEvent.changeText(dateOfVisitInput, '2023-10-12');

    // Update Priority
    const priorityInput = getByText('Enter Priority');
    fireEvent.changeText(priorityInput, 'P1');

    // Update Remark
    const remarkInput = getByText('Enter Remark');
    fireEvent.changeText(remarkInput, 'Updated remarks');

    // Submit the form
    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    // Assert that the success message is displayed
    await waitFor(() => {
      expect(getAllByText('Visitor details changed')).toBeTruthy();
    });

    // Additional Assertions
    expect(findDeviceToken).toHaveBeenCalledWith('user123');
    expect(updateDeviceToken).toHaveBeenCalledWith(
      { data: { Device_Tokens: '' } },
      'user123'
    );

    // Verify navigation if applicable
    // expect(mockNavigation.navigate).toHaveBeenCalledWith('ConfirmationScreen');
  });

  it('should handle logout failure gracefully', async () => {
    // Arrange
    signOut.mockRejectedValue(new Error('Logout failed'));

    // Render component
    const { getByTestId } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <NavigationContainer>
            <EditVerifyDetails navigation={mockNavigation} route={mockRoute} />
          </NavigationContainer>
        </AuthContext.Provider>
      </UserContext.Provider>
    );

    // Act
    const logoutButton = getByTestId('logoutButton');
    fireEvent.press(logoutButton);

    // Assert
    await waitFor(() => {
      // Verify signOut was called
      expect(signOut).toHaveBeenCalled();

      // Verify that Alert was shown with the correct message
      expect(Alert.alert).toHaveBeenCalledWith('Not able to logout!');

      // Ensure RNRestart.Restart was not called
      expect(RNRestart.Restart).not.toHaveBeenCalled();
    });
  });

  it('should render list items with unique keys', () => {
    // Arrange
    const { getByTestId } = render(
      <UserContext.Provider value={mockUserContextValue}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <NavigationContainer>
            <EditVerifyDetails navigation={mockNavigation} route={mockRoute} />
          </NavigationContainer>
        </AuthContext.Provider>
      </UserContext.Provider>
    );

    // Act & Assert
    mockVehicleInformation.forEach((vehicle) => {
      expect(getByTestId(`vehicle-item-${vehicle.id}`)).toBeTruthy();
    });
  });
});