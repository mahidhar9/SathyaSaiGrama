import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useFocusEffect, } from '@react-navigation/native';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';
import parseDate from "../../components/ParseDate"
import Filter from '../../components/Filter';
import DotsBlinkingLoaderEllipsis from '../../components/DotsBlinkingLoaderEllipsis'
import Sort from '../../components/Sort';
import moment from 'moment';

const defaultSort = (data) => {

  let sortedData = [...data];
  sortedData.sort((a, b) =>
    (new Date(moment(a.Modified_Time, 'DD-MMM-YYYY HH:mm:ss')) -
      new Date(moment(b.Modified_Time, 'DD-MMM-YYYY HH:mm:ss'))) * -1
  );
  return sortedData
}

const Approved = ({ navigation }) => {
  const { L1ID, getAccessToken, approveDataFetched, setApproveDataFetched } = useContext(UserContext);
  const [approveds, setApproveds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [dataFetched, setDataFetched] = useState(false);
  const [approvedsData, setApprovedsData] = useState([]);

  const fetchData = async () => {

    setLoading(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "APPROVED", getAccessToken());
    // sorting the Approveds data by date
    const all_approveds = result.data;
    if (result.data === undefined) {
      setApproveds(null);
      setApprovedsData(null);
      //setApproveDataFetched(false);
      setLoading(false);
    } else {
      
      const sortedData = defaultSort(all_approveds)
      setApproveds(sortedData);
      setApprovedsData(sortedData)
      setLoading(false);
      //setApproveDataFetched(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "APPROVED", getAccessToken());
    if (result.data === undefined) {
      setApproveds(null);
      setApprovedsData(null)
      setRefreshing(false);
      setLoading(false);
    }
    else {
      const sortedData = defaultSort(result.data)
      setApproveds(sortedData);
      setApprovedsData(sortedData)
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    onRefresh();
  }, []));

  useEffect(() => {

    const fetchLatest = async () => {
      await onRefresh();
    }

    fetchLatest();

  }, [approveDataFetched]);


  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFFF" }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <DotsBlinkingLoaderEllipsis />
        </View>
      ) : ((refreshing ? (<View style={styles.loadingContainer}>
        <DotsBlinkingLoaderEllipsis />
      </View>) : (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Sort setSortedData={setApprovedsData} ToSortData={approveds} />
            <Filter setFilteredData={setApprovedsData} ToFilterData={approveds} comingFrom={"Approved"} />
          </View>
          <FlatList
            data={approvedsData}
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
      {
        approvedsData?.length < 1 && approveds?.length > 0 && !loading && <View style={styles.noApprovedTextView}><Text style={{ flex: 10 }}>No Visitors found</Text></View>
      }
      {!refreshing && approveds === null && !loading && <View style={styles.noApprovedTextView}><Text style={{ flex: 10 }}>No Approved visitors</Text></View>}</>
  );
};

export default Approved;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noApprovedTextView: {
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