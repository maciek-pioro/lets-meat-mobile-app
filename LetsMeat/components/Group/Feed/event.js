import React, {
  useCallback, useContext, useEffect, useState
} from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import {
  ActivityIndicator, Card, Title
} from 'react-native-paper';
import { BackgroundContainer, ScrollPlaceholder } from '../../Background';
import { ModalButton } from '../../Buttons';
import {
  deleteEvent, getEventInfo, getResults, updateEvent
} from '../../Requests';
import { store } from '../../Store';
import Creator from './creator';
import Deadline from './deadline';
import Debts from './debts';
import Locations from './locations';
import Times from './times';

const EventView = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [results, setResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const finished = new Date(state.event.deadline) < new Date();

  const loadData = () => {
    if (deleting) return Promise.resolve();
    return Promise.all(
      [getEventInfo({ state, dispatch }, state.event.id).then((event) => {
        dispatch({ type: 'SET_EVENT', payload: event });
        setEventDetails(true);
      }),
      getResults({ state, dispatch }, state.event.id).then((votingResults) => {
        setResults(votingResults);
      })]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.event.id, loadData, state.user.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); return () => {}; }, [state.user.tokenId, deleting]);

  return (
    <BackgroundContainer>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card style={styles.outerSection}>
          <Card.Content>
            <Title style={styles.eventTitle}>{state.event.name}</Title>
          </Card.Content>
        </Card>
        { eventDetails
          ? (
            <>
              <Card elevation={0} style={styles.outerSection}>
                <Card.Title title={finished ? 'Results' : 'Candidates'} style={styles.resultsTitle} />
                <Card style={{ ...styles.innerSection, marginTop: 0 }} elevation={0}>
                  <Card.Title title="Locations" />
                  <Locations
                    order={(results && finished) ? results.locations : undefined}
                    onRate={({ gmapsId, customId }) => navigation.navigate('RateLocation', { gmapsId, customId })}
                    onAdd={() => navigation.navigate('AddLocation', { eventId: state.event.id, groupId: state.group.id })}
                    onVote={() => navigation.navigate('VoteLocation', { eventId: state.event.id, groupId: state.group.id })}
                    containerStyle={styles.innerSection}
                    showButtons={!finished}
                  />
                </Card>
                <Card style={styles.innerSection} elevation={0}>
                  <Card.Title title="Times" />
                  <Times
                    loading={loading}
                    times={(results && finished)
                      ? results.times.map((t) => new Date(t))
                      : state.event.candidate_times.map((t) => new Date(t))}
                    onVote={() => {
                      navigation.navigate('VoteTime', {
                        eventId: state.event.id
                      });
                    }}
                    onAddTime={(time) => {
                      setLoading(true);
                      return updateEvent({ state, dispatch },
                        { id: state.event.id, candidate_times: [time] })
                        .then((event) => dispatch({ type: 'SET_EVENT', payload: event }))
                        .finally(() => setLoading(false));
                    }}
                    deadline={new Date(state.event.deadline)}
                    showButtons={!finished}
                  />
                </Card>
                <Deadline
                  time={state.event.deadline}
                  containerStyle={styles.innerSection}
                />
                <Creator
                  userId={state.event.creator_id}
                  containerStyle={styles.innerSection}
                />
              </Card>
              <Debts
                containerStyle={styles.outerSection}
                debtStyle={styles.innerSection}
                navigation={navigation}
              />
              {state.event.creator_id === state.user.id
                ? (
                  <ModalButton
                    style={styles.deleteButton}
                    modalText="Are you sure you want to delete the event?"
                    icon="delete-forever"
                    buttonText="DELETE"
                    confirmAction={() => {
                      deleteEvent({ state, dispatch }, state.event.id).then(() => {
                        setDeleting(true);
                        dispatch({ type: 'REMOVE_EVENT', eventId: state.event.id });
                        navigation.goBack();
                      });
                    }}
                    confirmText="Delete"
                  />
                ) : null}
              <ScrollPlaceholder height={75} />
            </>
          )
          : (<ActivityIndicator />)}
      </ScrollView>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  eventTitle: {
    color: 'black',
    fontSize: 30,
    margin: 20,
    padding: 5,
    textAlign: 'center'
  },
  resultsTitle: {
    marginBottom: 0
  },
  container: {
    width: '100%',
    height: '100%'
  },
  outerSection: {
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  innerSection: {
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  deleteButton: {
    backgroundColor: 'red'
  },
});

export default EventView;
