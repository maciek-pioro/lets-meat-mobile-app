import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  StyleSheet, ToastAndroid, View
} from 'react-native';
import {
  Button, Caption, Card, Headline
} from 'react-native-paper';
import { formatDate, formatTime, getTimeLeft } from '../../../helpers/time';

export const TimeCard = ({ time, highlight = false, onLongPress }) => (
  <Card style={styles.timeCard} elevation={highlight ? 5 : 1} onLongPress={onLongPress}>
    <View style={{ textAlign: 'center' }}>
      <Headline style={styles.timeContainer}>
        {formatTime(time)}
      </Headline>
      <Headline style={styles.dateContainer}>
        {formatDate(time)}
      </Headline>
      <Caption style={styles.timeLeft}>
        {getTimeLeft(time)}
      </Caption>
    </View>
  </Card>
);

export const DateAndHourPicker = ({
  setValue, visible, setVisible, minimumDate, onDismiss
}) => {
  const [result, setResult] = useState(minimumDate);
  const [mode, setMode] = useState('date');

  const onChange = (event) => {
    setVisible(false);
    const { timestamp } = { ...event.nativeEvent };
    if (event.type === 'dismissed') {
      setMode('date');
      if (onDismiss) onDismiss();
      return;
    }
    if (mode === 'date') {
      setMode('time');
      setResult(new Date(timestamp));
      setVisible(true);
    }
    if (mode === 'time') {
      setMode('date');
      setValue(new Date(timestamp));
    }
  };

  return (visible
    ? (
      <DateTimePicker
        onChange={onChange}
        value={result}
        minimumDate={minimumDate}
        mode={mode}
        display="spinner"
        minuteInterval={5}
      />
    ) : null
  );
};

const Times = ({
  times, deadline, onAddTime, loading, onVote, showButtons = true
}) => {
  const [isAdding, setAdding] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const onDismiss = () => {
    setNewDate(null);
    setAdding(false);
  };

  const THREE_MIN = 3 * 60 * 1000;

  const onSetDate = (date) => {
    times.forEach((t) => {
      if (Math.abs(t - date) <= THREE_MIN) {
        ToastAndroid.show('That date has already been added', ToastAndroid.SHORT);
        onDismiss();
      }
    });
    setNewDate(date);
  };

  return (
    <>
      <View>
        {times.map((t) => <TimeCard key={t.getTime()} time={t} />)}
        {newDate ? <TimeCard key={newDate.getTime()} time={newDate} highlight /> : null}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {
          showButtons
        && (isAdding ? (
          <>
            <Button
              style={styles.addButton}
              onPress={() => {
                setAdding(false);
                onAddTime(newDate).finally(() => setNewDate(null));
              }}
            >
              <Icon name="check" size={25} />
            </Button>
            <Button
              color="red"
              style={styles.addButton}
              onPress={onDismiss}
            >
              <Icon name="close" size={25} />
            </Button>
          </>
        ) : (
          <>
            <Button
              style={styles.addButton}
              disabled={loading}
              onPress={() => {
                if (isAdding) return;
                setAdding(true);
                setDatePickerVisible(true);
              }}
            >
              <Icon name="plus" size={25} />
            </Button>
            <Button
              style={styles.addButton}
              disabled={loading || times.length === 0}
              onPress={onVote}
            >
              <Icon name="vote" size={25} />
            </Button>
          </>
        ))
}
      </View>
      <DateAndHourPicker
        visible={datePickerVisible}
        setVisible={setDatePickerVisible}
        setValue={onSetDate}
        onDismiss={onDismiss}
        minimumDate={deadline}
      />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginBottom: 10
  },
  timeCard: {
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center'
  },
  timeContainer: {
    fontSize: 30,
    textAlign: 'center'
  },
  dateContainer: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 17
  },
  timeLeft: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 13
  }
});

export default Times;
