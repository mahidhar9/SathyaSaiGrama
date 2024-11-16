// /**
//  * @format
//  */

import 'react-native';
import React from 'react';

// // Note: import explicitly to use the types shipped with jest.
// import {it} from '@jest/globals';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });



// import { render } from '@testing-library/react-native';
// import App from '../App'; 
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// // describe('Firebase Auth Tests', () => {
// //   it('should call initializeAuth with correct parameters', () => {
// //     const mockAuth = {};
// //     initializeAuth(mockAuth); // Call the mocked function
// //     expect(initializeAuth).toHaveBeenCalledWith(mockAuth);
// //   });

// //   it('should call getReactNativePersistence', () => {
// //     getReactNativePersistence(); // Call the mocked function
// //     expect(getReactNativePersistence).toHaveBeenCalled();
// //   });
// // });














// import AsyncStorage from '@react-native-async-storage/async-storage';

// describe('AsyncStorage Mocking', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Reset mocks before each test
//   });

//   it('should set and get item', async () => {
//     await AsyncStorage.setItem('key', 'value');
//     expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value');

//     const result = await AsyncStorage.getItem('key');
//     expect(result).toBe(null); // Because we mocked `getItem` to always return null
//   });

//   it('should remove an item', async () => {
//     await AsyncStorage.removeItem('key');
//     expect(AsyncStorage.removeItem).toHaveBeenCalledWith('key');
//   });
// });












// describe('MyComponent', () => {
//   test('renders NoNetworkScreen when network is not available', () => {
//     const { getByText } = render(<App isNetworkAvailable={false} loading={false} />);
    
//     expect(getByText('No Network')).toBeTruthy(); // Checks for NoNetworkScreen
//   });

//   test('renders SplashScreen when network is available but loading', () => {
//     const { getByText } = render(<App isNetworkAvailable={true} loading={true} />);
    
//     expect(getByText('Splash Screen')).toBeTruthy(); // Checks for SplashScreen
//   });

//   test('renders BaseRoute when network is available and not loading', () => {
//     const { getByText } = render(<App isNetworkAvailable={true} loading={false} />);
    
//     expect(getByText('Base Route')).toBeTruthy(); 
//   });
// });



describe('Jest Environment', () => {
  it('should define expect globally', () => {
    expect(true).toBe(true); // Basic test to check Jest setup
  });
});





// src/firebase/config.test.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { App } from '../App'; // Import your Firebase config file

jest.mock('firebase/app'); // Mock Firebase app
jest.mock('firebase/auth'); // Mock Firebase auth
jest.mock('@react-native-async-storage/async-storage'); // Mock AsyncStorage

describe('Firebase Auth Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize Firebase Auth with getReactNativePersistence', () => {
    // Assert initializeAuth is called with the correct arguments
    expect(initializeAuth).toHaveBeenCalledWith(expect.any(Object), {
      persistence: getReactNativePersistence(AsyncStorage),
    });

    // Ensure getReactNativePersistence was called
    expect(getReactNativePersistence).toHaveBeenCalledWith(AsyncStorage);

    // Ensure auth object is correctly exported
    expect(App).toBeDefined();
  });
});
