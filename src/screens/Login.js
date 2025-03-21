import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '../auth/firebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {
  getDataWithInt,
  getDataWithString,
  getDataWithTwoInt,
} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME } from '@env';
import Dialog from 'react-native-dialog';
import { encode } from 'base64-arraybuffer';
import DotsBlinkingLoaderEllipsis from '../components/DotsBlinkingLoaderEllipsis';
const Login = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(false);
  const [dotsBlinkingLoaderEllipsis, setDotsBlinkingLoaderEllipsis] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    userType,
    setUserType,
    accessToken,
    setUserEmail,
    setL1ID,
    loggedUser,
    setLoggedUser,
    deviceToken,
    resident,
    setResident,
    setProfileImage,
    employee,
    setEmployee,
    testResident,
    setTestResident,
    departmentIds,
    setDepartmentIds
  } = useContext(UserContext);
  let residentLocalVar = resident;
  let employeeLocalVar = employee;
  let testResidentLocalVar = testResident;
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [DialogVisible, setDialogVisible] = useState(false);
  const [password, setPassword] = useState();
  const [validation, setValidation] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    isValidLength: false,
  });
  const [isLoggedIntoAnotherDevice, setIsLoggedIntoAnotherDevice] = useState(false)

  const onPressOk = () => {
    setDialogVisible(false);
  };
  const onPressRegister = () => {
    navigation.navigate('Register');
    setDialogVisible(false);
  };

  const fetchDataFromOffice = async id => {
    console.log(
      'access token and id in fetchDataFromOffice in login: ',
      accessToken,
      id,
    );
    const res = await getDataWithInt(
      'All_Offices',
      'Approver_app_user_lookup',
      id,
      accessToken,
    );
    if (res && res.data) {
      console.log('department data found in Login:', res.data);
      const deptIds = res.data.map(dept => dept.ID);
      setDepartmentIds(deptIds);
      setUserType('L2');
    } else {
      setUserType('L1');
    }
    console.log('response in fetchDataFromOffice in login: '.res);
  };

  const isTestResident = async id => {
    const res = await getDataWithTwoInt(
      'All_Residents',
      'App_User_lookup',
      id,
      'Flats_lookup',
      '3318254000031368021',
      accessToken,
    );
    if (res && res.data && res.data[0].Accommodation_Approval === 'APPROVED') {
      console.log('Test resident is true');
      // testResident.current = true;
      testResidentLocalVar = true;
      setTestResident(true);
    } else {
      console.log('Test Resident is false');
      // testResident.current = false;
      testResidentLocalVar = false;
      setTestResident(false);
    }
  };

  const isResident = async id => {
    const res = await getDataWithInt(
      'All_Residents',
      'App_User_lookup',
      id,
      accessToken,
    );
    if (res && res.data && res.data[0].Accommodation_Approval === 'APPROVED') {
      console.log('resident is true');
      // resident.current = true;
      residentLocalVar = true;
      setResident(true);
    } else {
      console.log('resident is false');
      // resident.current = false;
      residentLocalVar = false;
      setResident(false);
    }
  };

  const isEmployee = async id => {
    const res = await getDataWithInt(
      'All_Employees',
      'App_User_lookup',
      id,
      accessToken,
    );
    if (res && res.data && res.data[0].Department_Approval === 'APPROVED') {
      console.log('employee is true');
      // employee.current = true;
      employeeLocalVar = true;
      setEmployee(true);
    } else {
      console.log('employee is false');
      // employee.current = false;
      employeeLocalVar = false;
      setEmployee(false);
    }
  };

  useEffect(() => {
    const storeData = async () => {
      if (currentUser) {
        console.log('Inside the useEffect of login');
        await AsyncStorage.setItem(
          'existedUser',
          JSON.stringify({
            userId: currentUser.id,
            role: userType,
            email: currentUser.email,
            deptIds: departmentIds,
            name: currentUser.name,
            profilePhoto: currentUser.profilePhoto,
            resident: residentLocalVar,
            employee: employeeLocalVar,
            testResident: testResidentLocalVar,
            Email_Notifications: currentUser.Email_Notifications,
          }),
        );
        let existedUser = await AsyncStorage.getItem('existedUser');
        existedUser = JSON.parse(existedUser);
        setLoggedUser(existedUser);
        setLoading(false);
        navigation.navigate('FooterTab');
      }
    };

    if (userType && departmentIds) {
      storeData();
    }
  }, [currentUser]);

  const updateDeviceToken = async (modified_data, id) => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${id}`;
      console.log(url);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
        body: JSON.stringify(modified_data),
      });
      return await response.json();
    } catch (err) {
      if (err.message === 'Network request failed')
        Alert.alert(
          'Network Error',
          'Failed to fetch data. Please check your network connection and try again.',
        );
      else {
        Alert.alert('Error: ', err);
        console.log(err);
      }
    }
  };

  const getProfileImage = async url => {
    const cacheBuster = new Date().getTime();
    const requestUrl = `${url}?cb=${cacheBuster}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Cache-Control': 'no-cache', // Prevent caching
          Pragma: 'no-cache', // Prevent caching in older HTTP/1.0 proxies
          Expires: '0',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const buffer = await response.arrayBuffer();
      const base64Image = encode(buffer); // Use the encode function from base64-arraybuffer
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      return dataUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const [userData, setUserData] = useState({})

  const handleLoginForm = async userCred => {
    setLoading(true);
    console.log("Login user data", userCred)
    setUserData(userCred)
    const res = await getDataWithString(
      'All_App_Users',
      'Email',
      userCred.email.toLowerCase().trim(),
      accessToken,
    );
    console.log('Whether user exis or not in login:---- ', res);

    if (res.code === 3000) {
      console.log("Device tokens - ", res.data[0].Device_Tokens)
      setDotsBlinkingLoaderEllipsis(true);

      await isResident(res.data[0].ID);
      await isEmployee(res.data[0].ID);
      console.log(
        'resident || employee boolean',
        residentLocalVar,
        employeeLocalVar,
      );
      await isTestResident(res.data[0].ID);
      if (res && res.data && (residentLocalVar || employeeLocalVar)) {
        try {
          await fetchDataFromOffice(res.data[0].ID);
          const userCredential = await signInWithEmailAndPassword(
            auth,
            userCred.email.toLowerCase().trim(),
            userCred.password,
          );
          const user = userCredential.user;

          if (user.emailVerified) {
            setL1ID(res.data[0].ID);
            setUserEmail(userCred.email.toLowerCase().trim());
            if(!userCred.duplicateLogin){
              if(res.data[0].Device_Tokens && deviceToken !== res.data[0].Device_Tokens){
                setLoading(false);
                setIsLoggedIntoAnotherDevice(true)
                return;
              }
            }

            const reqUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${res.data[0].ID}/Profile_Photo/download`;
            const profileImgUrl = await getProfileImage(reqUrl);
            if (profileImgUrl.length > 300) {
              setProfileImage(profileImgUrl);
              setCurrentUser({
                id: res.data[0].ID,
                email: userCred.email.toLowerCase().trim(),
                name: res.data[0].Name_field,
                profilePhoto: profileImgUrl,
                Email_Notifications: res.data[0].Email_Notifications,
              });
            } else {
              setProfileImage(null);
              setCurrentUser({
                id: res.data[0].ID,
                email: userCred.email.toLowerCase().trim(),
                name: res.data[0].Name_field,
                profilePhoto: null,
                Email_Notifications: res.data[0].Email_Notifications,
              });
            }

            const updateData = {
              data: {
                Device_Tokens: deviceToken,
              },
            };
            const updateResponse = await updateDeviceToken(
              updateData,
              res.data[0].ID,
            );
            console.log('update device token response: ', updateResponse);
          } else {
            await sendEmailVerification(auth.currentUser);
            setLoading(false);
            navigation.navigate('VerificationNotice', { id: res.data[0].ID });
          }
        } catch (error) {
          setLoading(false);
          if (error.message === 'Network request failed')
            Alert.alert(
              'Network Error',
              'Failed to fetch data. Please check your network connection and try again.',
            );
          else if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          } else {
            setDialogVisible(true);
          }
          console.log('Error in auth: ', error);
        }
      } else {
        setLoading(false);
        setDialogVisible(true);
      }
    } else if (res.code =="9280") {
      setLoading(false);
      setDialogVisible(true);
      console.log('inside whether error');
    } else {
      setLoading(false);
      Alert.alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      {loading ? dotsBlinkingLoaderEllipsis ? (<DotsBlinkingLoaderEllipsis />) : (
        <ActivityIndicator
          size="large"
          color="#752A26"
          style={styles.loadingContainer}
        />

      ) : (
        <>
          <ScrollView>
            <KeyboardAvoidingView>
              <Image
                source={require('../../src/assets/aashram.png')}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: 340,
                  marginTop: 0,
                }}
              />

              <View style={[styles.head]}>
                <Text style={styles.login}>Welcome!</Text>
                <View
                  style={[
                    styles.email,
                    focusedInput === 'email' && styles.inputFocused,
                  ]}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Email Address"
                        value={value}
                        selectionColor="#B21E2B"
                        onFocus={() => setFocusedInput('email')}
                        onChangeText={value =>
                          onChange(value.toLowerCase().trim())
                        }
                        autoCapitalize="none"
                        style={styles.inputBox}
                      />
                    )}
                    rules={{ required: true, pattern: /^\S+@\S+$/i }}
                  />
                </View>
                {errors.email?.type === 'required' && (
                  <Text style={styles.textError}>Email is required</Text>
                )}
                {errors.email?.type === 'pattern' && (
                  <Text style={styles.textError}>Enter valid email</Text>
                )}

                {/* <View
                  style={[
                    styles.passBorder,
                    focusedInput === 'password' && styles.inputFocused,
                  ]}>
                  <Controller
                    name="password"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder="Password"
                        style={styles.inputBox}
                        value={value}
                        selectionColor="#B21E2B"
                        onFocus={() => setFocusedInput('password')}
                        secureTextEntry={!showPassword}
                        onChangeText={value => onChange(value.trim())}
                      />
                    )}
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                  />
                  {showPassword === false ? (
                    <TouchableOpacity
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}>
                      <Image
                        source={require('../assets/eyestrike.png')}
                        style={{width: 16, height: 16}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}>
                      <Image
                        source={require('../assets/eye.png')}
                        style={{width: 16, height: 16}}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {errors.password?.type === 'required' && (
                  <Text style={styles.textError}>Password is required</Text>
                )}
                {errors.password?.type === 'minLength' && (
                  <Text style={styles.textError}>
                    Password must be 6 characters long
                  </Text>
                )} */}
                <View
                  style={[
                    styles.passBorder,
                    focusedInput === 'password' && styles.inputFocused,
                  ]}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Password"
                        style={styles.inputBox}
                        value={value}
                        selectionColor="#B21E2B"
                        onFocus={() => setFocusedInput('password')}
                        secureTextEntry={!showPassword}
                        onChangeText={value => {
                          const trimmedValue = value.trim();
                          onChange(trimmedValue);
                          setPassword(trimmedValue);
                        }}
                      />
                    )}
                    rules={{
                      required: true,
                      // minLength: 8,
                      //         maxLength:20,
                      // pattern:
                      //           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                    }}
                  />
                  {showPassword === false ? (
                    <TouchableOpacity
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}>
                      <Image
                        source={require('../assets/eyestrike.png')}
                        style={{ width: 16, height: 16 }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}>
                      <Image
                        source={require('../assets/eye.png')}
                        style={{ width: 16, height: 16 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {/* {errors.password?.type === 'pattern' && (
              <Text style={styles.errorMessage}>
          Password must be at least 8 characters long, contains both upper and lower case letters, includes at least one number, and has at least one special character<Text style={styles.errMes} >(e.g., !@#$%^&*).</Text>
        </Text> 
      )}*/}
                {errors.password?.type === 'required' && (
                  <Text style={styles.textError}>Password is required</Text>
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit(handleLoginForm)}
                  // disabled={!isValidPassword()}
                  style={[styles.register]}>
                  {/* style={styles.register}> */}
                  <Text style={styles.registerTitle}>Login</Text>
                </TouchableOpacity>
                <View style={styles.redirect}>
                  <Text
                    style={{
                      color: '#71727A',
                      marginEnd: 6,
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontStyle: 'normal',
                      fontWeight: '600',
                      letterSpacing: 0.12,
                    }}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Register');
                    }}>
                    <Text
                      style={{
                        color: '#B21E2B',
                        width: 124,
                        fontFamily: 'Inter',
                        fontSize: 12,
                        flexShrink: 0,
                        fontStyle: 'normal',
                        fontWeight: '600',
                        letterSpacing: 0.12,
                      }}>
                      Register now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          <Dialog.Container
            visible={DialogVisible}
            contentStyle={{ borderRadius: 10 }}>
            <Dialog.Title style={styles.dialogTitle}>
              Incorrect email or password.
              Please try again!
            </Dialog.Title>
            {/* <Dialog.Description style={{ color: '#2F3036' }}>
              Please check your email or password and try again. Otherwise
              please register.
            </Dialog.Description> */}
            {/* <Dialog.Button
              style={{ color: '#B21E2B' }}
              label="Register"
              onPress={onPressRegister}
            /> */}
            <Dialog.Button
              style={{ color: 'black' }}
              label="OK"
              onPress={onPressOk}
            />
          </Dialog.Container>
          <Dialog.Container
            visible={isLoggedIntoAnotherDevice}
            contentStyle={{ borderRadius: 10 }}>
            <Dialog.Title style={styles.dialogTitle}>
              Already logged into another device
            </Dialog.Title>
            <Dialog.Description style={{ color: '#2F3036' }}>
              You are already logged into another device.
              By logging here you will be automatically logged out from the other device.
            </Dialog.Description>
            <Dialog.Button
              style={{ color: '#B21E2B' }}
              label="Cancel"
              onPress={()=>{
                setIsLoggedIntoAnotherDevice(false)
              }}
            />
            <Dialog.Button
              style={{ color: '#B21E2B' }}
              label="Login Here"
              onPress={()=>{
                setIsLoggedIntoAnotherDevice(false)
                handleLoginForm({...userData, duplicateLogin: true});
              }}
            />
          </Dialog.Container>
        </>
      )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#FFF',
    flex: 1,
  },
  head: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
  },
  redirect: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    paddingLeft: "11%"
  },
  inputBox: {
    color: '#1F2024',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingEnd: 4,
    alignItems: 'center',
    height: 47,
    width: '93%',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  inputFocused: {
    borderColor: '#B21E2B',
  },
  passBorder: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 18,
    height: 48,
    alignSelf: 'center',
    marginBottom: 8,
  },
  email: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    color: '#1F2024',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: -1,
  },
  register: {
    width: 216,
    backgroundColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    marginTop: 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
  registerTitle: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    width: "100%",
    height: "100%",
    textAlign: "center"
  },
  login: {
    color: '#000',
    fontFamily: 'Inter',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.24,
    width: "85%",
    height: "8%",
    marginBottom: 24,
  },
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
  },
  forgotPassword: {
    color: '#B21E2B',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    alignSelf: 'stretch',
    marginStart: 6,
  },

  dialogTitle: {
    color: 'black',
  },
  errorMessage: {
    color: '#2F3036',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    alignSelf: 'stretch',
    marginStart: 6,
    marginBottom: 10,
  },
  errMes: {
    color: '#B21E2B',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    alignSelf: 'stretch',
    marginStart: 6,
    marginBottom: 10,
  },
});
