import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
    container:{
        width: '100%',
        alignItems: 'center',
        flex: 1    
    },
    page: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        width: '80%',
        borderRadius: 2,
        marginBottom: 10
    },
    button: {
        alignItems: 'center',   
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
    },
    title: {
        fontSize: 29,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: "Arial"
    },
    subTitleContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        backgroundColor: '#007bff',
        width:'100%'
    },
    subTitles: {
        width: '33%',
        fontSize: 24,
        fontWeight: 'bold',
        padding:10,
        fontFamily: "Arial",
        color: '#fff',
    },
    dataContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        borderWidth: 1,
        width: '100%',
        justifyContent:'space-between',
        alignItems: 'center',
    }     
});