import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext';
import {BASE_APP_URL, APP_LINK_NAME, APP_OWNER_NAME, SECRET_KEY} from '@env';
import {encode} from 'base64-arraybuffer';

const VisitorComponent = ({ visitor, navigation }) => {

    const { accessToken } = useContext(UserContext);

    let L2ApprovalStatus = visitor.L2_Approval_Status
    let L1ApprovalStatus = visitor.Referrer_Approval

    let icon = ""
    let backgroundColor = ""
    let statusText = ""

    if (L2ApprovalStatus === "APPROVED" && L1ApprovalStatus === "APPROVED") {
        icon = require("../assets/ApprovedIcon.png")
        backgroundColor = "#34C75980"
        statusText = "Approved"
    } else if (L2ApprovalStatus === "REJECTED" || L1ApprovalStatus === "REJECTED") {
        icon = require("../assets/RejectedIcon.png")
        backgroundColor = "#FFD8E4"
        statusText = "Rejected"
    } else if (L2ApprovalStatus === "PENDING APPROVAL" && L1ApprovalStatus === "APPROVED") {
        icon = require("../assets/SubmittedIcon.png")
        backgroundColor = "#FF950080"
        statusText = "Submitted"
    } else if (L1ApprovalStatus === "PENDING APPROVAL") {
        icon = require("../assets/ReceivedIcon.png")
        backgroundColor = "#00000021"
        statusText = "Received"
    }

    const [profileImage, setProfileImage] = useState(require("../assets/user.png"));

    const getImage = async () => {
        try {
            const url = `${BASE_APP_URL}/${APP_OWNER_NAME}/${APP_LINK_NAME}/report/Approval_to_Visitor_Report/${visitor.ID}/Photo/download`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            });

            if (!response.ok) {
                return
            }

            const buffer = await response.arrayBuffer();
            const base64Image = encode(buffer); // Use the encode function from base64-arraybuffer
            const dataUrl = `data:image/jpeg;base64,${base64Image}`;
            setProfileImage({ uri: dataUrl });
            console.log("Image Fetched", dataUrl);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    useEffect(() => {
        getImage();
    }, []);

    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ApprovedCard", { visitor: visitor })}>
            <View style={styles.profileImgView}>
                <Image source={profileImage} style={styles.profileImg} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.nametxt}>{visitor.Name_field.zc_display_value}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.dateofvisittxt}>Date of Visit : </Text>
                    <Text style={[styles.dateofvisittxt, { color: "#000000" }]}>{visitor.Date_of_Visit}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.noofpeopletxt}>No. of People : </Text>
                    <Text style={[styles.noofpeopletxt, { color: "#000000" }]}>{visitor.Number_of_People}</Text>
                </View>
            </View>
            <View style={styles.statusview}>
                <View style={[styles.status, { backgroundColor: backgroundColor, flexDirection: "row", alignItems: "center" }]}>
                    <Image source={icon} style={{ width: 20, height: 10, marginEnd: 2 }} />
                    <Text style={styles.statustxt}>{statusText}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
}

export default VisitorComponent

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#E0E0E0",
        marginTop: 10,
        elevation: 3,
    },
    profileImgView: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 0,
        marginRight: 5
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#00000021"
    },
    textContainer: {
        width: "50%",
        justifyContent: "center"
    },
    nametxt: {
        fontSize: 16,
        fontWeight: "800",
        fontFamily: "Roboto",
        color: "#000000"
    },
    dateofvisittxt: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "Roboto",
        color: "#5B5B5B"
    },
    noofpeopletxt: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "Roboto",
        color: "#5B5B5B"
    },
    statusview: {
        width: "30%",
        justifyContent: "center",
        alignItems: "center"
    },
    status: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "Roboto",
        color: "#4A4459",
        padding: 5,
        borderRadius: 5,
        width: "95%",
    },
    statustxt: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Roboto",
        color: "#4A4459",
    }
})