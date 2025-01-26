import { StyleSheet, Text, View, Switch } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import { patchDataWithInt } from '../components/ApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = () => {
  const { loggedUser, setLoggedUser, accessToken } = useContext(UserContext);
  const [isEnabled, setIsEnabled] = useState(false);

  // Initialize `isEnabled` when `loggedUser` changes
  useEffect(() => {
    if (loggedUser?.Email_Notifications !== undefined) {
      setIsEnabled(loggedUser.Email_Notifications);
    }
  }, [loggedUser]);

  const toggleSwitch = async () => {
    const newNotificationState = !isEnabled;
    setIsEnabled(newNotificationState);
    await toggleEmailNotificationChange(newNotificationState);
  };

  const toggleEmailNotificationChange = async (isNotification) => {
    try {
      console.log('Updating email notification to:', isNotification);

      const updateField = { Email_Notifications: isNotification };
      const updateData = {
        criteria: `ID==${loggedUser.userId}`,
        data: updateField,
      };

      console.log('Logged user ID:', loggedUser.userId);
      const res = await patchDataWithInt('All_App_Users', updateData, accessToken);
      console.log('Response from API:', res);

      // Update local storage and context
      await updateLocalUserState(isNotification);
    } catch (error) {
      console.error('Error updating email notifications:', error);
    }
  };

  const updateLocalUserState = async (isNotification) => {
    const updatedUser = {
      ...loggedUser,
      Email_Notifications: isNotification,
    };

    await AsyncStorage.setItem('existedUser', JSON.stringify(updatedUser));
    setLoggedUser(updatedUser);

    console.log('User state updated locally.');
  };

  return (
    <View style={styles.container}>
      {/* Mail Notifications Section */}
      <View style={styles.toggleSection}>
        <Text
          style={[styles.toggleText]}
        >
          Mail Notifications
        </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#FFCDD2' }}
          thumbColor={isEnabled ? '#B21E2B' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 5,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align text to the left and switch to the right
    alignItems: 'center',
  },
  toggleText: {
    color: '#1F2024',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});
