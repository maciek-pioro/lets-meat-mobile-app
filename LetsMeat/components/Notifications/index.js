import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Header } from '../Header';
import NotificationsScreen from './notificationsScreen';

const Stack = createStackNavigator();

const Notifications = () => (
  <Stack.Navigator
    initialRouteName="NotificationsContent"
    headerMode="screen"
    screenOptions={{
      header: ({ scene, previous, navigation }) => (
        <Header scene={scene} previous={previous} navigation={navigation} />
      ),
    }}
  >
    <Stack.Screen
      name="NotificationsContent"
      component={NotificationsScreen}
      options={{ headerTitle: 'Notifications' }}
    />
  </Stack.Navigator>
);

export default Notifications;
