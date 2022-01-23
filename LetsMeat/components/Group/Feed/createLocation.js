import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { BackgroundContainer } from '../../Background';
import { CustomLocationCard } from '../../Location';
import { createLocationCustom, updateEvent } from '../../Requests';
import { store } from '../../Store';

const CreateLocation = ({ navigation, route }) => {
  const { state, dispatch } = useContext(store);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [adding, setAdding] = useState(false);

  const { eventId } = route.params;
  const groupId = state.group.id;

  return (
    <BackgroundContainer backgroundVariant="map">
      <CustomLocationCard location={{ name, address }} />
      <TextInput label="Name" style={styles.input} mode="outlined" onChangeText={setName} value={name} />
      <TextInput label="Address" style={styles.input} mode="outlined" onChangeText={setAddress} value={address} />
      <Button
        mode="contained"
        style={styles.input}
        disabled={!name || adding}
        onPress={() => {
          setAdding(true);
          createLocationCustom({ state, dispatch }, groupId, name, address)
            .then((location) => updateEvent({ state, dispatch },
              { id: eventId, custom_locations_ids: [location.id] }))
            .then((event) => dispatch({ type: 'SET_EVENT', payload: event }))
            .then(() => navigation.pop(2))
            .finally(() => setAdding(false));
        }}
      >
        Add Location
      </Button>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 10
  }
});

export default CreateLocation;
