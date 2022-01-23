import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ActivityIndicator, Button, Card, TextInput, Title
} from 'react-native-paper';
import { BackgroundContainer } from '../../Background';
import { createEvent } from '../../Requests';
import { store } from '../../Store';
import { DateAndHourPicker, TimeCard } from '../Feed/times';

export const NewEventContent = ({ navigation }) => {
  const DEFAULT_DEADLINE = null;
  const DEFAULT_NAME = null;

  const { state, dispatch } = useContext(store);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [name, setName] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setDeadline(DEFAULT_DEADLINE);
      setName(DEFAULT_NAME);
    });
    return unsubscribe;
  }, [navigation]);

  const inputValid = deadline && name && deadline > new Date();

  return (
    <BackgroundContainer backgroundVariant="fireworks" loading>
      <Card style={styles.titleCard}>
        <Card.Content>
          <Title style={styles.title}>{name || 'You should supply a name for your event'}</Title>
        </Card.Content>
      </Card>
      {deadline
        ? <TimeCard time={deadline} />
        : (
          <Card style={styles.noDeadline} onPress={() => setPickerVisible(true)}>
            <Card.Title title="The event should have some deadline" />
          </Card>
        )}
      <TextInput onChangeText={setName} style={styles.input} mode="outlined" label="Event name" />
      {
        !adding
          ? (
            <>
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => {
                  setPickerVisible(true);
                }}
              >
                Set event deadline
              </Button>
              <Button
                style={styles.button}
                mode="contained"
                disabled={!inputValid}
                onPress={() => {
                  setAdding(true);
                  createEvent({ state, dispatch }, state.group.id, name, deadline)
                    .then((r) => dispatch({ type: 'ADD_EVENT', event: r }))
                    .then(() => navigation.goBack())
                    .finally(() => setAdding(false));
                }}
              >
                Create Event
              </Button>
            </>
          ) : (
            <ActivityIndicator size="large" />
          )
}
      <DateAndHourPicker
        visible={pickerVisible}
        setVisible={setPickerVisible}
        setPickerVisible={setPickerVisible}
        minimumDate={new Date()}
        setValue={setDeadline}
      />
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 30,
    margin: 20,
    padding: 4,
    textAlign: 'center'
  },
  titleCard: {
    margin: 10,
    backgroundColor: 'rgba(240, 240, 240, 0.8)'
  },
  button: {
    margin: 10
  },
  noDeadline: {
    margin: 10,
    backgroundColor: 'rgba(240, 240, 240, 0.8)'
  },
  input: {
    margin: 5
  }
});

const NewEvent = NewEventContent;

export default NewEvent;
