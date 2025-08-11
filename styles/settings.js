import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'left',
  width: '100%',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center'
  },
  labelText: {
    fontSize: 21,
    color: '#ffff',
    marginBottom: 10,
    marginTop: 5,
  },
  settingContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    padding: 15,
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'white',
    padding: 12,
    marginBottom: 10,
    width: '80%',
    fontSize: 18,
    color: 'white',
    borderRadius: 3,
  },
  button:{
    backgroundColor: '#BE3144',
    padding: 10,
    borderRadius: 100,
    marginBottom: 10,
    marginTop: 10,
  },
  tagButton:{
    backgroundColor: '#747070b4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    borderRadius: 20,
    alignSelf: 'flex-start', // ettei veny koko riville
    flexDirection: 'row', // mahdollistaa ikonit + tekstin
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2 // Android-varjo
  },
  tagText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '500',
  fontWeight:"bold"
}
});