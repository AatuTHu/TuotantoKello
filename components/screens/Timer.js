import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import TopBar from '../TopBar';
import { styles } from '../../styles/timer';
import { useStates } from '../../service/contexts/StateContext';
import { useNavigation } from '../../service/contexts/NavigationContext';

const TIMER_STORAGE_KEY = 'timer_start_time';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [mainTitle, setMainTitle] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [userName, setUserName] = useState('');
  const [phases, setPhases] = useState([]);

  const mainTitleRef = useRef(null);
  const phaseRef = useRef(null);
  const userRef = useRef(null);

  const { existingTitle, existingPhases, setExistingTitle, setExistingPhases } =
    useStates();
  const { setNavigate } = useNavigation();

  /* -------------------- LOAD DATA -------------------- */

  useEffect(() => {
    loadTimer();
    loadUserName();
  }, []);

  useEffect(() => {
    if (existingTitle) setMainTitle(existingTitle);
    if (existingPhases) setPhases(existingPhases);
  }, [existingTitle, existingPhases]);

  /* -------------------- TIMER -------------------- */

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const loadTimer = async () => {
    const stored = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
    if (!stored) return;

    const parsed = Number(stored);
    setStartTime(parsed);
    setSeconds(Math.floor((Date.now() - parsed) / 1000));
    setIsRunning(true);
  };

  const loadUserName = async () => {
    const name = await AsyncStorage.getItem('username');
    if (name) setUserName(name);
  };

  const toggleTimer = async () => {
    if (isRunning) {
      await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
      setIsRunning(false);
      return;
    }

    const now = Date.now();
    await AsyncStorage.setItem(TIMER_STORAGE_KEY, now.toString());
    setStartTime(now);
    setIsRunning(true);
  };

  const resetTimer = async () => {
    setSeconds(0);
    setStartTime(null);
    setIsRunning(false);
    await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
  };

  /* -------------------- PHASES -------------------- */

  const savePhase = () => {
    if (!phaseName.trim()) {
      phaseRef.current?.focus();
      return;
    }

    setPhases(prev => [...prev, { phaseName, time: seconds }]);
    setPhaseName('');
    resetTimer();
  };

  const deletePhase = index => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  /* -------------------- SAVE -------------------- */

  const saveAll = async () => {
    if (!mainTitle.trim()) {
      mainTitleRef.current?.focus();
      return;
    }

    /*if (!userName.trim()) {
      userRef.current?.focus();
      return;
    }*/

    const totalTime =
      phases.reduce((sum, p) => sum + p.time, 0) + seconds;

    const newItem = {
      mainTitle,
      phases,
      totalTime,
      userName,
    };

    const stored = await AsyncStorage.getItem('savedItems');
    const items = stored ? JSON.parse(stored) : [];

    const index = items.findIndex(item => item.mainTitle === mainTitle);
    index >= 0 ? (items[index] = newItem) : items.push(newItem);

    await AsyncStorage.setItem('savedItems', JSON.stringify(items));

    setExistingTitle('');
    setExistingPhases([]);
    setMainTitle('');
    setPhases([]);
    setPhaseName('');

    resetTimer();
    setNavigate('Controller');
  };

  /* -------------------- RENDER -------------------- */

  const renderPhase = ({ item, index }) => (
    <View style={styles.phaseRow}>
      <Text style={styles.phaseText}>
        {item.phaseName}: {Math.floor(item.time / 60)}:
        {String(item.time % 60).padStart(2, '0')}
      </Text>
      <TouchableOpacity onPress={() => deletePhase(index)}>
        <Ionicons name="remove-circle" size={40} color="#BE3144" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tuote *</Text>
        <TextInput
          ref={mainTitleRef}
          style={styles.input}
          value={mainTitle}
          onChangeText={setMainTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Työvaiheen nimi</Text>
        <TextInput
          ref={phaseRef}
          style={styles.input}
          value={phaseName}
          onChangeText={setPhaseName}
        />
      </View>

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>
          {String(Math.floor(seconds / 3600)).padStart(2, '0')}:
          {String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </Text>

        <TouchableOpacity onPress={isRunning ? resetTimer : toggleTimer}>
          <Ionicons
            name={isRunning ? 'refresh' : 'play'}
            size={55}
            color="#BE3144"
          />
        </TouchableOpacity>
      </View>

      {isRunning && (
        <TouchableOpacity style={styles.secondaryButton} onPress={savePhase}>
          <Text style={styles.primaryButtonText}>Tallenna työvaihe</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={phases}
        renderItem={renderPhase}
        keyExtractor={(_, i) => i.toString()}
        style={styles.list}
      />

      <View style={styles.footer}>

        <Text style={styles.label}>Mittaaja</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={saveAll}>
          <Text style={styles.primaryButtonText}>Tallenna kellotus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Timer;
