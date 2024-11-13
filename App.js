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

    return () => unsubscribe();
  }, []);

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
      if (!isNetworkAvailable) return; // Stop if no network

      let res = await fetch(
        `https://cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': APPWRITE_FUNCTION_PROJECT_ID,
            'X-Appwrite-Key': APPWRITE_API_KEY,
          },
        }
      );
      res = await res.json();
      console.log(res.documents[0].Token)
      await setAccessToken(res.documents[0].Token);
      setIsTokenFetched(true);
    } catch (error) {
      console.log('Error fetching AppWrite token:', error);
    }
  };



  //UseEffect to call Appwrite and device token functions
  useEffect(() => {
    const fetchToken = async () => {
      await getAppWriteToken();
      if (!isNetworkAvailable) return;
      const dToken = await getDeviceToken();
      setDeviceToken(dToken);
    };
    
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
        console.log('Existed user in App.js:', existedUser);
      }
    };

    checkUserExist();

  }, []);


  //==================================
  // check whether user is changed from L2 to L1 or not


  const checkRoleChanged = async () => {
    let changerUserType = userType;
    const res = await getDataWithInt('All_Offices', 'Approver_app_user_lookup', loggedUser.userId, accessToken);
    if (res && res.data) {
      if (loggedUser.role === "L1") changerUserType = "L2";
      const deptIds = res.data.map(dept => dept.ID);
      setDepartmentIds(deptIds);
    } else {
      if (loggedUser.role === "L2") changerUserType = "L1"; 
    }
    return changerUserType;
  };

  const checkIsResident = async () => {
    const res = await getDataWithInt('All_Residents', 'App_User_lookup', loggedUser.userId, accessToken);
    if(res && res.data && res.data[0].Accommodation_Approval === 'APPROVED'){
      return true;
    }else{
      return false;
    }
  };

  const checkIsEmployee = async () => {
    const res = await getDataWithInt('All_Employees', 'App_User_lookup', loggedUser.userId, accessToken);
    if(res && res.data && res.data[0].Department_Approval === 'APPROVED'){
      return true;
    }else{
      return false;
    }
  };

  const checkIsTestResident = async () => {
    const res = await getDataWithTwoInt('All_Residents', 'App_User_lookup', loggedUser.userId, 'Flats_lookup', '3318254000031368021', accessToken);
    if(res && res.data && res.data[0].Accommodation_Approval === 'APPROVED'){
      return true;
    }else{
      return false;
    }
  };

  const setModifyData = async (role, resident, employee, testResident) => {
    const data = {
      userId: loggedUser.userId,
      role: role,
      email: loggedUser.email,
      deptIds: loggedUser.deptIds,
      name: loggedUser.name,
      profilePhoto: loggedUser.profilePhoto,
      resident: resident,
      employee: employee,
      testResident: testResident,
    };

    setLoggedUser(data);
    console.log("Data to be set in AsyncStorage: ", data); // Log the data before setting
    await AsyncStorage.setItem('existedUser', JSON.stringify(data));

    const existedUser = await AsyncStorage.getItem('existedUser');
    console.log("existed user inside of setModifyData: ", JSON.parse(existedUser));
  };

  const runChecks = async () => {
    const [role, resident, employee, testResident] = await Promise.all([
      checkRoleChanged(),
      checkIsResident(),
      checkIsEmployee(),
      checkIsTestResident(),
    ]);

    await setModifyData(role, resident, employee, testResident);

  };

  useEffect(() => {
    if (isTokenFetched && loggedUser && isNetworkAvailable) {
      runChecks();
    }
  }, [isTokenFetched]);



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