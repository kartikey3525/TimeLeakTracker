import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import { database } from '../db';

const JournalScreen = ({ task, onDone }: any) => {
  const [text, setText] = useState('');

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const saveJournal = async () => {
    if (!text.trim()) return;

    await database.write(async () => {
      await database.get('journals').create((entry: any) => {
        entry.task_id = task?.id || '';

        entry.task_title = task?.title || '';

        entry.text = text;

        entry.image = image || '';

        entry.created_at = Date.now();
      });
    });

    onDone();
  };
  console.log('TASK DATA', task);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 8,
        }}
      >
        Session Reflection
      </Text>

      <Text
        style={{
          color: '#94A3B8',
          marginBottom: 20,
        }}
      >
        {task?.title}
      </Text>

      <TextInput
        placeholder="How was your focus session and what u have done in this task ?"
        placeholderTextColor="#64748B"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={120}
        style={{
          backgroundColor: '#1E293B',
          color: '#fff',
          padding: 14,
          borderRadius: 14,
          height: 100,
          marginBottom: 20,
          textAlignVertical: 'top',
        }}
      />

      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: '#334155',
          padding: 14,
          borderRadius: 14,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Add Image
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            height: 180,
            borderRadius: 14,
            marginBottom: 16,
          }}
        />
      )}

      <TouchableOpacity
        onPress={saveJournal}
        style={{
          backgroundColor: '#3B82F6',
          padding: 16,
          borderRadius: 14,
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: '700',
          }}
        >
          Save Journal
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default JournalScreen;