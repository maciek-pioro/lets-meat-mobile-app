import React, { useContext, useState, useLayoutEffect } from 'react';
import Slider from '@react-native-community/slider';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { BackgroundContainer } from '../Background';
import { Header } from '../Header';
import { updatePrefs } from '../Requests';
import { store } from '../Store';
import UserCard from '../User';

const PrefSetter = ({
  prefName, displayName, setPrefs, prefs
}) => (
  <Card style={styles.setterCard} elevation={0}>
    <Card.Title title={displayName} />
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={100}
      value={prefs[prefName]}
      onSlidingComplete={(v) => {
        setPrefs({ ...prefs, [prefName]: parseInt(v, 10) });
      }}
    />
  </Card>
);

const PreferencesContent = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [prefs, setPrefs] = useState(state.user.prefs);

  useLayoutEffect(() => {
    navigation.setOptions({
      rightIcon: 'content-save',
      rightAction: () => {
        updatePrefs({ state, dispatch }, prefs).then(
          () => dispatch({ type: 'UPDATE_PREFS', prefs })
        );
      }
    });
  }, [navigation, prefs, state, dispatch]);

  return (
    <BackgroundContainer backgroundVariant="settings">
      <UserCard user={{ ...state.user, picture_url: state.user.photo, prefs }} />
      <Card style={styles.card}>
        <Card.Title title="What's important to you?" />
        <PrefSetter prefName="price" displayName="Low Price" setPrefs={setPrefs} prefs={prefs} />
        <PrefSetter prefName="waiting_time" displayName="Waiting Time" setPrefs={setPrefs} prefs={prefs} />
        <PrefSetter prefName="amount_of_food" displayName="Portion Size" setPrefs={setPrefs} prefs={prefs} />
        <PrefSetter prefName="taste" displayName="Taste" setPrefs={setPrefs} prefs={prefs} />
      </Card>
    </BackgroundContainer>

  );
};

const Stack = createStackNavigator();

const Preferences = () => (
  <Stack.Navigator
    initialRouteName="PreferencesContent"
    headerMode="screen"
    screenOptions={{
      header: ({ scene, previous, navigation }) => (
        <Header scene={scene} previous={previous} navigation={navigation} />
      ),
    }}
  >
    <Stack.Screen
      name="PreferencesContent"
      component={PreferencesContent}
      options={{ headerTitle: 'Preferences' }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    margin: 50
  },
  card: {
    marginTop: 5,
    margin: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.9)'
  },
  slider: {
    margin: 10,
  },
  setterCard: {
    marginTop: 5,
    margin: 20,
    backgroundColor: 'rgba(240, 240, 240, 0)'
  },
});

export default Preferences;
