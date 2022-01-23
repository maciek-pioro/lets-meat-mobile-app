import React, {
  useCallback, useContext, useEffect, useRef, useState
} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList, RefreshControl, StyleSheet, View
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  ActivityIndicator, Badge, Card, FAB, Paragraph
} from 'react-native-paper';
import { refreshNotifications } from '../../../helpers/notifications';
import { BackgroundContainer, ScrollPlaceholder } from '../../Background';
import { getGroupInfo, getGroups } from '../../Requests';
import { store } from '../../Store';
import { refreshGroup } from '../../../helpers/refresh';

const noGroupimage = require('../../../images/noGroups.jpg');

const RenderGroup = ({
  groupId, onPress
}) => {
  const { state, dispatch } = useContext(store);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    getGroupInfo({ state, dispatch }, groupId)
      .then((info) => {
        setGroup(info);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, groupId, state.user.id]);

  return (
    <Card
      style={styles.emptyCard}
      onPress={onPress}
    >
      <Card.Title title={group && group.name} />
      <Card.Content>
        <View style={styles.badgesContainer}>
          <MaterialCommunityIcons size={30} name="emoticon-outline" />
          <Badge
            size={20}
            style={styles.badge}
          >
            {group && group.users && group.users.length}
          </Badge>
          <MaterialCommunityIcons size={30} name="map-marker-outline" />
          <Badge
            size={20}
            style={styles.badge}
          >
            {group && group.custom_locations && group.custom_locations.length}
          </Badge>
        </View>
      </Card.Content>
    </Card>
  );
};

export const Groups = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const groupsLoaded = state.groups;
  useFocusEffect(useCallback(() => {
    if (groupsLoaded) setLoadingGroups(false);
    refreshNotifications({ state, dispatch });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsLoaded, state.user.id]));
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const groupSelected = useRef(false);

  const loadGroups = () => {
    if (!groupsLoaded) {
      getGroups({ state, dispatch }).then((groups) => {
        dispatch({ type: 'SET_GROUPS', payload: groups });
        setLoadingGroups(false);
      });
    } else setLoadingGroups(false);
  };

  useFocusEffect(
    useCallback(() => {
      groupSelected.current = false;
    }, [groupSelected])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getGroups({ state, dispatch }).then((groups) => {
      dispatch({ type: 'SET_GROUPS', payload: groups });
    }).finally(() => setRefreshing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id]);

  useEffect(loadGroups, [state, groupsLoaded, dispatch]);

  return (
    loadingGroups
      ? (
        <View style={styles.progressBar}>
          <ActivityIndicator />
        </View>
      )
      : (
        <>
          <BackgroundContainer backgroundVariant="office">
            <Spinner visible={spinner} textContent="Loading data" />
            <FlatList
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              refreshing={refreshing}
              data={state.groups}
              renderItem={({ item, separators }) => (
                <RenderGroup
                  groupId={item.id}
                  separators={separators}
                  navigation={navigation}
                  onPress={() => {
                    if (groupSelected.current) return;
                    groupSelected.current = true;
                    setSpinner(true);
                    refreshGroup(state, dispatch, item.id)
                      .then(() => navigation.navigate('Home', { screen: 'Feed' }))
                      .finally(() => setSpinner(false));
                  }}
                />
              )}
              ListEmptyComponent={() => (
                <Card
                  style={styles.emptyCard}
                >
                  <Card.Title title="Nothing to show" />
                  <Card.Cover source={noGroupimage} />
                  <Card.Content>
                    <Paragraph>
                      Consider adding a group
                    </Paragraph>
                  </Card.Content>
                </Card>
              )}
              ListFooterComponent={() => <ScrollPlaceholder height={200} />}
            />
          </BackgroundContainer>
          <FAB
            style={styles.fab}
            icon="plus"
            label="Create new group"
            onPress={() => {
              setLoadingGroups(true);
              navigation.navigate('CreateGroup');
            }}
          />
        </>
      )
  );
};

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupsContainer: {
    width: '100%',
    height: '100%'
  },
  fab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
  },
  emptyCard: {
    margin: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  badge: {
    marginLeft: -10,
    marginTop: 10,
    fontSize: 15
  },
  badgesContainer: {
    width: '100%',
    alignItems: 'flex-start',
    margin: 0,
    flexDirection: 'row'
  }
});

export default Groups;
