import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DashboardScreen from './src/screens/DashboardScreen';
import FocusModeScreen from './src/screens/FocusModeScreen';
import JournalScreen from './src/screens/JournalScreen';

import { useTaskStore } from './src/store/useTaskStore';
import './src/db';

const App = () => {
  const { isFocusMode, showJournal, closeJournal } = useTaskStore();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />

      {isFocusMode ? (
        <FocusModeScreen />
      ) : showJournal ? (
        <JournalScreen onDone={closeJournal} />
      ) : (
        <SafeAreaView style={styles.container}>
          <DashboardScreen />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});

export default App;