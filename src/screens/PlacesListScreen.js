// src/screens/PlacesListScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getAllPlaces } from "../services/placesService";

export default function PlacesListScreen() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getAllPlaces();
      setPlaces(data);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locais próximos</Text>
      <FlatList
        data={places}
        keyExtractor={(i)=>i.id}
        renderItem={({item})=>(
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.type}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  title:{ fontSize:18, fontWeight:'600', marginBottom:8 },
  card:{ padding:12, backgroundColor:'#fff', borderRadius:8, marginBottom:8, elevation:2 },
  name:{ fontSize:16, fontWeight:'600' },
  type:{ color:'#666' }
});
