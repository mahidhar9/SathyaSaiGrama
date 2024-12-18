import React from 'react';
import { act } from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Feedback from '../../../src/screens/Feedback';
import UserContext from '../../../context/UserContext';
import { AuthContext } from '../../../src/auth/AuthProvider';
import { Alert } from 'react-native';
import { postDataWithInt } from '../../../src/components/ApiRequest';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';
import { Text as MockText } from 'react-native';

// Mock the View.prototype.measureInWindow
jest.spyOn(View.prototype, 'measureInWindow').mockImplementation(callback => {
  callback(100, 200, 300, 400);
});

// Mock the Dropdown component from 'react-native-element-dropdown'
jest.mock('react-native-element-dropdown', () => {
  const React = require('react');
  const { TouchableOpacity, View, Text } = require('react-native');

  return {
    Dropdown: ({ onChange, value, data, testID, ...props }) => {
      const handlePress = () => {
        // Simulate selecting 'Technical issue'
        const selectedItem = data.find(item => item.value === 'Technical issue');
        if (selectedItem) {
          onChange(selectedItem);
        }
      };

      return (
        <TouchableOpacity testID={testID} onPress={handlePress}>
          <View>
            <Text>{value || 'Select Subject'}</Text>
          </View>
        </TouchableOpacity>
      );
    },
  };
});

// Mock the ApiRequest module
jest.mock('../../../src/components/ApiRequest', () => ({
  postDataWithInt: jest.fn(() =>
    Promise.resolve({ message: 'Data Added Successfully' })
  ),
}));

// Mock the Toast component
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Mock Alert.alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('ValidateFunctionalityOfTheSendFeedbackOption Test', () => {
  const mockNavigation = { navigate: jest.fn() };

  const mockUserContextValue = {
    getAccessToken: jest.fn(() => 'mockAccessToken'),
    userEmail: 'test@example.com',
    L1ID: 1,
    deviceToken: 'testDeviceToken',
    loggedUser: { name: 'Test User', userId: 1 },
    accessToken: 'mockAccessToken',
    profileImage: null,
    setProfileImage: jest.fn(),
    userType: 'admin',
    setUserType: jest.fn(),
    setUserEmail: jest.fn(),
    setL1ID: jest.fn(),
    setLoggedUser: jest.fn(),
    setAccessToken: jest.fn(),
    setDeviceToken: jest.fn(),
    setResident: jest.fn(),
    resident: { id: 'r123', name: 'Jane Resident' },
    setEmployee: jest.fn(),
    employee: { id: 'e789', name: 'Alice Employee' },
    setTestResident: jest.fn(),
    testResident: { id: 't987', name: 'Test Resident' },
    setDepartmentIds: jest.fn(),
    Office_lookup: { Department: 'd1', Employee: 'e123' },
    departmentIds: ['d1', 'd2', 'd3'],
  };

  const mockAuthContextValue = {
    user: { email: 'mockuser@example.com' },
    setUser: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to Profile when Submit is pressed with valid inputs', async () => {
    // Arrange
    const { getByTestId, getByText } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Feedback navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.press(getByTestId('subjectDropdown'));

    fireEvent.changeText(getByTestId('feedbackText'), 'This is a test feedback.');

    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(postDataWithInt).toHaveBeenCalledWith(
        'Feedback',
        {
          data: {
            Pick_a_subject_and_provide_your_feedback: 'Technical issue',
            Your_feedback: 'This is a test feedback.',
            User_Email: 'test@example.com',
          },
        },
        'mockAccessToken'
      );

      expect(Alert.alert).toHaveBeenCalledWith('Feedback Submitted');

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });
  });
});

describe('ValidateFunctionalityOfTheSendFeedbackOption Test', () => {
  const mockNavigation = { navigate: jest.fn() };

  const mockUserContextValue = {
    getAccessToken: jest.fn(() => 'mockAccessToken'),
    userEmail: 'test@example.com',
    L1ID: 1,
    deviceToken: 'testDeviceToken',
    loggedUser: { name: 'Test User', userId: 1 },
    accessToken: 'mockAccessToken',
    profileImage: null,
    setProfileImage: jest.fn(),
    userType: 'admin',
    setUserType: jest.fn(),
    setUserEmail: jest.fn(),
    setL1ID: jest.fn(),
    setLoggedUser: jest.fn(),
    setAccessToken: jest.fn(),
    setDeviceToken: jest.fn(),
    setResident: jest.fn(),
    resident: { id: 'r123', name: 'Jane Resident' },
    setEmployee: jest.fn(),
    employee: { id: 'e789', name: 'Alice Employee' },
    setTestResident: jest.fn(),
    testResident: { id: 't987', name: 'Test Resident' },
    setDepartmentIds: jest.fn(),
    Office_lookup: { Department: 'd1', Employee: 'e123' },
    departmentIds: ['d1', 'd2', 'd3'],
  };

  const mockAuthContextValue = {
    user: { email: 'mockuser@example.com' },
    setUser: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to Profile when Submit is pressed with valid inputs', async () => {
    // Arrange
    const { getByTestId, getByText } = render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <UserContext.Provider value={mockUserContextValue}>
          <Feedback navigation={mockNavigation} />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

  
    fireEvent.press(getByText('Cancel'));

    // Assert
    await waitFor(() => {
     
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });
  });
});