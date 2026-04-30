import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  message: string;
  level?: 'safe' | 'warning' | 'high' | 'critical';
};

const getColor = (level?: Props['level']) => {
  switch (level) {
    case 'critical':
      return '#EF4444';
    case 'high':
      return '#F97316';
    case 'warning':
      return '#EAB308';
    default:
      return '#22C55E';
  }
};

const InsightBanner = ({ message, level }: Props) => {
  const color = getColor(level);

  return (
    <View
      style={{
        backgroundColor: '#1E293B',
        borderLeftWidth: 4,
        borderLeftColor: color,
        padding: 16,
        borderRadius: 12,
        marginVertical: 12,
      }}
    >
      <Text style={{ color: '#F8FAFC', fontSize: 14 }}>{message}</Text>
    </View>
  );
};

export default InsightBanner;
