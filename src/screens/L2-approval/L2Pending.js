import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { getL2Data } from '../../components/ApiRequest'
import UserContext from '../../../context/UserContext'
import L2ApprovalComponent from './L2ApprovalComponent';
import parseDate from '../../components/ParseDate';
import { useFocusEffect, } from '@react-navigation/native';
import Filter from '../../components/Filter';
import DotsBlinkingLoaderEllipsis from '../../components/DotsBlinkingLoaderEllipsis'
import Sort from '../../components/Sort';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const defaultSort = (data) => {

  let sortedData = [...data];
  sortedData.sort((a, b) =>
    (new Date(moment(a.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')) -
      new Date(moment(b.Modified_Time, 'DD-MMM-YYYY HH:mm:ss'))) * -1
  );
  return sortedData
}

const L2Pending = ({ navigation }) => {

  const { loggedUser, setLoggedUser, accessToken, L2PendingDataFetched, setL2PendingDataFetched } = useContext(UserContext)

  
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

  console.log("Logged user name in L2 pending: ", loggedUser.name)


  const [L2Pendings, setL2Pendings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [L2PendingsData, setL2PendingsData] = useState([]);


  const fetchData = async () => {
    setLoading(true)
    console.log("Logged user dept id in L2 Pending: ", loggedUser.deptIds)
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "PENDING APPROVAL", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2pendings = result.data;
    if (result.data === undefined) {
      setL2Pendings(null);
      setL2PendingsData(null);
      setL2PendingDataFetched(false);
      setLoading(false);
    }
    else {
      const sortedData = defaultSort(all_L2pendings)
      setL2Pendings(sortedData)
      setL2PendingsData(sortedData);
      setLoading(false)
      setL2PendingDataFetched(true)
    }
    console.log("object:: ", L2Pendings)
  };

  useEffect(() => {

    if (!L2PendingDataFetched) {
      fetchData();
    }

  }, [L2PendingDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "PENDING APPROVAL", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2pendings = result.data;
    if (result.data === undefined) {
      setL2Pendings(null);
      setL2PendingsData(null);
      setRefreshing(false);
      setLoading(false);


    } else {
      const sortedData = defaultSort(all_L2pendings)
      setL2Pendings(sortedData)
      setL2PendingsData(sortedData)
      setRefreshing(false);
    }
    console.log("object:: ", L2Pendings)
  };



  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [L2Pending]));


  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFF" }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          {/* <ActivityIndicator size="large" color="#B21E2B" /> */}
          <DotsBlinkingLoaderEllipsis />
        </View>
      ) : ((refreshing ? (<View style={styles.loadingContainer}>
        {/* <ActivityIndicator size="large" color="#B21E2B" /> */}
        <DotsBlinkingLoaderEllipsis />
      </View>) : (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Sort setSortedData={setL2PendingsData} ToSortData={L2Pendings} />
            <Filter setFilteredData={setL2PendingsData} ToFilterData={L2Pendings} comingFrom={"L2Pending"} />
          </View>

          <FlatList
            data={L2PendingsData}
            renderItem={({ item }) => (
              <L2ApprovalComponent navigation={navigation} key={item.ID} user={item} />
            )}
            keyExtractor={(item) => item.ID.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>

      )))}

      {
        L2PendingsData?.length < 1 && L2Pendings?.length > 0 && <View style={styles.noL2PendingTextView}><Text style={{ flex: 10 }}>No Visitors found</Text></View>
      }
      {!refreshing && L2Pendings === null && !loading && <View style={styles.noL2PendingTextView}><Text style={{ flex: 10 }}>No L2 Pending visitors</Text></View>}
    </View>
    </>)
}

export default L2Pending

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noL2PendingTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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