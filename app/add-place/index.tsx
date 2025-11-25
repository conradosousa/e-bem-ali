import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../src/services/firebaseConfig";

export default function AddPlace() {
    const [name, setName] = useState("");
    const [selectedType, setSelectedType] = useState("Borracharia");
    const [note, setNote] = useState("");

    async function savePlace() {
        if (!name.trim()) {
            Alert.alert("Erro", "Digite o nome do local.");
            return;
        }

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada", "Você precisa permitir acesso à localização.");
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});

            await addDoc(collection(db, "places"), {
                name,
                type: selectedType,
                note,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                createdAt: Date.now(),
            });

            Alert.alert("Sucesso", "Local cadastrado com sucesso!");
            router.push("/places");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível salvar o local.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Local</Text>

            <TextInput
                placeholder="Nome"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <View style={styles.typeContainer}>
                {["Borracharia", "Oficina", "Posto", "Guincho"].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[
                            styles.typeButton,
                            selectedType === t && styles.typeSelected,
                        ]}
                        onPress={() => setSelectedType(t)}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                selectedType === t && { color: "#000" },
                            ]}
                        >
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                placeholder="Observação (opcional)"
                style={[styles.input, { height: 120 }]}
                multiline
                value={note}
                onChangeText={setNote}
            />

            <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
                    <Text style={{ color: "#000" }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnSave} onPress={savePlace}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    typeContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
    },
    typeSelected: { backgroundColor: "#d9f3ff" },
    typeButtonText: { color: "#333" },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    btnCancel: {
        flex: 1,
        backgroundColor: "#e6e6e6",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
    },
    btnSave: {
        flex: 1,
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginLeft: 10,
    },
});
