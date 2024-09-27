import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import React, {useContext} from 'react';
import {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {auth} from '../auth/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {
  getDataWithString,
  getDataWithInt,
  getDataWithTwoInt,
} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';

const Register = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const [password, setPassword] = useState();
  const [validation, setValidation] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    isValidLength: false,
  });

  const validatePassword = (text) => {
    const hasNumber = /\d/.test(text);
    const hasUpperCase = /[A-Z]/.test(text);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(text);
    const isValidLength = text.length >= 8 && text.length <= 20;

    setValidation({
      hasNumber,
      hasUpperCase,
      hasSpecialChar,
      isValidLength,
    });

    setPassword(text);
  };
  const isValidPassword = () => {
    return (
      validation.hasNumber &&
      validation.hasUpperCase &&
      validation.hasSpecialChar &&
      validation.isValidLength
    );
  };
  const {accessToken, resident, employee, testResident} =
    useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [email, setEmail] = useState('');
  const isTestResident = async id => {
    const res = await getDataWithTwoInt(
      'All_Residents',
      'App_User_lookup',
      id,
      'Flats_lookup',
      '3318254000031368021',
      accessToken,
    );
    if (res && res.data) {
      console.log('Test resident is true');
      testResident.current = true;
    } else {
      console.log('Test Resident is false');
      testResident.current = false;
    }
  };

  const isResident = async id => {
    const res = await getDataWithInt(
      'All_Residents',
      'App_User_lookup',
      id,
      accessToken,
    );
    if (res && res.data) {
      console.log('resident data found in Login:', res.data);
      resident.current = true;
    } else {
      resident.current = false;
    }
    console.log('response in fetchDataFromOffice in login: '.res);
  };

  const isEmployee = async id => {
    const res = await getDataWithInt(
      'All_Employees',
      'App_User_lookup',
      id,
      accessToken,
    );
    if (res && res.data) {
      console.log('resident data found in Login:', res.data);
      employee.current = true;
    } else {
      employee.current = false;
    }
    console.log('response in fetchDataFromOffice in login: '.res);
  };

  const handleRegForm = async userCred => {
    setLoading(true);
    console.log(userCred.email);
    const res = await getDataWithString(
      'All_App_Users',
      'Email',
      userCred.email.toLowerCase().trim(),
      accessToken,
    );
    console.log('App user response returned in handleReg', res);
    if (
      res.data &&
      res.data.length > 0 
     
    ) {
      await isResident(res.data[0].ID);
    await isEmployee(res.data[0].ID);
    console.log(
      'resident || employee boolean in Register',
      resident.current,
      employee.current,
    );
    await isTestResident(res.data[0].ID);
    if(resident.current || employee.current){
      //authentication
      try {
        await createUserWithEmailAndPassword(
          auth,
          userCred.email.toLowerCase().trim(),
          userCred.password,
        );
        sendEmailVerification(auth.currentUser);
        setLoading(false);
        console.log('Id in register: ', res.data[0]);
        navigation.navigate('VerificationNotice', {
          id: res.data[0].ID,
          email: email,
        });
      } catch (error) {
        setLoading(false);
        if (error.message === 'Network request failed')
          Alert.alert(
            'Network Error',
            'Failed to fetch data. Please check your network connection and try again.',
          );
        else if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        } else {
          Alert.alert('Error in creating account:', error.message);
        }
        console.log('Error in auth: ', error);
      }
    }else {
      setLoading(false);
      Alert.alert('Your data does not exist. Please contact Admin');
      console.log('false');
    }
  }
    
     else {
      setLoading(false);
      Alert.alert('Your data does not exist. Please contact Admin');
      console.log('false');
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#752A26"
          style={styles.loadingContainer}
        />
      ) : (
        <ScrollView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
          style={styles.container}>
          <View style={styles.head}>
            <Text style={styles.signup}>Sign up</Text>
            <Text style={styles.subsignup}>
              Create an account to get started
            </Text>
            <Text style={styles.label}>Name</Text>
            <View
              style={[
                styles.input,
                focusedInput === 'name' && styles.inputFocused,
              ]}>
              <Controller
                name="name"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Name"
                    value={value}
                    selectionColor="#B21E2B"
                    onFocus={() => setFocusedInput('name')}
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
            </View>
            {errors.name?.type === 'required' && (
              <Text style={styles.textError}>Name is required</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.input,
                focusedInput === 'email' && styles.inputFocused,
              ]}>
              <Controller
                name="email"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Email Address"
                    value={value}
                    selectionColor="#B21E2B"
                    onFocus={() => setFocusedInput('email')}
                    onChangeText={value => {
                      onChange(value);
                      setEmail(value);
                    }}
                  />
                )}
                rules={{required: true, pattern: /^\S+@\S+$/i}}
              />
            </View>
            {errors.email?.type === 'required' && (
              <Text style={styles.textError}>Email is required</Text>
            )}
            {errors.email?.type === 'pattern' && (
              <Text style={styles.textError}>Enter valid email</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <View
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
                    onChangeText={text => {
                      onChange(text);
                     // setPassword(text);
                     validatePassword(text);
                    }}
                  />
                )}
                rules={{required: true,}}
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
            {/* {errors.password?.type === 'required' && (
              <Text style={[styles.textError,styles.passErro]}>Password is required</Text>
            )}
            {errors.password?.type === 'minLength' && (
              <Text style={[styles.textError,styles.passErro]}>
                Password must be between 6 to 20 characters long
              </Text>
            )}
            {errors.password?.type === 'maxLength' && (
              <Text style={[styles.textError,styles.passErro]}>
                Password must be between 6 to 20 characters long
              </Text>
            )} */}

            <Text style={[styles.text, validation.hasNumber ? styles.valid : styles.invalid]}>
             {validation.hasNumber ? '✓ ' : '✗ '} Contains at least one number
            </Text>
            <Text style={[styles.text, validation.hasUpperCase ? styles.valid : styles.invalid]}>
              {validation.hasUpperCase ? '✓ ' : '✗ '} Contains at least one uppercase letter
            </Text>
            <Text style={[styles.text, validation.hasSpecialChar ? styles.valid : styles.invalid]}>
              {validation.hasSpecialChar ? '✓ ' : '✗ '} Contains at least one special character
            </Text>
            <Text style={[styles.text, validation.isValidLength ? styles.valid : styles.invalid]}>
              {validation.isValidLength ? '✓ ' : '✗ '} Password length is between 8-20 characters
            </Text>

            <View
              style={[
                styles.passBorder,
                focusedInput === 'confirmPassword' && styles.inputFocused,
              ]}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Confirm Password"
                    style={styles.inputBox}
                    value={value}
                    selectionColor="#B21E2B"
                    onFocus={() => setFocusedInput('confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={onChange}
                  />
                )}
                rules={{
                  required: true,
                 // minLength: 6,
                  validate: value =>
                    value === password || 'Passwords do not match',
                }}
              />
              {showConfirmPassword === false ? (
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Image
                    source={require('../assets/eyestrike.png')}
                    style={{width: 16, height: 16}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Image
                    source={require('../assets/eye.png')}
                    style={{width: 16, height: 16}}
                  />
                </TouchableOpacity>
              )}
            </View>
            {errors.confirmPassword?.type === 'required' && (
              <Text style={styles.textError}>Password is required</Text>
            )}
            {/* {errors.confirmPassword?.type === 'minLength' && (
              <Text style={[styles.textError,styles.passErro]}>
                Password must be between 6 to 20 characters long
              </Text>
            )} */}
            {errors.confirmPassword?.type === 'validate' && (
              <Text style={[styles.textError,styles.passErro]} onFocus={()=>setPassword('')}>Passwords do not match</Text>
            )}

            {/* <Controller
              control={control}
              name="terms"
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <TouchableOpacity
                  style={{justifyContent: 'flex-start'}}
                  onPress={() => onChange(!value)}>
                  <View style={styles.condition}>
                    <View
                      style={[
                        styles.checkbox,
                        value ? styles.checked : styles.unchecked,
                      ]}>
                      {value && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.conditionText}>
                      I've read and agree with the
                      <Text style={{color: '#B21E2B', fontWeight: '600'}}>
                        {' '}
                        Terms and Conditions
                      </Text>{' '}
                      and the{' '}
                      <Text style={{color: '#B21E2B', fontWeight: '600'}}>
                        Privacy Policy
                      </Text>
                      .
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            {errors.terms && (
              <Text style={styles.textError}>
                You must accept the terms and conditions.
              </Text>
            )} */}

            <TouchableOpacity
              onPress={handleSubmit(handleRegForm)}
              // style={styles.register}
              disabled={!isValidPassword()} 
              style={[styles.register, !isValidPassword() ]}>
              <Text style={styles.registerTitle}>Register</Text>
            </TouchableOpacity>

            <View style={styles.redirect}>
              <Text
                style={{
                  width: 154,
                  color: '#71727A',
                  textAlign: 'center',
                  marginEnd: 2,
                  fontFamily: 'Inter',
                  fontSize: 12,
                  flexShrink: 0,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  letterSpacing: 0.12,
                }}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
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
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  redirect: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    paddingLeft: 100,
  },
  head: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
  },
  subsignup: {
    width: 327,
    color: '#71727A',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.12,
    marginBottom: 24,
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
  label: {
    color: '#2F3036',
    alignSelf: 'stretch',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    marginBottom: 5,
  },
  input: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#B21E2B',
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
    width: 50,
    height: 15,
  },
  signup: {
    width: 327,
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    marginBottom: 6,
    color: '#1F2024',
  },
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    marginLeft:5,
  },
  passErro:{
    marginLeft:11,

  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#B21E2B',
  },
  unchecked: {
    backgroundColor: '#fff',
  },
  checkmark: {
    color: '#fff',
  },
  condition: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 10,
    alignItems: 'baseline',
    marginBottom: 10,
    width: '90%',
  },
  conditionText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: 0.12,
    fontWeight: '400',
    color: '#71727A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: 0.12,
    fontWeight: '400',
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
   disabledButton: {
    backgroundColor: '#B0C4DE',
    },
});
