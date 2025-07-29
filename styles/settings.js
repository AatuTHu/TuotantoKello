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
  }
});