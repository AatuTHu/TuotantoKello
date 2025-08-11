import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/timer';
import { useStates } from '../../service/contexts/StateContext';
import { useNavigation } from '../../service/contexts/NavigationContext';
import TopBar from '../TopBar'
const STORAGE_KEY = "timer_start_time";
const STORAGE_PHASES_KEY = "phase_names";

const Timer = () => {
  // State hooks for various functionalities
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mainTitle, setMainTitle] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [userName, setUserName] = useState('');
  const [phases, setPhases] = useState([]);
  const [selectablePhases, setSelectablePhases] = useState([]);
  const [category, setCategory] = useState("")
  const [phaseDropDownVisible, setPhaseDropDownVisible] = useState(false);

  const inputRef = useRef(null);
  const mainTitleInputRef = useRef(null);
  const userNameInputRef = useRef(null);

  const { existingTitle, existingPhases, setExistingTitle, setExistingPhases } = useStates()
  const { setNavigate } = useNavigation()


  // Load the stored start time and phases from AsyncStorage on component mount
  useEffect(() => {
    loadPhases();
    loadStartTime();
  }, []);

  // Handle timer updates when running
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Update mainTitle and phases if existing data is provided
  useEffect(() => {
    if (existingPhases && existingTitle) {
      setMainTitle(existingTitle);
      setPhases(existingPhases);
    }
  }, [existingPhases, existingTitle]);

  useEffect(() => {
    try {
      const fetchUserName = async() => {
        const value = await AsyncStorage.getItem('username');
        if (value !== null) {
          setUserName(value);
        }
      }
      fetchUserName();
    } catch (error) {
      console.error('Virhe luettaessa nimeä AsyncStoragesta:', error);
    }
  },[])


  // Load the stored start time from AsyncStorage
  const loadStartTime = async () => {
    try {
      const storedTime = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTime) {
        const parsedTime = parseInt(storedTime, 10);
        setStartTime(parsedTime);
        setSeconds(Math.floor((Date.now() - parsedTime) / 1000));
        setIsRunning(true);
      }
    } catch (error) {
      console.error("Error loading start time:", error);
    }
  };

  //load phases from AsyncStorage
 const loadPhases = async () => {
    try {
      const saved = await AsyncStorage.getItem('phase_names');
      if (saved) {
        setSelectablePhases(JSON.parse(saved));
      } else {
        setSelectablePhases([]); // jos ei löydy mitään
      }
    } catch (error) {
      console.error('Virhe ladattaessa vaiheita:', error);
      setSelectablePhases([]); // virhetilanteessa tyhjä lista
    }
  };

  // Toggle timer start/stop and save start time to AsyncStorage
  const handleStartStop = async () => {
    if (!isRunning) {
      const now = Date.now();
      setStartTime(now);
      await AsyncStorage.setItem(STORAGE_KEY, now.toString());
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
    setIsRunning(!isRunning);
  };

  // Reset the timer and remove start time from AsyncStorage
  const handleReset = async () => {
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
    setExistingPhases([]);
    setExistingTitle('');
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  // Save a new phase to the list of phases
  const savePhase = () => {
    if (phaseName.trim() === '') {
      handleReset();
      return;
    }
    const newPhase = { phaseName, time: seconds };
    setPhases([...phases, newPhase]);
    setPhaseName("");
    setIsRunning(false);
    setSeconds(0);
  };

  // Save a new phase with a specific name
  const savePhaseName = (name) => {
    setPhaseName(name);
    setPhaseDropDownVisible(false);
  }

  // Save the main title and phases, and update AsyncStorage
  const saveMainTitleWithPhases = async () => {
    if (mainTitle.trim() === '') {
      mainTitleInputRef.current.focus();
      mainTitleInputRef.current.setNativeProps({ style: { borderColor: 'red' } });
      return;
    }

    if(userName.trim() === '') {
      userNameInputRef.current.focus();
      userNameInputRef.current.setNativeProps({ style: { borderColor: 'red' } });
      return;
    }

   
    const totalTime = phases.reduce((total, phase) => total + phase.time, 0) + seconds;
    const newItem = { mainTitle, phases, totalTime, userName, category };

    try {
      const storedItems = await AsyncStorage.getItem('savedItems');
      const items = storedItems ? JSON.parse(storedItems) : [];

      // Check if an item with the same mainTitle exists
      const existingItemIndex = items.findIndex(item => item.mainTitle === mainTitle);

      if (existingItemIndex >= 0) {
        items[existingItemIndex] = newItem;
      } else {
        items.push(newItem);
      }

      await AsyncStorage.setItem('savedItems', JSON.stringify(items));

      // Reset state and navigate to Controller screen
      handleReset();
      setMainTitle("");
      setPhaseName("");
      setCategory("")
      setPhases([]);
      mainTitleInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } });
      userNameInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } });
      setNavigate('Controller');
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  // Delete a phase by its index
  const deletePhase = (index) => {
    const updatedPhases = phases.filter((_, i) => i !== index);
    setPhases(updatedPhases);
  };

  // Render each phase item
  const renderItem = ({ item, index }) => (
    <View key={index} style={[styles.phaseContainer]}>
      <Text style={{ fontSize: 19, color: '#fff', marginTop: 5, width:"75%"}}>
        {item.phaseName}: {Math.floor(item.time / 60)}:
        {item.time % 60 < 10 ? `0${item.time % 60}` : item.time % 60}
      </Text>
      <TouchableOpacity onPress={() => deletePhase(index)} style={{marginRight:15}}>
        <Ionicons name="remove" size={50} color="#BE3144" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ width: '100%', alignItems: 'center', flex: 1 }}>
      <TopBar/>
      {/* Timer Display */}
      <Text style={{ fontSize: 48, marginBottom: 20, color: '#fff' }}>
        {String(Math.floor(seconds / 3600)).padStart(2, '0')}:
        {String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
      </Text>

      {/* Control Buttons */}
      <View style={styles.nappilaatikko}>
        <TouchableOpacity onPress={handleStartStop} style={styles.nappula}>
          <Text style={styles.nappulaText}>{isRunning ? 'Pysäytä' : seconds > 0 ? 'Jatka' : 'Aloita'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.nappula}>
          <Text style={styles.nappulaText}>Resetoi</Text>
        </TouchableOpacity>
      </View>

       

      {/* Main Title Input */}
      <TextInput
        ref={mainTitleInputRef}
        style={styles.input}
        placeholder="Tuotteen nimi"
        value={mainTitle}
        onChangeText={(text) => {
          setMainTitle(text);
          mainTitleInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } });
        }}
      />

      {/* Phase Name Input */}
      <View style={[styles.nappilaatikko,{ width:"80%"}]}>
        {selectablePhases.length > 0 && (
          <TouchableOpacity onPress={ () => setPhaseDropDownVisible(!phaseDropDownVisible)} style={[styles.nappula, { width: '30%' }]}>
            <Text style={styles.nappulaText}>Vaiheet</Text>
          </TouchableOpacity>
        )}

      { (isRunning && selectablePhases.length > 0) && (
        <TouchableOpacity onPress={savePhase} style={[styles.nappula,{ backgroundColor: '#005B41' }]}>
        <Text style={styles.nappulaText}>Tallenna vaihe</Text>
        </TouchableOpacity>
      )}
      </View>
      
      <View style={{flexDirection:"row", width:"80%", flexWrap:"wrap"}}>
        { phaseName.length > 0 && (
         <>
          <Text style={styles.phaseText}>Mitataan aikaa vaiheelle:  </Text>
          <Text style={[styles.phaseText,{fontWeight:"bold", color:"red"}]}>{phaseName}</Text>
         </>
        )}

      </View>

      {/*Dropdown where user selects phases*/}
        { phaseDropDownVisible && (
          <View style={{ width: '80%', justifyContent: 'space-between', marginTop: 10 }}>
          {selectablePhases.map((phase, index) => (    
            <TouchableOpacity key = {index} style={styles.buttonText} onPress={() => savePhaseName(phase)}>
              <Text style={[styles.nappulaText,{padding:2}]}>{phase}</Text>
            </TouchableOpacity>  
          ))}
        </View>
        )}

     

      {/* Phases List */}
      <FlatList
        data={phases}
        style={{width:"80%"}}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

    <View style={{width:"100%", alignItems:"center"}}>
      <Text style={{ fontSize: 16, color: '#fff', width:"80%"}}>Mittaaja</Text>
      <TextInput
      ref={userNameInputRef}
      style={styles.input}
      placeholder="Mittauksen suorittaja: "
      value={userName}
      onChangeText={(text) => {
        setUserName(text);
        userNameInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } });
      }}
    />
    </View>

      {/* Save Button */}
      <View style={{ width: '80%', marginTop: 10}}>
        <TouchableOpacity onPress={saveMainTitleWithPhases} style={[styles.nappula, { backgroundColor: '#005B41', width: '100%', alignSelf: 'center', marginBottom: 30 }]}>
          <Text style={styles.nappulaText}>Tallenna ajastus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Timer;
