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
  

  export default mockUserContextValue;