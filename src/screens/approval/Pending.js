import {
  StyleSheet,
  ActivityIndicator,
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';
import parseDate from '../../components/ParseDate';
import { useFocusEffect } from '@react-navigation/native';
import Filter from '../../components/Filter';
import Sort from '../../components/Sort'
import DotsBlinkingLoaderEllipsis from '../../components/DotsBlinkingLoaderEllipsis'
import moment from 'moment';

const defaultSort = (data) => {

  let sortedData = [...data];
  sortedData.sort((a, b) =>
    (new Date(moment(a.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')) -
      new Date(moment(b.Modified_Time, 'DD-MMM-YYYY HH:mm:ss'))) * -1
  );
  return sortedData
}

const Pending = ({ navigation }) => {
  const { L1ID, getAccessToken, pendingDataFetched, setPendingDataFetched } =
    useContext(UserContext);
  const [pendings, setPendings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingsData, setPendingsData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getDataWithIntAndString(
      'Approval_to_Visitor_Report',
      'Referrer_App_User_lookup',
      L1ID,
      'Referrer_Approval',
      'PENDING APPROVAL',
      getAccessToken(),
    );
    const all_pendings = result.data;
    if (result.data === undefined) {
      setPendings(null);
      setPendingsData(null);
      //setPendingDataFetched(false);
      setLoading(false);
    }
    // sorting the pendings data by date
    else {
      const sortedData = defaultSort(all_pendings)
      setPendings(sortedData);
      setPendingsData(sortedData);
      setPendingDataFetched(true);
      setLoading(false);
    }
  };


  useEffect(() => {

    const fetchLatest = async () => {
      await onRefresh();
    }

    fetchLatest();
    
  }, [pendingDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getDataWithIntAndString(
      'Approval_to_Visitor_Report',
      'Referrer_App_User_lookup',
      L1ID,
      'Referrer_Approval',
      'PENDING APPROVAL',
      getAccessToken(),
    );
    const all_pendings = result.data;
    // sorting the pendings data by date
    if (result.data === undefined) {
      setPendings(null);
      setPendingsData(null);
      setRefreshing(false);
      setLoading(false);
    } else {
      // all_pendings.sort((a, b) => {
      //   // Parse the date strings into Date objects
      //   const dateA = new parseDate(a.Date_of_Visit);
      //   const dateB = new parseDate(b.Date_of_Visit);
      //   // Compare the Date objects
      //   return dateB - dateA;
      // });

      const sortedData = defaultSort(all_pendings)
      setPendings(sortedData);
      setPendingsData(sortedData);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [Pending]),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 10, backgroundColor: '#FFFF' }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            {/* <ActivityIndicator size="large" color="#B21E2B" /> */}
            {/* <RequestSkeletonScreen /> */}
            <DotsBlinkingLoaderEllipsis />
          </View>
        ) : refreshing ? (
          <View style={styles.loadingContainer}>
            {/* <ActivityIndicator size="large" color="#B21E2B" /> */}
            <DotsBlinkingLoaderEllipsis />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Sort setSortedData={setPendingsData} ToSortData={pendings} />
              <Filter setFilteredData={setPendingsData} ToFilterData={pendings} comingFrom={"Pending"} />
            </View>
            <FlatList
              data={pendingsData}
              renderItem={({ item }) => (
                <ApprovalComponent
                  navigation={navigation}
                  key={item.ID}
                  user={item}
                /> // Approval component is the card in the approvals
              )}
              keyExtractor={item => item.ID.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        )}
      </View>
      {pendingsData?.length < 1 && pendings?.length > 0 && (
        <View style={styles.noPendingTextView}>
          <Text style={{ flex: 10 }}>No Visitors found</Text>
        </View>
      )}
      {!refreshing && pendings === null && !loading && (
        <View style={styles.noPendingTextView}>
          <Text style={{ flex: 10 }}>No Pending visitors</Text>
        </View>
      )}
    </View>
  );
};

export default Pending;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPendingTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },
  refreshingTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshingText: {
    flex: 10,
    fontSize: 20,
  },
});
