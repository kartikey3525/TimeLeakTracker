import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import AppItem from '../components/AppItem';
import InsightBanner from '../components/InsightBanner';
import StatCard from '../components/StatCard';
import PermissionScreen from './PermissionScreen';

import { hasUsagePermission } from '../native/usageStats';
import { useUsageStore } from '../store/useUsageStore';
import { useTaskStore } from '../store/useTaskStore';

const formatTime = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
};

const DashboardScreen = () => {
  const { summary, fetchUsage, leak } = useUsageStore();
  const [hasPermission, setHasPermission] = useState(true);
  const [taskInput, setTaskInput] = useState('');
  const { setSound, selectedSound } = useTaskStore();
  const { createNewTask, startTaskNow, enterFocusMode } = useTaskStore();

  useEffect(() => {
    const init = async () => {
      const permission = await hasUsagePermission();

      if (!permission) {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);
      fetchUsage();
    };

    init();
  }, []);

  if (!hasPermission) {
    return <PermissionScreen />;
  }

  const topApps = [...summary.apps]
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 3);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#0F172A',
        paddingHorizontal: 16,
        paddingTop: 12,
      }}
    >
      {/* HEADER */}
      <Text
        style={{
          color: '#F8FAFC',
          fontSize: 26,
          fontWeight: '800',
          marginBottom: 16,
        }}
      >
        Dashboard
      </Text>

      {/* STATS */}
      <View style={{ flexDirection: 'row' }}>
        <StatCard label="Total Time" value={formatTime(summary.totalTime)} />
        <StatCard label="Time Leak" value={formatTime(summary.socialTime)} />
      </View>

      <StatCard
        label="Productivity Score"
        value={`${summary.productivityScore}%`}
      />

      {/* INSIGHT */}
      <InsightBanner
        message={leak?.message || 'Analyzing your behavior...'}
        level={leak?.level}
      />

      {/* TASK INPUT */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: '#1E293B',
          padding: 14,
          borderRadius: 16,
        }}
      >
        <Text style={{ color: '#94A3B8', marginBottom: 8 }}>
          Turn distraction into focus
        </Text>

        <TextInput
          placeholder="Enter a task..."
          placeholderTextColor="#64748B"
          value={taskInput}
          onChangeText={setTaskInput}
          style={{
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            if (!taskInput.trim()) return;

            const task = createNewTask(taskInput);
            startTaskNow(task);
            enterFocusMode();

            setTaskInput('');
          }}
          style={{
            backgroundColor: '#3B82F6',
            padding: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Start Focus
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOP APPS */}
      <Text
        style={{
          color: '#94A3B8',
          fontSize: 13,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        TOP APPS
      </Text>

      {topApps.map(app => (
        <AppItem
          key={app.packageName}
          name={app.packageName}
          time={app.totalTime}
        />
      ))}
    </ScrollView>
  );
};

export default DashboardScreen;
