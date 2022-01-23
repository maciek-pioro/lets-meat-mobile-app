import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

const MIN_OPACITY = 0.3;

const createPrefStyle = (value, maxWidth = 100) => (
  {
    ...styles.bar,
    width: maxWidth * ((value + 10) / 110),
    opacity: MIN_OPACITY + (value * (1 - MIN_OPACITY)) / 100
  });

const Prefs = ({ prefs }) => {
  const [barWidth, setBarWidth] = useState(1);
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Caption>Price</Caption>
        <View style={createPrefStyle(prefs.price, barWidth - 10)} />
        <Caption>Waiting Time</Caption>
        <View style={createPrefStyle(prefs.waiting_time, barWidth - 10)} />
      </View>
      <View
        style={styles.section}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setBarWidth(width);
        }}
      >
        <Caption>Portion Size</Caption>
        <View style={createPrefStyle(prefs.amount_of_food, barWidth)} />
        <Caption>Taste</Caption>
        <View style={createPrefStyle(prefs.taste, barWidth)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  section: {
    width: '50%'
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#0a54c9',
    height: 20
  }
});

export default Prefs;
