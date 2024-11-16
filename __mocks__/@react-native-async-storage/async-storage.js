// // __mocks__/@react-native-async-storage/async-storage.js
// const mockAsyncStorage = {
//   setItem: jest.fn((key, value) => Promise.resolve()),
//   getItem: jest.fn((key) => Promise.resolve(null)), // Return null for all getItem calls by default
//   removeItem: jest.fn((key) => Promise.resolve()),
//   clear: jest.fn(() => Promise.resolve()),
// };

// export default mockAsyncStorage;


// __mocks__/@react-native-async-storage/async-storage.js
const mockAsyncStorage = {
  setItem: jest.fn((key, value) => Promise.resolve()),
  getItem: jest.fn((key) => Promise.resolve('mocked value')),
  removeItem: jest.fn((key) => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
};

export default mockAsyncStorage;
