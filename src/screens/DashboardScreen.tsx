import React, { useEffect, useState } from 'react';

import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AppItem from '../components/AppItem';
import InsightBanner from '../components/InsightBanner';
import StatCard from '../components/StatCard';
import JournalScreen from './JournalScreen';
import PermissionScreen from './PermissionScreen';

import { hasUsagePermission } from '../native/usageStats';

import { useTaskStore } from '../store/useTaskStore';
import { useUsageStore } from '../store/useUsageStore';

import { database } from '../db';

const formatTime = (ms: number) => {
  const h = Math.floor(ms / 3600000);

  const m = Math.floor((ms % 3600000) / 60000);

  return `${h}h ${m}m`;
};

const TaskCard = ({ task, onStart, onEnd, onDelete }: any) => {
  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return '#22C55E';

      case 'running':
        return '#3B82F6';

      default:
        return '#94A3B8';
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#111827',
        borderRadius: 28,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1E293B',
      }}
    >
      {/* TOP */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 18,
              fontWeight: '800',
              lineHeight: 24,
            }}
          >
            {task.title}
          </Text>

          <View
            style={{
              marginTop: 12,
              alignSelf: 'flex-start',
              backgroundColor: `${getStatusColor()}20`,
              borderRadius: 30,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <Text
              style={{
                color: getStatusColor(),
                fontWeight: '700',
                fontSize: 12,
                letterSpacing: 0.5,
              }}
            >
              {task.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onDelete}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: '#7F1D1D',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FCA5A5',
              fontSize: 15,
              fontWeight: '700',
            }}
          >
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIONS */}
      {task.status !== 'completed' && (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}
        >
          {task.status === 'pending' && (
            <TouchableOpacity
              onPress={onStart}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: '#2563EB',
                paddingVertical: 15,
                borderRadius: 18,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                Start Focus
              </Text>
            </TouchableOpacity>
          )}

          {task.status === 'running' && (
            <TouchableOpacity
              onPress={onEnd}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: '#DC2626',
                paddingVertical: 15,
                borderRadius: 18,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                End Session
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const JournalCard = ({ journal, onDelete }: any) => {
  const [expanded, setExpanded] = useState(false);

  const isLong = journal.text.length > 130;

  return (
    <View
      style={{
        backgroundColor: '#111827',
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#1E293B',
      }}
    >
      {!!journal.image && (
        <Image
          source={{ uri: journal.image }}
          resizeMode="cover"
          style={{
            width: '100%',
            height: 200,
          }}
        />
      )}

      <View
        style={{
          padding: 18,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{
                color: '#F8FAFC',
                fontSize: 18,
                fontWeight: '800',
                lineHeight: 24,
              }}
            >
              {journal.task_title}
            </Text>

            <Text
              style={{
                color: '#64748B',
                marginTop: 6,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {new Date(journal.created_at).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onDelete}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: '#7F1D1D',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#FCA5A5',
                fontSize: 15,
                fontWeight: '700',
              }}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <Text
          style={{
            color: '#CBD5E1',
            lineHeight: 25,
            fontSize: 15,
          }}
        >
          {expanded ? journal.text : journal.text.slice(0, 130)}

          {!expanded && isLong ? '...' : ''}
        </Text>

        {isLong && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpanded(!expanded)}
            style={{
              marginTop: 12,
              alignSelf: 'flex-start',
            }}
          >
            <Text
              style={{
                color: '#60A5FA',
                fontWeight: '700',
                fontSize: 14,
              }}
            >
              {expanded ? 'See Less' : 'See More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const { summary, fetchUsage, leak } = useUsageStore();

  const [hasPermission, setHasPermission] = useState(true);

  const [taskInput, setTaskInput] = useState('');

  const [journals, setJournals] = useState<any[]>([]);

  const {
    tasks,

    showJournal,

    completedTask,

    createNewTask,

    startTaskNow,

    endCurrentTask,

    closeJournal,
  } = useTaskStore();

  useEffect(() => {
    const init = async () => {
      const permission = await hasUsagePermission();

      if (!permission) {
        setHasPermission(false);

        return;
      }

      setHasPermission(true);

      fetchUsage();

      loadJournals();
    };

    init();
  }, []);

  const loadJournals = async () => {
    const data = await database.get('journals').query().fetch();

    const formatted = data.map((item: any) => ({
      id: item.id,

      task_title: item.task_title,

      task_id: item.task_id,

      text: item.text,

      image: item.image,

      created_at: item.created_at,
    }));

    setJournals(formatted.reverse());
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);

    useTaskStore.setState({
      tasks: updated,
    });
  };

  const deleteJournal = async (journalId: string) => {
    const collection = database.get('journals');

    const journal = await collection.find(journalId);

    await database.write(async () => {
      await journal.destroyPermanently();
    });

    loadJournals();
  };

  if (!hasPermission) {
    return <PermissionScreen />;
  }

  console.log('COMPLETED TASK FROM STORE', completedTask);

  if (showJournal && completedTask) {
    return (
      <JournalScreen
        task={completedTask}
        onDone={() => {
          closeJournal();

          loadJournals();
        }}
      />
    );
  }

  const topApps = [...summary.apps]
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 3);

  return (
    <>
      <StatusBar backgroundColor="#020617" barStyle="light-content" />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#020617',
        }}
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View
          style={{
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 34,
              fontWeight: '900',
              letterSpacing: -1,
            }}
          >
            Dashboard
          </Text>

          <Text
            style={{
              color: '#64748B',
              marginTop: 6,
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            Track focus, eliminate distractions, and build consistency.
          </Text>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <StatCard label="Total Time" value={formatTime(summary.totalTime)} />

          <StatCard label="Time Leak" value={formatTime(summary.socialTime)} />
        </View>

        <StatCard
          label="Productivity Score"
          value={`${summary.productivityScore}%`}
        />

        <View
          style={{
            marginTop: 6,
          }}
        >
          <InsightBanner
            message={leak?.message || 'Analyzing your behavior...'}
            level={leak?.level}
          />
        </View>
        {/* TOP APPS */}
        <Text
          style={{
            color: '#F8FAFC',
            fontSize: 24,
            fontWeight: '900',
            marginTop: 5,
            marginBottom: 16,
          }}
        >
          Top Apps
        </Text>

        {topApps.map(app => (
          <AppItem
            key={app.packageName}
            name={app.packageName}
            time={app.totalTime}
          />
        ))}
        {/* CREATE TASK */}
        <View
          style={{
            marginTop: 24,
            backgroundColor: '#111827',
            borderRadius: 30,
            padding: 18,
            borderWidth: 1,
            borderColor: '#1E293B',
          }}
        >
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 20,
              fontWeight: '800',
              marginBottom: 14,
            }}
          >
            Create Focus Task
          </Text>

          <TextInput
            placeholder="What are you working on?"
            placeholderTextColor="#64748B"
            value={taskInput}
            onChangeText={setTaskInput}
            style={{
              backgroundColor: '#020617',
              borderWidth: 1,
              borderColor: '#1E293B',
              color: '#fff',
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderRadius: 18,
              fontSize: 15,
            }}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!taskInput.trim()) return;

              createNewTask(taskInput);

              setTaskInput('');
            }}
            style={{
              marginTop: 16,
              backgroundColor: '#2563EB',
              paddingVertical: 16,
              borderRadius: 18,
            }}
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: '800',
                fontSize: 15,
              }}
            >
              Create Task
            </Text>
          </TouchableOpacity>
        </View>

        {/* TASKS */}
        <View
          style={{
            marginTop: 32,
            marginBottom: 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 24,
              fontWeight: '900',
            }}
          >
            Tasks
          </Text>

          <View
            style={{
              backgroundColor: '#111827',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: '#94A3B8',
                fontWeight: '700',
              }}
            >
              {tasks.length}
            </Text>
          </View>
        </View>

        {tasks.length === 0 && (
          <View
            style={{
              backgroundColor: '#111827',
              borderRadius: 26,
              padding: 28,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#1E293B',
            }}
          >
            <Text
              style={{
                color: '#64748B',
                fontSize: 15,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              No focus tasks yet.
            </Text>
          </View>
        )}

        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStart={() => startTaskNow(task.id)}
            onEnd={endCurrentTask}
            onDelete={() => deleteTask(task.id)}
          />
        ))}

        {/* JOURNALS */}
        <View
          style={{
            marginTop: 18,
            marginBottom: 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 24,
              fontWeight: '900',
            }}
          >
            Journals
          </Text>

          <View
            style={{
              backgroundColor: '#111827',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: '#94A3B8',
                fontWeight: '700',
              }}
            >
              {journals.length}
            </Text>
          </View>
        </View>

        {journals.length === 0 && (
          <View
            style={{
              backgroundColor: '#111827',
              borderRadius: 26,
              padding: 28,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#1E293B',
            }}
          >
            <Text
              style={{
                color: '#64748B',
                fontSize: 15,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Your reflections will appear here.
            </Text>
          </View>
        )}

        {journals.map((journal: any) => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onDelete={() => deleteJournal(journal.id)}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default DashboardScreen;