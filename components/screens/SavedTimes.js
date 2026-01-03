import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput,FlatList, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/savedTimes';
import { useNavigation } from '../../service/contexts/NavigationContext';
import { useStates } from '../../service/contexts/StateContext';
import { formatTime, generateHtml } from '../../service/Utilities';
import * as Print from 'expo-print';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system/legacy';

const SavedTimes = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [filteredItems, setFilteredItems] = useState([]);

  const { setNavigate } = useNavigation()
  const { setExistingTitle, setExistingPhases, setSelectedItems } = useStates()

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('savedItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setSavedItems(parsedItems);
          setFilteredItems(parsedItems);
        }
      } catch (error) {
        console.error('Error fetching saved items:', error);
      }
    };

    fetchSavedItems();
  }, []);

  useEffect(() => {
    const filterItems = () => {
      if (!searchTerm) {
        setFilteredItems(savedItems);
        return;
      }

      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = savedItems.filter((item) => {
        if (item.mainTitle.toLowerCase().includes(lowerSearchTerm)) {
          return true; // Match main title
        }

        return item.phases.some((phase) =>
          phase.phaseName.toLowerCase().includes(lowerSearchTerm)
        ); // Match phase name
      });
      setFilteredItems(filtered);
    };

    filterItems();
  }, [searchTerm, savedItems]);
  
  const onPressSavedTimeCard = (mainTitle, phases) => {
    setExistingTitle(mainTitle);
    setExistingPhases(phases);
    setNavigate('Timer');
  };
    
const deleteSelectedItems = async (itemToDelete) => {
  const updatedItems = savedItems.filter(
    item => item.mainTitle !== itemToDelete.mainTitle
  );
  setSavedItems(updatedItems);
  setSelectedItems([]);

  try {
    await AsyncStorage.setItem("savedItems", JSON.stringify(updatedItems));
    console.log("Saved Items After AsyncStorage Update:", await AsyncStorage.getItem("savedItems"));
  } catch (error) {
    console.error("Error deleting item from AsyncStorage:", error);
  }
};

// Print function
  const print = async (item) => {
    const html = generateHtml(item);
    await Print.printAsync({ html, printerUrl: selectedPrinter?.url });
  };

  // Email function
  const email = async (item) => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) return alert('Email is not available on this device');

    const html = generateHtml(item);
    const { uri } = await Print.printToFileAsync({ html, base64: false });

    const safeTitle = item.mainTitle.replace(/[^a-z0-9]/gi, '_');
    const pdfUri = FileSystem.documentDirectory + `${safeTitle}.pdf`;

    await FileSystem.copyAsync({ from: uri, to: pdfUri });

    await MailComposer.composeAsync({
      subject: `Report: ${item.mainTitle}`,
      body: 'PDF tiedosto mittauksesta.',
      attachments: [pdfUri],
    });
  };

const onPressAnalytics = (item) => {
  setSelectedItems(item)
     setTimeout(() => {
    setNavigate("Analytics");
  }, 100);
}

  

return (
<View style={styles.container}>

  <Text style={styles.label}>
    Hae tiettyä kellotusta
    <Ionicons style={styles.searchIcon} name="search" size={18}/>
  </Text>
  <TextInput
    style={styles.searchInput}
    value={searchTerm}
    onChangeText={(text) => setSearchTerm(text)}
  />

  <FlatList
  data={filteredItems}
  numColumns={1}
  keyExtractor={(item, index) => index.toString()}
  style={{marginTop:5, width:"100%"}}
  showsHorizontalScrollIndicator={false}
  ListEmptyComponent={
  <Text style={styles.noItemsText}>Ei tallennettuja aikoja.</Text>
  }
  renderItem={({ item, index }) => (
    <View style={[styles.savedItemCard]}>
      <TouchableOpacity
        onPress={() => onPressSavedTimeCard(item.mainTitle, item.phases)}
        onLongPress={() => {
        Alert.alert(
          "Poista kortti",
          "Haluatko varmasti poistaa tämän kortin?",
          [
            { text: "Peruuta", style: "cancel" },
            { text: "Poista", style: "destructive", onPress: () => deleteSelectedItems(item) }],
            { cancelable: true })
          }} delayLongPress={300}
      >

    <View style={{alignItems: 'left', padding: 7 }}>
      <Text
      style={styles.mainTitle}
      numberOfLines={1} // or 2
      ellipsizeMode="tail"
      >
        Tuote: {item.mainTitle}
      </Text>
        <View style={{justifyContent:"space-between", flexDirection:"row"}}>

          <Text style={styles.mainTime}>Aika: {formatTime(item.totalTime)}</Text>

            <View style={{flexDirection:"row"}}>
              <TouchableOpacity style={{marginRight: 15}} onPress={() => onPressAnalytics(item)}>
                <Ionicons name='analytics' size={43} color={"#BE3144"}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => print(item)}>
                <Ionicons name='print-outline' size={43} color={"#BE3144"}/>
              </TouchableOpacity>

              <TouchableOpacity style={{marginLeft: 15}} onPress={() => email(item)}>
                <Ionicons name='mail-outline' size={43} color={"#BE3144"}/>
              </TouchableOpacity>
            </View>
        </View>

    </View>

    </TouchableOpacity>
    </View>
  )}/>

</View>
)}

export default SavedTimes;