import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },

  inputGroup: {
    width: '80%',
    marginTop: 20,
  },

  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },

  timerText: {
    fontSize: 48,
    color: '#fff',
    marginRight: 20,
  },

  primaryButton: {
    backgroundColor: '#005B41',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },

  primaryButtonText: {
    color: '#ffffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#df9100ff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    width: '80%'
  },

  list: {
    width: '80%',
    marginTop: 20,
  },

  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  phaseText: {
    color: '#fff',
    fontSize: 18,
  },

  footer: {
    width: '80%',
    marginTop: 20,
    marginBottom: 30,
  },
});
