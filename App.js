import BaseRoute from './navigation/stack-navigation/BaseRoute';
import UserContext from './context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

import { StyleSheet } from 'react-native';

import {
  DATABASE_ID,
  COLLECTION_ID,
  APPWRITE_FUNCTION_PROJECT_ID,
  APPWRITE_API_KEY,
} from '@env';

import { ActivityIndicator, Alert } from 'react-native';
import { AuthContext, AuthProvider } from './src/auth/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/SplashScreen';
import { getDeviceToken } from './src/utils/notificationService';
import NoNetworkScreen from './src/screens/NoNetworkScreen';
import CodePush from 'react-native-code-push';
import { getDataWithInt, getDataWithTwoInt } from './src/components/ApiRequest';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
    // Add other light mode styles here
  },
};

const App = () => {
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsNetworkAvailable(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [isNetworkAvailable]);

  const {
    setAccessToken,
    userType,
    setUserType,
    accessToken,
    setLoggedUser,
    loggedUser,
    setL1ID,
    setUserEmail,
    setDeviceToken,
    setProfileImage,
    setDepartmentIds,
    setResident,
    setEmployee,
    setTestResident,
  } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const [isTokenFetched, setIsTokenFetched] = useState(false);

  //==============================
  //To get zoho access token from Appwrite
  const getAppWriteToken = async () => {
    try {
      console.log('database id : ', DATABASE_ID);
      let res = await fetch(
        `https://cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': APPWRITE_FUNCTION_PROJECT_ID,
            'X-Appwrite-Key': APPWRITE_API_KEY,
          },
        },
      );
      console.log('After api call');
      res = await res.json();
      console.log("Access token in App: ", res.documents[0].Token)
      await setAccessToken(res.documents[0].Token);
      setIsTokenFetched(!isTokenFetched);
    } catch (error) {
      console.log('Error in App.js in getAppWriteToken function: ', error);
      Alert.alert(error);
    }
  };


  //UseEffect to call Appwrite and device token functions
  useEffect(() => {

    const fetchToken = async () => {
      await getAppWriteToken();
      const dToken = await getDeviceToken();
      setDeviceToken(dToken);
      //console.log('device token is app.js: ', dToken);
    };
    console.log("network available ",  isNetworkAvailable)
    if (isNetworkAvailable) {
      fetchToken();
    }
  }, [isNetworkAvailable]);

  //====================================
  //To check user exists in local storage, if exists set in Context
  useEffect(() => {
    const checkUserExist = async () => {
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      if (existedUser) {
        setLoggedUser(existedUser);
        setUserType(existedUser.role);
        setL1ID(existedUser.userId);
        setUserEmail(existedUser.email);
        setProfileImage(existedUser.profilePhoto);
        console.log('Existed user name in App.js:', existedUser.name);
      }
    };

    checkUserExist();

  }, []);


  //==================================
  // check whether user is changed from L2 to L1 or not
  useEffect(() => {

    const checkRoleChanged = async () => {
      let changerUserType = userType;
      const res = await getDataWithInt('All_Offices', 'Approver_app_user_lookup', loggedUser.userId, accessToken);
      console.log("response is : ", res)
      if (res && res.data) {
        if (loggedUser.role === "L1") {
          changerUserType = "L2"
          console.log("User changed")
        }
        const deptIds = res.data.map(dept => dept.ID);
        setDepartmentIds(deptIds);
      } else {
        if (loggedUser.role === "L2") {
          changerUserType = "L1";
          console.log("User changed")
        }
      }
      setLoggedUser(prevState => ({
        ...prevState,
        role: changerUserType
      }));

    }
    /////_________Check whether user is resident or not
    const checkIsResident = async () => {
      let resident;
      const res = await getDataWithInt('All_Residents', 'App_User_lookup', loggedUser.userId, accessToken);
      if (res && res.data && res.data[0].Accommodation_Approval === 'APPROVED') {
        console.log('resident is true');
        // resident.current = true;
        resident = true;
        setResident(true);
      } else {
        console.log('resident is false');
        resident = false;
        setResident(false);
      }

      setLoggedUser(prevState => ({
        ...prevState,
        resident: resident
      }));
    };

    ///___________Check whether user is employee or not
    const checkIsEmployee = async () => {
      let employee;
      const res = await getDataWithInt('All_Employees', 'App_User_lookup', loggedUser.userId, accessToken);
      if (res && res.data && res.data[0].Department_Approval === 'APPROVED') {
        console.log('employee is true');
        employee = true;
        setEmployee(true);
      } else {
        console.log('employee is false');
        employee = false;
        setEmployee(false);
      }

      setLoggedUser(prevState => ({
        ...prevState,
        employee: employee
      }));
    };

    ///_________Check whether user is test resident
    const checkIsTestResident = async () => {
      let testResident;
      const res = await getDataWithTwoInt('All_Residents', 'App_User_lookup', loggedUser.userId, 'Flats_lookup', '3318254000031368021', accessToken);
      if (res && res.data && res.data[0].Accommodation_Approval === 'APPROVED') {
        console.log('Test resident is true');
        testResident = true;
        setTestResident(true);
      } else {
        console.log('Test Resident is false');
        testResident = false;
        setTestResident(false);
      }

      setLoggedUser(prevState => ({
        ...prevState,
        testResident: testResident
      }));
    };

    const setModifyData = async () => {
      await AsyncStorage.setItem(
        'existedUser',
        JSON.stringify({
          userId: loggedUser.userId,
          role: loggedUser.role,
          email: loggedUser.email,
          deptIds: loggedUser.deptIds,
          name: loggedUser.name,
          profilePhoto: loggedUser.profilePhoto,
          resident: loggedUser.resident,
          employee: loggedUser.employee,
          testResident: loggedUser.testResident,
        }),
      );
    }

    if (isTokenFetched && loggedUser && !isNetworkAvailable) {
      checkRoleChanged();
      checkIsResident();
      checkIsEmployee();
      checkIsTestResident();
      setModifyData();
    }

  }, [isTokenFetched])

  useEffect(() => {
    if (accessToken) {
      console.log("Access token found, stopping loading");
      setLoading(false);
    } else {
      console.log("Access token missing, still loading");
    }
  }, [accessToken]);
  

  return (
    <PaperProvider theme={lightTheme}>
      {!isNetworkAvailable ? (
        <NoNetworkScreen />
      ) : loading ? (
        // <ActivityIndicator size="large" color="#752A26" style={styles.loadingContainer}/>
        <SplashScreen />
      ) : (
        <BaseRoute />
      )}
    </PaperProvider>
  );
};

export default CodePush(App);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
