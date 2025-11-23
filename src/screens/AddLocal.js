import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function AddLocal() {
    const [region, setRegion] = useState(null);
    const [marker, setMarker] = useState(null);
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada", "Ative a localização para continuar.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    async function salvarLocal() {
        if (!marker) return Alert.alert("Erro", "Toque no mapa para marcar o local.");
        if (!nome.trim()) return Alert.alert("Erro", "Digite o nome.");
        if (!categoria.trim()) return Alert.alert("Erro", "Digite a categoria.");

        await addDoc(collection(db, "locais"), {
            nome,
            categoria,
            latitude: marker.latitude,
            longitude: marker.longitude,
            criadoEm: new Date(),
        });

        Alert.alert("Sucesso", "Local salvo com sucesso!");
        setNome("");
        setCategoria("");
        setMarker(null);
    }

    return (
        <View style={{ flex: 1 }}>
            {region && (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    onPress={(e) => setMarker(e.nativeEvent.coordinate)}
                >
                    {marker && <Marker coordinate={marker} />}
                </MapView>
            )}

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do local"
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Categoria (borracharia, oficina, posto)"
                    value={categoria}
                    onChangeText={setCategoria}
                />

                <TouchableOpacity style={styles.btn} onPress={salvarLocal}>
                    <Text style={styles.btnTxt}>Salvar Local</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: 10,
        backgroundColor: "#fff",
    },
    input: {
        backgroundColor: "#eee",
        marginVertical: 4,
        padding: 10,
        borderRadius: 8,
    },
    btn: {
        backgroundColor: "#ff3860",
        padding: 12,
        borderRadius: 8,
        marginTop: 6,
    },
    btnTxt: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});
