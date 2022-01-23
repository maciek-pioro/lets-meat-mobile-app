import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Caption, Card, Paragraph } from 'react-native-paper';

const getScore = (rating, attribute) => ` ${Math.round(rating[attribute] / rating[`${attribute}_votes`]) || '-'}`;

const Scores = ({ rating, iconUri }) => (
  <>
    <Card.Actions style={styles.cardActions}>
      {iconUri && <Image style={styles.image} source={{ uri: iconUri }} />}
      <Caption>
        Portion:
        {getScore(rating, 'amount_of_food')}
      </Caption>
      <Caption>
        Waiting time:
        {getScore(rating, 'waiting_time')}
      </Caption>
    </Card.Actions>
    <Card.Actions style={styles.cardActions}>
      <Caption>
        Personalized overall:
        {` ${Math.round(rating.personalized_score)}`}
      </Caption>
      <Caption>
        Price:
        {getScore(rating, 'price')}
      </Caption>
      <Caption>
        Taste:
        {getScore(rating, 'taste')}
      </Caption>
    </Card.Actions>
  </>
);

export const GMapsPredictionCard = ({ location, onPress, onLongPress }) => (
  <Card style={styles.searchResult} onPress={onPress} onLongPress={onLongPress}>
    <Card.Title title={location.structured_formatting.main_text} titleNumberOfLines={3} />
    <Card.Content>
      <Paragraph>
        { location.description}
      </Paragraph>
    </Card.Content>
  </Card>
);

export const GMapsCard = ({
  location, onPress, onLongPress, highlight
}) => {
  const { rating } = location;

  return (
    <Card
      style={styles.searchResult}
      onPress={onPress}
      onLongPress={onLongPress}
      elevation={highlight ? 5 : 1}
    >
      <Card.Title
        title={location.details.name}
        titleNumberOfLines={3}
      />
      <Card.Content>
        <Paragraph>
          {location.details.formatted_address}
        </Paragraph>
        <Scores iconUri={location.details.icon} rating={rating} />
      </Card.Content>
    </Card>
  );
};

export const CustomLocationCard = ({
  location, onPress, onLongPress, highlight
}) => (
  <Card
    style={styles.searchResult}
    onPress={onPress}
    onLongPress={onLongPress}
    elevation={highlight ? 5 : 1}
  >
    <Card.Title title={location.name} titleNumberOfLines={3} />
    <Card.Content>
      <Paragraph>
        {location.address}
      </Paragraph>
      {location.rating
      && <Scores rating={location.rating} />}
    </Card.Content>
  </Card>
);

const LocationCard = ({
  location, onPressPrediction, onPressGMaps, onPressCustom, onLongPress, highlight
}) => {
  const { kind } = location;
  const [Component, onPress] = (kind === 'google_maps_locations_predictions'
    ? [GMapsPredictionCard, onPressPrediction]
    : kind === 'google_maps_locations'
      ? [GMapsCard, onPressGMaps] : [CustomLocationCard, onPressCustom]);
  return <Component location={location} onPress={onPress} onLongPress={onLongPress} highlight={highlight} />;
};

const styles = StyleSheet.create({
  searchResult: {
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  image: {
    width: 20,
    height: 20
  },
  cardActions: {
    justifyContent: 'space-between'
  }
});

export default LocationCard;
