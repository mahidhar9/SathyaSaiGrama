import React from 'react'
import { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserContext from '../context/UserContext'
import BottomNavigation from './BottomNavigation'
import { SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../src/screens/Login'
import Register from '../src/screens/Register'
import ForgotPassword from '../src/screens/ForgotPassword'
import VerificationNotice from '../src/auth/VerificationNotice'

function RootNavigation() {

    const { loggedUser } = useContext(UserContext);

    const Stack = createNativeStackNavigator();


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    {
                        loggedUser ? (
                            <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                        )
                            :
                            <>
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="Register" component={Register} />
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                                <Stack.Screen name="VerificationNotice" component={VerificationNotice} />
                            </>
                    }

                </Stack.Navigator>
            </NavigationContainer>

        </SafeAreaView>
    )
}

export default RootNavigation
