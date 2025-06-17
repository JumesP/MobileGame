import React from 'react';
import { View } from 'react-native';

const Player = ({ position, size }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: position[0],
        top: position[1],
        width: size[0],
        height: size[1],
        backgroundColor: 'blue',
        borderWidth: 2,
        borderColor: 'black',
      }}
    />
  );
};

export default Player;
