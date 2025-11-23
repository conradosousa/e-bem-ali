// src/screens/MapScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import AddPlaceModal from "../components/AddPlaceModal";
import { getAllPlaces } from "../services/placesService";
import categories from "../utils/categories";

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [places, setPlaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização necessária");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    })();
    (async () => {
      const data = await getAllPlaces();
      setPlaces(data);
    })();
  }, []);

  const onPlaceAdded = async () => {
    const data = await getAllPlaces();
    setPlaces(data);
    setModalVisible(false);
  };

  if (!region) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Obtendo localização...</Text></View>;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Você" />
        {places.map(p => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={p.type}
            pinColor={categories[p.type]?.color || "blue"}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      <AddPlaceModal visible={modalVisible} onClose={() => setModalVisible(false)} userLocation={region} onSaved={onPlaceAdded} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1 },
  map:{ flex:1 },
  addButton:{ position:'absolute', right:20, bottom:30, width:60, height:60, borderRadius:30, backgroundColor:'#FFB300', alignItems:'center', justifyContent:'center', elevation:6 },
  addText:{ fontSize:34, color:'#fff', lineHeight:34 }
});
