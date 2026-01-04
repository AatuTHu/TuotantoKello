import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
    container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    paddingHorizontal: 10,
  },
  label: { fontSize: 16, color: "#fff", marginBottom: 5 },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 3,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 17,
    backgroundColor: "#fff",
  },
  result: { fontSize: 16, marginTop: 10, color: "#fff" },
  phaseText: { fontSize: 17, color: "#ccc", marginLeft: 10 },
  formula: {
    fontSize: 13,
    color: "#ccc",
    fontStyle: "italic",
    marginTop: 5,
  },
})