import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState, useContext, useEffect} from 'react';
import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {updateRecord} from './VerifyDetails';
import UserContext from '../../../context/UserContext';
import {Alert} from 'react-native';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME} from '@env';
import Dialog from 'react-native-dialog';
import {set} from 'react-hook-form';

const EditVerifyDetails = ({navigation, route}) => {
  const {height} = Dimensions.get('window');
  let heightStyles;
  if (height > 900) {
    heightStyles = normalScreen;
  } else if (height > 750) {
    heightStyles = mediumScreen;
  } else {
    heightStyles = smallScreen;
  }
  const {user} = route.params;
  if (typeof user === 'string') {
    console.log('inside if stringified');
    // const {user} = route.params;
    user = JSON.parse(user);

    user.Name_field = JSON.parse(user.Name_field);
    user.Referrer_App_User_lookup = JSON.parse(user.Referrer_App_User_lookup);
    user.Department = JSON.parse(user.Department);

    // Format the received string
    let formattedString = `[${user.Vehicle_Information}]`;

    try {
      // Parse the formatted string
      user.Vehicle_Information = JSON.parse(formattedString);
      console.log(parsedArray);
    } catch (error) {
      console.error('Parsing error:', error.message);
    }

    console.log('user in stringified', user);
  }

  if (user.L2_Approval_Status === 'APPROVED') {
    // Alert.alert('Can not edit details once Visitor is L2 approved', 'Please fill another form', [{style:styles.errorText}]);
    navigation.navigate('VerifyDetails', {user: user, triggerDialog: true});
  }

  const [date, setDate] = useState(user.Date_of_Visit);
  const [phone, setPhone] = useState(user.Phone_Number);
  const [isSingleFocus, setIsSingleFocus] = useState(false);
  const [isHomeFocus, setIsHomeFocus] = useState(false);
  const [isCategoryFocus, setIsCategoryFocus] = useState(false);
  const [isPriorityFocus, setIsPriorityFocus] = useState(false);
  const [isHome, setIsHome] = useState(user.Home_or_Office);
  const [isSingle, setIsSingle] = useState(user.Single_or_Group_Visit);
  const [category, setCategory] = useState(user.Guest_Category);
  const [priority, setPriority] = useState(user.Priority);
  const [men, setMen] = useState(user.Number_of_Men);
  const [women, setWomen] = useState(user.Number_of_Women);
  const [boys, setBoys] = useState(user.Number_of_Boys);
  const [girls, setGirls] = useState(user.Number_of_Girls);
  const [remarks, setRemarks] = useState(user.Remarks);
  const [vehicles, setVehicles] = useState(user.Vehicle_Information);
  const [vehicleErrorMessages, setVehicleErrorMessages] = useState({});
  // Regex format for vehicle number like 'KA 01 CU 1234'
  const vehicleNumberPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  const [selectedGender, setSelectedGender] = useState(user.Gender);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [DialogVisible, setDialogVisible] = useState(false);
  const [errType, setErrType] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const gender = ['Male', 'Female'];

  const {getAccessToken} = useContext(UserContext);
  let menCount = '0';
  let womenCount = '0';
  let boysCount = '0';
  let girlsCount = '0';

  const handleDateChange = selectedDate => {
    const formattedDate = moment(selectedDate, 'YYYY-MM-DD').format(
      'DD-MMM-YYYY',
    );
    setDate(formattedDate);
    setShowModal(false);
  };

  const homeOrOffice = [
    {label: 'Home', value: 'Home'},
    {label: 'Office', value: 'Office'},
  ];

  const singleOrGroup = [
    {label: 'Single', value: 'Single'},
    {label: 'Group', value: 'Group'},
  ];

  const guestCategory = [
    {label: 'Govt Officials', value: 'Govt Officials'},
    {label: 'Politician', value: 'Politician'},
    {label: 'Corporate', value: 'Corporate'},
    {label: 'Press', value: 'Press'},
    {label: 'Parent', value: 'Parent'},
    {label: 'Devotee', value: 'Devotee'},
  ];

  const guestPriority = [
    {label: 'P1', value: 'P1'},
    {label: 'P2', value: 'P2'},
    {label: 'P3', value: 'P3'},
  ];

  const today = new Date();

  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    'YYYY/MM/DD',
  );
  const addDaysToDate = (dateString, daysToAdd) => {
    // Convert the input string (YYYY/MM/DD) into a Date object
    const [year, month, day] = dateString.split('/'); // Split the string by '/'
    const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

    // Add the specified number of days (60 days in this case)
    date.setDate(date.getDate() + daysToAdd);

    // Format the new date back to 'YYYY/MM/DD'
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const newDay = String(date.getDate()).padStart(2, '0');

    return `${newYear}-${newMonth}-${newDay}`;
  };
  const endDate = addDaysToDate(startDate, 60);

  const updateRecord = async (reportName, modified_data, token, id) => {
    setUpdateLoading(true);
    try {
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${reportName}/${user.ID}`;
      console.log(url);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
        body: JSON.stringify(modified_data),
      });

      const responseData = await response.json();
      console.log(
        '--------------------------------------------------------------------------------------------------------',
      );
      console.log('@@@@@@@@@@@@@@@@@', responseData);

      if (responseData.code === 3000) {
        if (user.Referrer_Approval === 'PENDING APPROVAL') {
          setTimeout(() => Alert.alert('Visitor details changed'), 2000);
          setTimeout(() => navigation.navigate('Pending'), 2000);
        } else if (user.Referrer_Approval === 'APPROVED') {
          setTimeout(() => Alert.alert('Visitor details changed'), 2000);
          setTimeout(() => navigation.navigate('Approved'), 2000);
        } else if (user.Referrer_Approval === 'DENIED') {
          setTimeout(() => Alert.alert('Visitor details changed'), 2000);
          setTimeout(() => navigation.navigate('Denied'), 2000);
        }
      } else if (responseData.code === 3001) {
        //  Alert.alert('Can not edit details once Visitor is L2 approved', 'Please fill another form');
        setDialogVisible(true);
        return responseData;
      }
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
      setUpdateLoading(false);
    }
  };

  const onSave = async () => {
    if (!remarks) {
      setRemarks('');
    }
    if (validateForm()) {
      menCount = men === '' ? '0' : men;
      womenCount = women === '' ? '0' : women;
      boysCount = boys === '' ? '0' : boys;
      girlsCount = girls === '' ? '0' : girls;

      if (selectedGender == 'Male' && isSingle == 'Single') {
        menCount = 1;
        womenCount = 0;
        boysCount = 0;
        girlsCount = 0;
      } else if (selectedGender == 'Female' && isSingle == 'Single') {
        menCount = 0;
        womenCount = 1;
        boysCount = 0;
        girlsCount = 0;
      }

      // Calculate the total number of people
    let people = parseInt(menCount) + parseInt(womenCount) + parseInt(boysCount) + parseInt(girlsCount);
    console.log('Total people : ', people);

    // Validation checks for minimum counts
    let tempErrType = null;
    if (selectedGender === 'Male' && menCount < 1) {
      tempErrType = 'MenCount';
    } else if (selectedGender === 'Female' && womenCount < 1) {
      tempErrType = 'WomenCount';
    }
   
    setErrType(tempErrType);

     if(people >= 1 && tempErrType == null){
      vehicles.map(vehicle => {
        delete vehicle.ID;
        delete vehicle.zc_display_value;
      });

      const uppercaseVehicles = vehicles.map(vehicle => ({
        ...vehicle,
        Vehicle_Number: vehicle.Vehicle_Number.toUpperCase(),
      }));

      const updateField = {
        Date_of_Visit: date,
        Gender: selectedGender,
        Home_or_Office: isHome,
        Number_of_Boys: boysCount,
        Number_of_Girls: girlsCount,
        Number_of_Men: menCount,
        Number_of_People: people,
        Number_of_Women: womenCount,
        Priority: priority,
        Remarks: remarks,
        Single_or_Group_Visit: people == 1 ? 'Single' : 'Group',
        Guest_Category: category,
        Vehicle_Information: uppercaseVehicles,
      };

      const updateData = {
        criteria: `ID==${user.ID}`,
        data: updateField,
      };

      console.log('#############saved details are : ', updateField);

      const response = await updateRecord(
        'Approval_to_Visitor_Report',
        updateData,
        getAccessToken(),
      );

      if (response.result[0].code === 3000) {
        console.log(
          '----------------------------Update Successful---------------------------------',
        );
        const newUser = {...user, ...updateData};
        console.log('New user data is:', newUser);
        navigation.navigate('VerifyDetails', {user: {...user, ...updateField}});
      } else {
        Alert.alert('Error: ', response.code);
      }
     }
      else{
       if(people < 1){
        Alert.alert('Error: ', 'Please select at least one person to visit.');
     }
    }
    }
  };

  const onCancel = () => {
    navigation.navigate('VerifyDetails', {user: user});
  };
  const validateForm = () => {
    let valid = true;

    menCount = men === '' ? '0' : men;
    womenCount = women === '' ? '0' : women;
    boysCount = boys === '' ? '0' : boys;
    girlsCount = girls === '' ? '0' : girls;

    setMen(menCount);
    setWomen(womenCount);
    setBoys(boysCount);
    setGirls(girlsCount);

    // const isDateWithinTwoMonths = selectedDate => {
    //   const currentDate = new Date(); // Get current date

    //   // Create a date 2 months from today
    //   const twoMonthsLater = new Date();
    //   twoMonthsLater.setMonth(currentDate.getDate() + 1);

    //   // Compare the selected date with the date 2 months later
    //   return selectedDate <= twoMonthsLater;
    // };
    // if (date === 'Select Date') {
    //   setDateOfVisitErr('Date of visit is required');
    //   valid = false;
    // } else {
    //   if (!isDateWithinTwoMonths(date)) {
    //     setDateOfVisitErr('Please select a date within 2 months from today');
    //     valid = false;
    //   }
    //   setDateOfVisitErr(null);
    // }

    const errors = {};

    vehicles.forEach((vehicle, index) => {
      const vehicleNumber = vehicle.Vehicle_Number;
      if (
        !vehicleNumberPattern.test(
          vehicleNumber.replace(/\s+/g, '').toUpperCase(),
        )
      ) {
        errors[vehicle.ID] = `Invalid Vehicle Number`;
        valid = false;
      }
      if (vehicle.Vehicle_Type === '') {
        errors[vehicle.ID] = `Please select Vehicle Type`;
        valid = false;
      }
      if (
        !vehicleNumberPattern.test(
          vehicleNumber.replace(/\s+/g, '').toUpperCase(),
        ) &&
        vehicle.Vehicle_Type === ''
      ) {
        errors[vehicle.ID] = `Invalid Vehicle Information`;
        valid = false;
      }
    });

    setVehicleErrorMessages(errors);

    return valid;
  };

  const onPressOk = () => {
    setDialogVisible(false);
    if (user.Referrer_Approval === 'PENDING APPROVAL') {
      navigation.navigate('Pending');
    } else if (user.Referrer_Approval === 'APPROVED') {
      navigation.navigate('Approved');
    }
  };

  const handleAddVehicle = () => {
    setVehicles([
      ...vehicles,
      {Vehicle_Type: '', Vehicle_Number: '', ID: Date.now()},
    ]);
  };

  const handleRemoveVehicle = index => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
  };

  const handleTextChange = (index, field, value) => {
    console.log(vehicles)
    const updatedVehicles = vehicles.map((vehicle, i) =>
      i === index ? {...vehicle, [field]: value} : vehicle,
    );
    setVehicles(updatedVehicles);
  };

  const [dots, setDots] = useState(''); // State to manage dots animation

  // Use an interval to animate the dots
  useEffect(() => {
    let interval;
    if (updateLoading) {
      interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 500); // Adjust the speed as necessary
    } else {
      setDots('');
    }
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [updateLoading]);
  let addNewButtonVisibility;
  if (
    (isSingle === 'Group' && vehicles.length < 5) ||
    (isSingle === 'Single' && vehicles.length < 1)
  ) {
    addNewButtonVisibility = true;
  } else {
    addNewButtonVisibility = false;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <View style={styles.header}>
        <Text style={styles.headertxt}>Edit visitor details</Text>
      </View> */}
      <ScrollView
        style={{height: '92%s', backgroundColor: '#FFF', fontFamily: 'Inter'}}>
        <View style={styles.v}>
          <Text style={[styles.txt, {marginTop: 20}]}>Visitor Name</Text>
          <TextInput
            style={styles.inputtxt}
            value={user.Name_field.zc_display_value}
            editable={false}
          />
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Phone</Text>
          <TextInput style={styles.inputtxt} value={phone} editable={false} />
        </View>

        <View style={styles.v}>
          <Text style={styles.txt}>Date of visit</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <TextInput
              style={[styles.inputtxt, {color: 'black'}]}
              value={date}
              editable={false}
            />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}>
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={styles.modalContent}>
                    <DatePicker
                      mode="calender"
                      onSelectedChange={handleDateChange}
                      minimumDate={startDate}
                      maximumDate={endDate}
                      options={{
                        backgroundColor: '#fff',
                        textHeaderColor: '#333',
                        textDefaultColor: '#333',
                        selectedTextColor: '#fff',
                        mainColor: '#F4722B',
                        textSecondaryColor: '#999',
                        borderColor: '#ccc',
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Gender</Text>
          <View style={styles.radioButtonContainer}>
            {gender.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.singleOptionContainer}
                disabled={true}
                onPress={() => {
                  setSelectedGender(option);
                }}>
                <View style={styles.outerCircle}>
                  {selectedGender === option && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
                <Text style={{marginLeft: 10, fontSize: 14}}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.v}>
          <Text style={styles.txt}>Single or Group Visit</Text>
          <Dropdown
            style={styles.dropdownstyle}
            data={singleOrGroup}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={isSingle}
            onFocus={() => setIsSingleFocus(true)}
            onBlur={() => setIsSingleFocus(false)}
            onChange={item => {
              setIsSingle(item.value);
              setIsSingleFocus(false);
            }}
          />
        </View>
        {isSingle === 'Group' && (
          <View
            style={{
              width: '90%',
              height: '15%',
              marginTop: 10,
              marginLeft: 20,
            }}>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt}>No. of Men</Text>
              </View>
              <View style={styles.right}>
                <TextInput
                  style={styles.num}
                  keyboardType="numeric"
                  value={men}
                  onChangeText={text => {
                    // Allow only numbers
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setMen(numericValue);
                  }}
                />
                 {
                  errType == 'MenCount' && (
                    <Text style={{color: 'red'}}>Please enter a valid number.</Text>
                  )
                }
              </View>
            </View>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt}>No. of Women</Text>
              </View>
              <View style={styles.right}>
                <TextInput
                  style={styles.num}
                  keyboardType="numeric"
                  value={women}
                  onChangeText={text => {
                    // Allow only numbers
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setWomen(numericValue);
                  }}
                />
                {
                  errType == 'WomenCount' && (
                    <Text style={{color: 'red'}}>Please enter a valid number.</Text>
                  )
                }
              </View>
            </View>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt}>No. of Boys</Text>
              </View>
              <View style={styles.right}>
                <TextInput
                  style={styles.num}
                  keyboardType="numeric"
                  value={boys}
                  onChangeText={text => {
                    // Allow only numbers
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setBoys(numericValue);
                  }}
                />
              </View>
            </View>
            <View style={styles.single}>
              <View style={styles.left}>
                <Text style={styles.singleTxt}>No. of Girls</Text>
              </View>
              <View style={styles.right}>
                <TextInput
                  style={styles.num}
                  keyboardType="numeric"
                  value={girls}
                  onChangeText={text => {
                    // Allow only numbers
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setGirls(numericValue);
                  }}
                />
              </View>
            </View>
          </View>
        )}

        {/* <View style={styles.v}>
          <Text style={styles.txt}>
            Is the guest being invited to your Home or Office
          </Text>
          <Dropdown
            style={styles.dropdownstyle}
            data={homeOrOffice}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={isHome}
            onFocus={() => setIsHomeFocus(true)}
            onBlur={() => setIsHomeFocus(false)}
            onChange={item => {
              setIsHome(item.value);
              setIsHomeFocus(false);
            }}
            
          />
        </View> This is the dropdown to edit to Home or Office, the thought for future implementation of this is to only show this dropdown
 if the user is both an employee and a resident. */}

        <View style={styles.v}>
          <Text style={styles.txt}>Place of visit:</Text>
          <TextInput
            style={styles.dropdownstyle}
            value={isHome}
            editable={false}
          />
        </View>

        <View style={styles.v}>
          <Text style={styles.txt}>Guest Category</Text>
          <Dropdown
            style={styles.dropdownstyle}
            data={guestCategory}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isCategoryFocus ? 'Select Category' : '...'}
            value={category}
            onFocus={() => setIsCategoryFocus(true)}
            onBlur={() => setIsCategoryFocus(false)}
            onChange={item => {
              setCategory(item.value);
              setIsCategoryFocus(false);
            }}
          />
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Priority</Text>
          <Dropdown
            style={styles.dropdownstyle}
            data={guestPriority}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={priority}
            onFocus={() => setIsPriorityFocus(true)}
            onBlur={() => setIsPriorityFocus(false)}
            placeholder={!isPriorityFocus ? 'Select priority' : ''}
            onChange={item => {
              setPriority(item.value);
              setIsPriorityFocus(false);
            }}
          />
        </View>
        <View style={styles.v}>
          <Text style={styles.txt}>Remark</Text>
          <TextInput
            style={{
              height: 100,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 6,
              padding: 10,
            }} 
            multiline={true}
            value={remarks}
            onChangeText={txt => setRemarks(txt)}
          />
        </View>

        <View style={styles.v}>
        <Text style={styles.txt}>Vehicle Information</Text>
        </View>
       
        <View style={styles.v1}>
          <View style={styles.vehicle}>
            <Text>Vehicle type</Text>
            <Text>Vehicle Number</Text>
          </View>
          {vehicles.map((vehicle, index) => (
            <View style={{flexDirection: 'column', width: 350}}>
              <View key={index} style={styles.newvehicle}>
                <Picker
                  selectedValue={vehicle.Vehicle_Type}
                  style={styles.picker}
                  onValueChange={value =>
                    handleTextChange(index, 'Vehicle_Type', value)
                  }>
                  <Picker.Item label="Select" value="" />
                  <Picker.Item label="2-Wheeler" value="2-Wheeler" />
                  <Picker.Item label="Car" value="Car" />
                  <Picker.Item label="Bus" value="Bus" />
                  <Picker.Item label="Taxi" value="Taxi" />
                  <Picker.Item label="School Bus" value="School Bus" />
                  <Picker.Item label="Police Van" value="Police Van" />
                  <Picker.Item label="Van" value="Van" />
                  <Picker.Item label="Auto" value="Auto" />
                  <Picker.Item label="Ambulance" value="Ambulancer" />
                  <Picker.Item label="Truck" value="Truck" />
                  <Picker.Item label="Tractor" value="Tractor" />
                  <Picker.Item label="Cement Mixer" value="Cement Mixer" />
                  <Picker.Item label="Fire Engine" value="Fire Engine" />
                  <Picker.Item label="Transport Van" value="Transport Van" />
                  <Picker.Item label="Bulldozer" value="Bulldozer" />
                  <Picker.Item label="Roller Machine" value="Roller Machine" />
                  {/* Add more vehicle types as needed */}
                </Picker>
                <TextInput
                  style={styles.vehicleinput}
                  value={vehicle.Vehicle_Number}
                  placeholder="KA 01 AB 1234"
                  placeholderTextColor="#c5c7ca"
                  onChangeText={text => handleTextChange(index, 'Vehicle_Number', text )}
                  autoCapitalize='characters'
                />
                <TouchableOpacity onPress={() => handleRemoveVehicle(index)}>
                  <Image
                    source={require('../../assets/delete.png')}
                    style={styles.removeButton}
                  />
                </TouchableOpacity>
              </View>
              {vehicleErrorMessages[vehicle.ID] && (
                <Text style={[styles.errorText, {paddingLeft: 30}]}>
                  {vehicleErrorMessages[vehicle.ID]}
                </Text>
              )}
            </View>
          ))}
          {addNewButtonVisibility && (
            <TouchableOpacity
              style={styles.addvehicle}
              onPress={handleAddVehicle}>
              <Image
                source={require('../../assets/add.png')}
                style={{width: 15, height: 15}}
              />
              <Text style={{color: 'black', fontSize: 15}}>Add New</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* <View style={styles.btnRoot}>
          {!updateLoading ? (
            <TouchableOpacity
              style={styles.save}
              onPress={onSave}
              disabled={updateLoading} // Disable the button when loading
            >
              <View style={styles.btn}>
                <Text style={styles.btnsave}>Update</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.save}>
              <Text style={styles.btnsave}>Uploading{dots}</Text>
            </View>
          )}
        </View> */}

        <View style={styles.btnRoot}>
          <TouchableOpacity
            style={styles.save}
            onPress={onSave}
            disabled={updateLoading} // Disable the button when loading
          >
            <Text style={styles.btnsave}>Update</Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="fade"
          visible={updateLoading}
          onRequestClose={() => {}}>
          <View style={styles.modalBackground}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </Modal>
      </ScrollView>
      <Dialog.Container
        visible={DialogVisible}
        contentStyle={styles.detailsNotEditableDialogue}>
        <Dialog.Title style={styles.detailsNotEditableTitle}>
          Visitor just got L2 approved
        </Dialog.Title>
        <Dialog.Description>
          Please fill another form for new details
        </Dialog.Description>
        <Dialog.Button label="Ok" onPress={onPressOk} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

export default EditVerifyDetails;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },

  vehicle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    marginHorizontal: 15,
    height: 30,
    borderRadius: 10,
  },
  addvehicle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
  },
  newvehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    borderColor: '#B21E2B',
    borderWidth: 1,
    height: 50,
    marginHorizontal: 20,
  },
  picker: {
    flex: 1,
    height: 40,
    paddingRight: 60,
    // marginRight: -10,
  },
  vehicleinput: {
    flex: 1,
    height: 40,
    width: '100%'
  },

  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
    width: 20,
    height: 20,
  },
  header: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#1F2024',
    marginBottom: 24,
  },

  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 10,
  },
  headertxt: {
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdownstyle: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#FFF',
    borderColor: 'gray',
    height: 48,
    fontSize: 14,
  },
  inputtxt: {
    height: 48,
    marginTop: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    paddingLeft: 10,
    fontSize: 16,
  },
  v: {
    marginLeft: 20,
    marginBottom: 10,
    marginRight: 20,
  },
  v1:{
    marginLeft: 8,
    marginBottom: 10,
    marginRight: 0,
  },
  txt: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '700',
    marginBottom: 6,
    color: '#2F3036',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  save: {
    marginRight: 10,
    backgroundColor: '#b21e2b',
    width: 140,
    height: 40,
    borderRadius: 10,
  },
  cancel: {
    marginLeft: 10,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnsave: {
    width: 135,
    height: 40,
    textAlign: 'center',
    paddingTop: 5,
    borderRadius: 8,
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
  single: {
    flexDirection: 'row',
    marginHorizontal: 25,
  },
  left: {
    width: '60%',
  },
  right: {
    width: '40%',
  },
  num: {
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: 'gray',
    borderRadius: 6,
    paddingLeft: 10,
    marginVertical: 5,
    height: 35,
  },
  singleTxt: {
    marginVertical: 5,
    fontSize: 16,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '700',
    marginBottom: 6,
    color: '#2F3036',
  },

  btnRoot: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 80,
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
    backgroundColor: '#FFFF',
    borderColor: 'gray',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: '#b21e2b',
  },

  detailsNotEditableDialogue: {
    borderRadius: 30,
    backgroundColor: 'pink',
  },

  detailsNotEditableTitle: {
    fontWeight: 'bold',
  },
});

const mediumScreen = StyleSheet.create({
  UpdatingActivityIndicatorContainer: {
    top: 35,
    backgroundColor: '#b21e2b',
    zIndex: 1,
    borderRadius: 40,
    width: 300,
    right: -30,
    elevation: 5,
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
});

const smallScreen = StyleSheet.create({
  UpdatingActivityIndicatorContainer: {
    top: 35,
    backgroundColor: '#b21e2b',
    zIndex: 1,
    borderRadius: 40,
    right: -30,
    width: 350,
    elevation: 5,
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
});

const normalScreen = StyleSheet.create({
  UpdatingActivityIndicatorContainer: {
    top: 35,
    backgroundColor: '#b21e2b',
    zIndex: 1,
    borderRadius: 40,
    width: 350,
    right: -42,
    elevation: 5,
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
});