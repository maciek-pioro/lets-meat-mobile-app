import React from 'react';
import { Card } from 'react-native-paper';
import { TimeCard } from './times';

const Deadline = ({ time, containerStyle }) => (
  <Card elevation={0} style={containerStyle}>
    <Card.Title title="Deadline" />
    <TimeCard time={new Date(time)} />
  </Card>
);

export default Deadline;
