import React from 'react';
import { ImageBackground, View, Dimensions } from 'react-native';
import { Surface } from 'react-native-paper';

const food = require('../../images/background1.jpg');
const office = require('../../images/background2.jpg');
const money = require('../../images/background3.jpg');
const settings = require('../../images/background4.jpg');
const searching = require('../../images/background5.jpg');
const fireworks = require('../../images/background6.jpg');
const vote = require('../../images/background7.jpg');
const map = require('../../images/background8.jpg');

export const backgrounds = {
  food,
  office,
  money,
  settings,
  searching,
  fireworks,
  vote,
  map
};

export const BackgroundContainer = ({ backgroundVariant = 'food', children }) => {
  const source = backgrounds[backgroundVariant] || food;
  return (
    <ImageBackground
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}
      source={source}
    >
      <Surface style={{ width: '100%', height: '100%', backgroundColor: 'rgba(200, 200, 200, 0.3)' }}>
        {children}
      </Surface>
    </ImageBackground>
  );
};

export const ScrollPlaceholder = ({ height = 50 }) => (
  <View style={{ height, backgroundColor: 'rgba(0, 0, 0, 0)' }} />
);

export default BackgroundContainer;
