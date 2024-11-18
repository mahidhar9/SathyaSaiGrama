import React ,{ createContext, useContext } from "react";
import { render,fireEvent } from "@testing-library/react-native";
import Login from "../../src/screens/Login";
import {UserContext,UserContextProvider,} from '../../context/UserContext'


const mockNavigation = { navigate: jest.fn() };
const mockSetDialogVisible = jest.fn();
const mockUserContextValue={
  userType: 'admin',
  setUserType: jest.fn(),
  accessToken: 'mockAccessToken123',
  setUserEmail: jest.fn(),
  setL1ID: jest.fn(),
  loggedUser: {name: 'John Doe' },
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
  setDialogVisible: mockSetDialogVisible,
}
console.log(UserContext);

describe("../../src/screens/Login", () => {
  const { getByText } = render(
    <UserContext.Provider value={mockUserContextValue}>
      <Login navigation={mockNavigation} />
    </UserContext.Provider>
     );

    const link=getByText(" Register now");
    fireEvent.press(link);
  	expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
    expect(mockSetDialogVisible).toHaveBeenCalledWith(false);
})