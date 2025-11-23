import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

// Firestore
import { db } from "../../src/services/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [places, setPlaces] = useState<any[]>([]); // ← onde vamos guardar os locais do Firestore

  // ---- LOCALIZAÇÃO ----
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização negada!");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  // ---- FIRESTORE (escuta em tempo real) ----
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "places"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPlaces(list);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >

        {/* Marcadores vindos do Firestore */}
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.type}
            pinColor="#0ea5e9"
          />
        ))}

      </MapView>

      {/* Botão flutuante para adicionar */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-place")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#0ea5e9",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 34,
    marginTop: -4,
  },
});
