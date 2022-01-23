import { useFocusEffect } from '@react-navigation/native';
import React, {
  useCallback, useContext, useRef, useState
} from 'react';
import {
  RefreshControl, ScrollView, StyleSheet, View
} from 'react-native';
import {
  Card, FAB, Title
} from 'react-native-paper';
import { refreshGroup } from '../../../helpers/refresh';
import { BackgroundContainer, ScrollPlaceholder } from '../../Background';
import { store } from '../../Store';
import { TimeCard } from './times';

const Event = ({ event, onPress }) => (
  <Card elevation={1} style={styles.event} onPress={onPress}>
    <Card.Content>
      <View style={styles.titleContainer}>
        <Title style={styles.title}>{event.name}</Title>
      </View>
      <TimeCard time={new Date(event.deadline)} />
    </Card.Content>
  </Card>
);

const FeedContent = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [refreshing, setRefreshing] = useState(false);
  const eventSelected = useRef(false);

  const onRefresh = () => {
    setRefreshing(true);
    refreshGroup(state, dispatch).finally(() => { setRefreshing(false); });
  };

  useFocusEffect(
    useCallback(() => {
      eventSelected.current = false;
    }, [eventSelected])
  );

  return (
    <BackgroundContainer>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <>
          {state.group.events && state.group.events.map((e) => (
            <Event
              key={e.id}
              event={e}
              onPress={() => {
                if (eventSelected.current) return;
                eventSelected.current = true;
                dispatch({ type: 'SET_EVENT', payload: e });
                navigation.navigate('Event');
              }}
            />
          ))}
          <ScrollPlaceholder height={200} />
        </>
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        label="New Event"
        onPress={() => { navigation.navigate('NewEvent'); }}
      />
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  fab: {
    margin: 30,
    position: 'absolute',
    bottom: 100,
    right: 0
  },
  event: {
    margin: 10,
    backgroundColor: 'rgba(230, 230, 230, 0.9)'
  },
  titleContainer: {
    margin: 20,
    marginTop: 10
  },
  title: {
    fontSize: 30,
    padding: 4
  }
});

export default FeedContent;
