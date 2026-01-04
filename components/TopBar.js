import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import  Constants  from 'expo-constants'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../service/contexts/NavigationContext';

export default function TopBar() {

  const { setNavigate, navigate } = useNavigation()

  return (
    <View style={styles.nappula}>
      {navigate !== 'Controller' && (
        <TouchableOpacity style={{position:'absolute', left:10}} onPress={() => setNavigate('Controller')}>
          <Ionicons name="arrow-back" size={27} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={{color:'#ffff', fontSize:28, fontWeight:'bold', textAlign:'center'}}></Text>

      <TouchableOpacity style={{position:'absolute', right:10}} onPress={() => setNavigate("Settings")}>
          <Ionicons name="settings" size={27} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    nappula: {
      flexDirection:"row",
      marginTop:Constants.statusBarHeight,
      backgroundColor: '#065a9eff',
      padding: 10,
      width: '100%',
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center',
      marginBottom: 50,
    }
  });