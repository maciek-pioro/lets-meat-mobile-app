import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator, Avatar, Caption, Card, Dialog, Portal, TextInput
} from 'react-native-paper';
import { getUsersInfo } from '../Requests';
import { store } from '../Store';
import Prefs from './prefs';

export const UserPicker = ({
  userIds, dialogVisible, onDismiss, setUser
}) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(store);

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    getUsersInfo({ state, dispatch }, userIds).then((usersInfo) => {
      setUsers(usersInfo);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id, userIds]);

  return (
    <Portal>
      <Dialog
        visible={dialogVisible}
        contentContainerStyle={styles.container}
        onDismiss={onDismiss}
      >
        <Dialog.Content>
          <TextInput
            mode="outlined"
            label="Search user"
            onChangeText={setQuery}
            value={query}
          />
          {loading ? <ActivityIndicator />
            : (
              <ScrollView>
                { filteredUsers.map((u) => (
                  <UserCard
                    user={u}
                    key={u.id}
                    onPress={() => {
                      setUser(u);
                      if (onDismiss) onDismiss();
                    }}
                  />
                ))}
              </ScrollView>
            )}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const UserCard = ({
  user, style, actions, onPress
}) => (
  <Card key={user.id} style={{ ...styles.userCard, ...style }} onPress={onPress}>
    <Card.Title title={user.name} subtitle={user.email} />
    <Card.Content style={styles.content}>
      <View style={styles.leftContent}>
        <Avatar.Image source={{ uri: user.picture_url }} />
      </View>
      <View style={styles.rightContent}>
        {user.prefs
          ? (
            <Prefs prefs={user.prefs} />
          ) : <Caption style={styles.noPreferencesMessage}>User Preferences not available</Caption>}
      </View>
    </Card.Content>
    {actions
    && (
    <Card.Actions>
      {actions}
    </Card.Actions>
    )}
  </Card>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  noPreferencesMessage: {
    fontStyle: 'italic',
    alignSelf: 'center',
    marginTop: 20
  },
  userCard: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  content: {
    marginTop: 10,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row'
  },
  leftContent: {
    marginLeft: 5,
    flexGrow: 1,
  },
  rightContent: {
    marginTop: -15,
    marginLeft: 20,
    marginRight: 0,
    maxWidth: '70%',
    display: 'flex',
    flexDirection: 'column'
  },
});

export default UserCard;
