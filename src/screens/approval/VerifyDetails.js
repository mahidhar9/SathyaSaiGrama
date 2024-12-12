import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME, SECRET_KEY} from '@env';

import UserContext from '../../../context/UserContext';
import {encode} from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Dialog from 'react-native-dialog';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateRecord = async (reportName, modified_data, token, id) => {
  try {
    const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}/${id}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
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

const VerifyDetails = ({navigation, route}) => {
  const {height} = Dimensions.get('window');
  const {stringified} = route.params;
  //console.log('stringified', stringified);
  let {user} = route.params;
  // console.log('user outside stringified', user);
  let userID = user.ID;
  console.log('user id before stringified', userID);

  if (stringified) {
    console.log('inside if stringified');
    // const {user} = route.params;
    user = JSON.parse(user);
    console.log('user.ID', user.ID);
    userID = user.ID;
    user.Name_field = JSON.parse(user.Name_field);
    user.Referrer_App_User_lookup = JSON.parse(user.Referrer_App_User_lookup);
    user.Department = JSON.parse(user.Department);

    // Format the received string
    let formattedString = `[${user.Vehicle_Information}]`;

    try {
      // Parse the formatted string
      user.Vehicle_Information = JSON.parse(formattedString);
      // console.log(parsedArray);
    } catch (error) {
      console.error('Parsing error:', error.message);
    }

    console.log('user in stringified', user);
  }

  const [photo, setPhoto] = useState();
  const [QrCodephoto, setQrCodephoto] = useState();
  const [codeUploaded, setcodeUploaded] = useState(false);
  const [DialogVisible, setDialogVisible] = useState(false);
  const {
    setDeniedDataFetched,
    deniedDataFetched,
    setApproveDataFetched,
    pendingDataFetched,
    approveDataFetched,
    setPendingDataFetched,
    setEditData,
    loggedUser,
    setLoggedUser,
    accessToken,
  } = useContext(UserContext);

  useEffect(() => {
    const settingLoggedUser = async () => {
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      if (existedUser) {
        setLoggedUser(existedUser);
      }
    };

    if (!loggedUser || loggedUser === null) {
      settingLoggedUser();
    }
  }, []);

  const onPressOk = () => {
    setDialogVisible(false);
  };

  useEffect(() => {
    setEditData(user);
  }, []);
  const [loading, setLoading] = useState(true);

  // const [url, setUrl] = useState(
  //   `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Photo/download`,
  // );
  // const [qrCodeurl, setQrCodeurl] = useState(
  //   `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Generated_QR_Code/download`,
  // );
  const [approvingLoading, setapprovingLoading] = useState(false);
  const [deniedLoading, setdeniedLoading] = useState(false);

  const getImage = async url => {
    try {
      console.log('get image url', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
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
  const getQrCodeImage = async qrCodeurl => {
    try {
      console.log('get QRCodeImage url', qrCodeurl);
      const response = await fetch(qrCodeurl, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const buffer = await response.arrayBuffer();
      const base64Image = encode(buffer); // Use the encode function from base64-arraybuffer
      const qrCodeDataUrl = `data:image/jpeg;base64,${base64Image}`;

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     const dataUrl = await getImage();
  //     let qrCodeDataUrl = await getQrCodeImage();
  //     if (qrCodeDataUrl.length === 135) {
  //       qrCodeDataUrl = await getQrCodeImage();
  //     }
  //     console.log('qrCodeDataUrl', qrCodeDataUrl);
  //     setPhoto(dataUrl);
  //     setQrCodephoto(qrCodeDataUrl);
  //     setLoading(false);
  //   };
  //   fetchImage();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      const fetchImage = async () => {
        try {
          // setUrl(
          //   `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Photo/download`,
          // );
          // setQrCodeurl(
          //   `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Generated_QR_Code/download`,
          // );
          const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${userID}/Photo/download`;
          const qrCodeurl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${userID}/Generated_QR_Code/download`;
          const dataUrl = await getImage(url);
          let qrCodeDataUrl = await getQrCodeImage(qrCodeurl);
          let count = 0;
          // Retry if QR Code Data URL is of unexpected length
          while (qrCodeDataUrl.length === 135) {
            qrCodeDataUrl = await getQrCodeImage(qrCodeurl);
            count++;
            if (count > 5) {
              break;
            }
          }

          // console.log('qrCodeDataUrl', qrCodeDataUrl);
          setPhoto(dataUrl);
          setQrCodephoto(qrCodeDataUrl);
        } catch (error) {
          console.error('Error fetching images:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchImage();

      // Cleanup function (if necessary)
      return () => {
        console.log('Screen unfocused, cleaning up if needed');
        setPhoto(null);
        setQrCodephoto(null);
        setLoading(true);
      };
    }, [userID]),
  );

  const generateQR = async passcodeData => {
    try {
      const qrUrl = `https://qr-code-invitation-to-visitor.onrender.com/generate-image?name=${user.Referrer_App_User_lookup.Name_field}&&passcode=${passcodeData}&&date=${user.Date_of_Visit}&&key=${SECRET_KEY}`;
      const res = await fetch(qrUrl);
      console.log('URL - ', qrUrl);
      console.log('res from fetch img : ', res);

      if (!res.ok) {
        console.error('Error fetching image:', res.statusText);
        return;
      }

      // Convert response to a Blob
      const imageBlob = await res.blob();

      // Convert Blob to base64 using a Promise
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result.split(',')[1]; // Extract the base64 part only
          resolve(result);
        };
        reader.onerror = error => {
          console.error('Error reading blob:', error);
          reject(error);
        };
        reader.readAsDataURL(imageBlob);
      });

      if (!base64Data) {
        throw new Error('Failed to extract base64 data from Blob');
      }

      // Prepare data to send as form data
      const postData = new FormData();
      postData.append('file', {
        uri: `data:image/png;base64,${base64Data}`,
        name: 'qrcode.png',
        type: 'image/png',
      });

      // First PATCH request to Zoho
      const payload = {
        data: {
          Generated_Passcode: passcodeData,
        },
      };

      const url1 = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}`;
      console.log(url1);
      const response1 = await fetch(url1, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const updateRes = await response1.json();

      if (response1.ok) {
        if (updateRes.data && updateRes.code === 3000) {
          const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Generated_QR_Code/upload`;
          const response = await fetch(url, {
            method: 'POST',
            body: postData,
            headers: {
              Authorization: `Zoho-oauthtoken ${accessToken}`,
              'Cache-Control': 'no-cache', // Prevent caching
              Pragma: 'no-cache', // Prevent caching in older HTTP/1.0 proxies
              Expires: '0',
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.ok) {
            console.log('Image uploaded successfully to Zoho.', response);
            return;
          } else {
            console.log(
              'Failed to upload qr code image to Zoho: ',
              response.status,
            );
            return;
          }
        } else if (
          updateRes.error[0].alert_message[0] === 'L2 is already approved.' ||
          updateRes.error[0].alert_message[0] ===
            'Record cannot be edited after L2 Approved'
        ) {
          setL2approvedalreadydialogVisible(true);
          setErrorMessage(updateRes.error[0].alert_message[0]);
        } else if (
          updateRes.error[0].alert_message[0] ===
          'You cannot approve the L1 Denied requests'
        ) {
          setDialogVisible(true);
        } else {
          Alert.alert('Error in approving: ', updateRes.code);
        }
      } else {
        console.log(
          'Failed to post code to Zoho:',
          response1.status,
          response1.statusText,
        );
      }

      // POST request to upload image to Zoho
      // const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${user.ID}/Generated_QR_Code/upload`;
      // console.log(url);
      // const response = await fetch(url, {
      //   method: 'POST',
      //   body: postData,
      //   headers: {
      //     Authorization: `Zoho-oauthtoken ${accessToken}`,
      //     'Cache-Control': 'no-cache', // Prevent caching
      //     Pragma: 'no-cache', // Prevent caching in older HTTP/1.0 proxies
      //     Expires: '0',
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // console.log('Posting image to Zoho....');

      // if (response.ok) {
      //   console.log('Image uploaded successfully to Zoho.', response);
      //   return;
      // } else {
      //   console.log('Failed to upload image to Zoho: ', response.status,);
      //   return;
      // }
    } catch (error) {
      console.error('Error capturing and uploading QR code:', error);
    }
  };

  const passcodeGenerator = async status => {
    let generatedPasscode;
    while (true) {
      const newCode = Math.floor(
        100000 + Math.random() * (999999 - 100001 + 1),
      ).toString();
      const codeurl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Passcode_Report?criteria=Passcode==${newCode}`;
      const response = await fetch(codeurl, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
        params: {
          criteria: `Passcode==${newCode}`,
        },
      });

      if (response.ok) {
        continue;
      }
      generatedPasscode = newCode;
      break;
    }

    generateQR(generatedPasscode);

    const payload = {
      data: {
        Passcode: generatedPasscode,
      },
    };

    const PasscodeUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Passcode`;
    const passcodeResponse = await fetch(PasscodeUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!passcodeResponse.ok) {
      console.log('Error is posting passcode to zoho');
      Alert.alert('Error is posting passcode to zoho');
    }
  };

  const onApprove = async () => {
    let status = user.Referrer_Approval;

    let updateField;

    if (
      loggedUser.role === 'L2' &&
      ((user.Home_or_Office === 'Home' &&
        (loggedUser.deptIds.includes('3318254000027832015') ||
          loggedUser.deptIds.includes('3318254000031368009'))) ||
        user.Home_or_Office === 'Office')
    ) {
      updateField = {
        Referrer_Approval: 'APPROVED',
        L2_Approval_Status: 'APPROVED',
      };
    } else {
      updateField = {
        Referrer_Approval: 'APPROVED',
        L2_Approval_Status: 'PENDING APPROVAL',
      };
    }

    setapprovingLoading(true);

    const updateData = {
      data: updateField,
    };

    const response = await updateRecord(
      'Approval_to_Visitor_Report',
      updateData,
      accessToken,
      user.ID,
    );

    if (response.code === 3000) {
      console.log('record is updated');
      if (status === 'PENDING APPROVAL') {
        setPendingDataFetched(!pendingDataFetched);
        setApproveDataFetched(!approveDataFetched);
      } else if (status === 'DENIED') {
        setDeniedDataFetched(!deniedDataFetched);
        setApproveDataFetched(!approveDataFetched);
      }

      if (
        loggedUser.role === 'L2' &&
        ((user.Home_or_Office === 'Home' &&
          (loggedUser.deptIds.includes('3318254000027832015') ||
            loggedUser.deptIds.includes('3318254000031368009'))) ||
          user.Home_or_Office === 'Office')
      ) {
        Alert.alert('Visitor Approved');
        await passcodeGenerator(status);
      } else {
        Alert.alert('Visitor Approved');
      }
      setapprovingLoading(false);
      // navigation.navigate('Approved');
      Linking.openURL('myapp://Approved');

      return;
    } else {
      Alert.alert('Error: ', response.code);
    }
  };

  const onReject = async () => {
    setdeniedLoading(true);
    let status = user.Referrer_Approval;

    let updateField;

    if (loggedUser.role === 'L2') {
      updateField = {
        L2_Approval_Status: 'DENIED',
        Referrer_Approval: 'DENIED',
        Generated_Passcode: null,
        Generated_QR_Code: null,
      };
    } else {
      updateField = {
        Referrer_Approval: 'DENIED',
        Generated_Passcode: null,
        Generated_QR_Code: null,
      };
    }

    const updateData = {
      data: updateField,
    };

    const response = await updateRecord(
      'Approval_to_Visitor_Report',
      updateData,
      accessToken,
      user.ID,
    );
    console.log('response in reject', response);
    let L2status = user.L2_Approval_Status;

    if (L2status === 'APPROVED') {
      const PasscodeDeleteUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Passcode_Report`;

      const deletePayload = {
        criteria: `Passcode==\"${user.Generated_Passcode}\"`,
        result: {
          message: true,
          tasks: true,
        },
      };
      try {
        const deletePasscodeResponse = await fetch(PasscodeDeleteUrl, {
          method: 'DELETE',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
          body: JSON.stringify(deletePayload),
        });
        if (deletePasscodeResponse.ok) {
          const responseData = await deletePasscodeResponse.json();
          console.log('Passcode deleted successfully:', responseData);
        } else {
          const errorData = await deletePasscodeResponse.json();
          console.error('Error deleting passcode:', errorData);
          // Handle error based on errorData (e.g., display error message, retry, etc.)
        }
      } catch (error) {
        console.error('Error in deleting passcode:', error);
        // Handle unexpected errors (e.g., network issues, server errors)
      }
    }

    if (response.code === 3000) {
      if (status === 'PENDING APPROVAL') {
        setPendingDataFetched(false);
        setDeniedDataFetched(false);
      } else if (status === 'APPROVED') {
        setDeniedDataFetched(false);
        setApproveDataFetched(false);
      }
      console.log('Reject is called');
      Alert.alert('Visitor Rejected');
      // navigation.navigate('Denied');
      Linking.openURL('myapp://Denied');
      setdeniedLoading(false);
    } else {
      Alert.alert('Error in rejecting: ', response.code);
    }
  };

  const onShare = async () => {
    try {
      // Define the path to download the image
      const path = `${RNFS.DocumentDirectoryPath}/images.jpg`;

      // Download the image to local storage
      const base64string = QrCodephoto.replace(`data:image/jpeg;base64`, '');
      await RNFS.writeFile(path, base64string, 'base64');

      // const { Generated_QR_Code } = user;

      // // Define the path to download the image
      // const path = `${RNFS.DocumentDirectoryPath}/image.jpg`;

      // // Download the image to local storage
      // await RNFS.downloadFile({
      //   from: QrCodephoto,
      //   toFile: path,
      // }).promise;

      // Share the image
      await Share.open({
        // url: Platform.OS === 'android' ? `file://${path}` : path,
        url: `file://${path}`,
      });
    } catch (error) {
      console.log('', 'The file is not shared.');
    }
  };

  let heightStyles;
  if (height > 900) {
    heightStyles = normalScreen;
  } else if (height > 750) {
    heightStyles = mediumScreen;
  } else {
    heightStyles = smallScreen;
  }

  useFocusEffect(
    useCallback(() => {
      const {triggerDialog} = route.params || {};
      if (triggerDialog) {
        setDialogVisible(true);
      }

      return () => {
        setDialogVisible(false);
      };
    }, [route.params]),
  );

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFF', zIndex: 1}}>
        {/* <View style={styles.header}>
      <View style={styles.headerContainer}>
        <Text style={styles.headertxt}>Visitor details</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditVerifydetails", { user: user })} style={{ width: 40, height: 40, padding: 10, marginEnd: 20 }}>
          <Image
            source={edit}
            style={{ width: 40, height: 40, }}
          />
        </TouchableOpacity>
      </View>
    </View> */}
        <ScrollView style={styles.scrollview}>
          {/* {approvingLoading ? (
            <View style={heightStyles.ApproveActivityIndicatorContainer}>
              <Text style={[heightStyles.ActivityIndicatorText, {color:'white'}]}>Approving</Text>
              <ActivityIndicator
                size="large"
                color="#006400"
                style={heightStyles.ActivityIndicator}
              />
            </View>
          ) : null}
          {deniedLoading ? (
            <View style={heightStyles.RejectActivityIndicatorContainer}>
              <Text style={heightStyles.ActivityIndicatorText} >Rejecting</Text>
              <ActivityIndicator
                size="large"
                color="red"
                style={heightStyles.ActivityIndicator}
              />
            </View>
          ) : null} */}
          {user?.Referrer_Approval === 'PENDING APPROVAL' ? (
            <View style={[styles.container, {marginTop: 20}]}>
              {approvingLoading || deniedLoading ? (
                <View>
                  {approvingLoading ? (
                    <View
                      style={heightStyles.ApproveActivityIndicatorContainer}>
                      <Text
                        style={[
                          heightStyles.ActivityIndicatorText,
                          {color: 'white'},
                        ]}>
                        Approving
                      </Text>
                      <ActivityIndicator
                        size="large"
                        color="#006400"
                        style={heightStyles.ActivityIndicator}
                      />
                    </View>
                  ) : null}
                  {deniedLoading ? (
                    <View style={heightStyles.RejectActivityIndicatorContainer}>
                      <Text style={heightStyles.ActivityIndicatorText}>
                        Rejecting
                      </Text>
                      <ActivityIndicator
                        size="large"
                        color="red"
                        style={heightStyles.ActivityIndicator}
                      />
                    </View>
                  ) : null}
                </View>
              ) : (
                <>
                  <View style={[styles.left, {width: '50%'}]}>
                    <TouchableOpacity
                      style={[styles.btnAccept, heightStyles.apprejBtnPosition]}
                      onPress={onApprove}>
                      <Text style={styles.btntxt}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.right}>
                    <TouchableOpacity
                      style={styles.btnReject}
                      onPress={onReject}>
                      <Text style={styles.rejectBtnTxt}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ) : user?.Referrer_Approval === 'APPROVED' ? (
            <View>
              {deniedLoading ? (
                <View style={heightStyles.RejectActivityIndicatorContainer}>
                  <Text style={heightStyles.ActivityIndicatorText}>
                    Rejecting
                  </Text>
                  <ActivityIndicator
                    size="large"
                    color="red"
                    style={heightStyles.ActivityIndicator}
                  />
                </View>
              ) : (
                <View style={{width: '100%', padding: 10, marginLeft: '30%'}}>
                  <TouchableOpacity
                    style={[styles.btnReject]}
                    onPress={onReject}>
                    <Text style={[styles.rejectBtnTxt]}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : user?.Referrer_Approval === 'DENIED' ? (
            <View>
              {approvingLoading ? (
                <View style={heightStyles.ApproveActivityIndicatorContainer}>
                  <Text
                    style={[
                      heightStyles.ActivityIndicatorText,
                      {color: 'white'},
                    ]}>
                    Approving
                  </Text>
                  <ActivityIndicator
                    size="large"
                    color="#006400"
                    style={heightStyles.ActivityIndicator}
                  />
                </View>
              ) : (
                <View style={{width: '100%', padding: 10, marginLeft: '15%'}}>
                  <TouchableOpacity
                    style={styles.btnAccept}
                    onPress={onApprove}>
                    <Text style={styles.btntxt}>Approve</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
          {user.Referrer_Approval === 'APPROVED' &&
          user.L2_Approval_Status == 'APPROVED' &&
          user.Referrer_App_User_lookup.ID == loggedUser.userId ? (
            <View style={[styles.container, {marginTop: 20, marginBottom: 20}]}>
              <View style={styles.left}>
                <Text style={styles.label}>Generated QR Code</Text>
              </View>
              <View
                style={[
                  styles.right,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  },
                ]}>
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  QrCodephoto && (
                    <>
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{width: '98%', height: 200}}>
                        <Image
                          source={{uri: QrCodephoto}}
                          style={{width: '100%', height: 200}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.HomeButton, {backgroundColor: 'green'}]}
                        onPress={() => {
                          onShare();
                        }}>
                        <Text style={[styles.wewe, styles.wewe1]}>Share</Text>
                      </TouchableOpacity>
                    </>
                  )
                )}
                {/* {loading ? null : (
                  <TouchableOpacity
                    style={[styles.HomeButton, { backgroundColor: 'green' }]}
                    onPress={() => {
                      onShare();
                    }}>
                    <Text style={[styles.wewe, styles.wewe1]}>Share</Text>
                  </TouchableOpacity>
                )} */}
              </View>
            </View>
          ) : null}
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Name</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>
                {user.Name_field.zc_display_value}
              </Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Phone</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Phone_Number}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Single or Group Visit</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Single_or_Group_Visit}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Date of Visit</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Date_of_Visit}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Guest Category</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Guest_Category}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Priority</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Priority}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Remarks</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Remarks}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Gender</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Gender}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Photo</Text>
            </View>
            <View style={styles.right}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                photo && (
                  <Image
                    source={{uri: photo}}
                    style={{width: '98%', height: 200}}
                  />
                )
              )}
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Referrer</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>
                {user.Referrer_App_User_lookup.Name_field} -{' '}
              </Text>
              <Text style={styles.value}>
                {user.Referrer_App_User_lookup.Email}
              </Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Department</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Department.Department}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Number of Men</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Number_of_Men}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Number of Women</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Number_of_Women}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Number of Boys</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Number_of_Boys}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Number of Girls</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Number_of_Girls}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>Vehicle Information</Text>
            </View>

            <View style={styles.right}>
              {user?.Vehicle_Information?.length > 0
                ? user.Vehicle_Information.map((vehicle, index) => (
                    <Text key={index} style={styles.value}>
                      {vehicle.zc_display_value}
                    </Text>
                  ))
                : null}
            </View>
          </View>
          <View style={[styles.container, {marginTop: 20, marginBottom: 20}]}>
            <View style={styles.left}>
              <Text style={styles.label}>
                Is the guest being invited to your Home or Office
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{user.Home_or_Office}</Text>
            </View>
          </View>
        </ScrollView>

        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            {/* Full-Screen Image */}
            <Image source={{uri: QrCodephoto}} style={styles.fullScreenImage} />

            {/* Close and Share Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Image
                source={require('../../../src/assets/cancel.png')}
                style={styles.closeButtonText}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Image
                source={require('../../../src/assets/share.png')}
                style={styles.shareButtonText}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>

      <Dialog.Container
        visible={DialogVisible}
        contentStyle={styles.detailsNotEditableDialogue}>
        <Image
          source={require('../../../src/assets/Denied.png')}
          style={{width: '15%', height: '25%', alignSelf: 'center', top: -85}} // adjust as needed
        />
        <Dialog.Title style={styles.detailsNotEditableTitle}>
          Can not edit details once Visitor is L2 approved
        </Dialog.Title>
        <Dialog.Description style={styles.detailsNotEditableTxT}>
          Please fill another form
        </Dialog.Description>
        <Dialog.Button label="Ok" onPress={onPressOk} />
      </Dialog.Container>
    </>
  );
};

export default VerifyDetails;

const mediumScreen = StyleSheet.create({
  apprejBtnPosition: {
    marginLeft: '30%',
  },

  ApproveActivityIndicatorContainer: {
    top: 10,
    backgroundColor: '#9FE2BF',
    zIndex: 1,
    borderRadius: 40,
    width: 300,
  },

  RejectActivityIndicatorContainer: {
    top: 10,
    backgroundColor: 'pink',
    zIndex: 1,
    borderRadius: 40,
    width: 300,
  },

  ActivityIndicator: {
    top: -10,
    right: -60,
  },
  ActivityIndicatorText: {
    bottom: -20,
    right: -90,
    fontSize: 14,
    fontWeight: 'bold',
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
    zIndex: 0,
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  topGradient: {
    top: 0,
    height: '180%',
  },

  bottomGradient: {
    bottom: 0,
    height: '9%',
    backgroundColor: '#F9ECDF',
  },

  BottomImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 385,
    height: 130, // height as a percentage of screen height
    position: 'absolute',
    bottom: -79,
  },

  BottomLogoImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 145,
    height: 95, // height as a percentage of screen height
    position: 'absolute',
    bottom: -76,
  },

  pageContainer: {
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECDF',
    width: 385,
    height: 612,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  code: {
    fontSize: 35,
    textAlign: 'center',
    color: 'brown',
  },

  codeBackdrop: {
    marginTop: 12,
    backgroundColor: 'pink',
    borderRadius: 20,
    flexGrow: 0,
    width: 170,
    height: 50,
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6E260E',
    marginBottom: 10,
  },

  middleText: {
    fontSize: 17,
    color: '#6E260E',
    marginTop: 10,
  },

  BottomtextContainer: {
    marginTop: 15,
  },

  Bottomtext: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6E260E',
  },

  dateOfArrivalText: {
    color: '#6E260E',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },

  qrCodeContainer: {
    flex: 0.92,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Buttons: {
    marginTop: 100,
  },
});

const smallScreen = StyleSheet.create({
  apprejBtnPosition: {
    marginLeft: '37%',
  },

  ApproveActivityIndicatorContainer: {
    top: 10,
    backgroundColor: '#9FE2BF',
    zIndex: 1,
    borderRadius: 40,
    width: 350,
  },

  RejectActivityIndicatorContainer: {
    top: 10,
    backgroundColor: 'pink',
    zIndex: 1,
    borderRadius: 40,
    width: 350,
  },

  ActivityIndicator: {
    top: -10,
    right: -60,
  },

  ActivityIndicatorText: {
    bottom: -20,
    right: -110,
    fontSize: 17,
    fontWeight: 'bold',
  },

  hidden: {
    opacity: 0,
    position: 'absolute',
    zIndex: 0,
  },

  topGradient: {
    top: 0,
    height: '180%',
  },

  bottomGradient: {
    bottom: 0,
    height: '9%',
    backgroundColor: '#F9ECDF',
  },

  BottomImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 440,
    height: 90, // height as a percentage of screen height
    position: 'absolute',
    bottom: -35,
  },

  BottomLogoImage: {},

  gradient: {
    ...StyleSheet.absoluteFillObject,
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  pageContainer: {
    backgroundColor: 'white',
  },

  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECDF',
    width: 430,
    height: 570,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 5,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  code: {
    fontSize: 35,
    textAlign: 'center',
    color: 'brown',
  },

  codeBackdrop: {
    marginTop: 12,
    backgroundColor: 'pink',
    borderRadius: 20,
    flexGrow: 0,
    width: 170,
    height: 50,
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6E260E',
    marginBottom: 10,
  },

  middleText: {
    fontSize: 17,
    color: '#6E260E',
    marginTop: 10,
  },

  BottomtextContainer: {
    marginTop: 15,
  },

  Bottomtext: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6E260E',
  },

  dateOfArrivalText: {
    color: '#6E260E',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },

  qrCodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Buttons: {
    marginTop: 100,
  },
});

const normalScreen = StyleSheet.create({
  apprejBtnPosition: {
    marginLeft: '40%',
  },
  ApproveActivityIndicatorContainer: {
    top: 10,
    backgroundColor: '#9FE2BF',
    zIndex: 1,
    borderRadius: 40,
    width: 350,
    right: -10,
  },

  RejectActivityIndicatorContainer: {
    top: 10,
    backgroundColor: 'pink',
    zIndex: 1,
    borderRadius: 40,
    width: 350,
    right: -10,
  },

  ActivityIndicator: {
    top: -10,
    right: -60,
  },

  ActivityIndicatorText: {
    bottom: -20,
    right: -100,
    fontSize: 15,
    fontWeight: 'bold',
  },

  hidden: {
    opacity: 0,
    position: 'absolute',
    zIndex: 0,
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  topGradient: {
    top: 0,
    height: '180%',
  },

  bottomGradient: {
    bottom: 0,
    height: '10%',
    backgroundColor: '#F9ECDF',
  },

  pageContainer: {
    backgroundColor: 'white',
  },

  BottomLogoImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 170,
    height: 120, // height as a percentage of screen height
    position: 'absolute',
    bottom: -40,
    alignItems: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECDF',
    width: 450,
    height: 780,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    margin: 0,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
    color: '#6E260E',
    fontWeight: 'bold',
  },

  code: {
    fontSize: 35,
    textAlign: 'center',
    color: 'brown',
  },

  codeBackdrop: {
    marginTop: 12,
    backgroundColor: 'pink',
    borderRadius: 20,
    flexGrow: 0,
    width: 170,
    height: 50,
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6E260E',
    marginBottom: 10,
  },

  middleText: {
    fontSize: 17,
    color: '#6E260E',
    marginTop: 10,
  },

  BottomtextContainer: {
    marginTop: 19,
  },

  Bottomtext: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6E260E',
  },

  dateOfArrivalText: {
    color: '#6E260E',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },

  qrCodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Buttons: {
    marginTop: 100,
  },

  BottomImage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: 500,
    height: 200, // height as a percentage of screen height
    position: 'absolute',
    bottom: -78,
  },
});

const styles = StyleSheet.create({
  apprejBtnPosition: {
    marginLeft: '30%',
  },
  header: {
    width: '100%',
    height: '8%',
    backgroundColor: '#752a26',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headertxt: {
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 0,
  },
  left: {
    width: '40%',
  },
  right: {
    width: '60%',
  },
  label: {
    textAlign: 'right',
    marginEnd: 20,
    fontSize: 15,
  },
  value: {
    marginStart: 10,
    fontSize: 15,
    fontWeight: '800',
    color: 'black',
  },
  scrollview: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnAccept: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: '20%',
    backgroundColor: 'green',
  },
  btnReject: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B21e2B',
  },
  btntxt: {
    fontWeight: 'bold',
    fontSize: 20,
    //color: "#752A26"
    color: '#FFF',
  },
  rejectBtnTxt: {
    fontWeight: 'bold',
    fontSize: 20,
    //color: "#752A26"
    color: '#B21E2B',
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  HomeButton: {
    height: 30,
    width: 80,
    backgroundColor: '#752A26',
    paddingTop: 8,
    borderRadius: 12,
    marginTop: 20,
    marginLeft: 4,
    marginRight: 4,
  },
  wewe: {
    fontFamily: 'Inter',
    fontSize: 8,
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

  detailsNotEditableDialogue: {
    borderRadius: 30,
    backgroundColor: '#FFE2E5',
  },

  detailsNotEditableTitle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#B21E2B',
    bottom: -80,
  },

  detailsNotEditableTxT: {
    color: 'black',
    bottom: -80,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 115,
    right: 10,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    width: 25,
    height: 25,
    tintColor: '#B21E2B',
  },
  shareButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  shareButtonText: {
    color: '#fff',
    width: 30,
    height: 30,
    tintColor: '#B21E2B',
  },
});
