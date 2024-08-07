import { StyleSheet, ActivityIndicator, View, FlatList, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ApprovalComponent from './ApprovalComponent';
import UserContext from '../../../context/UserContext';
import { getDataWithIntAndString } from '../../components/ApiRequest';
import parseDate from "../../components/ParseDate"

const Denied = ({ navigation }) => {
  const { L1ID, getAccessToken, deniedDataFetched, setDeniedDataFetched } = useContext(UserContext);
  const [denieds, setDenieds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //const [dataFetched, setDataFetched] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getDataWithIntAndString('Approval_to_Visitor_Report', 'Referrer_App_User_lookup', L1ID, "Referrer_Approval", "DENIED", getAccessToken());
    const all_denieds = result.data;
    all_denieds.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
    });
    setDenieds(all_denieds);
    setLoading(false);
    setDeniedDataFetched(true);
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
    all_denieds.sort((a, b) => {
      // Parse the date strings into Date objects
      const dateA = new parseDate(a.Date_of_Visit);
      const dateB = new parseDate(b.Date_of_Visit);
      // Compare the Date objects
      return dateB - dateA;
    });
    setDenieds(all_denieds);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFFF" }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={denieds}
          renderItem={({ item }) => (
            <ApprovalComponent navigation={navigation} key={item.ID} user={item} />
          )}
          keyExtractor={(item) => item.ID.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default Denied;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
