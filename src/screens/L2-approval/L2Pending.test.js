import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react-native';
import L2Pending from './L2Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../context/UserContext'; 

// Mock the AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native-phone-number-input', () => jest.fn());
jest.mock('react-native-element-dropdown', () => jest.fn());
jest.mock('react-native-modern-datepicker', () => jest.fn());

const mockUserContextValues = {
  loggedUser: 'mockUser',
  setLoggedUser: jest.fn(),
  accessToken: 'mockAccessToken',
  L2PendingDataFetched: false,
  setL2PendingDataFetched: jest.fn(),
};

describe('L2Pending', () => {
  test('renders loading indicator when data is fetching', () => {
    const { getByTestId } = render(
      <UserContext.Provider value={mockUserContextValues}>
        <L2Pending />
      </UserContext.Provider>
    );
    expect(getByTestId('loading-indicator')).toBeDefined();
  });

  test('renders error message when there is no logged user', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByText } = render(
      <UserContext.Provider value={mockUserContextValues}>
        <L2Pending />
      </UserContext.Provider>
    );
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    expect(getByText('No L2 Pending visitors')).toBeDefined();
  });

  // Write more unit tests for the remaining functionality of the L2Pending component
});