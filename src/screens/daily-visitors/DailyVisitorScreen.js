import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getRecentVisitors } from '../../components/ApiRequest'
import UserContext from '../../../context/UserContext'
import VisitorComponent from '../../components/VisitorComponent'

export default function DailyVisitorScreen({ navigation }) {

    const [allVisitors, setAllVisitors] = useState(null)

    const { accessToken, loggedUser } = useContext(UserContext)

    useEffect(() => {
        const getVisitorData = async () => {
            const visitors = await getRecentVisitors(accessToken, loggedUser.userId)
            setAllVisitors(visitors)
            console.log("Visitors are: ", visitors)
        }
        getVisitorData();

    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View style={styles.bannerview}>
                <View style={styles.bannerposter}>
                    <View style={{ width: "20%" }}>
                        <Image source={require("../../assets/mouseImage.png")} style={styles.bannerimg} />
                    </View>
                    <View style={{ width: "80%"}}>
                        <Text style={styles.bannertitle}>Hello, Sairam</Text>
                        <Text style={styles.bannerdescription}>"Goodness is the only investment that never fails"</Text>
                    </View>
                </View>
                <View style={{ width: "90%", height: 1, alignSelf: "center", backgroundColor: '#B3261E', marginTop: 2 }} />
                <View style={styles.visitorscountview}>
                    <View style={styles.countview}>
                        <Text style={styles.txt}>Total Request</Text>
                        <Text style={styles.txt}>10</Text>
                    </View>
                    <View style={styles.countview}>
                        <Text style={styles.txt}>Pending</Text>
                        <Text style={styles.txt}>15</Text>
                    </View>
                    <View style={styles.countview}>
                        <Text style={styles.txt}>Approved</Text>
                        <Text style={styles.txt}>20</Text>
                    </View>
                </View>
            </View>

            <View style={styles.inviteview}>
                <TouchableOpacity style={styles.invitebtn}>
                    <Text style={styles.btntxt}>Share Invitation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.invitebtn} onPress={() => navigation.navigate("FillInvitation")}>
                    <Text style={styles.btntxt}>Fill Invitation</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.requestandviewall}>
                <Text style={{ fontSize: 14, fontFamily: "Roboto", color: "#000000" }}>Recent Requests</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 14, fontFamily: "Roboto", color: "#000000" }}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.requestsview}>
                <FlatList
                    data={allVisitors}
                    renderItem={({ item }) => (
                        <VisitorComponent visitor={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item.ID.toString()}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    bannerview: {
        width: "92%",
        height: "20%",
        alignSelf: "center",
        marginTop: 25,
        backgroundColor: "#FFFFFF",
        padding: 10,
        elevation: 5,
        borderRadius: 10
    },
    bannerposter: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bannerimg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 2,
        marginTop: 5
    },
    bannertitle: {
        fontSize: 14,
        fontWeight: "800",
        fontFamily: "Roboto",
        color: "#000000",
        marginTop: 12
    },
    bannerdescription: {
        fontSize: 10,
        fontWeight: "400",
        fontFamily: "Roboto",
        color: "#000000",
        fontStyle: "italic",
        marginTop: 5,
        marginBottom:10
    },
    visitorscountview: {
        width: "100%",
        height: "50%",
        flexDirection: "row",
        justifyContent: "space-between",
        padding:"3%"
    },

    countview: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#B3261E",
        width: "30%",
        borderRadius: 10,
    },
    txt: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "Roboto",
    },
    inviteview: {
        height: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginHorizontal: 20
    },
    invitebtn: {
        borderColor: "#B3261E",
        borderWidth: 3,
        width: "48%",
        borderRadius: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    btntxt: {
        color: "#2C2C2C",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Roboto"
    },
    requestandviewall: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: "6.5%",
        marginTop: 15
    },

    textview: {
        width: "50%"
    },
    requestsview: {
        marginLeft: "6%",
        marginRight: "6%",
        marginTop: 10,
        height: "64%"
    }


})