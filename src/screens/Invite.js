import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Image,
  Share,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import UserContext from '../../context/UserContext';
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../auth/AuthProvider';
import {BASE_APP_URL, APP_OWNER_NAME, APP_LINK_NAME, YOURLS_KEY} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import RNRestart from 'react-native-restart';

const Invite = ({navigation}) => {
  const {user} = useContext(AuthContext);

  const {
    userEmail,
    getAccessToken,
    loggedUser,
    setLoggedUser,
    employee,
    resident,
    deviceToken,
    zohoDeviceToken,
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

  const L1ID = loggedUser.userId;
  const [selectedOption, setSelectedOption] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //Popup when clicked on Visitor fills the form
  const handleModal = () => {
    setModal(!modal);
  };

  // const handleCheckboxChange = option => {
  //   setSelectedOption(selectedOption === option ? null : option);
  // };
  //===========================================================
  //To short the Zoho visitor Info form URL
  const shortUrl = async url => {
    console.log('short');
    try {
      const response = await axios.get(
        'https://visit.ssslsg.org/yourls-api.php',
        {
          params: {
            signature: YOURLS_KEY,
            action: 'shorturl',
            url: url,
            format: 'json',
          },
        },
      );
      if (response.data.status === 'success') {
        return response.data.shorturl;
      } else {
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  //To fetch existed link IDs
  const generatedData = async () => {
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_Link_Ids`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
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

  //To generate random number for Iink ID
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  // To check the uniqueness of generated ID
  const generateUniqueLinkID = async () => {
    let link_id = 0;
    const Generated_Link_ID = await generatedData();

    while (true) {
      const glink_id = randomNumber(100000000001, 999999999998);
      const link_id_count = Generated_Link_ID.data.filter(
        record => record.Link_ID === glink_id,
      ).length;

      if (link_id_count === 0) {
        link_id = glink_id;
        break;
      }
    }
    console.log(link_id);
    return link_id;
  };

  const postss = async () => {
    const UniqueNumber = await generateUniqueLinkID();

    const formData = {
      data: {
        Link_ID: UniqueNumber,
        Referrer_App_User_lookup: L1ID,
      },
    };

    //============
    //To post the generated random link id
    try {
      const response = await fetch(
        `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Generated_Link_ID`,
        {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
          },
          body: JSON.stringify(formData),
        },
      );

      return await response.json();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };
  let veryshortUrl = '';
  const generateURL = async selected => {
    const res = await postss();
    console.log(res);
    const id = res.data.ID;
    const selectedOpttion = selected;

    if (id) {
      const longUrl = `https://sathyasaigrama.github.io/visitor-invitation/#/?L1_lookup=${L1ID}&LinkIDLookup=${id}&Home_Office=${selectedOpttion}`
      //const shareURL = `https://creatorapp.zohopublic.com/${APP_OWNER_NAME}/${APP_LINK_NAME}/form-perma/Visitor_Information/t253nXrNhjgOHEpBs8EmZMTmpfP1UQejdGPB07QXDWt9NV2SjENZJmXwHJUuPbwFmXpT2Wsm72zAnyXwtZdy8Y4YgBdGyb6mOKee?L1_lookup=${L1ID}&LinkIDLookup=${id}&Home_Office=${selectedOpttion}`;
      console.log('L1ID:', L1ID, ' id:', id, 'selected:', selected);

      veryshortUrl = await shortUrl(longUrl);
    }
  };

  //================
  //To Share the generated URL
  const onShare = async selected => {
    try {
      if (selected !== null) {
        setLoading(true); // Start loading of activity indicator untill all sharing apps appear
        const res = await generateURL(selected);
        const result = await Share.share({
          message: `Please Fill the form using this Link : ${veryshortUrl}`,
        });
        setLoading(false); // stop loading after sharing apps appear
        setModal(false);
      } else {
        Alert.alert('Select anyone option');
      }
    } catch (error) {
      setLoading(false);
      setModal(false);
      //Alert.alert(error.message);
    }
  };

  const performLogout = async() =>{
    await AsyncStorage.removeItem('existedUser');
    RNRestart.Restart();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcome}>Invite</Text>

          <View
            style={{
              marginTop: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Inter',
                  fontWeight: '800',
                  fontSize: 18,
                  fontStyle: 'normal',
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#B21E2B',
                }}>
                Visitor's Particulars
              </Text>
              <Text style={[styles.text1, styles.text]}>
                If you’re inviting someone to Sathya Sai Grama, you’ll need to
                provide the details of the visitor(s) beforehand.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              width: '100%',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => navigation.navigate('FillByYourSelf')}>
              <Image
                style={{alignSelf: 'center', width: 50, height: 50}}
                source={require('../assets/fillbyyourselficon.png')}
              />
              <Text style={styles.buttonText}>
                I will {'\n'}complete {'\n'}the form
              </Text>
            </TouchableOpacity>
            <View style={styles.wrapper}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => setModal(false)}>
                <TouchableWithoutFeedback onPress={handleModal}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View>
                        <Text style={styles.shareLink}  allowFontScaling={false}>
                          Share link with the visitor
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.HomeorOffice}  allowFontScaling={false}>
                          {loggedUser.resident && loggedUser.employee
                            ? 'Are you inviting your visitor to your Home or Office?'
                            : 'Click the button below to share link with the visitor'}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        {loggedUser.resident ? (
                          <TouchableOpacity
                            style={[
                              styles.HomeButton,
                              {backgroundColor: '#B21E2B'},
                            ]}
                            onPress={() => {
                              onShare('Home');
                            }}>
                            <Text style={[styles.wewe, styles.wewe1]}>
                              {loggedUser.resident && loggedUser.employee
                                ? 'Home'
                                : 'Share Link'}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        {loggedUser.employee ? (
                          <TouchableOpacity
                            style={[
                              styles.HomeButton,
                              {backgroundColor: '#FFBE65'},
                            ]}
                            onPress={() => {
                              onShare('Office');
                            }}>
                            <Text style={[styles.wewe, styles.wewe2]}>
                              {loggedUser.resident && loggedUser.employee
                                ? 'Office'
                                : 'Share Link'}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                      {loading && ( // Display ActivityIndicator if loading
                        <ActivityIndicator
                          size="large"
                          color="#752A26"
                          style={styles.loadingContainer}
                        />
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
            <TouchableOpacity style={styles.buttonBox} onPress={handleModal}>
              <Image
                style={{alignSelf: 'center'}}
                source={require('../assets/PaperPlane.png')}
              />
              <Text style={styles.buttonText}>
                Visitor {'\n'}to complete {'\n'}the form
              </Text>
            </TouchableOpacity>
            <Dialog.Container
              visible={zohoDeviceToken && deviceToken!==zohoDeviceToken}
              contentStyle={{borderRadius: 10}}>
              <Dialog.Title style={{color: "black"}}>
                Logged into another device
              </Dialog.Title>
              <Dialog.Description style={{color: '#2F3036'}}>
                You are already logged into another device.
              </Dialog.Description>
              <Dialog.Button
                style={{color: '#B21E2B'}}
                label="Ok"
                onPress={performLogout}
              />
            </Dialog.Container>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the opacity as needed
    zIndex: 1,
  },
  welcome: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2024',
    textAlign: 'center',
    fontStyle: 'normal',
    lineHeight: 30,
    alignItems: 'center',
    padding: 17,
    marginTop: 5,
  },
  text: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    fontStyle: 'normal',
    borderRadius: 8,
    textAlign: 'center',
    color: '#71727A',

    lineHeight: 20,
  },
  text1: {
    margin: 35,
  },
  text2: {margin: 0},
  text3: {
    marginBottom: 8,
  },
  register: {
    width: 211,
    height: 55,
    backgroundColor: '#752A26',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  register1: {
    backgroundColor: '#B21E2B',
    margin: 35,
  },
  register2: {
    backgroundColor: '#ffbe65',
    marginLeft: 35,
    marginBottom: 30,
  },
  buttonBox: {
    width: '35%',
    height: 'auto',
    // backgroundColor: '#752A26',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    borderColor: '#B21E2B',
    borderWidth: 2,
    alignContent: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    color: '#B21E2B',
  },
  registerTitle: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  smalltext: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 'bold',
    paddingTop: 8,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  modalView: {
    maxHeight: '55%',
    margin: 20,
    minHeight:'20%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
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
  
  shareLink: {
    color: '#1F2024',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    marginBottom: 15,
    paddingLeft: 10,
    alignSelf: 'stretch',
  },
  HomeorOffice: {
    color: '#71727A',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  HomeButton: {
    height: 50,
    width:  120,
    backgroundColor: '#752A26',
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 4,
    marginRight: 4,
  },
  wewe: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '800',
    textAlign: 'center',
  },
  wewe1: {
    color: '#fff',
  },
  wewe2: {
    color: '#B21E2B',
  },
});
