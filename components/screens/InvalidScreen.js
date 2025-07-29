import { View, Text, TouchableOpacity } from 'react-native'
import TopBar from "../TopBar"
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '../../service/contexts/NavigationContext';

export default function InvalidScreen() {

  const { setNavigate } = useNavigation()

  return (
    <View style={{flex:1, alignItems:'center', width:"100%"}}>
      <TopBar/>
      
      <Text style={{color:'#ffff', fontSize:20, fontWeight:'bold'}}>Saavuttiin virhe sivulle..</Text>
    </View>
  )
}