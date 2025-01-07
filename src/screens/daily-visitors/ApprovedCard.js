

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState, useFocusEffect } from 'react'
import RNFS from 'react-native-fs';

const ApprovedCard = ({ route }) => {
    const { visitor } = route.params;
    let visitorID = visitor.ID;
    const { profileImage } = route.params;
    const [QrCodephoto, setQrCodephoto] = useState();
    const [photo, setPhoto] = useState();
    const [loading, setLoading] = useState(true);
    console.log("Visitor is: ", profileImage);

    return (
        <View style={styles.container}>

            {/* Card Section */}
            <View style={styles.card}>
                {/* Profile Picture and Name */}
                <View style={styles.headSection}>
                    <View >
                        <TouchableOpacity>
                            <Image
                                source={profileImage}
                                style={styles.propic}
                            />
                        </TouchableOpacity>
                        <Text style={styles.nameText}>{visitor.Name_field.first_name} {visitor.Name_field.last_name}</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Gender: </Text>
                            <Text style={styles.value}>{visitor.Gender}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Number: </Text>
                            <Text style={styles.value}>{visitor.Phone_Number}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date of Visit: </Text>
                            <Text style={styles.value}>{visitor.Date_of_Visit}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>L1 Approver: </Text>
                            <Text style={styles.value}>{visitor.Referrer_App_User_lookup.Name_field}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>No. of Boys: </Text>
                            <Text style={styles.value}>{visitor.Number_of_Boys}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>No. of Girls: </Text>
                            <Text style={styles.value}>{visitor.Number_of_Girls}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: "8%" }}>
                        <TouchableOpacity style={styles.shareButton} onPress={() => {
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={require('../../assets/share.png')}
                                    style={styles.shareIcon}
                                />
                                <Text style={styles.shareButtonText}>Share</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <Text style={styles.label}>Place of Visit: </Text>
                            <Text style={styles.value}>{visitor.Home_or_Office}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>No. of People: </Text>
                            <Text style={styles.value}>{visitor.Number_of_People}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Guest Category: </Text>
                            <Text style={styles.value}>{visitor.Guest_Category}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Priority: </Text>
                            <Text style={styles.value}>{visitor.Priority}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>No. of Men: </Text>
                            <Text style={styles.value}>{visitor.Number_of_Men}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>No. of Women: </Text>
                            <Text style={styles.value}>{visitor.Number_of_Women}</Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.editButton}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('../../assets/edit.png')}
                            style={styles.shareIcon}
                        />
                        <Text style={styles.editButtonText}>Edit</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.rejectButtonText}>Reject</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        fontFamily: 'Roboto',
        padding: '5%',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: '1%' },
        shadowRadius: '1%',
    },
    nameText: {
        fontSize: 16,
        color: '#000000',
        marginTop: '9%',
    },
    row: {
        flexDirection: 'row',
        marginVertical: '2%',
    },
    label: {
        fontSize: 12,
        color: '#5B5B5B',
    },
    value: {
        fontSize: 12,
        color: '#000000',
    },
    shareButton: {
        backgroundColor: '#E8B131',
        paddingVertical: 8,
        borderRadius: 8,
        width: '80%',
        justifyContent: "center",
        alignSelf: 'flex-end',
        marginTop: '7%',
        marginBottom: '18%',
        flexDirection: 'row',
    },
    shareButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    editButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#C00F0C',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '45%',
    },
    editButtonText: {
        fontSize: 14,
        weight: 'bold',
        color: '#000000',
    },
    rejectButton: {
        backgroundColor: '#C00F0C',
        width: '45%',
        paddingVertical: 8,
        justifyContent: 'center',
        paddingHorizontal: 24,
        flexDirection: 'row',
        borderRadius: 8,
    },
    rejectButtonText: {
        fontSize: 14,
        weight: 'bold',
        color: '#fff',
    },
    headSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    propic: {
        width: 50,
        height: 50,
        borderRadius: 85,
        textAlign: 'center',
        borderWidth: 0.2,
        borderColor: 'gray',
    },
    shareIcon: {
        width: 20,
        height: 18,
        marginEnd: 5,
        tintColor: 'black',
    }
});

export default ApprovedCard;