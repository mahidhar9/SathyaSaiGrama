// module.exports = {
//   preset: 'react-native',
//   setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
//   transform: {
//     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transpile ES modules
//   },
//   setupFilesAfterEnv: ['./jest.setup.js'],
//   moduleNameMapper: {
//     '^firebase/auth$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/firebase/auth.js',
//     '^react-native$': 'react-native',
//     '\\.(css|less)$': 'identity-obj-proxy',
    
//     transformIgnorePatterns: [
//  'node_modules/(?!(firebase|@firebase)/)',
//       'node_modules/(?!(@react-native|react-native|@react-native-firebase|react-native-reanimated)/)',
//       'node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|my-package))',
//     ],
//   },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
// };


module.exports = {
  preset: 'react-native',
  // setupFilesAfterEnv: ['./jest.setup.js'], // Point to your Jest setup file
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-dialog|@react-native|@react-navigation|react-native-vector-icons)/)',
   'node_modules/(?!(react-native|react-native-vector-icons)/)',
    'node_modules/(?!(@react-native|react-native|@react-native-firebase|react-native-reanimated)/)',
  ],
  moduleNameMapper: {
        '^firebase/auth$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/firebase/auth.js',
      '^@react-native-async-storage/async-storage$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/@react-native-async-storage/async-storage.js',
      '^react-native-dialog$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/react-native-dialog.js',
      // '^react-native-vector-icons/(.*)$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/react-native-vector-icons.js',  
      '^react-native-vector-icons/(.*)$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/react-native-vector-icons.js',
    },
};



// module.exports = {
//   preset: 'react-native', // Use ts-jest preset
//   // testEnvironment: 'node', // You can also use 'jsdom' if testing browser-like environments
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
//     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
//   },
//   transformIgnorePatterns: [
//     'node_modules/(?!(firebase|@firebase)/)', // Transform Firebase ESM packages
//     'node_modules/(?!(@react-native|react-native|@react-native-firebase|react-native-reanimated)/)',
//   ],
//   moduleNameMapper: {
//       '^firebase/app$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/firebase/app.js',
//     '^firebase/auth$': 'C:/Users/sasiv/Project/SathyaSaiGrama/__mocks__/firebase/auth.js',
    
      
//     },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   setupFilesAfterEnv: ['./jest.setup.js'], // Optional if you have a setup file
// };




