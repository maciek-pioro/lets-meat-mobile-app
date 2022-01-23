import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useLayoutEffect } from 'react';
import { Header } from '../../Header';
import { store } from '../../Store';
import Invite from './invite';
import SettingsScroll from './main';
import { MembersScreen } from './members';
import { SendTransfer } from './sendTransfer';

const Stack = createStackNavigator();

const SCREENS_WITHOUT_TABS = new Set(['Invite', 'Members', 'SendTransfer']);

const Settings = ({ navigation, route }) => {
  const { state } = useContext(store);

  useLayoutEffect(() => {
    const screenName = getFocusedRouteNameFromRoute(route);
    if (SCREENS_WITHOUT_TABS.has(screenName)) navigation.setOptions({ tabBarVisible: false });
    else navigation.setOptions({ tabBarVisible: true });
  }, [navigation, route]);

  return (

    <Stack.Navigator
      initialRouteName="Settings"
      headerMode="float"
      screenOptions={{
        headerTitle: state.group.name,
        // eslint-disable-next-line no-shadow
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScroll}
      />
      <Stack.Screen
        name="Invite"
        component={Invite}
      />
      <Stack.Screen
        name="SendTransfer"
        component={SendTransfer}
      />
      <Stack.Screen
        name="Members"
        component={MembersScreen}
      />
    </Stack.Navigator>
  );
};

export default Settings;
export { Settings };
