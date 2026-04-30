import React from 'react';
import { Text, View } from 'react-native';

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  return `${minutes} min`;
};

const AppItem = ({ name, time }: any) => {
  return (
    <View
      style={{
        backgroundColor: '#1E293B',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderWidth: 1,
        borderColor: '#334155',
      }}
    >
      <Text
        style={{
          color: '#F8FAFC',
          fontSize: 14,
          fontWeight: '500',
        }}
      >
        {name}
      </Text>

      <Text
        style={{
          color: '#94A3B8',
          fontSize: 13,
        }}
      >
        {formatTime(time)}
      </Text>
    </View>
  );
};

export default AppItem;
