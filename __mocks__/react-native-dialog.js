const Dialog = {
    Container: jest.fn(({ children }) => children),
    Title: jest.fn(({ children }) => children),
    Description: jest.fn(({ children }) => children),
    Input: jest.fn(() => null),
    Button: jest.fn(() => null),
  };
  
  export default Dialog;
  