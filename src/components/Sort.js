import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native';
import sortIcon from "../assets/sort_icon.png";
import moment from 'moment';

const Sort = ({ ToSortData, setSortedData }) => {
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleSortModal = () => {
    setIsSortVisible(!isSortVisible);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
    setSortOrder('Ascending')
    sortData(sort); // Sort immediately when an option is selected
    handleSortModal();
  };

  const handleSortOrder = (sortorder) => {
    setSortOrder(sortorder);
    if (sortBy != '' && sortorder == 'Ascending') {
      let sortedData = [...ToSortData]; // Copy to avoid mutating original data

      switch (sortBy) {
        case 'NameOfVisitor':
          sortedData.sort((a, b) =>
            a.Name_field.first_name.localeCompare(b.Name_field.first_name)
          );
          break;
        case 'ModifiedTime':
          sortedData.sort((a, b) =>
            (new Date(moment(a.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')) -
              new Date(moment(b.Modified_Time, 'DD-MMM-YYYY HH:mm:ss'))) * -1
          );

          break;
        case 'DateOfVisit':
          sortedData.sort((a, b) =>
            (new Date(moment(a.Date_of_Visit, 'DD-MMM-YYYY')) - new Date(moment(b.Date_of_Visit, 'DD-MMM-YYYY'))) * -1
          );
          break;
        default:
          break;
      }

      setSortedData(sortedData);
    }
    else if (sortBy != '' && sortorder == 'Descending') {
      let sortedData = [...ToSortData]; // Copy to avoid mutating original data

      switch (sortBy) {
        case 'NameOfVisitor':
          sortedData.sort((a, b) =>
            a.Name_field.first_name.localeCompare(b.Name_field.first_name) * -1
          );
          break;
        case 'ModifiedTime':
          sortedData.sort((a, b) =>
          (new Date(moment(a.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')) -
            new Date(moment(b.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')))
          );

          break;
        case 'DateOfVisit':
          sortedData.sort((a, b) =>
            (new Date(moment(a.Date_of_Visit, 'DD-MMM-YYYY')) - new Date(moment(b.Date_of_Visit, 'DD-MMM-YYYY')))
          );
          break;
        default:
          break;
      }

      setSortedData(sortedData);
    }
    setIsSortVisible(!isSortVisible)
  }

  const sortData = (sortCriteria) => {
    let sortedData = [...ToSortData]; // Copy to avoid mutating original data

    switch (sortCriteria) {
      case 'NameOfVisitor':
        sortedData.sort((a, b) =>
          a.Name_field.first_name.localeCompare(b.Name_field.first_name)
        );
        break;
      case 'ModifiedTime':
        sortedData.sort((a, b) =>
          (new Date(moment(a.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')) -
            new Date(moment(b.Modified_Time, 'DD-MMM-YYYY HH:mm:ss'))) * -1
        );

        break;
      case 'DateOfVisit':
        sortedData.sort((a, b) =>
          (new Date(moment(a.Date_of_Visit, 'DD-MMM-YYYY')) - new Date(moment(b.Date_of_Visit, 'DD-MMM-YYYY'))) * -1
        );
        break;
      default:
        break;
    }

    setSortedData(sortedData); // Update sorted data
  };

  return (
    <View style={styles.filterview}>
      <TouchableOpacity style={styles.filterbtn} onPress={handleSortModal}>
        {
          ToSortData != null && (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.filter}>Sort</Text>
              <Image source={sortIcon} style={styles.image} />

              {sortBy && (
                <View style={styles.sortbubble}>
                </View>
              )}
            </View>
          )}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSortVisible}
        onRequestClose={handleSortModal}
      >
        <TouchableWithoutFeedback onPress={handleSortModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                {/* Sorting Options */}
                <TouchableOpacity onPress={() => handleSort('NameOfVisitor')}>
                  {
                    sortBy === 'NameOfVisitor' && (
                      <Text style={styles.bubbleText1}>
                        .
                      </Text>
                    )
                  }
                  <Text style={[styles.optionText, sortBy === 'NameOfVisitor' && styles.selectedText]}>
                    Name of Visitor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort('ModifiedTime')} >
                  {
                    sortBy === 'ModifiedTime' && (
                      <Text style={styles.bubbleText1}>
                        .
                      </Text>
                    )
                  }
                  <Text style={[styles.optionText, sortBy === 'ModifiedTime' && styles.selectedText]}>
                    Modified Time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort('DateOfVisit')} >
                  {
                    sortBy === 'DateOfVisit' && (
                      <Text style={styles.bubbleText1}>
                        .
                      </Text>
                    )
                  }
                  <Text style={[styles.optionText, sortBy === 'DateOfVisit' && styles.selectedText]}>
                    Date of Visit
                  </Text>
                </TouchableOpacity>

                {/* Divider Line */}
                <View style={styles.dividerLine} />

                {/* Sort Order Options */}

                <TouchableOpacity onPress={() => handleSortOrder('Ascending')} >
                  {
                    sortOrder === 'Ascending' && (
                      <Text style={styles.bubbleText1}>
                        .
                      </Text>
                    )
                  }
                  <Text style={[styles.optionText, sortOrder === 'Ascending' && styles.selectedText]}>
                    Descending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSortOrder('Descending')} >
                  {
                    sortOrder === 'Descending' && (
                      <Text style={styles.bubbleText1}>
                        .
                      </Text>
                    )
                  }
                  <Text style={[styles.optionText, sortOrder === 'Descending' && styles.selectedText]}>
                    Ascending
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};

export default Sort;

const styles = StyleSheet.create({
  select: {
    flexDirection: 'row',
  },
  sortbubble: {
    position: "absolute",
    top: -3,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff9d00"
  },
  selectedText: {
    fontWeight: 'bold',
    color: "#B21E2B"
  },
  bubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bubble1: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText1: {
    position: "absolute",
    top: -28,
    left: 0,
    color: '#ff9d00',
    fontSize: 50,
    fontWeight: 'bold',
  },
  filterview: {
    height: 30,
    display: 'flex',
  },
  filterbtn: {
    alignSelf: 'flex-end',
    marginVertical: 2,
    marginEnd: 25,
  },
  image: {
    width: 16,
    height: 16,
    tintColor: '#B21E2B',
    marginTop: 3,
    marginStart: 2,
  },
  filter: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    color: '#B21E2B',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalView: {
    width: 200,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 60,
    marginRight: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
    paddingStart: 20
  },
  dividerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    width: '100%',
    marginVertical: 10,
  },
});
