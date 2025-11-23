import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>É Bem Ali</Text>
      <Text style={styles.subtitle}>Soluções rápidas para condutores 🚗🏍️</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.buttonText}>Abrir Mapa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 10, marginBottom: 40 },
  button: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
