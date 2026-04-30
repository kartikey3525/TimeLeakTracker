import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { database } from '../db';

const JournalScreen = ({ onDone }: any) => {
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
        entry.text = text;
        entry.image = image || '';
        entry.created_at = Date.now();
      });
    });

    onDone();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 22, marginBottom: 20 }}>
        Reflect your session
      </Text>

      <TextInput
        placeholder="How was your focus? (max 3 lines)"
        placeholderTextColor="#64748B"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={120}
        style={{
          backgroundColor: '#1E293B',
          color: '#fff',
          padding: 12,
          borderRadius: 10,
          height: 80,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: '#334155',
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Add Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ height: 150, borderRadius: 10, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity
        onPress={saveJournal}
        style={{
          backgroundColor: '#3B82F6',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Save Journal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JournalScreen;
