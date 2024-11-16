import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { getL2Data } from '../../components/ApiRequest'
import UserContext from '../../../context/UserContext'
import L2ApprovalComponent from './L2ApprovalComponent';
import parseDate from '../../components/ParseDate';
import { useFocusEffect, } from '@react-navigation/native';
import Filter from '../../components/Filter';
import DotsBlinkingLoaderEllipsis from '../../components/DotsBlinkingLoaderEllipsis'
import AsyncStorage from '@react-native-async-storage/async-storage';

const L2Approved = ({ navigation }) => {

  const { loggedUser, setLoggedUser, accessToken, L2ApproveDataFetched, setL2ApproveDataFetched } = useContext(UserContext)

  
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

  console.log("Logged user name in L2 approveds: ", loggedUser.name)

  const [L2Approveds, setL2Approveds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [L2ApprovedsData, setL2ApprovedsData] = useState([]);

  const fetchData = async () => {
    setLoading(true)
    console.log("Logged user dept id in L2 Approveds: ", loggedUser.deptIds)
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "APPROVED", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2approveds = result.data;
    if (result.data === undefined) {
      setL2Approveds(null);
      setL2ApprovedsData(null);
      setL2ApproveDataFetched(false);
      setLoading(false);

    } else {
      all_L2approveds.sort((a, b) => {
        // Parse the date strings into Date objects
        const dateA = new parseDate(a.Date_of_Visit);
        const dateB = new parseDate(b.Date_of_Visit);
        // Compare the Date objects
        return dateB - dateA;
      });
      setL2Approveds(all_L2approveds)
      setL2ApprovedsData(all_L2approveds)
      setLoading(false)
      setL2ApproveDataFetched(true)
    }

  };

  useEffect(() => {

    if (!L2ApproveDataFetched) {
      fetchData();
    }

  }, [L2ApproveDataFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getL2Data('Approval_to_Visitor_Report', 'Department', loggedUser.deptIds, "Referrer_Approval", "APPROVED", "L2_Approval_Status", "APPROVED", "Referrer_App_User_lookup", loggedUser.userId, accessToken);
    const all_L2approveds = result.data;
    if (result.data === undefined) {
      setL2Approveds(null);
      setL2ApprovedsData(null);
      setRefreshing(false);
      setLoading(false);


    } else {
      all_L2approveds.sort((a, b) => {
        // Parse the date strings into Date objects
        const dateA = new parseDate(a.Date_of_Visit);
        const dateB = new parseDate(b.Date_of_Visit);
        // Compare the Date objects
        return dateB - dateA;
      });
      setL2Approveds(all_L2approveds)
      setL2ApprovedsData(all_L2approveds)
      setRefreshing(false);
    }
  };


  useFocusEffect(useCallback(() => {
    onRefresh();
  }, [L2Approved]));

  return (
    <><View style={{ flex: 1, paddingTop: 10, backgroundColor: '#FFF' }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          {/* <ActivityIndicator size="large" color="#B21E2B" /> */}
          {/* <RequestSkeletonScreen/> */}
          <DotsBlinkingLoaderEllipsis/>
        </View>
      ) : ((refreshing ? (<View style={styles.loadingContainer}>
        {/* <ActivityIndicator size="large" color="#B21E2B" /> */}
        {/* <RequestSkeletonScreen/> */}
        <DotsBlinkingLoaderEllipsis/>
      </View>) : (
        <>
          <Filter setFilteredData={setL2ApprovedsData} ToFilterData={L2Approveds}  comingFrom={"L2Approved"}/>
          <FlatList
            data={L2ApprovedsData}
            renderItem={({ item }) => (
              <L2ApprovalComponent navigation={navigation} key={item.ID} user={item} />
            )}
            keyExtractor={(item) => item.ID.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      ))
      )}

      {
        L2ApprovedsData?.length < 1 && L2Approveds?.length > 0 && <View style={styles.noL2ApprovedTextView}><Text style={{ flex: 10 }}>No Visitors found</Text></View>
      }
      {!refreshing && L2Approveds === null && !loading && <View style={styles.noL2ApprovedTextView}><Text style={{ flex: 10 }}>No L2 Approved visitors</Text></View>}
    </View>
    </>
  )
}

export default L2Approved

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noL2ApprovedTextView: {
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