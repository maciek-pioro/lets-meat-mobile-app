import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useLayoutEffect } from 'react';
import { Header } from '../../Header';
import { store } from '../../Store';
import { NewEventContent } from '../NewEvent';
import AddDebt from './addDebt';
import AddLocation from './addLocation';
import CreateLocation from './createLocation';
import EventView from './event';
import FeedContent from './feedContent';
import RateLocation from './rateLocation';
import VoteLocation from './voteLocation';
import VoteTime from './voteTime';

const Stack = createStackNavigator();

const SCREENS_WITHOUT_TABS = new Set(['Event',
  'VoteTime', 'VoteLocation', 'AddLocation',
  'CreateLocation', 'AddDebt', 'RateLocation',
  'NewEvent']);

const Feed = ({ navigation, route }) => {
  const { state } = useContext(store);

  useLayoutEffect(() => {
    const screenName = getFocusedRouteNameFromRoute(route);
    if (SCREENS_WITHOUT_TABS.has(screenName)) {
      navigation.setOptions({ tabBarVisible: false });
    } else {
      navigation.setOptions({ tabBarVisible: true });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="Feed"
      headerMode="screen"
      screenOptions={{
        headerTitle: state.group.name,
        // eslint-disable-next-line no-shadow
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="Feed"
        component={FeedContent}
      />
      <Stack.Screen
        name="Event"
        component={EventView}
      />
      <Stack.Screen
        name="VoteTime"
        component={VoteTime}
      />
      <Stack.Screen
        name="AddLocation"
        component={AddLocation}
      />
      <Stack.Screen
        name="VoteLocation"
        component={VoteLocation}
      />
      <Stack.Screen
        name="CreateLocation"
        component={CreateLocation}
      />
      <Stack.Screen
        name="AddDebt"
        component={AddDebt}
      />
      <Stack.Screen
        name="RateLocation"
        component={RateLocation}
      />
      <Stack.Screen
        name="NewEvent"
        component={NewEventContent}
      />
    </Stack.Navigator>
  );
};

export default Feed;
