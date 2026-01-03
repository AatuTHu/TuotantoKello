import { View, Text, Button,Alert, TextInput, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { styles } from '../../styles/settings'
import TopBar from '../TopBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {

  const [username, setUsername] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [selectablePhases, setSelectablePhases] = useState([]);

  useEffect(() => {
    try {
      const fetchfromAsyncStorage = async() => {
        const value = await AsyncStorage.getItem('username');
        if (value !== null) {
          setUsername(value);
        }
      }
      fetchfromAsyncStorage();
    } catch (error) {
      console.error('Virhe luettaessa nimeä AsyncStoragesta:', error);
    }
  },[])

  const clearStorage = async () => {
    Alert.alert(
      'Varoitus',
      'Haluatko varmasti tyhjentää kaiken tallennetun datan?',
      [
        {
          text: 'Peruuta',
          style: 'cancel',
        },
        {
          text: 'Tyhjennä',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log('AsyncStorage tyhjennetty!');
            } catch (error) {
              console.error('Virhe tyhjennettäessä AsyncStoragea:', error);
            }
          },
        },
      ]
    );
  };

  const saveName = async () => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.error('Virhe tallennettaessa nimeä AsyncStorageen:', error);
    }
  }

const savePhaseName = async () => {
  try {
    const savedNames = await AsyncStorage.getItem('phase_names');
    let namesArray = savedNames ? JSON.parse(savedNames) : [];
    namesArray.push(phaseName);
    setSelectablePhases(namesArray);
    await AsyncStorage.setItem('phase_names', JSON.stringify(namesArray));
    setPhaseName('');
  } catch (error) {
    console.error('Virhe tallennettaessa vaihetta AsyncStorageen:', error);
  }
};

const deletePhase = async (phase) => {
  try {
    const savedNames = await AsyncStorage.getItem('phase_names');
    let namesArray = savedNames ? JSON.parse(savedNames) : [];
    const updatedNames = namesArray.filter(item => item !== phase);
    await AsyncStorage.setItem('phase_names', JSON.stringify(updatedNames));
    setSelectablePhases(updatedNames);
  } catch (error) {
    console.error('Virhe poistettaessa vaihetta AsyncStorageista:', error);
  }
  }

  return (
  <View style = {styles.container}>
    <TopBar/>
        <View style= {styles.settingContainer}>
        <Text style={styles.labelText}>Tyhjennä muisti</Text>
          <Button title='tyhjennä' onPress={clearStorage}/>
        </View>

    <View style= {[styles.settingContainer, {flexDirection:'column'}]}>
      <Text style={[styles.labelText,{textAlign:'left', width:'100%'}]}>Mittauksissa käytettävä nimi</Text>
        <View style= {{flexDirection:'row'}}>
          <TextInput
          style={styles.input}
          placeholder="Nimi"
          value={username}
          placeholderTextColor={'white'}
          onChangeText={(text) => setUsername(text)}
          numberOfLines={1}
          maxLength={25}
          />
          <TouchableOpacity onPress={saveName} style={styles.button}>
            <Ionicons name='save' size={32} color={'white'}/>
          </TouchableOpacity>
        </View>

    </View> 
  </View>
  )
}