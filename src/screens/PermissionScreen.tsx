import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { openUsageAccessSettings } from '../native/permissions';

const PermissionScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 22, marginBottom: 10 }}>
        Enable Usage Access
      </Text>

      <Text style={{ color: '#aaa', marginBottom: 20 }}>
        Go to Usage Access and enable "TimeLeakTracker"
      </Text>

      <TouchableOpacity
        onPress={openUsageAccessSettings}
        style={{
          backgroundColor: '#007aff',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Open Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PermissionScreen;
