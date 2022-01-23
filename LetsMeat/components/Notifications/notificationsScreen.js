import React, { useCallback, useContext, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Caption
} from 'react-native-paper';
import { getNotificationTimestamp, refreshNotifications } from '../../helpers/notifications';
import { BackgroundContainer, ScrollPlaceholder } from '../Background';
import { store } from '../Store';
import { Notification } from './common';

const Notifications = () => {
  const { state, dispatch } = useContext(store);

  const [refreshing, setRefreshing] = useState(false);

  const notifications = [...state.invitations, ...state.debts]
    .sort((a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshNotifications({ state, dispatch }).finally(() => setRefreshing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id]);

  return (
    <BackgroundContainer backgroundVariant="money">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {notifications.length > 0
          ? (
            <>
              {notifications
                .map((item) => (
                  <Notification
                    item={item}
                    key={`${item.group_id}${item.id}`}
                    full
                  />
                ))}
            </>
          )
          : (
            <View style={styles.noPending}>
              <Caption>You have no pending notifications</Caption>
            </View>
          )}
        <ScrollPlaceholder height={100} />
      </ScrollView>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  noPending: {
    alignItems: 'center',
    marginBottom: 10
  }
});

export default Notifications;
