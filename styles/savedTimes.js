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
        color: '#fff',
        textAlign: 'center',
    },

    searchInput: {
        width: '90%',
        alignSelf: 'center',
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },

    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        width: '85%',
    },

});