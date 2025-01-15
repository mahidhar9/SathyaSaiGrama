import React, {useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Invite from '../../src/screens/Invite';
import {ActivityIndicator, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import ApprovalTab from '../../src/screens/approval/ApprovalTab';
import Profile from '../../src/screens/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import VisitorFills from '../../src/screens/VisitorFills';
import FillByYourSelf from '../../src/screens/FillByYourSelf';
import MyProfile from '../../src/screens/MyProfile';
import Notifications from '../../src/screens/Notifications';
import Settings from '../../src/screens/Settings';
import VerifyDetails from '../../src/screens/approval/VerifyDetails';
import EditVerifyDetails from '../../src/screens/approval/EditVerifydetails';
import UserContext from '../../context/UserContext';
import {AuthContext} from '../../src/auth/AuthProvider';
import {
  getDataWithString,
  getDataWithInt,
} from '../../src/components/ApiRequest';
import Edit from '../../src/screens/Edit';
import AddData from '../../src/screens/AddData';
import FamilyMemberVerifyDetails from '../../src/screens/FamilyMemberVerifyDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import L2ApprovalTab from '../../src/screens/L2-approval/L2ApprovalTab';
import ViewDetails from '../../src/screens/L2-approval/ViewDetails';
import FlatMembers from '../../src/screens/FlatMembers';
import Feedback from '../../src/screens/Feedback';

const Tab = createBottomTabNavigator();
const InviteStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ApproveStack = createNativeStackNavigator();
const LApprovalStack = createNativeStackNavigator();

function InviteStackScreen({navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset stack to the initial route (ScreenA)
      navigation.reset({
        index: 0,
        routes: [{name: 'Invite'}],
      });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <InviteStack.Navigator
      screenOptions={{headerShown: true, unmountOnBlur: true}}>
      <InviteStack.Screen
        name="Invite"
        component={Invite}
        options={{headerShown: false, animation: 'none'}}
      />
      {/* <InviteStack.Screen
                name="VisitorFills"
                component={VisitorFills}
            /> */}
      <InviteStack.Screen
        name="FillByYourSelf"
        component={FillByYourSelf}
        options={{
          title: 'Visitor Information',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#1F2024',
          headerTitleStyle: {
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: '800',
            alignSelf: 'center',
            textAlign: 'center',
            fontStyle: 'normal',
            lineHeight: 30,
            alignItems: 'center',
          },
          animation: 'fade',
        }}
      />
    </InviteStack.Navigator>
  );
}

function ProfileStackScreen({navigation}) {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
      }}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{headerTitle: 'My Profile'}}
      />
      <ProfileStack.Screen name="Notifications" component={Notifications} />
      <ProfileStack.Screen name="Settings" component={Settings} />
      <ProfileStack.Screen name="Edit" component={Edit} />
      <ProfileStack.Screen name="AddData" component={AddData} />
      <ProfileStack.Screen
        name="FamilyMemberVerifyDetails"
        component={FamilyMemberVerifyDetails}
      />
      <ProfileStack.Screen name="Feedback" component={Feedback} />
      <ProfileStack.Screen name="FlatMembers" component={FlatMembers} />
    </ProfileStack.Navigator>
  );
}

const ApprovalStack = ({navigation}) => {
  const {editData} = useContext(UserContext);
  return (
    <ApproveStack.Navigator>
      <ApproveStack.Screen
        name="ApprovalTab"
        component={ApprovalTab}
        options={{
          header: () => (
            <View
              style={{
                height: 62,
                padding: 19.5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF',
              }}>
              <Text
                style={{
                  fontStyle: 'normal',
                  fontWeight: 800,
                  fontSize: 14,
                  color: '#1F2024',
                  fontFamily: 'Inter',
                  textAlign: 'center',
                }}>
                My Approvals
              </Text>
            </View>
          ),
        }}
      />
      <ApproveStack.Screen
        name="VerifyDetails"
        component={VerifyDetails}
        options={{
          title: 'Visitor details',
          headerTintColor: '#B21E2B',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ApprovalTab')}>
              <Image
                source={require('../../src/assets/arrow_left_alt.png')} // Your icon URL here
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 15,
                  tintColor: '#B21E2B',
                }} // Adjust style as needed
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditVerifydetails', {user: editData})
              }>
              <Image
                source={require('../../src/assets/edit.png')} // Your icon URL here
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 15,
                  tintColor: '#B21E2B',
                }} // Adjust style as needed
              />
            </TouchableOpacity>
          ),
        }}
      />
    </ApproveStack.Navigator>
  );
};

const AppApproveStack = ({navigation}) => {
  return (
    <LApprovalStack.Navigator screenOptions={{headerShown: false}}>
      <ApproveStack.Screen name="ApprovalStack" component={ApprovalStack} />
      <ApproveStack.Screen
        name="EditVerifydetails"
        component={EditVerifyDetails}
        options={{
          title: 'Edit visitor details',
          headerShown: true,
          headerTintColor: '#B21E2B',
        }}
      />
    </LApprovalStack.Navigator>
  );
};

const L2ApprovalStack = ({navigation}) => {
  const {loggedUser, accessToken, setUserType, userType, userEmail} =
    useContext(UserContext);
  const {setUser} = useContext(AuthContext);

  return (
    <ApproveStack.Navigator>
      <ApproveStack.Screen
        name="L2ApprovalTab"
        component={L2ApprovalTab}
        options={{
          header: () => (
            <View
              style={{
                height: 56,
                padding: 19.5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF',
              }}>
              <Text
                style={{
                  fontStyle: 'normal',
                  fontWeight: 800,
                  fontSize: 14,
                  color: '#1F2024',
                  fontFamily: 'Inter',
                  textAlign: 'center',
                }}>
                L1 Requests
              </Text>
            </View>
          ),
        }}
      />
      <ApproveStack.Screen
        name="ViewDetails"
        component={ViewDetails}
        options={{
          title: 'Visitor details',
          headerTintColor: '#B21E2B',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('L2ApprovalTab')}>
              <Image
                source={require('../../src/assets/arrow_left_alt.png')} // Your icon URL here
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 15,
                  tintColor: '#B21E2B',
                }} // Adjust style as needed
              />
            </TouchableOpacity>
          ),
        }}
      />
    </ApproveStack.Navigator>
  );
};

//================================================
//Footer Tab Navigation

function FooterTab({navigation}) {
  const {loggedUser} = useContext(UserContext);

  return (
    <>
      {!loggedUser ? (
        <ActivityIndicator
          size="large"
          color="red"
          style={styles.loadingContainer}
        />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              height: 88,
              borderTopWidth: 0,
              elevation: 0,
              paddingTop: 16,
              paddingLeft: 16,
              paddingRight: 16,
              paddingBottom: 32,
              gap: 4,
            },
          }}>
          <Tab.Screen
            name="InviteStackScreen"
            component={InviteStackScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <View style={styles.iconContainer}>
                  <Image
                    source={
                      !focused
                        ? require('../../src/assets/invitation.png')
                        : require('../../src/assets/invitationDark.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: focused ? '#B21E2B' : '#D4D6DD',
                    }}
                  />
                  <Text style={focused ? styles.pressed : styles.notpressed}>
                    Invite
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="AppApproveStack"
            component={AppApproveStack}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <View style={styles.iconContainer}>
                  <Image
                    source={
                      focused
                        ? require('../../src/assets/approvedDark.png')
                        : require('../../src/assets/approved.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: focused ? '#B21E2B' : '#D4D6DD',
                    }}
                  />
                  <Text style={focused ? styles.pressed : styles.notpressed}>
                    My Approvals
                  </Text>
                </View>
              ),
            }}
          />
          {loggedUser.role === 'L2' ? (
            <Tab.Screen
              name="L2ApprovalStack"
              component={L2ApprovalStack}
              options={{
                headerShown: false,
                tabBarIcon: ({focused}) => (
                  <View style={styles.iconContainer}>
                    <Image
                      source={
                        focused
                          ? require('../../src/assets/request.png')
                          : require('../../src/assets/request.png')
                      }
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: focused ? '#B21E2B' : '#D4D6DD',
                      }}
                    />
                    <Text style={focused ? styles.pressed : styles.notpressed}>
                      L1 Requests
                    </Text>
                  </View>
                ),
              }}
            />
          ) : null}
          <Tab.Screen
            name="ProfileStackScreen"
            component={ProfileStackScreen}
            options={{
              headerShown: false,

              tabBarIcon: ({focused}) => (
                <View style={styles.iconContainer}>
                  <Image
                    source={
                      focused
                        ? require('../../src/assets/userDark.png')
                        : require('../../src/assets/user.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: focused ? '#B21E2B' : '#D4D6DD',
                    }}
                  />
                  <Text style={focused ? styles.pressed : styles.notpressed}>
                    Account
                  </Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
}

export default FooterTab;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pressed: {
    color: '#1F2024',
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.165,
  },
  notpressed: {
    color: '#71727A',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    letterSpacing: 0.165,
  },
});
