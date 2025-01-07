import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

const ReceivedCard = () => {

  const [isCategoryFocus, setIsCategoryFocus] = useState(false);
  const [isPriorityFocus, setIsPriorityFocus] = useState(false);
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState(null);
  const [remarks, setRemarks] = useState(null);

  const guestCategory = [
    { label: 'Govt Officials', value: 'Govt Officials' },
    { label: 'Politician', value: 'Politician' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Press', value: 'Press' },
    { label: 'Parent', value: 'Parent' },
    { label: 'Devotee', value: 'Devotee' },
  ];

  const guestPriority = [
    { label: 'P1', value: 'P1' },
    { label: 'P2', value: 'P2' },
    { label: 'P3', value: 'P3' },
  ];

  const [vehicles, setVehicles] = useState([]);

  let addNewButtonVisibility;
  if (
    (vehicles.length < 5) ||
    (vehicles.length < 1)
  ) {
    addNewButtonVisibility = true;
  } else {
    addNewButtonVisibility = false;
  }

  return (
    <View style={styles.container}>

      {/* Card Section */}
      <View style={styles.card}>
        {/* Profile Picture and Name */}
        <View >
          <View >
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <Image
                  source={require('../../assets/profilePhoto.png')}
                  style={styles.propic}
                />
              </TouchableOpacity>
              <Text style={styles.nameText}>Ravi</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View>
                <View style={styles.row}>
                  <Text style={styles.label}>Gender: </Text>
                  <Text style={styles.value}>Male</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Number: </Text>
                  <Text style={styles.value}>9898989899</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>No. of People: </Text>
                  <Text style={styles.value}>5</Text>
                </View>
              </View>
              <View style={{ marginLeft: "8%" }}>
                <View style={styles.row}>
                  <Text style={styles.label}>Date of Visit: </Text>
                  <Text style={styles.value}>12/12/2024</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Place of Visit: </Text>
                  <Text style={styles.value}>Office</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.card, { marginTop: '5%' }]}>
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
        <TouchableOpacity style={styles.submitButton}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    fontFamily: 'Roboto',
    padding: '5%',
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
  v: {
    marginTop: 10
  },
  txt: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '700',
    marginBottom: 6,
    color: '#2F3036',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: '1%' },
    shadowRadius: '1%',
  },
  nameText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: '5%',
    marginTop: '5%',
  },
  row: {
    flexDirection: 'row',
    marginVertical: '0.5%',
  },
  label: {
    fontSize: 12,
    color: '#5B5B5B',
  },
  value: {
    fontSize: 12,
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  propic: {
    width: 50,
    height: 50,
    borderRadius: 85,
    textAlign: 'center',
    borderWidth: 0.2,
    borderColor: 'gray',
    marginBottom: '10%'
  },
  shareIcon: {
    width: 20,
    height: 18,
    marginEnd: 5,
    tintColor: 'black',
  },
  submitButton: {
    backgroundColor: '#C00F0C',
    width: '80%',
    height: "10%",
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: '10%',
},
submitButtonText: {
    fontSize: 14,
    weight: 'bold',
    color: '#fff',
},
});

export default ReceivedCard;
