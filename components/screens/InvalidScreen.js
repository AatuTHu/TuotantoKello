import { View, Text } from 'react-native'
import TopBar from "../TopBar"

export default function InvalidScreen() {
  return (
    <View style={{flex:1, alignItems:'center', width:"100%"}}>
      <TopBar/>
      <Text style={{color:'#ffff', fontSize:20, fontWeight:'bold'}}>Saavuttiin virhe sivulle..</Text>
    </View>
  )
}