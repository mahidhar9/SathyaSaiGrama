import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { View, Text } from 'react-native'
import DailyVisitorScreen from '../../src/screens/daily-visitors/DailyVisitorScreen'
import ShareInvitation from '../../src/screens/daily-visitors/ShareInvitation'
import FillInvitation from '../../src/screens/daily-visitors/FillInvitation'
import ViewAll from '../../src/screens/daily-visitors/ViewAll'
import ApprovedCard from '../../src/screens/daily-visitors/ApprovedCard'

function DailyVisitorTab() {
  const DailyVisitorStack = createNativeStackNavigator()

  return (
      <DailyVisitorStack.Navigator screenOptions={{
        headerTintColor: '#1E1E1E',
        headerStyle: {
          backgroundColor: '#FFD8E4', // Background color of the header
        },
          headerTitleStyle: {
            fontFamily: 'Subheading',
            fontSize: 18,
            fontWeight: '800',
            textAlign: 'center',
            fontStyle: 'normal',
          },
      }}>
        <DailyVisitorStack.Screen  name="DailyVisitorScreen" component={DailyVisitorScreen} options={{ headerShown: false}}/>
        <DailyVisitorStack.Screen name="ShareInvitation" component={ShareInvitation} options={{ headerShown: false}} />
        <DailyVisitorStack.Screen name='FillInvitation' component={FillInvitation} options={{ title: "Invitation Form"}}/>
        <DailyVisitorStack.Screen name="ViewAll" component={ViewAll} options={{ headerShown: false}}/>
        <DailyVisitorStack.Screen name="ApprovedCard" component={ApprovedCard} options={{ title: "Approved"}}/>
      </DailyVisitorStack.Navigator>
  )
}

export default DailyVisitorTab
