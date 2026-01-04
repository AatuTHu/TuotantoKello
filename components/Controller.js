import { View,TouchableOpacity,StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import SavedTimes from './screens/SavedTimes';
import { useNavigation } from '../service/contexts/NavigationContext';
import { useStates } from '../service/contexts/StateContext';
import TopBar from './TopBar';
import { Ionicons } from '@expo/vector-icons';

export default function Controller() {

const { setNavigate } = useNavigation()
const { setExistingPhases, setExistingTitle, setSelectedItems } = useStates()

useEffect(() => {
  setExistingTitle('');
  setExistingPhases([]);
  setSelectedItems([]);
},[])

return (
  <View style={styles.container}>
    <TopBar/>
      
      <SavedTimes/>

      <View style={styles.buttonBox}>
      <TouchableOpacity onPress={() => setNavigate('Timer')}>
        <Ionicons name="stopwatch-outline" size={90} color="#FFFf" />
      </TouchableOpacity>
    
    </View> 
  
  </View>
)
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#BE3144',
      padding: 15,
      alignItems:'center',
      borderRadius: 100,
      marginBottom: 10,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonBox: {
      flexDirection: 'row',
      justifyContent:'space-around',
      width: '100%',
      marginTop:10,
      marginBottom: 20,
    },
  });