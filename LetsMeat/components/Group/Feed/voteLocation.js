/* eslint-disable no-restricted-syntax */
import React, {
  useContext, useEffect, useLayoutEffect, useRef, useState
} from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { ActivityIndicator } from 'react-native-paper';
import { BackgroundContainer } from '../../Background';
import LocationCard from '../../Location';
import { castVote, getLocationsInfo, getVoteLocations } from '../../Requests';
import { store } from '../../Store';

const VoteLocation = ({ navigation, route }) => {
  const { state, dispatch } = useContext(store);

  const { eventId } = route.params;
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [locations, setLocations] = useState([]);
  const voteData = useRef([]);

  const setHeaderAction = () => {
    if (!loading && locations && locations.length > 0 && !voting) {
      navigation.setOptions({
        rightIcon: 'vote',
        rightAction: () => {
          setVoting(true);
          castVote({ state, dispatch }, eventId,
            undefined, translateLocationsToVote(locations)).then(() => {
            setVoting(false);
          });
        }
      });
    } else if (voting) {
      navigation.setOptions({
        rightIcon: 'timer-sand',
        rightAction: () => {}
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(setHeaderAction, [loading, state.user.id,
    navigation, voting, eventId, locations]);

  const translateLocationsToVote = (newLocations) => newLocations.map((l) => {
    if (l.kind === 'google_maps_locations') {
      return {
        google_maps_location_id: l.details.place_id,
        custom_location_id: null
      };
    }
    return {
      google_maps_location_id: null,
      custom_location_id: l.id
    };
  });

  const translateAndSetData = (locationsInfo) => {
    const locationsArray = [];
    for (const l of voteData.current) {
      if (l.google_maps_location_id) {
        const details = locationsInfo
          .google_maps_location_information
          .find((d) => d.details.place_id === l.google_maps_location_id);
        locationsArray.push({ ...details, kind: 'google_maps_locations' });
      } else if (l.custom_location_id) {
        const details = locationsInfo
          .custom_location_infomation
          .find((d) => d.id === l.custom_location_id);
        locationsArray.push({ ...details, kind: 'custom' });
      }
    }
    setLocations([...locationsArray]);
    setLoading(false);
  };

  const getAndExtractData = () => {
    getVoteLocations({ state, dispatch }, eventId).then((data) => {
      voteData.current = data;
      const googleLocations = data
        .filter((l) => l.google_maps_location_id).map((l) => l.google_maps_location_id);
      const customLocations = data
        .filter((l) => l.custom_location_id).map((l) => l.custom_location_id);
      return getLocationsInfo({ state, dispatch }, customLocations, googleLocations);
    }).then(translateAndSetData);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getAndExtractData, [state.user.id, eventId]);

  const keyExtractor = (item) => `${item.kind === 'google_maps_locations' ? item.details.place_id : item.id}`;

  return (

    <BackgroundContainer backgroundVariant="vote">
      { loading ? <ActivityIndicator />
        : (
          <DraggableFlatList
            data={locations}
            renderItem={({
              item, drag, isActive
            }) => <LocationCard location={item} onLongPress={drag} highlight={isActive} />}
            keyExtractor={keyExtractor}
            onDragEnd={({ data }) => setLocations(data)}
          />
        )}
    </BackgroundContainer>
  );
};

export default VoteLocation;
