import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const StartScreen = ({ onStart }) => {
  return (
    <View style={styles.container}>
      <Button title="Start Game" onPress={onStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartScreen;
