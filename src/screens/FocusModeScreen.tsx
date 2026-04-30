import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { useTaskStore } from '../store/useTaskStore';
const optimize = (url: string) => `${url}?auto=format&fit=crop&w=1200&q=80`;

const backgrounds = [
  // 🌲 Forest Calm
  optimize('https://images.unsplash.com/photo-1441974231531-c6227db76b6e'),
  optimize('https://images.unsplash.com/photo-1501785888041-af3ef285b470'),
  optimize('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'),

  // 🌊 Ocean / Water
  optimize('https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),
  optimize('https://images.unsplash.com/photo-1470770841072-f978cf4d019e'),
  optimize('https://images.unsplash.com/photo-1500375592092-40eb2168fd21'),

  // 🌄 Mountains
  optimize('https://images.unsplash.com/photo-1501785888041-af3ef285b470'),
  optimize('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'),
  optimize('https://images.unsplash.com/photo-1439853949127-fa647821eba0'),

  // 🌌 Night / Focus vibe
  optimize('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429'),
  optimize('https://images.unsplash.com/photo-1470770841072-f978cf4d019e'),
  optimize('https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3'),

  // 🌿 Minimal Zen
  optimize('https://images.unsplash.com/photo-1493244040629-496f6d136cc3'),
  optimize('https://images.unsplash.com/photo-1506744038136-46273834b3fb'),
  optimize('https://images.unsplash.com/photo-1502082553048-f009c37129b9'),
];

const soundMap = {
  rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  forest: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  focus: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
};

const FocusModeScreen = () => {
  const { currentTask, exitFocusMode, endCurrentTask, selectedSound } =
    useTaskStore();

  const [seconds, setSeconds] = useState(0);
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ⏱ TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🌿 PREMIUM TRANSITION
  useEffect(() => {
    const interval = setInterval(() => {
      setNextIndex((index + 1) % backgrounds.length);

      fadeAnim.setValue(0);
      scaleAnim.setValue(1.1);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex(prev => (prev + 1) % backgrounds.length);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [index]);

  const format = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* 🔊 AUDIO */}
      <Video
        source={{ uri: soundMap[selectedSound] }}
        repeat
        muted={false}
        volume={1}
        playInBackground
        playWhenInactive
        ignoreSilentSwitch="ignore"
        style={{ width: 0, height: 0 }}
      />

      {/* CURRENT IMAGE */}
      <ImageBackground
        source={{ uri: backgrounds[index] }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        blurRadius={5}
      />

      {/* NEXT IMAGE (FADE + SCALE) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <ImageBackground
          source={{ uri: backgrounds[nextIndex] }}
          style={{ flex: 1 }}
          blurRadius={6}
        />
      </Animated.View>

      {/* DARK OVERLAY */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* CONTENT */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 30, fontWeight: '700' }}>
          Focus Mode
        </Text>

        <Text style={{ color: '#fff', marginTop: 10 }}>
          {currentTask?.title}
        </Text>

        <Text
          style={{
            color: '#fff',
            fontSize: 52,
            marginVertical: 30,
            fontWeight: '800',
          }}
        >
          {format()}
        </Text>

        <TouchableOpacity
          onPress={() => {
            endCurrentTask(); // ✅ triggers journal
            exitFocusMode(); // ✅ exit focus
          }}
          style={{
            backgroundColor: '#EF4444',
            padding: 14,
            borderRadius: 14,
            width: 160,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>End Focus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FocusModeScreen;