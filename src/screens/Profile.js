import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../auth/firebaseConfig';
// import ImagePicker from 'react-native-image-crop-picker';
import {
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserContext from '../../context/UserContext';
import {
  getDataWithInt,
  getDataWithString,
  getDataWithStringAndInt,
  getDataWithoutStringAndWithInt,
} from '../components/ApiRequest';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../auth/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import Dialog from 'react-native-dialog';
import { BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME } from '@env';
import Toast from 'react-native-toast-message';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';

const Profile = ({ navigation }) => {
  const {
    getAccessToken,
    userEmail,
    L1ID,
    deviceToken,
    loggedUser,
    accessToken,
    profileImage,
    setProfileImage,
  } = useContext(UserContext);
  const { user, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImageModalVisible, setProfileImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isLogOutIndicator, setIsLogOutIndicator] = useState(false);

  let OndeleteStyles;
  if (deleteLoading) {
    OndeleteStyles = deleteLoadingStyles;
  } else if (!deleteLoading) {
    OndeleteStyles = styles;
  }


  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressOk = () => {
    onLogout();
    setDialogVisible(false);
  }

  const handleProfileModal = () => {
    setProfileImageModalVisible(!profileImageModalVisible);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleDeleteAccount = async (email, password) => {
    const credential = EmailAuthProvider.credential(email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      console.log('User reauthenticated successfully.');

      await deleteUser(user);
      console.log('User account deleted successfully.');
      setModalVisible(!modalVisible);
      setDeleteLoading(false);
      setToastVisible(true);
    } catch (error) {
      console.error('Error reauthenticating or deleting user:', error);
      Alert.alert(
        'Error',
        `Error reauthenticating or deleting user: ${error.message}`,
      );
    }
  };

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

  const findDeviceToken = async id => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${id}`;
      console.log(url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
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

  const onDelete = async userCred => {
    setDeleteLoading(true);
    console.log(userCred);
    await handleDeleteAccount(userCred.email, userCred.password);
  };
  const onLogout = () => {
    setIsLogOutIndicator(true);
    signOut(auth)
      .then(async response => {
        console.log('response :', response);
        setUser(null);

        const respon = await findDeviceToken(loggedUser.userId);
        console.log('findDeviceToken response is: ', respon);
        const replaceToken = deviceToken + '||';
        let myDeviceToken = respon.data.Device_Tokens.replace(replaceToken, '');

        console.log('local device token is: ', myDeviceToken);
        console.log('Response device token is : ', respon);
        const updateData = {
          data: {
            Device_Tokens: myDeviceToken,
          },
        };
        const updateResponse = await updateDeviceToken(
          updateData,
          loggedUser.userId,
        );
        console.log('update device token response: ', updateResponse);

        await AsyncStorage.removeItem('existedUser');
        RNRestart.Restart();

      })
      .catch(error => {
        console.log('error :', error);
        Alert.alert('Not able to logout!');
      });
  };


  const changeProfile = () => {
    setProfileImageModalVisible(!profileImageModalVisible);
  };

  const toMyprofile = async () => {
    setLoading(true);
    console.log('Email from context: ', userEmail);
    console.log(getAccessToken());
    const resFromUser = await getDataWithString(
      'All_App_Users',
      'Email',
      userEmail,
      getAccessToken(),

    );
    const resFromVehicleInfo = await getDataWithInt(
      'All_Vehicle_Information',
      'App_User_lookup',
      L1ID,
      getAccessToken(),
    );

    const resFromFlat = await getDataWithInt(
      'All_Flats',
      'Primary_Contact_app_user_lookup',
      L1ID,
      getAccessToken(),
    );

    const resFromEmployee = await getDataWithInt(
      'All_Employees',
      'App_User_lookup',
      L1ID,
      getAccessToken(),
    );
    // console.log('resFromFlat: ', resFromFlat);

    if (resFromFlat.data) {
      const resFromFamilyMember = await getDataWithoutStringAndWithInt(
        'All_Residents',
        'Relationship_with_the_primary_contact',
        'Self',
        'Flats_lookup',
        resFromFlat.data[0].ID,
        getAccessToken(),
      );
      console.log('resfromfamilyrelation: ', resFromFamilyMember.data);
      if (resFromFamilyMember.data) {
        setLoading(false);
        if (resFromEmployee.data)
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: true,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            familyMembersData: resFromFamilyMember.data,
            flatid: resFromFlat.data[0].ID,
            dapartmentExists: true,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        else
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: true,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            familyMembersData: resFromFamilyMember.data,
            flatid: resFromFlat.data[0].ID,
            dapartmentExists: false,
          });
      } else {
        setLoading(false);
        if (resFromEmployee.data)
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            flatExists: true,
            dapartmentExists: true,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        else
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flat: {
              building: resFromFlat.data[0].Building,
              flat: resFromFlat.data[0].Flat,
            },
            flatExists: true,
            dapartmentExists: false,
          });
      }
    } else {
      const resFromFamilyMemberRoom = await getDataWithInt(
        'All_Residents',
        'App_User_lookup',
        L1ID,
        getAccessToken(),
      );
      console.log('resfromfamilyrelation: ', resFromFamilyMemberRoom.data);
      setLoading(false);

      if (resFromEmployee.data) {
        if (resFromFamilyMemberRoom.data) {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            flatMember: true,
            flat: {
              building: resFromFamilyMemberRoom.data[0].Flats_lookup.Building,
              flat: resFromFamilyMemberRoom.data[0].Flats_lookup.Flat,
            },
            dapartmentExists: true,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        } else {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            dapartmentExists: true,
            flatMember: false,
            dapartment: resFromEmployee.data[0].Office_lookup.Department,
          });
        }
      } else {
        if (resFromFamilyMemberRoom.data) {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            flatMember: true,
            flat: {
              building: resFromFamilyMemberRoom.data[0].Flats_lookup.Building,
              flat: resFromFamilyMemberRoom.data[0].Flats_lookup.Flat,
            },
            dapartmentExists: false,
          });
        } else {
          navigation.navigate('MyProfile', {
            userInfo: resFromUser.data,
            vehicleInfo: resFromVehicleInfo.data,
            flatExists: false,
            dapartmentExists: false,
          });
        }
      }
    }
  };

  useEffect(() => {
    setIsLogOutIndicator(false)
  }, [Profile])

  useEffect(() => {

    if (toastVisible) {

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Account Deleted',
        text2: 'Your account has been deleted successfully',
        visibilityTime: 4000,
        autoHide: true,

        bottomOffset: 20,

      });
      onLogout();
    }
  }, [toastVisible]);

  const [frofileModalVisible, setFrofileModalVisible] = useState(false);

  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];

  const openProfileModal = () => {
    setFrofileModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeProfileModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFrofileModalVisible(false));
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      return result === 'granted';
    } else {
      // iOS permission handled automatically
      return true;
    }
  };

  /////Uploading profile photo to zoho

  const uploadProfileImage = async (imgUrl) => {

    const formData = new FormData();
    formData.append('file', {
      uri: imgUrl,
      type: 'image/jpeg', // adjust the MIME type if necessary
      name: 'profile.jpg',
    });

    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${L1ID}/Profile_Photo/upload`;
    console.log(url);
    const response = await fetch(
      url,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
      console.log('posting to zoho....'),
    );
    if (response.ok) {
      console.log('Image uploaded successfully to Zoho.');
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      existedUser.profilePhoto = imgUrl;
      await AsyncStorage.setItem('existedUser', JSON.stringify(existedUser));
      setProfileImage(imgUrl);

    } else {
      console.log(
        'Failed to upload image to Zoho:',
        response.status,
        response.statusText,
      );
    }
  }

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Camera permission denied');
      return;
    }
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Photo capture canceled');
        closeProfileModal();
      } else if (response.errorCode) {
        Alert.alert('Error capturing photo:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        uploadProfileImage(imageUri);
        closeProfileModal();
      } else {
        Alert.alert('Error: No photo captured.');
      }
    });
  };

  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Image selection canceled');
        closeProfileModal();
      } else if (response.error) {
        Alert.alert('Error selecting image:', response.error);
      } else {
        const imageUri = response.assets[0].uri;
        uploadProfileImage(imageUri);
        closeProfileModal();
      }
    });
  };

  const updateField = {
    Profile_Photo: ""
  };

  const updateData = {
    criteria: `ID==${L1ID}`,
    data: updateField,
  };


  const deleteProfileImage = async (url) => {
    const reqUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_App_Users/${L1ID}`;
    try {
      const response = await fetch(reqUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,  // Add authentication if needed    
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      console.log('Resource deleted successfully!');
      setProfileImage(null)
      closeProfileModal();
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      existedUser.profilePhoto = null
      await AsyncStorage.setItem('existedUser', JSON.stringify(existedUser));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogoutModal = () => {
    setLogoutModalVisible(!logoutModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B21E2B" />
        </View>
      ) : ((isLogOutIndicator ? (
        <View style={{flex:1, justifyContent:"center", alignItems: "center"}}>
          <View style={styles.indicatorBox}>
            <ActivityIndicator style={styles.activityIndicator} size="large" color="#0000ff" />
            <Text style={styles.text}>Logging Out...</Text>
          </View>
          </View>
      ) :
        <View>
          <View style={styles.account}>
            <Text style={styles.accountTitle}>Account</Text>
          </View>
          <View style={styles.topSection}>
            <View>
              <TouchableOpacity>
                {
                  profileImage != null ?
                    <Image source={{ uri: profileImage }} style={styles.propic} /> :
                    <Image source={require('../assets/profileImg.png')} style={styles.propic} />
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={openProfileModal} style={styles.editContainer}>
                <Image source={require('../assets/edit.png')} style={styles.editIcon} />
              </TouchableOpacity>

              {/* profile picture selector modal */}
              <Modal transparent={true} visible={frofileModalVisible} animationType="none" onRequestClose={closeProfileModal}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    {/* Close Modal when clicking outside */}
                    <TouchableWithoutFeedback onPress={closeProfileModal}>
                      <View style={styles.overlay}>
                        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                          <View style={{ width: "100%" }}>
                            <Text style={styles.uploadHead}>Profile  Photo</Text>
                            <View style={styles.profileUpload}>
                              <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
                                <Image source={require('../assets/cameraImg.png')} style={styles.uploadImg} />
                                <Text >Camera</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={selectImage} style={styles.iconButton}>
                                <Image source={require('../assets/galleryImg.png')} style={styles.uploadImg} />
                                <Text>Gallery</Text>
                              </TouchableOpacity>
                              {
                                profileImage && (
                                  <TouchableOpacity onPress={deleteProfileImage} style={styles.iconButton}>
                                    <Image source={require('../assets/delete.png')} style={styles.uploadImg} />
                                    <Text>Delete</Text>
                                  </TouchableOpacity>
                                )
                              }
                            </View>
                          </View>
                        </Animated.View>
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </KeyboardAvoidingView>
              </Modal>
            </View>

            <Text style={styles.name}>{loggedUser.name}</Text>
            <View style={styles.imgdel}>
              <Text style={styles.emailVisible}>{userEmail}</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setModalVisible(true)}>
                <Image
                  source={require('../assets/delete.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.buttonSection}
              onPress={toMyprofile}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>My Profile</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.buttonSection}
              onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>Notifications</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.buttonSection}
              onPress={() => navigation.navigate('Feedback')}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>Send Feedback</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSection} onPress={handleLogoutModal}>
              <View style={styles.buttonArea}>
                <Text style={styles.buttonName}>Logout</Text>
                <Image
                  source={require('../assets/RightArrow.png')}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>
          </View>



          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Enter your credentials to delete your account permanently
                </Text>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonDelete]}
                    onPress={async () => {
                      setModalVisible(!modalVisible);
                      await handleDeleteAccount();
                    }}>
                    <Text style={styles.textStyle}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal> */}

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}>
            <TouchableWithoutFeedback onPress={handleModal}>
              <View style={styles.centeredView}>
                <View style={OndeleteStyles.modalView}>
                  {deleteLoading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#B21E2B" /><Text>Deleting profile...</Text></View>) : <>
                    <Text style={styles.shareLink}>
                      Enter your credentials to delete your account permanently
                    </Text>

                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          placeholder="Email Address"
                          value={value}
                          style={[
                            styles.email,
                            focusedInput === 'email' && styles.inputFocused,
                          ]}
                          selectionColor="#B21E2B"
                          onFocus={() => setFocusedInput('email')}
                          onChangeText={onChange}
                          autoCapitalize="none"
                        />
                      )}
                      rules={{ required: true, pattern: /^\S+@\S+$/i }}
                    />
                    {errors.email?.type === 'required' && (
                      <Text style={styles.textError}>Email is required</Text>
                    )}
                    {errors.email?.type === 'pattern' && (
                      <Text style={styles.textError}>Enter valid email</Text>
                    )}

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
                            onChangeText={onChange}
                          />
                        )}
                        rules={{
                          required: true,
                          minLength: 8,
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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

                    {errors.password?.type === 'required' && (
                      <Text style={styles.textError}>Password is required</Text>
                    )}
                    {errors.password?.type === 'minLength' && (
                      <Text style={styles.textError}>
                        Password must be 8 characters long
                      </Text>
                    )}
                    {errors.password?.type === 'pattern' && (
                      <Text style={styles.textError}>
                        Password must contain at least a uppercase,lowercase,
                        number and a special character
                      </Text>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={[styles.HomeButton, { backgroundColor: '#B21E2B' }]}
                        onPress={handleSubmit(onDelete)}>
                        <Text style={[styles.wewe, styles.wewe1]}>Delete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.HomeButton, { backgroundColor: '#FFBE65' }]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={[styles.wewe, styles.wewe2]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={() => setModalVisible(!logoutModalVisible)}>
            <TouchableWithoutFeedback onPress={handleLogoutModal}>
              <View style={styles.centeredView}>
                <View style={OndeleteStyles.modalView}>
                    <Text style={styles.shareLink}>
                      Are you sure want to logout?
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={[styles.HomeButton, { backgroundColor: '#B21E2B' }]}
                        onPress={onLogout}>
                        <Text style={[styles.wewe, styles.wewe1]}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.HomeButton, { backgroundColor: '#FFBE65' }]}
                        onPress={() => setLogoutModalVisible(!logoutModalVisible)}>
                        <Text style={[styles.wewe, styles.wewe2]}>No</Text>
                      </TouchableOpacity>
                    </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={profileImageModalVisible}
            onRequestClose={() =>
              setProfileImageModalVisible(!profileImageModalVisible)
            }>
            <TouchableWithoutFeedback onPress={handleProfileModal}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.profileHead}>
                    <Text style={styles.shareLink}>Profile Photo</Text>
                    <Image source={require('../assets/delete.png')} />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={[styles.HomeButton, { backgroundColor: '#B21E2B' }]}>
                      <Text style={[styles.wewe, styles.wewe1]}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.HomeButton, { backgroundColor: '#FFBE65' }]}>
                      <Text style={[styles.wewe, styles.wewe2]}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>


        </View>
      ))}

      <Toast />


    </SafeAreaView>

  );
};



export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profleEditIcon: {

  },
  profileUpload: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  uploadImg: {
    width: 35,
    height: 35,
    tintColor: '#B21E2B',
    textAlign: 'center',
  },
  iconButton: {
    alignItems: 'center',
  },
  uploadHead: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
    marginBottom: 17
  },
  editContainer: {
    top: -30,
    left: 50,
    backgroundColor: "#B21E2B",
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  editIcon: {
    width: 12,
    height: 12,
    tintColor: "white",
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  profileHead: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  account: {
    height: 80,
    paddingTop: 19.5,
    paddingRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  accountTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '800',
    color: '#1F2024',
    textAlign: 'center',
    // lineHeight:"normal"
  },
  propic: {
    width: 81.5,
    height: 82,
    borderRadius: 85,
    textAlign: 'center',
    borderWidth: 0.2,
    borderColor: 'gray',
  },
  name: {
    color: '#1F2024',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  emailVisible: {
    color: '#71727A',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.12,
    marginEnd: 15,
    marginStart: 30,
    alignSelf: 'center',
  },
  options: {
    width: 375,
    paddingTop: 44,
    paddingRight: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  buttonSection: {
    padding: 15,
    marginStart: 10,
    marginEnd: 10,
    gap: 10,
    alignSelf: 'stretch',
    borderBottomWidth: 0.3,
    borderBottomColor: '#D4D6DD',
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonName: {
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    height: 12,
    width: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  imgdel: {
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 20,
    margin: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonDelete: {
    backgroundColor: '#ff0000',
  },
  inputBox: {
    color: '#1F2024',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingEnd: 4,
    alignItems: 'center',
    height: 48,
    width: '90%',
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
    width: 250,
    marginTop: 10,
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    color: '#1F2024',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
  },
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  shareLink: {
    color: '#1F2024',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    height: 41,
    alignSelf: 'stretch',
  },
  wewe: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
  },
  wewe1: {
    color: '#fff',
  },
  wewe2: {
    color: '#B21E2B',
  },
  HomeButton: {
    height: 50,
    width: 120,
    backgroundColor: '#752A26',
    borderRadius: 12,
    marginTop: 20,
    marginLeft: 4,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  detailsNotEditableDialogue: {
    borderRadius: 30,
    backgroundColor: 'pink',

  },

  detailsNotEditableTitle: {
    fontWeight: 'bold',
  }, 
  indicatorBox: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 100,
    alignSelf: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  activityIndicator: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },


});

const deleteLoadingStyles = StyleSheet.create({
  modalView: {
    margin: 20,
    height: 180,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }
  },

});