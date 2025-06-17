import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const EndScreen = ({ onRestart }) => {
  return (
    <View style={styles.container}>
      <Button title="Restart Game" onPress={onRestart} />
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

export default EndScreen;
