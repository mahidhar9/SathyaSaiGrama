import React, {useState, useContext, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  // TouchableOpacity,
  Pressable,
  ScrollView,
  LogBox,
  TouchableWithoutFeedback,
  Button,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';

import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {encode} from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import {getToday, getFormatedDate} from 'react-native-modern-datepicker';
import PhoneInput from 'react-native-phone-number-input';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import UserContext from '../../context/UserContext';
import {Dropdown} from 'react-native-element-dropdown';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME} from '@env';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import {captureRef} from 'react-native-view-shot';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

import SentForApproval from './SentForApproval';
import {updateRecord} from './approval/VerifyDetails';
import {isJSDocCommentContainingNode} from 'typescript';
import dayjs from 'dayjs';
import {CalendarList} from 'react-native-calendars';
LogBox.ignoreLogs(['Warnings...']);
LogBox.ignoreAllLogs();
const FillByYourSelf = ({navigation}) => {
  const {height} = Dimensions.get('window');
  const [prefix, setPrefix] = useState(' ');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [men, setMen] = useState('0');
  const [women, setWomen] = useState('0');
  const [boys, setBoys] = useState('0');
  const [girls, setGirls] = useState('0');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSG, setSelectedSG] = useState('');

  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  // const [RES_ID, setRES_ID] = useState('');
  const [guestCategory, setGuestCategory] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [focus, setFocus] = useState(false);
  const [priority, setPriority] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [isVehicle, setIsVehicle] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  //just so that the othe code gets commited can delete after

  const [vehicles, setVehicles] = useState([]);
  const [vehicleErrorMessages, setVehicleErrorMessages] = useState({});
  // Regex format for vehicle number like 'KA 01 CU 1234'
  const vehicleNumberPattern = /^[a-z]{2}[0-9]{2}[a-z]{2}[0-9]{4}$/;
  let selectedHomeOffice = '';

  const {
    getAccessToken,
    loggedUser,
    testResident,
    accessToken,
    setApproveDataFetched,
  } = useContext(UserContext);
  if (loggedUser.resident === true && loggedUser.employee === true) {
    selectedHomeOffice = '';
  } else if (loggedUser.resident === true && loggedUser.employee === false) {
    selectedHomeOffice = 'Home';
  } else if (loggedUser.resident === false && loggedUser.employee === true) {
    selectedHomeOffice = 'Office';
  }

  const [selectedHO, setSelectedHO] = useState(selectedHomeOffice);
  const [date, setDate] = useState('Select Date');

  const [showModal, setShowModal] = useState(false);
  const L1ID = loggedUser.userId;
  console.log('L1ID', L1ID);
  const minDate = dayjs().format('YYYY-MM-DD');
  const maxDate = dayjs().add(6, 'month').format('YYYY-MM-DD');

  const startMonth = dayjs(minDate).month();
  const endMonth = dayjs(maxDate).month();
  const [visitingMonth, setVisitingMonth] = useState(startMonth);

  const convertDateFormat = date => {
    return date === 'Select Date'
      ? 'Select Date'
      : dayjs(date).format('DD-MMM-YYYY');
  };
  const onDayPress = day => {
    if (day.dateString >= minDate && day.dateString <= maxDate) {
      setDate(day.dateString);
      setShowModal(false); // Close calendar after selecting a date
      setDateOfVisitErr(null); // Clear any error
      const monthNumber = dayjs(day.dateString).month();
      setVisitingMonth(monthNumber); // Update the visiting month
      console.log('Visiting month (number format):', monthNumber); // Log the visiting month
    }

    // const today = new Date();

    // const startDate = getFormatedDate(
    //   today.setDate(today.getDate()),
    //   'YYYY/MM/DD',
    // );
    // const addDaysToDate = (dateString, daysToAdd) => {
    //   // Convert the input string (YYYY/MM/DD) into a Date object
    //   const [year, month, day] = dateString.split('/'); // Split the string by '/'
    //   const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

    //   // Add the specified number of days (60 days in this case)
    //   date.setDate(date.getDate() + daysToAdd);

    //   // Format the new date back to 'YYYY/MM/DD'
    //   const newYear = date.getFullYear();
    //   const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    //   const newDay = String(date.getDate()).padStart(2, '0');

    //   return `${newYear}/${newMonth}/${newDay}`;
    // };
  };
  // const endDate = addDaysToDate(startDate, 60);
  // console.log('endDate', endDate);
  const approvalToVisitorID = useRef(null);
  const viewRef = useRef();
  const [code, setCode] = useState('');
  const [codeReload, setcodeReload] = useState(false);
  const codeGenrator = () => {
    const newCode = Math.floor(
      100000 + Math.random() * (999999 - 100001 + 1),
    ).toString();
    setCode(newCode);
  };
  const options = ['Male', 'Female'];
  const singleorgroup = ['Single', 'Group'];
  const homeoroffice = ['Home', 'Office'];

  // const handleDateChange = selectedDate => {
  //   const formatteddate = moment(selectedDate, 'YYYY-MM-DD').format(
  //     'DD-MMM-YYYY',
  //   );
  //   setDate(formatteddate);
  //   setShowModal(!showModal); //Date Picker
  //   setDateOfVisitErr(null);
  // };

  let pastScrollRange = 0;
  let futureScrollRange = 6;
  let MonthNumberCount = visitingMonth;
  console.log('Count', MonthNumberCount);
  console.log('Visiting month:', visitingMonth); // Log the visiting month state
  pastScrollRange =
    MonthNumberCount >= startMonth
      ? MonthNumberCount - startMonth
      : MonthNumberCount + 12 - startMonth;
  futureScrollRange =
    endMonth >= MonthNumberCount
      ? endMonth - MonthNumberCount
      : endMonth + 12 - MonthNumberCount;

  const prefixValues = [
    {label: 'Mr.', value: 'Mr.'},
    {label: 'Mrs.', value: 'Mrs.'},
    {label: 'Ms.', value: 'Ms.'},
    {label: 'Dr.', value: 'Dr.'},
    {label: 'Prof.', value: 'Peof.'},
    {label: 'Rtn.', value: 'Rtn.'},
    {label: 'Sri', value: 'Sri.'},
    {label: 'Smt.', value: 'Smt.'},
  ];
  const guestCategoryValues = [
    {label: 'Govt Officials', value: 'Govt Officials'},
    {label: 'Politician', value: 'Politician'},
    {label: 'Corporate', value: 'Corporate'},
    {label: 'Press', value: 'Press'},
    {label: 'Parent', value: 'Parent'},
    {label: 'Devotee', value: 'Devotee'},
    {label: 'Guest', value: 'Guest'},
    {label: 'Staff', value: 'Staff'},
    {label: 'Student', value: 'Student'},
    {label: 'Intern', value: 'Intern'},
    {label: 'Other', value: 'Other'},
  ];
  const priorityValues = [
    {label: 'P1', value: 'P1'},
    {label: 'P2', value: 'P2'},
    {label: 'P3', value: 'P3'},
  ];
  const vehicleTypeValues = [
    {label: '2-wheeler', value: '2-wheeler'},
    {label: 'Car', value: 'Car'},
    {label: 'Bus', value: 'Bus'},
    {label: 'Taxi', value: 'Taxi'},
    {label: 'School Bus', value: 'School Bus'},
    {label: 'Police Van', value: 'Police Van'},
    {label: 'Ambulence', value: 'Ambulence'},
    {label: 'Van', value: 'Van'},
    {label: 'Auto', value: 'Auto'},
    {label: 'Truck', value: 'Truck'},
    {label: 'Tractor', value: 'Tractor'},
    {label: 'Cement Mixer', value: 'Cement Mixer'},
    {label: 'Fire Engine', value: 'Fire Engine'},
    {label: 'Transport Van', value: 'Transport Van'},
    {label: 'Bulldozer', value: 'Bulldozer'},
    {label: 'Roller Machine', value: 'Roller Machine'},
    {label: 'Other', value: 'Other'},
  ];

  let menCount = '0';
  let womenCount = '0';
  let boysCount = '0';
  let girlsCount = '0';

  const PasscodeUrl = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Passcode`;

  const payload = {
    data: {
      Passcode: code,
    },
  };

  const PasscodeData = async () => {
    setcodeReload(false);

    console.log('in PasscodeData function');
    try {
      console.log('inside try in passcode');
      const passcodeResponse = await fetch(PasscodeUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('after fetch in passcode');
      const responseData = await passcodeResponse.json();

      console.log('here is the passcode response', responseData);

      if (responseData.code === 3002) {
        console.log('Post of code was un-sucessfull');
        codeGenrator();
        setcodeReload(true);
      } else if (responseData.code === 3000) {
        console.log('code posted successfully to Zoho.');
        ScreenshotQR();
        setcodeReload(false);
      }

      console.log('Passcode data:', passcodeResponse);
    } catch (error) {
      console.log(error);
      return false;
    }
    return codeExsits;
  };

  //To get employee record
  const getEmpId = async () => {
    try {
      console.log('into getEmpId');
      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/All_Employees?criteria=App_User_lookup==${L1ID}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken  ${getAccessToken()}`,
        },
        params: {
          criteria: `App_User_lookup == ${L1ID}`,
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

  const posttoL1aprroved = async DepartmentID => {
    console.log('inside posttoL1aprroved');

    // const Vehicle_Info = await postVehicle();
    // let menCount = '0';
    // let womenCount = '0';
    if (selectedSG === 'Single') {
      if (selectedGender === 'Male') {
        console.log('Inside Single Male');
        menCount = '1';
        womenCount = '0';
      } else if (selectedGender === 'Female') {
        console.log('Inside Single Female');
        menCount = '0';
        womenCount = '1';
      }
    } else {
      menCount = men === '' ? '0' : men;
      womenCount = women === '' ? '0' : women;
    }
    const formData = {
      data: {
        Single_or_Group_Visit: selectedSG,
        L2_Approval_Status: 'PENDING APPROVAL',
        Name_field: {
          prefix: prefix,
          last_name: lastName,
          first_name: firstName,
        },
        Referrer_App_User_lookup: L1ID,
        Referrer_Approval: 'APPROVED',
        Department: DepartmentID,
        Phone_Number: formattedValue,
        Priority: priority,
        Date_of_Visit: convertDateFormat(date),
        Gender: selectedGender,
        Guest_Category: guestCategory,
        Number_of_Men: menCount,
        Number_of_Boys: boys,
        Number_of_Women: womenCount,
        Number_of_Girls: girls,
        Home_or_Office: selectedHO,
        Vehicle_Information: vehicles,
      },
    };

    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!form data',
      formData,
    );

    if (loggedUser.role === 'L2') {
      if (
        (selectedHO === 'Home' &&
          (loggedUser.deptIds.includes('3318254000027832015') ||
            loggedUser.deptIds.includes('3318254000031368009'))) ||
        selectedHO === 'Office'
      ) {
        console.log('just before changing the L2 Approval status');
        formData.data.L2_Approval_Status = 'APPROVED';
        console.log(
          'L2 approval status changed in formData',
          formData.data.L2_Approval_Status,
        );
      }
    }

    try {
      const response = await fetch(
        `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Approval_to_Visitor`,
        {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
          },
          body: JSON.stringify(formData),
        },
      );
      const res = await response.json();
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', res);
      const photoUploadRes = await uploadPhoto(
        res.data.ID,
        'Approval_to_Visitor_Report',
      );
      console.log('', photoUploadRes);
      return res;
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const postToVisitorDetails = async () => {
    const formData = {
      data: {
        Name_field: {
          prefix: prefix,
          last_name: lastName,
          first_name: firstName,
        },
        Phone_Number: formattedValue,
        Gender: selectedGender,
        Added_by_App_user_lookup: L1ID,
      },
    };

    try {
      const response = await fetch(
        `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/form/Visitor_Details`,
        {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${getAccessToken()}`,
          },
          body: JSON.stringify(formData),
        },
      );
      const res = await response.json();
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', res);
      await uploadPhoto(res.data.ID, 'All_Visitor_Details');
      return res;
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleAddVehicle = () => {
    setVehicles([
      ...vehicles,
      {Vehicle_Type: '', Vehicle_Number: '', ID: Date.now()}, //Date now is used to create a unique id for each vehicle row
    ]);
  };

  const handleRemoveVehicle = index => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
  };
  //  Function to handle vehicle number change
  const handleTextChange = (index, field, value) => {
    const updatedVehicles = vehicles.map((vehicle, i) =>
      i === index ? {...vehicle, [field]: value} : vehicle,
    );
    setVehicles(updatedVehicles);
  };

  // Function to select an image
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        const {uri, type, fileName} = response.assets[0];
        setImage({uri, type, name: fileName});
        setImageUri(uri); // For displaying the image preview
      }
    });
  };

  // Function to remove the selected image
  const removeImage = () => {
    setImage(null);
    setImageUri(null); // Clear the image preview
  };

  // Function to upload Photo
  const uploadPhoto = async (rec_id, report) => {
    //To upload Photo
    if (image) {
      const imgFormData = new FormData();
      imgFormData.append('file', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });

      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/${report}/${rec_id}/Photo/upload`;
      console.log('Photo Upload', url);
      const imgResponse = await fetch(url, {
        method: 'POST',
        body: imgFormData,
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Photo posting response', imgResponse);
    }
  };

  const [nameErr, setNameErr] = useState(null);
  const [dateOfVisitErr, setDateOfVisitErr] = useState(null);
  const [singleOrGroupErr, setSingleOrGroupErr] = useState(null);
  const [homeOrOfficeErr, setHomeOrOfficeErr] = useState(null);
  const [genderErr, setGenderErr] = useState(null);
  const [phoneErr, setPhoneErr] = useState(null);
  const [phoneValidErr, setPhoneValidErr] = useState(null);
  const [submitFlag, setSubmitFlag] = useState(false);

  const validatePhoneNumber = () => {
    if (!formattedValue) {
      setPhoneErr('Phone number is required');
      setPhoneValidErr(null);
    } else {
      setPhoneErr(null);
      const parsedPhoneNumber = parsePhoneNumberFromString(formattedValue);
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        setPhoneValidErr('Invalid phone number');
      } else {
        setPhoneValidErr(null);
      }
    }
  };

  useEffect(() => {
    if (submitFlag) {
      validatePhoneNumber();
    }
  }, [formattedValue]);

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

    if (
      prefix.trim() === '' ||
      firstName.trim() === '' ||
      lastName.trim() === ''
    ) {
      console.log('inside name null validation');
      setNameErr('Prefix, First Name and Last Name are required');
      valid = false;
    } else {
      if (
        !validateInput(firstName, setNameErr) ||
        !validateInput(lastName, setNameErr)
      ) {
        // setNameErr('Prefix, First Name and Last Name are required');
        // Alert.alert('Error', '20 letters Only letters are allowed in the name field ');
        console.log('inside !validateInput');
        valid = false;
      } else {
        setNameErr(null);
      }
    }

    // const isDateWithinTwoMonths = selectedDate => {
    //   const currentDate = new Date(); // Get current date

    //   // Create a date 2 months from today
    //   const twoMonthsLater = new Date();
    //   twoMonthsLater.setMonth(currentDate.getDate() + 1);

    //   // Compare the selected date with the date 2 months later
    //   return selectedDate <= twoMonthsLater;
    // };
    if (date === 'Select Date') {
      setDateOfVisitErr('Date of visit is required');
      console.log('inside Select Date');
      valid = false;
    } else {
      // if (!isDateWithinTwoMonths(date)) {
      //   setDateOfVisitErr('Please select a date within 2 months from today');
      //   console.log('inside 2 months from today');
      //   valid = false;
      // }
      setDateOfVisitErr(null);
    }

    if (!formattedValue) {
      setPhoneErr('Phone number is required');
      console.log('inside !formattedValue');
      valid = false;
    } else {
      setPhoneErr(null);
      const parsedPhoneNumber = parsePhoneNumberFromString(formattedValue);
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        setPhoneValidErr('Invalid phone number');
        console.log('invalid phone number');
        valid = false;
      } else {
        setPhoneValidErr(null);
      }
    }

    if (!selectedSG) {
      console.log('inside !selectedSG', selectedSG);
      setSingleOrGroupErr('Single or Group is required');
      valid = false;
    } else {
      // setSingleOrGroupErr(null);
      if (
        selectedSG === 'Group' &&
        menCount === '0' &&
        womenCount === '0' &&
        boysCount === '0' &&
        girlsCount === '0'
      ) {
        setSingleOrGroupErr('Total No. of people cannot be 0');
        console.log('inside Total No. of people cannot be 0');
        valid = false;
      } else {
        setSingleOrGroupErr(null);
      }
    }
    console.log('selectedHO', selectedHO);
    if (!selectedHO) {
      console.log('inside !selectedHO', selectedHO);
      setHomeOrOfficeErr('Home or Office is required');
      valid = false;
    } else {
      setHomeOrOfficeErr(null);
    }

    if (!selectedGender) {
      console.log('inside !selectedGender', selectedGender);
      setGenderErr('Gender is required');
      if (selectedGender === 'Male') {
        setMen('1');
        setWomen('0');
      } else if (selectedGender === 'Female') {
        setWomen('1');
        setMen('0');
      }
      valid = false;
    } else {
      setGenderErr(null);
    }
    const errors = {};

    vehicles.forEach((vehicle, index) => {
      const vehicleNumber = vehicle.Vehicle_Number;
      if (
        !vehicleNumberPattern.test(
          vehicleNumber.replace(/\s+/g, '').toLowerCase(),
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
          vehicleNumber.replace(/\s+/g, '').toLowerCase(),
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

  const handleSubmit = async () => {
    console.log('##########vehicles are: ', vehicles);
    setSubmitFlag(true);
    if (validateForm()) {
      setIsSubmitted(true);
      let office_id;

      if (selectedHO === 'Home') {
        office_id = '3318254000027832015';
        if (testResident) {
          office_id = '3318254000031368009';
        }
        console.log('In Home conditional block');
      } else {
        const empId = await getEmpId();
        console.log(empId);
        office_id = empId.data[0].Office_lookup.ID;
      }

      try {
        const rese = await posttoL1aprroved(office_id);
        console.log('Response of posting to Approval_to_Visitor_Report', rese);
        approvalToVisitorID.current = rese.data.ID;
        const responseFromVisitorDetails = await postToVisitorDetails();
        console.log('responseFromVisitorDetails', responseFromVisitorDetails);
        if (loggedUser.role === 'L2') {
          PasscodeData();
        } else if (loggedUser.role === 'L1') {
          navigation.navigate('Invite');
        }
      } catch (err) {
        Alert.alert(err);
      }
      // Add form submission logic here
    }
  };

  const handleReset = () => {
    // setBoys('0');
    // setWomen('0');
    // setMen('0');
    // setGirls('0');
    // setPrefix(' ');
    // setDate('Select Date');
    // setSelectedGender('');
    // setSelectedHO('');
    // setSelectedSG('');
    // setLastName('');
    // setFirstName('');
    // setValue('');
    // setImage(null);
    // setGuestCategory('');
    // setPriority('');
    // setVehicleType('');
    // setVehicleNumber('');
    // setIsVehicle(false);
    // setIsFocus(false);
    // setFocus(false);
    // setNameErr(null);
    // setDateOfVisitErr(null);
    // setPhoneErr(null);
    // setSingleOrGroupErr(null);
    // setHomeOrOfficeErr(null);
    // setGenderErr(null);
    // setPhoneValidErr(null);
    navigation.navigate('Invite');
  };
  let heightStyles;
  if (height > 900) {
    heightStyles = normalScreen;
  } else if (height > 750) {
    heightStyles = mediumScreen;
  } else {
    heightStyles = smallScreen;
  }

  const ScreenshotQR = async () => {
    if (!codeReload) {
      return;
    }
    try {
      console.log('capturing view.......');
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      console.log('view captured Uri:', uri);

      // if (!uri){throw new Error('failed to capture, uri is undefined or null');
      // }

      let base64Data = '';
      if (uri.startsWith('data:image/png;base64,')) {
        base64Data = uri.split('data:image/png;base64,')[1];
      } else if (uri.startsWith('file://')) {
        base64Data = await RNFS.readFile(uri, 'base64');
      } else {
        throw new Error(`Unexpected URI format: ${uri}`);
      }

      console.log('extracted base 64 data:', base64Data.length);

      if (!base64Data) {
        throw new Error('failed to extract base64 Data from URI');
      }

      const postData = new FormData();
      postData.append('file', {
        uri: `data:image/png;base64, ${base64Data}`,
        name: 'qrcode.png',
        type: 'image/png',
      });

      const payload = {
        data: {
          Generated_Passcode: code,
        },
      };

      const url1 = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${approvalToVisitorID.current}`;
      console.log(url1);
      const response1 = await fetch(
        url1,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
        console.log('posting to zoho....'),
      );
      if (response1.ok) {
        console.log('code posted successfully to Zoho.');
        console.log('response', response1);
      } else {
        console.log(
          'Failed to post code to Zoho:',
          response1.status,
          response1.statusText,
          response1.ok,
        );
      }

      const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${approvalToVisitorID.current}/Generated_QR_Code/upload`;
      console.log(url);
      const response = await fetch(
        url,
        {
          method: 'POST',
          body: postData,
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
        console.log('posting to zoho....'),
      );

      if (response.ok) {
        console.log('Image uploaded successfully to Zoho.');
        setIsSubmitted(false);
        setApproveDataFetched(false);
        navigation.navigate('FooterTab', {
          screen: 'AppApproveStack',
          params: {
            screen: 'ApprovalStack',
            params: {
              screen: 'ApprovalTab',
              params: {
                screen: 'Approved',
              },
            },
          },
        });
      } else {
        console.log(
          'Failed to upload image to Zoho:',
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error capturing and uploading QR code:', error);
    }
  };

  useEffect(() => {
    if (codeReload === true) {
      PasscodeData();
    }
  }, [codeReload]);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const validateInput = (txt, setError) => {
    if (/^[a-zA-Z\s]{1,20}$/.test(txt) || txt === '') {
      setError(''); // Clear error on valid input
      return true; // Valid input
    } else {
      setError('20 letters only are allowed');
      return false; // Invalid input
    }
  };

  const handleFirstNameChange = txt => {
    setFirstName(txt);
    validateInput(txt, setFirstNameError);
  };

  const handleLastNameChange = txt => {
    setLastName(txt);
    validateInput(txt, setLastNameError);
  };
  let addNewButtonVisibility;
  if (
    (selectedSG === 'Group' && vehicles.length < 5) ||
    (selectedSG === 'Single' && vehicles.length < 1)
  ) {
    addNewButtonVisibility = true;
  } else {
    addNewButtonVisibility = false;
  }
  return (
    <>
      {isSubmitted ? (
        <SentForApproval style={{zIndex: 1}} />
      ) : (
        <SafeAreaView style={styles.container}>
          <GestureHandlerRootView>
            <ScrollView style={{paddingStart: 8}}>
              <View>
                <View style={styles.namecontainer}>
                  <Text style={[styles.label, {marginTop: 20}]}>
                    Name <Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Dropdown
                      style={[styles.dropdown, {width: '25%'}]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={prefixValues}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select' : '...'}
                      searchPlaceholder="Search..."
                      value={prefix}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        if (submitFlag) {
                          validateForm();
                        }
                        setPrefix(item.value);
                        setIsFocus(false);
                      }}
                    />

                    <TextInput
                      style={[
                        styles.dropdown,
                        {width: '32%', color: '#71727A'},
                        styles.input,
                      ]}
                      value={firstName}
                      onChangeText={txt => {
                        handleFirstNameChange(txt);
                        if (firstName) {
                          setFirstName(txt);
                        }
                      }}
                      selectionColor={'#B21E2B'}
                    />

                    <TextInput
                      style={[
                        styles.dropdown,
                        {width: '30%', color: '#71727A'},
                      ]}
                      value={lastName}
                      onChangeText={txt => {
                        handleLastNameChange(txt);
                        if (submitFlag && lastName) {
                          setLastName(txt);
                          validateForm();
                        }
                      }}
                      selectionColor={'#B21E2B'}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <Text style={[styles.bottomtext, {marginRight: 75}]}>
                      Prefix
                    </Text>

                    <Text style={[styles.bottomtext, {marginRight: 72}]}>
                      First Name
                    </Text>

                    <Text style={styles.bottomtext}>Last Name</Text>
                  </View>
                  {nameErr && <Text style={styles.errorText}>{nameErr}</Text>}
                  {firstNameError && lastNameError ? (
                    <Text style={styles.errorText}>{firstNameError}</Text>
                  ) : firstNameError || lastNameError ? (
                    <Text style={styles.errorText}>
                      {firstNameError + lastNameError}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.namecontainer}>
                  <Text style={styles.label}>
                    Phone <Text style={{color: 'red'}}>*</Text>
                  </Text>

                  <PhoneInput
                    defaultValue={value}
                    defaultCode="IN"
                    layout="first"
                    containerStyle={styles.phoneInputContainer}
                    textContainerStyle={styles.textContainer}
                    flagButtonStyle={styles.flagButton}
                    codeTextStyle={styles.codeText}
                    onChangeText={text => {
                      setPhoneNumber(text);
                      if (submitFlag) {
                        validateForm();
                      }
                    }}
                    onChangeFormattedText={text => {
                      setFormattedValue(text);
                    }}
                    countryPickerProps={{withAlphaFilter: true}}
                    disabled={false}
                    withDarkTheme
                    withShadow
                  />
                  {phoneErr && <Text style={styles.errorText}>{phoneErr}</Text>}
                  {phoneValidErr && (
                    <Text style={styles.errorText}>{phoneValidErr}</Text>
                  )}
                </View>
                <View style={styles.namecontainer}>
                  <Text style={styles.label}>
                    Date of Visit <Text style={{color: 'red'}}>*</Text>
                  </Text>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      onPress={() => {
                        console.log('clicked on date of visit field input');
                        setShowModal(true);
                      }}>
                      <TextInput
                        style={[
                          styles.phoneInputContainer,
                          {paddingLeft: 12, color: '#71727A'},
                        ]}
                        value={convertDateFormat(date)}
                        editable={false}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Pressable
                      onPress={() => {
                        console.log('clicked on date of visit field input');
                        setShowModal(true);
                      }}>
                      <TextInput
                        style={[
                          styles.phoneInputContainer,
                          {paddingLeft: 12, color: '#71727A'},
                        ]}
                        value={convertDateFormat(date)}
                        editable={false}
                      />
                    </Pressable>
                  )}
                  {/* <TouchableWithoutFeedback
                    onPress={() => {
                      console.log('clicked on date of visit field input');
                      setShowModal(true);
                    }}>
                    <TextInput
                      style={[
                        styles.phoneInputContainer,
                        {paddingLeft: 12, color: '#71727A'},
                      ]}
                      value={convertDateFormat(date)}
                      editable={false}
                    />
                  </TouchableWithoutFeedback> */}
                  {dateOfVisitErr && (
                    <Text style={styles.errorText}>{dateOfVisitErr}</Text>
                  )}
                  <Modal
                    animationType="none"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setShowModal(false);
                      }}>
                      <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                          <View style={styles.modalView}>
                            <CalendarList
                              style={{width: '90%'}}
                              current={date === 'Select Date' ? minDate : date}
                              minDate={minDate}
                              maxDate={maxDate}
                              pastScrollRange={pastScrollRange}
                              futureScrollRange={futureScrollRange}
                              scrollEnabled={true}
                              onDayPress={onDayPress}
                              markedDates={{
                                [date]: {
                                  selected: true,
                                  selectedColor: '#B21E2B',
                                },
                              }}
                              theme={{
                                textSectionTitleColor: '#000',
                                selectedDayBackgroundColor: '#B21E2B',
                                todayTextColor: '#FFBE65',
                                dayTextColor: '#2d4150',
                                agendaKnobColor: '#B21E2B',
                                arrowColor: '#FFBE65',
                              }}
                              showScrollIndicator={true}
                            />
                            {/* <DatePicker
                          mode="calendar"
                          minimumDate={startDate}
                          maximumDate={endDate}
                          onSelectedChange={handleDateChange}
                          options={{
                            backgroundColor: 'white',
                            textHeaderColor: '#B21E2b',
                            textDefaultColor: '#333',
                            selectedTextColor: '#B21E2b',
                            mainColor: 'white',
                            textSecondaryColor: 'black',
                            borderColor: '#B21E2B',
                          }}
                        /> */}
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>
                <View style={styles.namecontainer}>
                  <Text style={styles.label}>
                    Single or Group Visit <Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View style={styles.radioButtonContainer}>
                    {singleorgroup.map(optionss => {
                      return (
                        <TouchableOpacity
                          key={optionss}
                          style={styles.singleOptionContainer}
                          onPress={() => {
                            setSelectedSG(optionss);
                            setSingleOrGroupErr(null);
                          }}>
                          <View style={styles.outerCircle}>
                            {selectedSG === optionss ? (
                              <View style={styles.innerCircle} />
                            ) : null}
                          </View>
                          <Text style={{marginLeft: 10}}>{optionss}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {singleOrGroupErr && (
                    <Text style={styles.errorText}>{singleOrGroupErr}</Text>
                  )}
                </View>
                {selectedSG === 'Group' ? (
                  <View>
                    <View style={styles.namecontainer}>
                      <Text style={styles.label}>
                        Number of Men <Text style={{color: 'red'}}>*</Text>
                      </Text>
                      <TextInput
                        style={[styles.phoneInputContainer, {paddingLeft: 15}]}
                        keyboardType="numeric"
                        value={men}
                        onChangeText={text => {
                          // Allow only numbers
                          const numericValue = text.replace(/[^0-9]/g, '');
                          setMen(numericValue);
                        }}
                        selectionColor="#B21E2B"
                      />
                    </View>

                    <View style={styles.namecontainer}>
                      <Text style={styles.label}>
                        Number of Women <Text style={{color: 'red'}}>*</Text>
                      </Text>
                      <TextInput
                        style={[styles.phoneInputContainer, {paddingLeft: 15}]}
                        keyboardType="numeric"
                        value={women}
                        onChangeText={text => {
                          // Allow only numbers
                          const numericValue = text.replace(/[^0-9]/g, '');
                          setWomen(numericValue);
                        }}
                        selectionColor="#B21E2B"
                      />
                    </View>
                    <View style={styles.namecontainer}>
                      <Text style={styles.label}>
                        Number of Boys <Text style={{color: 'red'}}>*</Text>
                      </Text>
                      <TextInput
                        style={[styles.phoneInputContainer, {paddingLeft: 15}]}
                        keyboardType="numeric"
                        value={boys}
                        onChangeText={text => {
                          // Allow only numbers
                          const numericValue = text.replace(/[^0-9]/g, '');
                          setBoys(numericValue);
                        }}
                        selectionColor="#B21E2B"
                      />
                    </View>
                    <View style={styles.namecontainer}>
                      <Text style={styles.label}>
                        Number of Girls <Text style={{color: 'red'}}>*</Text>
                      </Text>
                      <TextInput
                        style={[styles.phoneInputContainer, {paddingLeft: 15}]}
                        keyboardType="numeric"
                        value={girls}
                        onChangeText={text => {
                          // Allow only numbers
                          const numericValue = text.replace(/[^0-9]/g, '');
                          setGirls(numericValue);
                        }}
                        selectionColor="#B21E2B"
                      />
                    </View>
                  </View>
                ) : null}
                {loggedUser.resident === true &&
                loggedUser.employee === true ? (
                  <View style={styles.namecontainer}>
                    <Text style={styles.label}>
                      Is the Guest being invited to Home or Office
                      <Text style={{color: 'red'}}> *</Text>
                    </Text>
                    <View style={styles.radioButtonContainer}>
                      {homeoroffice.map(option => {
                        return (
                          <TouchableOpacity
                            key={option}
                            style={styles.singleOptionContainer}
                            onPress={() => {
                              setSelectedHO(option);
                              setHomeOrOfficeErr(null);
                            }}>
                            <View style={styles.outerCircle}>
                              {selectedHO === option ? (
                                <View style={styles.innerCircle} />
                              ) : null}
                            </View>
                            <Text style={{marginLeft: 10}}>{option}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {homeOrOfficeErr && (
                      <Text style={styles.errorText}>{homeOrOfficeErr}</Text>
                    )}
                  </View>
                ) : null}
                <View style={styles.namecontainer}>
                  <Text style={styles.label}>
                    Select Gender <Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View style={styles.radioButtonContainer}>
                    {options.map(option => {
                      return (
                        <TouchableOpacity
                          key={option}
                          style={styles.singleOptionContainer}
                          onPress={() => {
                            setSelectedGender(option);
                            setGenderErr(null);
                          }}>
                          <View style={styles.outerCircle}>
                            {selectedGender === option ? (
                              <View style={styles.innerCircle} />
                            ) : null}
                          </View>
                          <Text style={{marginLeft: 10}}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {genderErr && (
                    <Text style={styles.errorText}>{genderErr}</Text>
                  )}
                  <View style={styles.namecontainer}>
                    <Text style={styles.label}>Photo</Text>
                    <View
                      style={[
                        styles.dropdown,
                        {flexDirection: 'row', justifyContent: 'space-between'},
                      ]}>
                      <Text style={{color: 'gray', marginHorizontal: 10}}>
                        {imageUri ? image.name : 'Select Image'}
                      </Text>
                      <View style={{paddingHorizontal: 10}}>
                        {imageUri ? (
                          <TouchableOpacity onPress={removeImage}>
                            <Image
                              source={require('../assets/close_icon.png')}
                              style={{width: 20, height: 20}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={selectImage}>
                            <Image
                              source={require('../assets/upload.png')}
                              style={{width: 20, height: 20}}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                  {/* <Button
                  title={imageUri ? 'Update Image' : 'Select Image'}
                  onPress={selectImage}
                /> */}

                  {imageUri && (
                    <>
                      <Image
                        source={{uri: imageUri}}
                        style={{width: 100, height: 100}}
                      />
                      {/* <Button title="Remove Image" onPress={removeImage} /> */}
                    </>
                  )}
                  <View style={styles.namecontainer}>
                    <Text style={styles.label}>Guest Category</Text>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        {width: '95%', paddingLeft: 12, color: '#71727a'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={guestCategoryValues}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select' : '...'}
                      value={guestCategory}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setGuestCategory(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={styles.namecontainer}>
                    <Text style={styles.label}>Priority</Text>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        {width: '95%', paddingLeft: 12, color: '#71727a'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={priorityValues}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!focus ? 'Select' : '...'}
                      value={priority}
                      onFocus={() => setFocus(true)}
                      onBlur={() => setFocus(false)}
                      onChange={item => {
                        setPriority(item.value);
                        setFocus(false);
                      }}
                    />
                  </View>

                  <View style={styles.namecontainer}>
                    <Text style={styles.label}>Vehicle Information</Text>
                    <View style={styles.vehicle}>
                      <Text>Vehicle type</Text>
                      <Text>|</Text>
                      <Text>Vehicle Number</Text>
                    </View>
                    {vehicles.map((vehicle, index) => (
                      <>
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
                            <Picker.Item
                              label="School Bus"
                              value="School Bus"
                            />
                            <Picker.Item
                              label="Police Van"
                              value="Police Van"
                            />
                            <Picker.Item label="Van" value="Van" />
                            <Picker.Item label="Auto" value="Auto" />
                            <Picker.Item label="Ambulance" value="Ambulance" />
                            <Picker.Item label="Truck" value="Truck" />
                            <Picker.Item label="Tractor" value="Tractor" />
                            <Picker.Item
                              label="Cement Mixer"
                              value="Cement Mixer"
                            />
                            <Picker.Item
                              label="Fire Engine"
                              value="Fire Engine"
                            />
                            <Picker.Item
                              label="Transport Van"
                              value="Transport Van"
                            />
                            <Picker.Item label="Bulldozer" value="Bulldozer" />
                            <Picker.Item
                              label="Roller Machine"
                              value="Roller Machine"
                            />
                            {/* Add more vehicle types as needed */}
                          </Picker>
                          <TextInput
                            style={styles.vehicleinput}
                            placeholder="KA 01 CU 1234"
                            placeholderTextColor="#c5c7ca"
                            value={vehicle.Vehicle_Number}
                            onChangeText={text =>
                              handleTextChange(index, 'Vehicle_Number', text)
                            }
                          />

                          <TouchableOpacity
                            onPress={() => handleRemoveVehicle(index)}>
                            <Image
                              source={require('../assets/delete.png')}
                              style={styles.removeButton}
                            />
                          </TouchableOpacity>
                        </View>
                        {vehicleErrorMessages[vehicle.ID] && (
                          <Text
                            style={[
                              styles.errorText,
                              {marginTop: -10, paddingLeft: 30},
                            ]}>
                            {vehicleErrorMessages[vehicle.ID]}
                          </Text>
                        )}
                      </>
                    ))}
                    {addNewButtonVisibility && (
                      <TouchableOpacity
                        style={styles.addvehicle}
                        onPress={handleAddVehicle}>
                        <Image
                          source={require('../assets/add.png')}
                          style={{width: 15, height: 15}}
                        />
                        <Text style={{color: 'black', fontSize: 15}}>
                          Add Vehicle Information
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submit}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleReset} style={styles.Cancel}>
                    <Text style={styles.buttonText1}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </GestureHandlerRootView>
        </SafeAreaView>
      )}
      <View style={[heightStyles.hidden]}>
        {/* <TouchableOpacity style={styles.btnAccept} onPress={onApprove}>
                <Text style={styles.btntxt}>Approve</Text>
              </TouchableOpacity> */}
        <View ref={viewRef} style={[heightStyles.container]}>
          <View style={{flex: 1}}>
            <View style={[heightStyles.qrCodeContainer]}>
              <Text style={[heightStyles.title]}>{loggedUser.name}</Text>
              <Text style={[heightStyles.title2]}>has invited you</Text>
              <Text style={[heightStyles.text]}>
                Show this QR code or OTP to the guard at the gate
              </Text>
              {code ? (
                <QRCode value={code} size={160} />
              ) : (
                <Text>Genrating Qr code....</Text>
              )}
              <Text style={[heightStyles.middleText]}>---OR---</Text>
              <View style={[heightStyles.codeBackdrop]}>
                <Text style={[heightStyles.code]}>{code}</Text>
                <View style={[heightStyles.BottomtextContainer]}>
                  <Text style={[heightStyles.dateOfArrivalText]}>
                    {convertDateFormat(date)}
                  </Text>
                  <Text style={[heightStyles.Bottomtext]}>
                    Sathya Sai Grama -
                  </Text>
                  <Text style={[heightStyles.Bottomtext]}>
                    Muddenahalli Rd,
                  </Text>
                  <Text style={[heightStyles.Bottomtext]}>
                    {' '}
                    Karnataka 562101,
                  </Text>
                  <View style={{flex: 1}}></View>
                </View>
              </View>
              <View style={{flex: 0.7}}>
                <ImageBackground
                  style={[heightStyles.BottomImage]}
                  source={require('../../src/assets/ashramQrScreen.jpg')}>
                  <LinearGradient
                    colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                    style={[heightStyles.gradient, heightStyles.topGradient]}
                  />
                  <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    style={[heightStyles.gradient, heightStyles.bottomGradient]}
                  />
                </ImageBackground>

                <ImageBackground
                  style={[heightStyles.BottomLogoImage]}
                  source={require('../../src/assets/SSG_OWOF.png')}></ImageBackground>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

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
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexShrink: 0,
    justifyContent: 'center',
    paddingLeft: 12,
    zIndex: 1,
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
    paddingRight: 10,
  },
  vehicleinput: {
    flex: 1,
    height: 40,
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
  namecontainer: {
    flex: 1,
    gap: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  dropdown: {
    height: 48,

    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 7,
    paddingRight: 7,
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginRight: 16,
    gap: 0,
  },
  bottomtext: {
    color: '#71727A',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 11,
    fontStyle: 'normal',
  },

  label: {
    fontSize: 14,

    color: '#2F3036',
    fontWeight: '500',
  },
  phoneInputContainer: {
    height: 50,
    width: '95%',
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#B21e2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  textContainer: {
    paddingVertical: 0,
    borderRadius: 10,
    backgroundColor: 'white',
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

  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    flex: 1,

    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    width: '95%',
    height: '60%',
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },

  HomeorOffice: {
    marginBottom: 15,
  },

  singlrOrgroup: {
    marginBottom: 10,
  },

  uploadText: {
    fontSize: 16,
    color: '#777777',
  },

  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#222',
    height: 40,
    width: '95%',
    paddingLeft: 8,
    fontSize: 15,
    justifyContent: 'center',
    backgroundColor: '#e2e2e2',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#B21E2B',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    flex: 1,
    borderRadius: 15,
  },
  singleOptionContainer: {
    flexDirection: 'row', // ensure the circle and text are in a row
    alignItems: 'center', // vertically center align the circle and text
    marginRight: 60, // add space between the buttons
    marginVertical: 10, // add vertical margin for spacing above and below buttons
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#B21E2B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 11,
    backgroundColor: '#B21E2B',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'auto',
  },
});

export default FillByYourSelf;
