import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Feed from '../Feed';
import { Settings } from '../Settings';

const Tab = createBottomTabNavigator();

const makeIcon = (name) => ({ focused, color }) => (
  <MaterialCommunityIcons
    name={name}
    size={focused ? 25 : 20}
    color={color}
  />
);

const ACTIVE_TAB_COLOR = 'rgba(240, 240, 240, 1)';
const INACTIVE_TAB_COLOR = 'rgba(30, 30, 30, 1)';
const TABS_BACKGROUND_COLOR = 'rgba(160, 160, 160, 0.7)';

export const BottomTabs = () => (
  <Tab.Navigator
    initialRouteName="Feed"
    tabBarOptions={{
      activeTintColor: ACTIVE_TAB_COLOR,
      inactiveTintColor: INACTIVE_TAB_COLOR,
      labelStyle: {
        fontSize: 12
      },
      style: {
        position: 'absolute',
        backgroundColor: TABS_BACKGROUND_COLOR,
        left: 0,
        bottom: 0,
        right: 0,
        elevation: 0,
        borderTopWidth: 0
      }
    }}
  >
    <Tab.Screen
      name="Feed"
      component={Feed}
      options={{
        tabBarVisible: true,
        tabBarIcon: makeIcon('home-account'),
      }}
    />
    <Tab.Screen
      name="Group Info"
      component={Settings}
      options={{
        tabBarIcon: makeIcon('account-group'),
      }}
    />
  </Tab.Navigator>
);

export default BottomTabs;
