import React, { useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  GoogleSignin
} from '@react-native-community/google-signin';
import { DrawerItem } from '@react-navigation/drawer';
import {
  StyleSheet, View
} from 'react-native';
import {
  Avatar,
  Caption, Drawer,
  Title
} from 'react-native-paper';
import Notifications from '../Notifications/drawer';
import { store } from '../Store';

export const DrawerButton = ({
  onPress, icon, label
}) => (
  <DrawerItem
    icon={({ color, size }) => (
      <MaterialCommunityIcons
        name={icon}
        color={color}
        size={size}
      />
    )}
    onPress={onPress}
    label={label}
  />
);

function DrawerContent({ navigation }) {
  const { state, dispatch } = useContext(store);

  return (
    <View
      style={styles.drawer}
    >
      <View>
        <View style={styles.userInfo}>
          <Avatar.Image size={50} source={{ uri: state.user.photo }} />
          <Title style={styles.title}>{state.user.name}</Title>
          <Caption style={styles.caption}>{state.user.email}</Caption>
        </View>
      </View>
      <Drawer.Section style={styles.drawerSection}>
        <DrawerButton
          icon="settings-outline"
          label="Preferences"
          onPress={() => navigation.navigate('Preferences')}
        />
      </Drawer.Section>
      <Drawer.Section style={styles.drawerSection}>
        {state.group && state.group.id && (
        <DrawerButton
          icon="account-multiple-outline"
          label={state.group.name}
          onPress={() => navigation.navigate('Feed')}
        />
        )}
        <DrawerButton
          icon="account-group-outline"
          label="Groups"
          onPress={() => navigation.navigate('Groups')}
        />
      </Drawer.Section>
      <Drawer.Section style={{ ...styles.drawerSection, ...styles.notificationsSection }}>
        <Notifications navigation={navigation} />
      </Drawer.Section>
      <Drawer.Section style={styles.lastDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="logout"
              color={color}
              size={size}
            />
          )}
          label="Log Out"
          onPress={async () => {
            await GoogleSignin.signOut();
            dispatch({ type: 'LOGOUT' });
            dispatch({ type: 'SET_LOADED' });
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: 'rgb(250, 250, 250)'
  },
  userInfo: {
    paddingLeft: 20,
    paddingTop: 20
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey'
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  drawerSection: {
    marginTop: 15,
  },
  notificationsSection: {
    marginTop: 5
  },
  lastDrawerSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 15
  }
});

export default DrawerContent;
