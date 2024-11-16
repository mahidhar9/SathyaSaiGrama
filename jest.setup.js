import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Ensure Jest globals are loaded
import '@jest/globals';
// console.log('Resolved Path:', require.resolve('<rootDir>/__mocks__/firebase/auth.js'));

// console.log(global.expect); // Should not be undefined


// Clear mock data between tests
beforeEach(() => {
  jest.clearAllMocks();
});


jest.mock('react-native-vector-icons/Zocial', () => 'Icon');
jest.mock('react-native-vector-icons', () => {
  return {
    createIconSetFromFontello: jest.fn(),
    createIconSetFromIcoMoon: jest.fn(),
  };
});
export default {}; 
  