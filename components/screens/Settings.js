import { View, Text, Button,Alert, TextInput, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { styles } from '../../styles/settings'
import TopBar from '../TopBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '../../service/contexts/NavigationContext';
import { db } from "../../service/database/firebaseConfig"
import { addDoc, collection, getDocs } from 'firebase/firestore';

export default function Settings() {

  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);
  const { setNavigate } = useNavigation()

  useEffect(() => {
    try {
      const fetchfromAsyncStorage = async() => {
        const value = await AsyncStorage.getItem('username');
         const storedItems = await AsyncStorage.getItem('savedItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setData(parsedItems);
        }
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

  const saveData = async () => {
    try {
    await addDoc(collection(db, "ajastukset"), {
      ...data,
    });
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

const fetchData = async () => {
   try {
    const querySnapshot = await getDocs(collection(db, "ajastukset"));

    const timings = querySnapshot.docs.map(doc => ({
      ...doc.data(),
    }));

    let parsedTimings = Object.values(timings[0])
    await AsyncStorage.setItem('savedItems', JSON.stringify(parsedTimings));

    setNavigate('Controller');
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
}

  return (
  <View style = {styles.container}>
    <TopBar/>

    <View style= {[styles.settingSection, {flexDirection:'column'}]}>
      <Text style={[styles.sectionTitle,{textAlign:'left', width:'100%'}]}>Mittauksissa käytettävä nimi</Text>
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
        </View>
          <Button title='Tallenna' onPress={saveName}/>
    </View>

    <View style= {styles.settingSection}>
      <Text style={styles.sectionTitle}>Hae mittaukset pilvestä</Text>
      <Button title='Hae' onPress={fetchData}/>
    </View>

    <View style= {styles.settingSection}>
      <Text style={styles.sectionTitle}>Tallenna mittaukset pilveen</Text>
      <Button title='Tallenna' onPress={saveData}/>
    </View>


    <View style= {styles.settingSection}>
      <Text style={styles.sectionTitle}>Tyhjennä muisti</Text>
      <Button title='tyhjennä' onPress={clearStorage}/>
    </View>
    
  </View>
  )
}