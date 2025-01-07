import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ApprovedCard = () => {
    return (
        <View style={styles.container}>

            {/* Card Section */}
            <View style={styles.card}>
                {/* Profile Picture and Name */}
                <View style={styles.headSection}>
                    <View >
                        <TouchableOpacity>
                            <Image
                                source={require('../../assets/profileImg.png')}
                                style={styles.propic}
                            />
                        </TouchableOpacity>
                        <Text style={styles.nameText}>Ravi</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Gender: </Text>
                            <Text style={styles.value}>Male</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Number: </Text>
                            <Text style={styles.value}>9898989899</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date of Visit: </Text>
                            <Text style={styles.value}>12/12/2024</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>L1 Approver: </Text>
                            <Text style={styles.value}>Gangi Reddy</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: "8%" }}>
                        <TouchableOpacity style={styles.shareButton}>
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
                            <Text style={styles.value}>Office</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>No. of People: </Text>
                            <Text style={styles.value}>5</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Guest Category: </Text>
                            <Text style={styles.value}>VIP</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Priority: </Text>
                            <Text style={styles.value}>P1</Text>
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
                        <Image
                            source={require('../../assets/edit.png')}
                            style={styles.shareIcon}
                        />
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
        backgroundColor: '#fffffsf',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        height: '26%',
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
        height: '22%',
        justifyContent: "center",
        alignSelf: 'flex-end',
        marginTop: '7%',
        marginBottom: '7%',
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
        width: '38%',
        height: 43,
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