import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
container:{
    flex: 1, 
    width: '100%',
    alignItems: 'center',
},
savedItemCard: {
    backgroundColor: '#ffffffff',
    borderRadius: 10,
    marginBottom: 10,
    width:'90%',
    alignSelf:"center"
},
mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
},
mainTime:{
    fontSize: 22,
    color: 'black',
},
noItemsText: {
    fontSize: 18,
    color: 'black',
},

searchInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
},
input2:{ 
    fontSize: 18, 
    color:'black', 
    orderColor: 'black', 
    borderWidth: 1, 
    width: '100%', 
    backgroundColor: "#3F2E3E"  
},
});