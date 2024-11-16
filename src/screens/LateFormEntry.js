// import {StyleSheet, Text, View} from 'react-native';
// import React, {useState} from 'react'; // Import useState
// import {
//   GestureHandlerRootView,
//   ScrollView,
//   TextInput,
// } from 'react-native-gesture-handler';
// import {TouchableOpacity} from 'react-native';
// import UserContext from '../../context/UserContext';
// import {getDataWithString, postDataWithInt} from '../components/ApiRequest';
// import {Controller, useForm} from 'react-hook-form';

// const transportOptions = [
//   {id: 'Car', label: 'Car'},
//   {id: 'Two-wheeler', label: 'Two-wheeler'},
//   {id: 'Cab', label: 'Cab'},
//   {id: 'Auto', label: 'Auto'},
//   {id: 'Bus', label: 'Bus'},
//   {id: 'Others', label: 'Others'},
// ];
// const LateFormEntry = ({route,navigation}) => {
//   const userdata = route.params?.userInfo[0];
//   console.log('userdata', userdata);
//   const {loggedUser, accessToken, getDataWithString} =React.useContext(UserContext);
//   const [selectedOption, setSelectedOption] = useState('');
//   const selectedOptions = selectedOption ? [selectedOption] : [];
//   // const UserData = async () => {
//   //   try {
//   //     const data = await getDataWithString('All_App_Users');
//   //     console.log('All Users', data);
//   //   } catch (error) {
//   //     console.error('Error fetching user data: ', error);
//   //   }
//   // };
//   const {
//     control,
//     handleSubmit,
//     formState: {errors},
//     watch,
//   } = useForm();

//   const onSubmit = async data => {
//     console.log('Inside onSubmit');
//     const formData = {
//       data: {
//         Name: loggedUser.name,
//         // phone: userdata.Phone_Number,
//         App_User_lookup: loggedUser.userId,
//         Reason_for_Late_Entry: data.reasonForLate,
//         No_of_members_accompanied: data.noOfMembers,
//         Names_of_the_Members_Accompanied: data.memberNames,
//         Vehicle_Number: data.vehicleNumber,
//         Travelling_From: data.travellingFrom,
//         Mode_of_Transport: selectedOption,
//       },
//     };

//     console.log('formData', formData);
//     // await postDataWithInt('Late_Entry', formData, accessToken);
//     navigation.navigate('Profile');
//   };
//   const noOfMembers = watch('noOfMembers');

//   const isVehicleNumberRequired = selectedOptions.some(option =>
//     ['Car', 'Cab', 'Auto', 'Two-wheeler'].includes(option),
//   );
//   const handleSelect = option => {
//     setSelectedOption(option);
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <ScrollView>
//         <View>
//           <View style={styles.innerContainer}>
//             <Text style={[styles.title, {margin: 18, marginLeft: -1}]}>Name:<Text style={{color: 'red'}}>*</Text>
//             </Text>
//             <TextInput
//               value={loggedUser.name}
//               placeholder="0"
//               keyboardType="numeric"
//               style={[styles.textInput, {height: 50, marginBottom: 10}]}
//               editable={false}
//             />

//             {/* <Text style={[styles.title, {margin: 18, marginLeft: -1}]}>Phone Number:<Text style={{color: 'red'}}>*</Text>
//             </Text>
//             <TextInput
//               value={userdata.Phone_Number}
//               placeholder="0"
//               keyboardType="numeric"
//               style={[styles.textInput, {height: 50, marginBottom: 10}]}
//               editable={false}
//             /> */}

//             <Text style={[styles.title, {margin: 18, marginLeft: -1}]}>No. of Members Accompanied:<Text style={{color: 'red'}}>*</Text>
//             </Text>
//             <Controller
//               control={control}
//               rules={{
//                 required: true,
//                 pattern: {
//                   value: /^[0-9]{1,2}$/,
//                   message: 'Please enter a valid number (0-20)',
//                 },
//               }}
//               render={({field: {onChange, value}}) => (
//                 <TextInput
//                   value={value}
//                   onChangeText={onChange}
//                   placeholder="0"
//                   placeholderTextColor={'#c6c3c1'}
//                   keyboardType="numeric"
//                   style={[styles.textInput, {height: 50, marginBottom: 10}]}
//                 />
//               )}
//               name="noOfMembers"
//               defaultValue=""
//             />
//             {errors.noOfMembers && (
//               <Text style={styles.errorText}>{errors.noOfMembers.message}</Text>
//             )}
//             {parseInt(noOfMembers, 10) > 0 && (
//               <View>
//                 <Text style={styles.title}>There Names:<Text style={{color: 'red'}}>*</Text>
//                 </Text>
//                 <Controller
//                   control={control}
//                   rules={{required: `Name for Member is required`}}
//                   render={({field: {onChange, value}}) => (
//                     <TextInput
//                       value={value}
//                       onChangeText={onChange}
//                       placeholder={`Names`}
//                       placeholderTextColor={'#c6c3c1'}
//                       style={styles.textInput}
//                     />
//                   )}
//                   name="memberNames"
//                   defaultValue=""
//                 />
//                 {errors.memberNames && (
//                   <Text style={styles.errorText}>
//                     {errors.memberNames.message}
//                   </Text>
//                 )}
//               </View>
//             )}

//             <Text style={styles.title}>Travelling From:<Text style={{color: 'red'}}>*</Text>
//             </Text>
//             <Controller
//               control={control}
//               rules={{required: 'This field is required'}}
//               render={({field: {onChange, value}}) => (
//                 <TextInput
//                   value={value}
//                   onChangeText={onChange}
//                   placeholder="Travelling From"
//                   placeholderTextColor={'#c6c3c1'}
//                   multiline
//                   numberOfLines={2}
//                   style={[styles.textInput, {height: 50}]}
//                 />
//               )}
//               name="travellingFrom"
//               defaultValue=""
//             />
//             {errors.travellingFrom && (
//               <Text style={styles.errorText}>
//                 {errors.travellingFrom.message}
//               </Text>
//             )}

//             <Text style={[styles.title]}>Mode of Transport:<Text style={{color: 'red'}}>*</Text>
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               flexWrap: 'wrap',
//               justifyContent: 'space-between',
//               marginLeft: 10,
//             }}>
//             {transportOptions.map((option, index) => (
//               <TouchableOpacity
//                 key={option.id}
//                 style={styles.optionContainer}
//                 onPress={() => handleSelect(option.id)}>
//                 <View style={[styles.radioCircle]}>
//                   {selectedOption === option.id && (
//                     <View style={styles.selectedRb} />
//                   )}
//                 </View>
//                 <Text style={styles.optionText}>{option.label}</Text>
//                 {(index + 1) % 3 === 0 && <View style={{width: 70}} />}
//               </TouchableOpacity>
//             ))}
//           </View>
//           <View style={styles.innerContainer}>
//             {isVehicleNumberRequired && (
//               <View>
//                 <Text style={styles.title}>Vehicle Number:<Text style={{color: 'red'}}>*</Text>
//                 </Text>

//                 <Controller
//                   control={control}
//                   rules={{
//                     required: true,
//                     pattern: /^([A-Z]{2}\d{2}[A-Z]{2}\d{4})$/,
//                     message: 'Please enter a valid vehicle number',
//                   }}
//                   render={({field: {onChange, value}}) => (
//                     <TextInput
//                       value={value}
//                       onChangeText={onChange}
//                       placeholder=" KA 40 WV 6859"
//                       placeholderTextColor={'#c6c3c1'}
//                       style={[styles.textInput, {height: 50, marginBottom: 10}]}
//                     />
//                   )}
//                   name="vehicleNumber"
//                   defaultValue=""
//                 />

//                 {errors.vehicleNumber && (
//                   <Text style={[styles.errorText, {color: '#B21'}]}>
//                     {errors.vehicleNumber.message}
//                   </Text>
//                 )}
//               </View>
//             )}

//             <Text style={styles.title}>Reason For Late:<Text style={{color: 'red'}}>*</Text>
//             </Text>
//             <Controller
//               control={control}
//               rules={{required: 'This field is required'}}
//               render={({field: {onChange, value}}) => (
//                 <TextInput
//                   value={value}
//                   onChangeText={onChange}
//                   placeholder="Reason For Late"
//                   placeholderTextColor={'#c6c3c1'}
//                   multiline
//                   numberOfLines={5}
//                   style={styles.textInput}
//                 />
//               )}
//               name="reasonForLate"
//               defaultValue=""
//             />
//             {errors.reasonForLate && (
//               <Text style={styles.errorText}>
//                 {errors.reasonForLate.message}
//               </Text>
//             )}

//             <View style={styles.buttonContainer}>
//               <TouchableOpacity
//                 onPress={handleSubmit(onSubmit)}
//                 style={styles.submit}>
//                 <Text style={styles.buttonText}>Submit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Profile')}
//                 style={styles.cancel}>
//                 <Text style={styles.buttonText1}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </GestureHandlerRootView>
//   );
// };

// export default LateFormEntry;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   innerContainer: {
//     justifyContent: 'center',
//   },
//   separator: {
//     width: '100%',
//     height: 10,
//   },

//   title: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   textInput: {
//     height: 100,
//     borderColor: '#B21E2B',
//     borderWidth: 1,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     textAlignVertical: 'top',
//     padding: 10,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'left',
//   },
//   textInput1: {
//     height: 40,
//     borderColor: '#B21E2B',
//     borderWidth: 1,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     textAlignVertical: 'top',
//     padding: 10,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'left',
//   },
//   errorText: {
//     color: '#B21',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginTop: 10,
//   },
//   submit: {
//     height: 50,
//     width: '38%',
//     backgroundColor: '#B21E2B',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancel: {
//     height: 50,
//     width: '38%',
//     borderWidth: 1,
//     borderColor: '#B21E2B',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonText1: {
//     color: '#B21E2B',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   optionContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 15,
//     width: '30%',
//   },
//   radioCircle: {
//     height: 20,
//     width: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#B21E2B',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectedRb: {
//     width: 12,
//     height: 12,
//     borderRadius: 10,
//     backgroundColor: '#B21E2B',
//   },
//   optionText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#333',
//   },
// });
