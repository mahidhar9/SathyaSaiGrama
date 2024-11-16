// // __mocks__/firebase/auth.js
// export const initializeAuth = jest.fn(() => ({}));
// export const getReactNativePersistence = jest.fn();
// // export const signInWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: '123', email: 'test@test.com' } }));
// export const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: { uid: '456', email: 'new@test.com' } }));
// export const onAuthStateChanged = jest.fn((auth, callback) => callback(null));
// export const getAuth = jest.fn(() => ({
//   currentUser: { uid: '123', email: 'test@example.com' },
// }));
// export const signInWithEmailAndPassword = jest.fn((auth, email, password) => {
//   if (email === 'test@example.com' && password === 'password') {
//     return Promise.resolve({ user: { uid: '123', email } });
//   }
//   return Promise.reject(new Error('Invalid credentials'));
// });
// export const signOut = jest.fn(() => Promise.resolve());



// __mocks__/firebase/auth.js
// export const initializeAuth = jest.fn(() => ({
//     currentUser: { uid: '123', email: 'test@example.com' },
//   }));
//   export const getAuth = jest.fn(() => ({
//     currentUser: { uid: '123', email: 'test@example.com' },
//   }));
//   export const signInWithEmailAndPassword = jest.fn((auth, email, password) => {
//     if (email === 'test@example.com' && password === 'password') {
//       return Promise.resolve({ user: { uid: '123', email } });
//     }
//     return Promise.reject(new Error('Invalid credentials'));
//   });
//   export const signOut = jest.fn(() => Promise.resolve());
  





// __mocks__/firebase/auth.js
export const initializeAuth = jest.fn(() => ({
  currentUser: null,
}));
export const getReactNativePersistence = jest.fn();
