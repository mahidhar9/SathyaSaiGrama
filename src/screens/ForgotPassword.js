import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '../auth/firebaseConfig';
import { openInbox } from 'react-native-email-link';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailSent, setemailSent] = useState(false);

  const [isForgetVisible, setIsForgetVisible] = useState(false);


  const handleForgotPassword = async ({ email }) => {
    try {
      // Check if the user exists by checking the sign-in methods for the given email
      console.log("Email is ", email)
      const signInMethods = await fetchSignInMethodsForEmail(auth, email.toLowerCase().trim());

      console.log("signInMethod ", signInMethods)

      if (signInMethods.length === 0) {
        // If no sign-in methods are found, the user does not exist
        setIsForgetVisible(true);
        //Alert.alert('Emai id is not registered', 'The given email address not found. Please check your email and retry or .');
      } else {
        // If the user exists, send the password reset email
        await sendPasswordResetEmail(auth, email.toLowerCase().trim());
        setemailSent(true); // Update state to show that email has been sent
      }
    } catch (error) {
      // Handle network and other errors
      if (error.message === 'Network request failed') {
        Alert.alert('Network Error', 'Please check your connection and try again.');
      } else {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
      console.error('Password Reset Error:', error);
    }
  };

  const handleForgetModal = () => {
    setIsForgetVisible(!isForgetVisible);
  };



  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      style={styles.container}>
      {!emailSent ? (
        <View style={styles.main}>
          <Text style={styles.forgot}>Enter Email Address</Text>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email for Password Reset"
                style={styles.inputBox}
                value={value}
                onChangeText={onChange}
              />
            )}
            rules={{ required: true, pattern: /^\S+@\S+$/i }}
          />
          {errors.email?.type === 'required' && (
            <Text style={styles.textError}>Email is required</Text>
          )}
          {errors.email?.type === 'pattern' && (
            <Text style={styles.textError}>Enter a valid email</Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(handleForgotPassword)}
            style={styles.register}>
            <Text style={styles.registerTitle}>Send</Text>
          </TouchableOpacity>

          <View style={[styles.redirect, { marginTop: '5%' }]}>
            <Text
              style={{
                color: '#71727A',

                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 16,
                marginRight: 5,
              }}>
              Haven't registered yet?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  color: '#B21E2B',

                  fontFamily: 'Inter',
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 16,
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isForgetVisible}
            onRequestClose={() => setIsForgetVisible(!isForgetVisible)}
          >
            {/* Background container with reduced opacity */}
            <TouchableWithoutFeedback onPress={handleForgetModal}>
              <View style={styles.modalBackground}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalView}>
                    <Text style={styles.titletext}>Email is not registered</Text>
                    <Text style={styles.subtext}>
                      The given email address is not registered. Please check your email and retry, or Register
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 30 }}>
                      <TouchableOpacity
                        style={[styles.HomeButton, { backgroundColor: '#B21E2B' }]}
                        onPress={() => {
                          setIsForgetVisible(false)
                          navigation.navigate('Register')
                        }}
                      >
                        <Text style={[styles.wewe, styles.wewe1]}>Register</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.HomeButton, { backgroundColor: '#fff', borderColor: '#B21E2B', borderWidth: 2 }]}
                        onPress={() => setIsForgetVisible(false)}
                      >
                        <Text style={[styles.wewe, styles.wewe2]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      ) : (
        <>
          <View style={{ margin: 30 }}>
            <Image
              style={{ width: '20%', marginTop: 150, alignSelf: 'center' }}
              resizeMode="contain"
              source={require('../../src/assets/imagekey.png')}
            />
            <Text
              style={{
                width: 350,
                // height: 38,
                color: '#1F2024',
                alignSelf: 'center',
                fontFamily: 'Inter',

                textAlign: 'center',
                fontSize: 17,
                fontWeight: '900',
                letterSpacing: 0.09,
                lineHeight: 22,
                marginTop: 20,
                marginBottom: 20,
              }}>
              A password reset link is sent to your registered email
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.register,
              styles.register1,
              { alignSelf: 'center' },
              { marginTop: 0 },
            ]}
            onPress={() => {
              openInbox();
            }}>
            <Text style={[styles.registerTitle, { color: 'white' }]}>
              Open Email App
            </Text>
          </TouchableOpacity>
          {/* <Text
            style={{
              width: 280,
              color: '#71727A',
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 20,
            }}>
            {' '}
            Please register if you haven't registered.
          </Text> */}

          <View
            style={[
              styles.redirect,
              { marginTop: '25%' },
              { alignSelf: 'center' },
            ]}>
            <Text
              style={{
                color: '#71727A',

                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 16,
                marginRight: 5,
              }}>
              Haven't registered yet?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  color: '#B21E2B',

                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: 900,
                  lineHeight: 16,
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.redirect, { alignSelf: 'center' }]}>
            <Text
              style={{
                color: '#71727A',

                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 16,
                marginRight: 5,
              }}>
              Back to
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login'), setemailSent(false);
              }}>
              <Text
                style={{
                  color: '#B21E2B',

                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: 900,
                  lineHeight: 16,
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  redirect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  inputBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    margin: 20,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#B21E2B',
    justifyContent: 'center',
  },
  register: {
    width: 220,
    height: 48,
    backgroundColor: '#B21E2B',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
    marginTop: '12%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
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
  registerTitle: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    color: 'white',
  },
  textError: {
    color: 'red',
    fontSize: 12,
  },
  forgot: {
    color: '#2F3036',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    marginRight: '60%',
  },
  instructions: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: "3%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // This adds a semi-transparent dark overlay
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titletext: {
    fontSize: 20,
    marginBottom: 10,
    color: "black",
    fontWeight: "bold"
  },
  subtext: {
    fontSize: 16,
    lineHeight: 20,  // Same line height
    color: '#71727A',

  },
  HomeButton: {
    height: 40,
    width: 100,
    borderRadius: 12,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#B21E2B',  // Hyperlink color
    textDecorationLine: 'underline',  // Underline for hyperlink appearance
    fontWeight: '600',  // Bold for emphasis
    fontSize: 14,       // Same as subtext
    lineHeight: 20,     // Same as subtext for alignment
  },


});

//Ignore
