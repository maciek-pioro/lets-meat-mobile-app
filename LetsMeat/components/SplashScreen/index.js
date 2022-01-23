import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let&apos;s meat</Text>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    margin: 50
  }
});

export default SplashScreen;
