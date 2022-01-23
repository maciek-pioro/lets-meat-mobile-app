import Slider from '@react-native-community/slider';
import React, {
  useContext,
  useEffect, useState
} from 'react';
import {
  StyleSheet
} from 'react-native';
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import { BackgroundContainer } from '../../Background';
import LocationCard from '../../Location';
import { getLocationsInfo, rateLocation } from '../../Requests';
import { store } from '../../Store';

const PrefSetter = ({
  prefName, displayName, setPrefs, prefs
}) => (
  <Card style={styles.slider} elevation={0}>
    <Card.Title title={displayName} />
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={100}
      value={prefs[prefName]}
      onSlidingComplete={(v) => {
        setPrefs({ ...prefs, [prefName]: parseInt(v, 10) });
      }}
    />
  </Card>
);

const RateLocation = ({ navigation, route }) => {
  const { state, dispatch } = useContext(store);
  const { gmapsId, customId } = route.params;
  const [locationInfo, setLocationInfo] = useState(undefined);
  const [isRating, setIsRating] = useState(false);
  const [prefs, setPrefs] = useState({
    price: 50, waiting_time: 50, amount_of_food: 50, taste: 50
  });

  useEffect(() => {
    getLocationsInfo({ state, dispatch },
      customId ? [customId] : undefined, gmapsId ? [gmapsId] : undefined).then((info) => {
      if (gmapsId) {
        setLocationInfo({ ...info.google_maps_location_information[0], kind: 'google_maps_locations' });
      } else {
        setLocationInfo({ ...info.custom_location_infomation[0], kind: 'custom_locations' });
      }
    });
  });

  return (
    <BackgroundContainer backgroundVariant="settings">
      {
        locationInfo ? <LocationCard location={locationInfo} /> : <ActivityIndicator />
      }
      <Card style={styles.card}>
        <Card.Title title="How would you describe this place?" />
        <PrefSetter prefName="price" displayName="Low Price" setPrefs={setPrefs} prefs={prefs} />
        <PrefSetter prefName="waiting_time" displayName="Waiting Time" setPrefs={setPrefs} prefs={prefs} />
        <PrefSetter prefName="amount_of_food" displayName="Portion Size" setPrefs={setPrefs} prefs={prefs} />
        <PrefSetter prefName="taste" displayName="Taste" setPrefs={setPrefs} prefs={prefs} />
      </Card>
      {
      isRating ? <ActivityIndicator />
        : (
          <Button
            mode="contained"
            style={styles.button}
            onPress={
        () => {
          setIsRating(true);
          rateLocation({ state, dispatch }, prefs.taste, prefs.price,
            prefs.amount_of_food, prefs.waiting_time, gmapsId || undefined, customId || undefined)
            .then(() => navigation.goBack())
            .catch(() => setIsRating(false));
        }
      }
          >
            Rate
          </Button>
        )
}
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  slider: {
    margin: 10,
    backgroundColor: 'transparent'
  },
  button: {
    margin: 10
  }
});

export default RateLocation;
