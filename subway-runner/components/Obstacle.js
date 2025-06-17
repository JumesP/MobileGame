import React from 'react';
import { View, StyleSheet } from 'react-native';

const Obstacle = ({ position, size, speed }) => {
  return (
    <View
      style={[
        styles.obstacle,
        {
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default Obstacle;
