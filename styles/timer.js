import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  marginTop: 20,
  width: '100%',
  },
  title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#fff',
  },
  scrollContainer: {
  width: '90%',
  },
  savedItemContainer: {
  backgroundColor: '#3F2E3E',
  padding: 15,
  marginBottom: 15,
  borderRadius: 10,
  width: '100%',
  },
  mainTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 10,
  },
  totalTimeText: {
  fontSize: 18,
  color: '#fff',
  marginBottom: 10,
  },
  phaseText: {
  fontSize: 20,
  color: '#fff',
  },
  deleteButton: {
  backgroundColor: '#BE3144',
  padding: 10,
  borderRadius: 50,
  alignSelf: 'flex-end',
  },
  noItemsText: {
  fontSize: 18,
  color: '#fff',
  },
  nappula: {
  backgroundColor: '#BE3144',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
  },
  nappulaText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 22,
  },
  nappilaatikko: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '50%',
  },
  phaseContainer: {
  flexDirection: 'row',
  marginBottom: 10,
  width:"100%",
  justifyContent:"space-between"
  },
  deleteButton: {
  marginRight: 16,
  },
  input: {
  borderWidth: 2,
  borderColor: '#ccc',
  borderRadius: 3,
  padding: 10,
  marginBottom: 10,
  fontSize: 17,
  backgroundColor: '#fff',
  width: '80%',
  },
  searchInput: {
  height: 40,
  width: '90%',
  borderColor: 'gray',
  borderWidth: 1,
  margin: 10,
  padding: 10,
  borderRadius: 5,
  backgroundColor: '#fff',
  },
  input2:{ 
  fontSize: 18, 
  color:'#fff', 
  orderColor: 'black', 
  borderWidth: 1, 
  width: '100%', 
  backgroundColor: "#3F2E3E"  
  },
  buttonText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedOuter: {
    borderColor: '#007AFF', // iOS blue
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 22,
    color: '#FFFf',
  },
   radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});