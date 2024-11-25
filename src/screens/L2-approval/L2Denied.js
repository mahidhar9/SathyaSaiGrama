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

const L2Denied = ({ navigation }) => {
 // console.log("Logged user name in L2 denied: ", loggedUser.name)

  const { loggedUser, setLoggedUser, accessToken, L2DeniedDataFetched, setL2DeniedDataFetched } = useContext(UserContext)

  
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

  const [L2Denieds, setL2Denieds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [L2DeniedsData, setL2DeniedsData] = useState([]);

  const fetchData = async () => {
    setLoading(true)
    console.log("Logged user dept id in L2 Pending: ", loggedUser.deptIds)
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "DENIED", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2denieds = result.data;
    if (result.data === undefined) {
      setL2Denieds(null);
      setL2DeniedsData(null);
      setL2DeniedDataFetched(false);
      setLoading(false);
    }
    else {
      const sortedData = defaultSort(all_L2denieds)
      setL2Denieds(sortedData)
      setL2DeniedsData(sortedData)
      setLoading(false)
      setL2DeniedDataFetched(true)
    }
  };

  useEffect(() => {

    if (!L2DeniedDataFetched) {
      fetchData();
    }

  }, [L2DeniedDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "DENIED", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2denieds = result.data;
    if (result.data === undefined) {
      setL2Denieds(null);
      setL2DeniedsData(null);
      setRefreshing(false);
      setLoading(false);
    } else {
      const sortedData = defaultSort(all_L2denieds)
      setL2Denieds(sortedData)
      setL2DeniedsData(sortedData);
      setRefreshing(false);
    }

  };

  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [L2Denied]));
  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: '#FFF' }}>
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
            <Sort setSortedData={setL2DeniedsData} ToSortData={L2Denieds} />
            <Filter setFilteredData={setL2DeniedsData} ToFilterData={L2Denieds} comingFrom={"L2Denied"} />
          </View>

          <FlatList
            data={L2DeniedsData}
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
        L2DeniedsData?.length < 1 && L2Denieds?.length > 0 && <View style={styles.noL2DeniedTextView}><Text style={{ flex: 10 }}>No Visitors found</Text></View>
      }
      {!refreshing && L2Denieds === null && !loading && <View style={styles.noL2DeniedTextView}><Text style={{ flex: 10 }}>No L2 Denied visitors</Text></View>}
    </View>
    </>
  )
}

export default L2Denied

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noL2DeniedTextView: {
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