import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button, Caption,
  IconButton, Subheading
} from 'react-native-paper';
import { getNotificationTimestamp, refreshNotifications } from '../../helpers/notifications';
import { store } from '../Store';
import { Notification } from './common';

const Notifications = ({ navigation }) => {
  const { state, dispatch } = useContext(store);

  const notifications = [...state.invitations, ...state.debts]
    .sort((a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a));

  return (
    <View>
      <View style={styles.headerContainer}>
        <Subheading style={styles.header}>Notifications</Subheading>
        <IconButton
          icon="refresh"
          size={20}
          style={styles.refreshButton}
          onPress={() => refreshNotifications({ state, dispatch })}
        />
      </View>
      {notifications.length > 0
        ? (
          <>
            {notifications.slice(0, 2)
              .map((item) => (
                <Notification
                  item={item}
                  key={`${item.group_id}${item.id}`}
                />
              ))}
            {notifications.length >= 1 && <Button onPress={() => navigation.navigate('Notifications')}>Show More</Button>}
          </>
        )
        : (
          <View style={styles.emptyNotificationsText}>
            <Caption>You have no pending notifications</Caption>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  refreshButton: {
    position: 'absolute',
    top: -9,
    right: 0
  },
  emptyNotificationsText: {
    alignItems: 'center',
    marginBottom: 10
  },
  headerContainer: {
    flexDirection: 'row',
    margin: 5
  },
  header: {
    margin: 10
  }
});

export default Notifications;
