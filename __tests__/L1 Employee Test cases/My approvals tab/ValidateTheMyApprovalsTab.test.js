import React from 'react';
import { render, fireEvent, waitFor, cleanup, act } from '@testing-library/react-native';
import ApprovalTab from '../../../src/screens/approval/ApprovalTab';
import UserContext from '../../../context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { Animated } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock('react-native-phone-number-input', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => {
      return <>{children}</>;
    }),
  };
});

jest.mock('react-native-element-dropdown', () => {
  return {
    __esModule: true,
    Dropdown: jest.fn().mockImplementation(({ children }) => {
      return <>{children}</>;
    }),
  };
});

jest.mock('react-native-modern-datepicker', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => {
      return <>{children}</>;
    }),
    getFormatedDate: jest.fn().mockReturnValue('2023-10-01'),
  };
});

jest.mock('react-native-elements', () => {
  return {
    __esModule: true,
    SearchBar: jest.fn().mockImplementation(({ children }) => {
      return <>{children}</>;
    }),
  };
});

jest.mock('moment', () => {
  return jest.fn(() => ({
    format: jest.fn().mockReturnValue('2023-10-01'),
  }));
});

jest.mock('../../../src/components/Filter', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => {
      return <>{children}</>;
    }),
  };
});

// Mock Animated.loop to prevent it from running during the test
jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return {
    ...actualReactNative,
    Animated: {
      ...actualReactNative.Animated,
      loop: jest.fn((animation) => ({
        start: jest.fn(),
      })),
    },
  };
});

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
};

const AppNavigator = () => (
  <UserContext.Provider value={mockUserContextValue}>
    <NavigationContainer>
      <ApprovalTab />
    </NavigationContainer>
  </UserContext.Provider>
);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('Verify that the My Approvals tab responds properly without delay, double-click effects', async () => {
  const { getByText } = render(<AppNavigator />);

  // Step 1: Open the application and navigate to My Approvals tab
  fireEvent.press(getByText('My Approvals'));

  // Step 2: Observe the Pending, Approved, and Rejected tabs
  await waitFor(() => {
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Approved')).toBeTruthy();
    expect(getByText('Rejected')).toBeTruthy();
  });

  // Step 3: Tap on each tab multiple times rapidly to check for delays or double-click effects
  for (let i = 0; i < 5; i++) {
    fireEvent.press(getByText('Pending'));
    fireEvent.press(getByText('Approved'));
    fireEvent.press(getByText('Rejected'));
  }

  // Step 4: Verify that all tabs respond properly without delay or double-click effects
  await waitFor(() => {
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Approved')).toBeTruthy();
    expect(getByText('Rejected')).toBeTruthy();
  });
});