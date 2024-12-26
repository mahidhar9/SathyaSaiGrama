import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  patchDataWithInt,
  patchDataWithRecordId,
  deleteDataWithID,
} from '../components/ApiRequest';
import UserContext from '../../context/UserContext';
import PhoneInput from 'react-native-phone-number-input';
import {Platform} from 'react-native';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Edit = ({ route, navigation }) => {
  const formType = route.params?.formType;
  const userdata = route.params?.userdata;
  const vehicledata = route.params?.vehicledata;
  const memberdata = route.params?.memberdata;

  const gender = ['Male', 'Female'];
  const [selectedGender, setSelectedGender] = useState(userdata?.Gender);
  const [memSelectedGender, setMemSelectedGender] = useState(
    memberdata?.App_User_lookup.Gender,
  );
  console.log(
    'object: ',
    formType,
    route.params?.departmentName, // Ensure the parameter names match
    route.params?.departmentNameExists,
    userdata?.Gender,memberdata?.App_User_lookup.Gender,
    
  );
  const dept = route.params?.departmentName;
  const deptExists = route.params?.departmentNameExists;

  const [loading, setLoading] = useState(false);

  // phone related states
  const [isEditable, setIsEditable] = useState(false);
  const [phoneValidErr, setPhoneValidErr] = useState(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [phoneErr, setPhoneErr] = useState(null);
  const [submitFlag, setSubmitFlag] = useState(false);

  const relationTypeDropDown = [
    { label: 'Spouse', value: 'Spouse' },
    { label: 'Son', value: 'Son' },
    { label: 'Daughter', value: 'Daughter' },
    { label: 'Mother', value: 'Mother' },
    { label: 'Father', value: 'Father' },
    { label: 'Brother', value: 'Brother' },
    { label: 'Sister', value: 'Sister' },
    { label: 'Colleague', value: 'Colleague' },
    { label: 'Grand Mother', value: 'Grand Mother' },
    { label: 'Grand Father', value: 'Grand Father' },
    { label: 'Aunt', value: 'Aunt' },
    { label: 'Uncle', value: 'Uncle' },
    { label: 'Father-in-Law', value: 'Father-in-Law' },
    { label: 'Mother-in-Law', value: 'Mother-in-Law' },
    { label: 'Sister-in-Law', value: 'Sister-in-Law' },
    { label: 'Brother-in-Law', value: 'Brother-in-Law' },
    { label: 'Niece', value: 'Niece' },
    { label: 'Nephew', value: 'Nephew' },
    { label: 'Grandson', value: 'Grandson' },
    { label: 'Granddaughter', value: 'Granddaughter' },
    { label: 'Other', value: 'Other' },
  ];

  // const { formType, userdata, vehicledata } = route.params;
  const { L1ID, getAccessToken, loggedUser, setLoggedUser } = useContext(UserContext);

  useEffect(()=>{
    const settingLoggedUser = async() => {
      let existedUser = await AsyncStorage.getItem('existedUser');
      existedUser = JSON.parse(existedUser);
      if(existedUser){
        setLoggedUser(existedUser);
      }
    }

    if(!loggedUser || loggedUser===null){
      settingLoggedUser();
    }
  }, [])
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userdata?.Name_field,
      secondary_phone: userdata?.Secondary_Phone,
      email: userdata?.Email,
      gender: userdata?.Gender,
      familymembername: memberdata?.App_User_lookup.Name_field,
      familymemberemail: memberdata?.App_User_lookup.Email,
      familymemberphone: memberdata?.App_User_lookup.Phone_Number,
      familymemberrelation: memberdata?.Relationship_with_the_primary_contact,
    },
  });
  const [invalidVehicleNumber, setInvalidVehicleNumber] = useState([]);
  const vehicleTypeDropDown = [
    { label: '2-wheeler', value: '2-wheeler' },
    { label: 'Car', value: 'Car' },
  ];

  const [isFocus, setIsFocus] = useState(true);

  const handleCancelByMemberBasicInfo = () => {
    navigation.navigate('Profile');
  };

  const handleCancelByBasicInfo = () => {
    navigation.navigate('MyProfile', {
      userInfo: [{ ...userdata }],
      vehicleInfo: vehicledata,
      familyMembersData: route.params.family,
      flatExists: route.params.flat,
      flat: route.params.flatdata,
      dapartment: dept,
      dapartmentExists: deptExists,
      flatMember: route.params.flatMember,
    });
  };

  const handleEditPhone = () => {
    setIsEditable(true);
  };
  const handleCancelPhone = () => {
    setPhoneErr(null);
    setPhoneValidErr(null);
    setFormattedValue(userdata?.Phone_Number);
    setIsEditable(false);
  };

  const validatePhoneNumber = () => {
    if (!formattedValue) {
      setPhoneErr('Phone number is required');
      console.log("phone number required error")
      setPhoneValidErr(null);
      return false;
    } else {
      setPhoneErr(null);
      const parsedPhoneNumber = parsePhoneNumberFromString(formattedValue);
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        console.log("invalid phone number  error")
        setPhoneValidErr('Invalid phone number');
        return false;
      } else {
        setPhoneValidErr(null);
        return true;
      }
    }
  };


  useEffect(() => {
    if (submitFlag) {
      validatePhoneNumber();
    }
  }, [formattedValue, submitFlag]);

  
  const saveDataFromBasicInfo = async (basicInfo) => {

    setPhoneErr(null);
    setPhoneValidErr(null);

    setSubmitFlag(true);

    if(!validatePhoneNumber()){
      return;
    }

    setLoading(true);
    console.log('Phone number is: ', formattedValue);

    let updateddata;
    if (!formattedValue) {
      updateddata = {
        Name_field: basicInfo.name,
        Phone_Number: userdata?.Phone_Number,
        Secondary_Phon: basicInfo.secondary_phone,
        Gender: basicInfo.gender,
      };
    } else {
      updateddata = {
        Name_field: basicInfo.name,
        Phone_Number: formattedValue,
        Secondary_Phon: basicInfo.secondary_phone,
        Gender: basicInfo.gender,
      };
    }
    console.log("object------------- ", updateddata)

    const user = {
      criteria: `ID==${L1ID}`,
      data: updateddata,
    };

    const resFromUserUpdate = await patchDataWithInt(
      'All_App_Users',
      user,
      getAccessToken(),
    );
    console.log(" (((((((((((((((((( ", resFromUserUpdate)

    if (resFromUserUpdate.result[0].code === 3000) {
      setLoading(false);
      console.log(basicInfo);

      console.log("Data to be set in AsyncStorage: ", data); // Log the data before setting
      const data = {
        userId: loggedUser.userId,
        role: loggedUser.role,
        email: loggedUser.email,
        deptIds: loggedUser.deptIds,
        name: basicInfo.name,
        profilePhoto: loggedUser.profilePhoto,
        resident: loggedUser.resident,
        employee: loggedUser.employee,
        testResident: loggedUser.testResident,
      };
      await AsyncStorage.setItem('existedUser', JSON.stringify(data));
      setLoggedUser(data)

      setFormattedValue('');
      navigation.navigate('MyProfile', {
        userInfo: [{ ...userdata, ...updateddata }],
        vehicleInfo: vehicledata,
        familyMembersData: route.params.family,
        flatExists: route.params.flat,
        flat: route.params.flatdata,
        dapartment: dept,
        dapartmentExists: deptExists,
        flatMember: route.params.flatMember,
      });
    } else {
      setLoading(false);
      Alert.alert('Error code', resFromUserUpdate.code);
    }
  };

  const saveDataFromVehicleInfo = async (vehicleInfo, id, ind) => {
    setLoading(true);
    const vehicleNumberPattern = /^[a-z]{2}[0-9]{2}[a-z]{2}[0-9]{4}$/;
    const vehicleNumber = vehicleInfo[`vehicleNumber${ind}`];
    if (
      vehicleNumberPattern.test(vehicleNumber.replace(/\s+/g, '').toLowerCase())
    ) {
      setInvalidVehicleNumber({ number: false, ind: ind });
      const updateddata = {
        Vehicle_Type: vehicleInfo[`vehicleType${ind}`],
        Vehicle_Number: vehicleInfo[`vehicleNumber${ind}`],
      };

      const vehicle = {
        criteria: `App_User_lookup==${L1ID}&&ID==${id}`,
        data: updateddata,
      };

      console.log(vehicle);
      const resFromVehicleUpdate = await patchDataWithInt(
        'All_Vehicle_Information',
        vehicle,
        getAccessToken(),
      );
      console.log(resFromVehicleUpdate);
      if (resFromVehicleUpdate.result[0].code === 3000) {
        setLoading(false);
        console.log(updateddata);
        const ind = vehicledata.findIndex(vehicle => vehicle.ID === id);

        if (ind != -1) {
          vehicledata[ind] = { ...vehicledata[ind], ...updateddata };
        }
        navigation.navigate('MyProfile', {
          userInfo: [{ ...userdata }],
          vehicleInfo: vehicledata,
          familyMembersData: route.params.family,
          flatExists: route.params.flat,
          flat: route.params.flatdata,
          dapartment: dept,
          dapartmentExists: deptExists,
          flatMember: route.params.flatMember,
        });
      } else {
        setLoading(false);
        Alert.alert('Error code', resFromVehicleUpdate.code);
      }
    } else {
      setInvalidVehicleNumber({ number: true, ind: ind });
      setLoading(false);
    }
  };
  const handleDeleteVehicle = async index => {
    setLoading(true);
    const id = vehicledata[index].ID;
    console.log('vehicledata', vehicledata);
    const resFromVehicleDelete = await deleteDataWithID(
      'All_Vehicle_Information',
      id,
      getAccessToken(),
    );
    if (resFromVehicleDelete.code === 3000) {
      setLoading(false);

      vehicledata.splice(index, 1);
      navigation.navigate('MyProfile', {
        userInfo: [{ ...userdata }],
        vehicleInfo: vehicledata,
        familyMembersData: route.params.family,
        flatExists: route.params.flat,
        flat: route.params.flatdata,
        dapartment: dept,
        dapartmentExists: deptExists,
        flatMember: route.params.flatMember,
      });
    } else {
      setLoading(false);
      Alert.alert('Error ', resFromVehicleDelete);
    }
  };

  const saveDataFromFamilyMemberBasicInfo = async memberInfo => {
    setLoading(true);
    const sendUpdateddata = {
      App_User_lookup: {
        Name_field: memberInfo.familymembername,
        Phone_Number: memberInfo.familymemberphone,
        Email: memberInfo.familymemberemail,
        Gender: memSelectedGender,
        ID: memberdata?.App_User_lookup.ID,
      },
      Relationship_with_the_primary_contact: memberInfo?.familymemberrelation,
      ID: memberdata?.ID,
    };

    console.log(memberdata?.App_User_lookup.ID);
    const user = {
      criteria: `ID==${memberdata?.App_User_lookup.ID}`,
      data: {
        Name_field: memberInfo?.familymembername,
        Phone_Number: memberInfo?.familymemberphone,
        Gender: memSelectedGender,
      },
    };
    console.log(user);

    console.log(memberdata?.ID);

    const relationUpdate = {
      criteria: `ID==${memberdata?.ID}`,
      data: {
        Relationship_with_the_primary_contact: memberInfo?.familymemberrelation,
      },
    };

    console.log(relationUpdate);
    console.log(getAccessToken);

    const resFromRelation = await patchDataWithInt(
      'All_Residents',
      relationUpdate,
      getAccessToken(),
    );
    console.log('resFromRelation: ', resFromRelation);

    const resFromMemberUpdate = await patchDataWithInt(
      'All_App_Users',
      user,
      getAccessToken(),
    );
    console.log(getAccessToken());

    console.log('resFromMemUpdate: ', resFromMemberUpdate);
    console.log('route.params?.membersData: ', route.params?.membersData);

    if (
      resFromMemberUpdate &&
      resFromMemberUpdate.result[0].message === 'Data Updated Successfully' &&
      resFromRelation &&
      resFromRelation.result[0].message === 'Data Updated Successfully'
    ) {
      const membersData = route.params?.membersData;

      // const index = membersData.findIndex(obj => obj.ID === memberdata?.ID);

      // if (index === -1) {
      //   membersData[index] = {}
      // }
      setLoading(false);
      navigation.navigate('Profile', {
        userInfo: route.params.user,
        vehicleInfo: route.params.vehicle,
        familyMembersData: route.params.family,
        flatExists: route.params.flat,
        flat: route.params.flatdata,
        dapartment: dept,
        dapartmentExists: deptExists,
      });
    } else {
      setLoading(false);
      Alert.alert('Error code', resFromMemberUpdate.code);
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
        <ScrollView style={styles.container}>
          <View style={styles.infoContainer}>
            {formType === 'BasicInfo' ? (
              <View>
                <Text style={styles.title}>Personal Info</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Name <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.inputBox}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{ required: true }}
                  />
                  {errors.name && (
                    <Text style={styles.textError}>Name is required</Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Email <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.inputBox}
                        value={value}
                        editable={false}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Phone <Text style={{ color: 'red' }}>*</Text>
                  </Text>

                  <View style={styles.editPhoneContainer}>
                    <Controller
                      name="phoneDisplay"
                      control={control}
                      defaultValue={userdata?.Phone_Number}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={styles.displayPhone}
                          value={value}
                          editable={false}
                        />
                      )}
                      rules={{ required: true }}
                    />
                    <TouchableOpacity
                      onPress={handleEditPhone}
                      style={styles.editPhonebtn}>
                      <Image
                        source={require('../assets/edit.png')}
                        style={styles.editPhoneIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  {isEditable && (
                    <>
                      <View style={styles.editPhoneContainer}>
                        <PhoneInput
                          defaultCode="IN"
                          layout="first"
                          placeholder=" "
                          containerStyle={styles.phoneInputContainer}
                          textContainerStyle={styles.textContainer}
                          flagButtonStyle={styles.flagButton}
                          codeTextStyle={styles.codeText}
                          onChangeFormattedText={text => {
                            setFormattedValue(text);
                          }}
                          countryPickerProps={{ withAlphaFilter: true }}
                          disabled={false}
                          withDarkTheme
                          withShadow
                        />

                        <TouchableOpacity
                          onPress={handleCancelPhone}
                          style={styles.editPhonebtn}>
                          <Image
                            source={require('../assets/cancel.png')}
                            style={[
                              styles.editPhoneIcon,
                              { tintColor: '#B21E2B' },
                            ]}
                          />
                        </TouchableOpacity>
                      </View>

                      {phoneErr && (
                        <Text style={styles.textError}>{phoneErr}</Text>
                      )}
                      {phoneValidErr && (
                        <Text style={styles.textError}>{phoneValidErr}</Text>
                      )}
                    </>
                  )}
                </View>
                {/* Secondary phone number */}
                {/* <View style={styles.field}>
                  <Text style={styles.label}>Secondary Phone</Text>
                  <Controller
                    name="secondary_phone"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.inputBox}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View> */}

                <View style={styles.field}>
                  <Text style={styles.label}>
                  Gender <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="gender"
                    rules={{ required: 'Gender is required' }}
                    render={({ field: { onChange } }) => (
                      <View style={styles.radioButtonContainer}>
                        {gender.map(option => (
                          <TouchableOpacity
                            key={option}
                            style={styles.singleOptionContainer}
                            onPress={() => {
                              setSelectedGender(option);
                              onChange(option);
                            }}>
                            <View style={styles.outerCircle}>
                              {selectedGender === option && (
                                <View style={styles.innerCircle} />
                              )}
                            </View>
                            <Text style={{ marginLeft: 10 }}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  />
                  {errors.gender && (
                    <Text style={{ color: 'red' }}>{errors.gender.message}</Text>
                  )}
                </View>

                {/* <TouchableOpacity
              style={styles.register}
              onPress={handleSubmit(saveDataFromBasicInfo)}>
              <Text style={styles.registerTitle}>Save</Text>
            </TouchableOpacity> */}

                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={handleSubmit(saveDataFromBasicInfo)}
                    style={styles.submit}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelByBasicInfo}
                    style={styles.Cancel}>
                    <Text style={styles.buttonText1}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : formType === 'VehicleInfo' ? (
              <View>
                <View style={styles.head}>
                  <Text style={styles.title}>Vehicle Info</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddData', {
                        formType: 'VehicleInfo',
                        userdata: userdata,
                        vehicledata: vehicledata,
                        family: route.params?.familyMembersData,
                        flat: route.params.flatExists,
                      })
                    }
                    style={styles.edit}>
                    <Image
                      source={require('../assets/add.png')}
                      style={{
                        width: 17,
                        height: 14.432,
                        marginEnd: 5,
                        flexShrink: 0,
                      }}
                    />
                    <Text style={[styles.title, styles.editText]}>Add</Text>
                  </TouchableOpacity>
                </View>
                {vehicledata ? (
                  vehicledata.map((vehicle, index) => (
                    <View style={styles.main} key={index}>
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          marginBottom: 0,
                        }}>
                        <View style={{ marginEnd: 15 }}>
                          <Text style={styles.label}>Vehicle Type</Text>
                          <Controller
                            name={`vehicleType${index}`} // Use unique key for Controller name
                            control={control}
                            defaultValue={vehicle.Vehicle_Type}
                            render={({ field: { onChange, value } }) => (
                              <Dropdown
                              testID={`dropdown-vehicleType${index}`}
                                style={[
                                  styles.dropdownVehicle,
                                  styles.inputBox,
                                ]}
                                data={vehicleTypeDropDown}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                  onChange(item.value); // Update the form value
                                  setIsFocus(false);
                                }}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          {errors[`vehicleType-${index}`] && (
                            <Text style={styles.textError}>
                              Vehicle type is required
                            </Text>
                          )}
                        </View>
                        <View style={styles.field}>
                          <Text style={styles.label}>Vehicle Number</Text>
                          <Controller
                            name={`vehicleNumber${index}`} // Use unique key for Controller name
                            control={control}
                            defaultValue={vehicle.Vehicle_Number}
                            render={({ field: { onChange, value } }) => (
                              <TextInput
                                style={styles.vehicleNumber}
                                value={value}
                                maxLength={12}
                                onChangeText={onChange}
                              />
                            )}
                            rules={{ required: true }}
                          />

                          {errors[`vehicleNumber${index}`] && ( // Corrected error handling for dynamic field names
                            <Text style={styles.textError}>
                              Vehicle number cannot be empty
                            </Text>
                          )}
                          {invalidVehicleNumber.number &&
                            invalidVehicleNumber.ind === index && (
                              <Text style={styles.textError}>
                                Invalid Vehicle number
                              </Text>
                            )}
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            console.log('inside onpress of handle delete');
                            handleDeleteVehicle(index);
                          }}>
                          <Image
                            source={require('../assets/close_icon.png')}
                            style={{
                              width: 17,
                              height: 14.432,
                              marginLeft: 5,
                              flexShrink: 0,
                            }}
                          />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                    style={styles.registerVehicle}
                    onPress={handleSubmit(
                      data => saveDataFromVehicleInfo(data, vehicle.ID, index), // Passed index correctly to handleSubmit
                    )}>
                    <Text style={styles.registerVehicleTitle}>Save</Text>
                  </TouchableOpacity> */}
                      </View>

                      <View style={[styles.footer, styles.submitButton]}>
                        <TouchableOpacity
                          style={styles.submit}
                          onPress={handleSubmit(
                            data =>
                              saveDataFromVehicleInfo(data, vehicle.ID, index), // Passed index correctly to handleSubmit
                          )}>
                          <Text testID="vehicleSubmit" style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <></>
                )}
              </View>
            ) : formType === 'MemberBasicInfo' ? (
              <>
                <Text style={styles.title}>Personal Info</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Name <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    name="familymembername"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.inputBox}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{ required: true }}
                  />
                  {errors.familymembername && (
                    <Text style={styles.textError}>Name is required</Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Relation Type <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    name="familymemberrelation" // Use unique key for Controller name
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        style={styles.inputBox}
                        data={relationTypeDropDown}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          onChange(item.value); // Update the form value
                          setIsFocus(false);
                        }}
                      />
                    )}
                    rules={{ required: true }}
                  />
                  {errors['familymemberrelation'] && (
                    <Text style={styles.textError}>
                      Relation type is required
                    </Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Email <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    name="familymemberemail"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.inputBox}
                        editable={false}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Phone <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Controller
                    name="familymemberphone"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.inputBox}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{ required: true }}
                  />
                  {errors.familymemberphone && (
                    <Text style={styles.textError}>
                      Phone number is required
                    </Text>
                  )}
                </View>

                <View testID="gender" style={styles.field}>
                  <Text style={styles.label}>
                    Gender <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.radioButtonContainer}>
                    {gender.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.singleOptionContainer}
                        onPress={() => {
                          setMemSelectedGender(option);
                        }}>
                        <View style={styles.outerCircle}>
                          {memSelectedGender === option && (
                            <View style={styles.innerCircle} />
                          )}
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Inter',
                            fontSize: 14,
                            fontStyle: 'normal',
                            fontWeight: '400',
                          }}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={handleSubmit(saveDataFromFamilyMemberBasicInfo)}
                    style={styles.submit}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelByMemberBasicInfo}
                    style={styles.Cancel}>
                    <Text style={styles.buttonText1}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Edit;

const styles = StyleSheet.create({
  displayPhone: {
    fontFamily: 'Inter',
    width: '100%',
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
  },
  editPhoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 0,
  },
  editPhonebtn: {
    width: 25,
    height: 25,
    left: '-50%',
    marginTop: 12,
  },
  editPhoneIcon: {
    width: 15,
    height: 15,
    marginTop: 5,
    // top: -45,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputContainer: {
    height: 50,
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C5C6CC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    paddingVertical: 0,
    borderRadius: 10,
    flex: 1,
    fontSize: 10,
  },
  flagButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  codeText: {
    fontSize: 14,
    color: '#2f3036',
    paddingLeft: 1,
  },
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  submitButton: {
    alignSelf: 'center',
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    flexDirection: 'column',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  editText: {
    color: '#B21E2B',
  },
  label: {
    alignSelf: 'stretch',
    color: '#2F3036',
    fontFamily: 'Inter',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  vehicleNumber: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    paddingHorizontal: 12,
    height: 40,
    width: '120%',
    marginTop: 10,
  },
  inputBox: {
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
  title: {
    width: 327,
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '900',
    letterSpacing: 0.08,
    marginBottom: 24,
  },
  dropdownVehicle: {
    width: '100%',
    marginEnd: 85,
    height: 40,
    marginTop: 10,
  },
  registerVehicleTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    alignSelf: 'center',
  },
  registerVehicle: {
    width: '25%',
    backgroundColor: '#752A26',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  head: {
    // flexDirection:"row"
  },
  add: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  textError: {
    color: 'red',
    fontSize: 12,
  },
  field: {
    marginBottom: 15,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'auto',
  },
  singleOptionContainer: {
    flexDirection: 'row', // ensure the circle and text are in a row
    alignItems: 'center', // vertically center align the circle and text
    marginRight: 20, // add space between the buttons
    marginVertical: 10, // add vertical margin for spacing above and below buttons
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e2e2',
    marginEnd: 8,
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: '#B21E2B',
  },
  footer: {
    flex: 1,
    width: 340,
    height: 45,
    paddingVertical: 20,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  buttonText1: {
    color: '#B21E2B',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  submit: {
    height: 50,
    width: 110,
    backgroundColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Cancel: {
    height: 50,
    width: 110,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleSubmit: {
    width: 80,
  },
  main: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: '3%',
    width: 310,
    alignSelf: 'center',
    borderRadius: 8,
    flexShrink: 0,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#FFF',
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
