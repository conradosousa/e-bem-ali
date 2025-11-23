import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Location from "expo-location";
import { db } from "../../src/services/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function AddPlace() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [coords, setCoords] = useState<any>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada!", "Ative a localização para continuar.");
                return;
            }

            const current = await Location.getCurrentPositionAsync({});
            setCoords(current.coords);
        })();
    }, []);

    async function handleSave() {
        if (!name || !type) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        if (!coords) {
            Alert.alert("Erro", "Localização ainda não carregou.");
            return;
        }

        try {
            await addDoc(collection(db, "places"), {
                name,
                type,
                latitude: coords.latitude,
                longitude: coords.longitude,
                createdAt: new Date(),
            });

            Alert.alert("Sucesso", "Local adicionado!");
            router.push("/map");

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Local</Text>

            <TextInput
                placeholder="Nome do local (ex: Borracharia do Zé)"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Tipo (borracharia, oficina, posto...)"
                style={styles.input}
                value={type}
                onChangeText={setType}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar Local</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#0ea5e9",
        padding: 15,
        borderRadius: 10,
        marginTop: 10
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold"
    }
});
