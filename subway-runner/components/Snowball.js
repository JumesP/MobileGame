import React from 'react';
import { View, StyleSheet } from 'react-native';

const Snowball = ({ position }) => {
  return (
    <View
      style={[
        styles.player,
        {
          left: position.x,
          bottom: position.y,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  player: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    position: 'absolute',
    borderRadius: 25,
  },
});

export default Snowball;
