import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
};

const StatCard = ({ label, value }: Props) => {
  return (
    <View
      style={{
        backgroundColor: '#1E293B',
        padding: 18,
        borderRadius: 18,
        flex: 1,
        margin: 6,

        borderWidth: 1,
        borderColor: '#334155',

        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Text
        style={{
          color: '#94A3B8',
          fontSize: 12,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: '#F8FAFC',
          fontSize: 22,
          fontWeight: '700',
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default StatCard;
