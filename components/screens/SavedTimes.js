import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput,FlatList, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/savedTimes';
import { useNavigation } from '../../service/contexts/NavigationContext';
import { useStates } from '../../service/contexts/StateContext';
import { formatTime } from '../../service/Utilities';

const SavedTimes = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
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

const onPressPrinter = (item) => {
  setSelectedItems(item)
   setTimeout(() => {
    setNavigate("Printer");
  }, 100);
}

const onPressAnalytics = (item) => {
  setSelectedItems(item)
     setTimeout(() => {
    setNavigate("Analytics");
  }, 100);
}
  

return (
<View style={styles.container}>

  <TextInput
  style={styles.searchInput}
  placeholder="Hae tiettyä aikaa..."
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
        {
          text: "Peruuta",
          style: "cancel"
        },
        {
          text: "Poista",
          style: "destructive",
          onPress: () => deleteSelectedItems(item)
        }
      ],
      { cancelable: true }
    );
  }}
  delayLongPress={300}
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

      <TouchableOpacity style={styles.button} onPress={() => onPressPrinter(item)}>
        <Ionicons name='print-outline' size={43} color={"#BE3144"}/>
      </TouchableOpacity>
      </View>
    </View>


  </View>
      </TouchableOpacity>
  </View>
  )}
  />
</View>
)}

export default SavedTimes;