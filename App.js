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
      // console.log("Existed user in App.js : ", existedUser)
      if (existedUser) {
        setLoggedUser(existedUser);
        setUserType(existedUser.role);
        setL1ID(existedUser.userId);
        setUserEmail(existedUser.email);
        setProfileImage(existedUser.profilePhoto);
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
    
  };

  const runChecks = async () => {
    const [role, resident, employee, testResident] = await Promise.all([
      checkRoleChanged(),
      checkIsResident(),
      checkIsEmployee(),
      checkIsTestResident(),
    ]);

    await setModifyData(role, resident, employee, testResident);

   // console.log("loggedUser after setting: ", loggedUser)

  };

  useEffect(() => {
    if (isTokenFetched && loggedUser && isNetworkAvailable) {
      runChecks();
    }
  }, [isTokenFetched]);



  useEffect(() => {
    if (accessToken) {
      console.log("Access token found, stopping loading", accessToken);

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

// import React, { useState } from "react"; 
// import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// const InvitationForm = () => {
//   const [prefix, setPrefix] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [dateOfVisit, setDateOfVisit] = useState(new Date());
//   const [visitType, setVisitType] = useState("Single");
//   const [gender, setGender] = useState("Male");
//   const [photo, setPhoto] = useState(null);
//   const [guestCategory, setGuestCategory] = useState("");
//   const [priority, setPriority] = useState("");
//   const [remark, setRemark] = useState("");
//   const [vehicleType, setVehicleType] = useState("");
//   const [vehicleNumber, setVehicleNumber] = useState("");

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.card}>
//         <Text style={styles.label}>Name</Text>
//         <Picker
//           selectedValue={prefix}
//           onValueChange={(itemValue) => setPrefix(itemValue)}
//           style={styles.input}
//         >
//           <Picker.Item label="Mr." value="Mr." />
//           <Picker.Item label="Ms." value="Ms." />
//           <Picker.Item label="Dr." value="Dr." />
//         </Picker>
//         <Text style={styles.label}>FULL Name</Text>
//         <TextInput
//             style={styles.input}
//             value={fullName}
//             onChangeText={setFullName}
//             placeholder="Enter Full Name"
//         />
//         <Text style={styles.label}>Phone</Text>
//         <TextInput
//           style={styles.input}
//           value={phone}
//           onChangeText={setPhone}
//           placeholder="Enter phone number"
//           keyboardType="phone-pad"
//         />
//         <Text style={styles.label}>Date of Visit</Text>
//         <TouchableOpacity onPress={() => {}}>
//           <Text style={styles.input}>{dateOfVisit.toDateString()}</Text>
//         </TouchableOpacity>
//         <Text style={styles.label}>Single or Group Visit</Text>
//         <View style={styles.buttonGroup}>
//           <TouchableOpacity
//             style={[styles.button, visitType === "Single" && styles.activeButton]}
//             onPress={() => setVisitType("Single")}
//           >
//             <Text style={styles.buttonText}>Single</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, visitType === "Group" && styles.activeButton]}
//             onPress={() => setVisitType("Group")}
//           >
//             <Text style={styles.buttonText}>Group</Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.label}>Select Gender</Text>
//         <View style={styles.buttonGroup}>
//           <TouchableOpacity
//             style={[styles.button, gender === "Male" && styles.activeButton]}
//             onPress={() => setGender("Male")}
//           >
//             <Text style={styles.buttonText}>Male</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, gender === "Female" && styles.activeButton]}
//             onPress={() => setGender("Female")}
//           >
//             <Text style={styles.buttonText}>Female</Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.label}>Photo</Text>
//         <TouchableOpacity style={styles.uploadButton}>
//           <Text style={styles.uploadButtonText}>Select Image</Text>
//         </TouchableOpacity>
//         <Text style={styles.label}>Guest Category</Text>
//         <Picker
//           selectedValue={guestCategory}
//           onValueChange={(itemValue) => setGuestCategory(itemValue)}
//           style={styles.input}
//         >
//           <Picker.Item label='Govt Officials' value='Govt Officials'/>
//           <Picker.Item label= 'Politician' value= 'Politician'/>
//           <Picker.Item label= 'Corporate' value='Corporate'/>
//           <Picker.Item label= 'Press' value='Press'/>
//           <Picker.Item label= 'Parent' value='Parent'/>
//           <Picker.Item label= 'Devotee' value='Devotee'/>
//         </Picker>
//         <Text style={styles.label}>Priority</Text>
//         <Picker
//           selectedValue={priority}
//           onValueChange={(itemValue) => setPriority(itemValue)}
//           style={styles.input}
//         >
//           <Picker.Item label="High" value="High" />
//           <Picker.Item label="Medium" value="Medium" />
//           <Picker.Item label="Low" value="Low" />
//         </Picker>
//         <Text style={styles.label}>Remark</Text>
//         <TextInput
//           style={styles.input}
//           value={remark}
//           onChangeText={setRemark}
//           placeholder="Enter remark"
//         />
//         <Text style={styles.label}>Vehicle Information</Text>
//         <View style={styles.rowGroup}>
//           <TextInput
//             style={styles.input}
//             value={vehicleType}
//             onChangeText={setVehicleType}
//             placeholder="Vehicle type"
//           />
//           <TextInput
//             style={styles.input}
//             value={vehicleNumber}
//             onChangeText={setVehicleNumber}
//             placeholder="Vehicle Number"
//           />
//         </View>
//         <TouchableOpacity style={styles.submitButton}>
//           <Text style={styles.submitButtonText}>Submit</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f8f8",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 3,
//     marginTop: "5%",
//     width: "90%",
//     elevation: 3,
//     marginHorizontal: "5%",
//   },
//   label: {
//     fontFamily: "System",
//     fontSize: 16,
//     fontWeight: "400",
//     lineHeight: 22.4,
//     textAlign: "left",
//     marginBottom: 5,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//     fontFamily: "Roboto",
//     fontSize: 14,
//     color: "#333",
//   },
//   rowGroup: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   buttonGroup: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   button: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 5,
//     marginHorizontal: 5,
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   activeButton: {
//     backgroundColor: "#E8B931",
//     borderColor: "#E8B931",
//   },
//   buttonText: {
//     color: "#000",
//     fontSize: 14,
//   },
//   uploadButton: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 12,
//     alignItems: "center",
//     marginBottom: 10,
//     backgroundColor: "#fff",
//   },
//   uploadButtonText: {
//     color: "#000",
//     fontSize: 14,
//   },
//   submitButton: {
//     backgroundColor: "#C00F0C",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   radioButtonGroup: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 15,
//   },
//   radioButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 20,
//   },
//   radioCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#E8B931",
//     marginRight: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   selectedCircle: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#E8B931",
//   },
//   radioText: {
//     fontSize: 16,
//     color: "#333",
//   },
// });

// export default InvitationForm;
