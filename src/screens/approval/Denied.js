import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useFocusEffect, } from '@react-navigation/native';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';
import parseDate from "../../components/ParseDate"
import Filter from '../../components/Filter';

const Denied = ({ navigation }) => {
  const { L1ID, getAccessToken, deniedDataFetched, setDeniedDataFetched } = useContext(UserContext);
  const [denieds, setDenieds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //const [dataFetched, setDataFetched] = useState(false);
  const [deniedsData, setDeniedsData] = useState([])

  const fetchData = async () => {
    setLoading(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "DENIED", getAccessToken());
    const all_denieds = result.data;
    if (result.data === undefined) {
      setDenieds(null);
      setDeniedsData(null);
      setDeniedDataFetched(false);
      setLoading(false);
    }
    else {
      // all_denieds.sort((a, b) => {
      //   // Parse the date strings into Date objects
      //   const dateA = new parseDate(a.Date_of_Visit);
      //   const dateB = new parseDate(b.Date_of_Visit);
      //   // Compare the Date objects
      //   return dateB - dateA;
      // });
      setDenieds(all_denieds);
      setDeniedsData(all_denieds);
      setLoading(false);
      setDeniedDataFetched(true);
    }
  };

  useEffect(() => {
    if (!deniedDataFetched) {
      fetchData();
    }
  }, [deniedDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "DENIED", getAccessToken());
    const all_denieds = result.data;
    if (result.data === undefined) {
      setDenieds(null);
      setDeniedsData(null)
      setRefreshing(false);
      setLoading(false);


    } else {
      // all_denieds.sort((a, b) => {
      //   // Parse the date strings into Date objects
      //   const dateA = new parseDate(a.Date_of_Visit);
      //   const dateB = new parseDate(b.Date_of_Visit);
      //   // Compare the Date objects
      //   return dateB - dateA;
      // });
      setDenieds(all_denieds);
      setDeniedsData(all_denieds);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [Denied]));


  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFFF" }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B21E2B" />
        </View>
      ) : ((refreshing ? (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B21E2B" />
      </View>) : (
        <>
          <Filter setFilteredData={setDeniedsData} ToFilterData={denieds} comingFrom={"Denied"} />
          <FlatList
            data={deniedsData}
            renderItem={({ item }) => (
              <ApprovalComponent navigation={navigation} key={item.ID} user={item} />
            )}
            keyExtractor={(item) => item.ID.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )))}
    </View>
    {deniedsData?.length<1 && denieds?.length>0  && !loading && <View style={styles.noDeniedTextView}><Text style={{ flex: 10 }}>No Visitors found</Text></View>}
      {!refreshing && denieds === null && !loading && <View style={styles.noDeniedTextView}><Text style={{ flex: 10 }}>No Denied visitors</Text></View>}</>
  );
};

export default Denied;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDeniedTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFF",
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
