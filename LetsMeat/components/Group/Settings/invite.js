import { debounce } from 'debounce';
import React, {
  useCallback, useContext,
  useEffect, useRef, useState
} from 'react';
import {
  StyleSheet, Text, View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Avatar, Button, Chip, FAB, Searchbar
} from 'react-native-paper';
import { MIN_SEARCH_LENGTH } from '../../../constants';
import { BackgroundContainer } from '../../Background';
import { searchUsers, sendInvitation } from '../../Requests';
import { store } from '../../Store';
import UserCard from '../../User';

const SelectedUsers = ({ users, onClose }) => (
  <View style={styles.selectedUserContainer}>
    <ScrollView horizontal>
      {users ? users.map((user) => (
        <Chip
          key={user.id}
          avatar={<Avatar.Image source={{ uri: user.picture_url }} size={24} />}
          onClose={() => onClose(user.id)}
        >
          <Text>
            {user.name}
          </Text>
        </Chip>
      ))
        : <Chip><Text>Nothin to show</Text></Chip>}
    </ScrollView>
  </View>
);

const Invite = ({ navigation }) => {
  const mounted = useRef(false);

  const { state, dispatch } = useContext(store);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const persistentSearchQuery = useRef('');

  const getSearchResults = useCallback(() => {
    if (!persistentSearchQuery.current
      || persistentSearchQuery.current.length <= MIN_SEARCH_LENGTH) return;
    searchUsers({ state, dispatch }, persistentSearchQuery.current).then((results) => {
      if (!mounted.current) return;
      setSearchResults(results);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id]);

  // Only to be called once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(getSearchResults, 1000), []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    persistentSearchQuery.current = query;
    if (query.length <= 3) return;
    debouncedSearch();
  };

  const invite = (user) => () => {
    if (selectedUsers.find((u) => u.id === user.id)) return;
    setSelectedUsers([...selectedUsers, user]);
  };

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  return (
    <BackgroundContainer backgroundVariant="searching">
      <SelectedUsers
        users={selectedUsers}
        onClose={(id) => { setSelectedUsers(selectedUsers.filter((u) => u.id !== id)); }}
      />
      <Searchbar
        style={styles.searchbar}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <ScrollView>
        {searchResults && searchResults.map((result) => {
          let disabled = false;
          let message = 'Invite';
          if (state.group.users.find((u) => u.id === result.id)) {
            disabled = true;
            message = 'Already a member';
          }
          if (selectedUsers.find((u) => u.id === result.id)) {
            disabled = true;
            message = 'Will be invited';
          }
          return (
            <UserCard
              key={result.id}
              user={result}
              actions={(
                <Button
                  disabled={disabled}
                  onPress={invite(result)}
                >
                  {message}
                </Button>
            )}
            />
          );
        })}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="send"
        label="Invite"
        disabled={!selectedUsers || selectedUsers.length === 0}
        onPress={() => {
          selectedUsers.forEach((user) => {
            sendInvitation({ state, dispatch }, user.id, state.group.id);
          });
          navigation.goBack();
        }}
      />
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    margin: 5
  },
  selectedUserContainer: {
    margin: 5
  },
  fab: {
    margin: 20,
    marginBottom: 80,
    right: 0,
    position: 'absolute',
    bottom: 0,
  }
});

export default Invite;
