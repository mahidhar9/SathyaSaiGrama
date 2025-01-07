import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BuggyServiceTab from './buttom-tabs/BuggyServiceTab'
import DailyVisitorTab from './buttom-tabs/DailyVisitorTab'
import LateEntryTab from './buttom-tabs/LateEntryTab'
import MoreTab from './buttom-tabs/MoreTab'

function BottomNavigation() {

  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        height: 70,
        borderTopWidth: 0,
        elevation: 0,
        padding: 10,
        gap: 4,
        paddingBottom: 20
      },
    }}>
      <Tab.Screen name="DailyVisitorTab" component={DailyVisitorTab}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image source={require('../src/assets/DailyVisitorsIcon.png')}
                resizeMode="contain"
                style={{ width: 80, height: 80, tintColor: focused ? '#B21E2B' : '#49454F', marginTop: 10 }}
              />
            </View>
          )
        }} />
      <Tab.Screen name="BuggyServiceTab" component={BuggyServiceTab} 
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image source={require('../src/assets/BuggyServiceIcon.png')}
              resizeMode="contain"
              style={{ width: 80, height: 80, tintColor: focused ? '#B21E2B' : '#49454F', marginTop: 10 }}
            />
          </View>
        )
      }} />
      <Tab.Screen name="LateEntryTab" component={LateEntryTab} 
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image source={require('../src/assets/LateEntryIcon.png')}
              resizeMode="contain"
              style={{ width: 80, height: 80, tintColor: focused ? '#B21E2B' : '#49454F', marginTop: 10 }}
            />
          </View>
        )
      }} />
      <Tab.Screen name="MoreTab" component={MoreTab} 
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image source={require('../src/assets/MoreIcon.png')}
              resizeMode="contain"
              style={{ width: 80, height: 80, tintColor: focused ? '#B21E2B' : '#49454F', marginTop: 10 }}
            />
          </View>
        )
      }} />
    </Tab.Navigator>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
