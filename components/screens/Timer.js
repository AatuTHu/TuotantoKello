import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../TopBar';
import { styles } from '../../styles/timer';
import { useStates } from '../../service/contexts/StateContext';
import { useNavigation } from '../../service/contexts/NavigationContext';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import NativeTimerModule from '../../specs/NativeTimerModule';
import { formatTime } from '../../service/Utilities';


const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [mainTitle, setMainTitle] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [userName, setUserName] = useState('');
  const [phases, setPhases] = useState([]);

  const mainTitleRef = useRef(null);
  const phaseRef = useRef(null);
  const rafId = useRef(null);

  const { existingTitle, existingPhases, setExistingTitle, setExistingPhases } = useStates();
  const { setNavigate } = useNavigation();

  /* -------------------- LOAD DATA -------------------- */

  useEffect(() => {
    updateTime();
    return () => cancelAnimationFrame(rafId.current); // cleanup
  }, []);
  
  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem('username');
      if (name) setUserName(name);
    };
    loadUserName();
  }, []);
  
  useEffect(() => {
    if (existingTitle) setMainTitle(existingTitle);
    if (existingPhases) setPhases(existingPhases);
  }, [existingTitle, existingPhases]);
  
  const updateTime = () => {
    const ms = NativeTimerModule.getElapsedTime();
    setSeconds(ms);
    rafId.current = requestAnimationFrame(updateTime);
  };

  const startTimer = async () => {
   setIsRunning(true);
   NativeTimerModule.start();
  };

  const stopTimer = async () => {
   setIsRunning(false);
   NativeTimerModule.stop();
  }

  const resetTimer = async () => {
   setIsRunning(false);
   NativeTimerModule.reset();
  };

  /* -------------------- PHASES -------------------- */

  const savePhase = () => {
    if (!phaseName.trim()) {
      phaseRef.current?.focus();
      return;
    }
    //Round milliseconds to seconds and fix the decimals to none
    const sec = Number((seconds / 1000).toFixed(0))
    
    setPhases(prev => [...prev, { phaseName, time: sec}]);
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

    const totalTime = phases.reduce((sum, p) => sum + p.time, 0);
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

    setPhases([]);
    setMainTitle('');
    setPhaseName('');
    setExistingTitle('');
    setExistingPhases([]);

    resetTimer();
    setNavigate('Controller');
  };

  /* -------------------- RENDER -------------------- */

  const renderPhase = ({ item, index }) => (
    <View style={styles.phaseRow}>
      <Text style={styles.phaseText}>{item.phaseName}:</Text>
      <Text style={styles.phaseText}>
        {formatTime(item.time)}
      </Text>

      <Ionicons 
      onPress={() => deletePhase(index)} 
      name="remove-circle-outline"
      size={40} 
      color="#F44336"
      />
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
          {NativeTimerModule.getFormattedTime()}
        </Text>

          <Ionicons
            onPress={isRunning ? stopTimer : startTimer}
            name={isRunning ? 'stop' : 'play'}
            color={isRunning ? "#F44336" : "#005B41"}
            size={55}
          />
       
          {seconds > 0 && 
            <Ionicons
              onPress={resetTimer}
              name="refresh"
              size={50}
              color="#FF9800"
            />
          }
      </View>

      {isRunning || seconds > 0 && (
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
