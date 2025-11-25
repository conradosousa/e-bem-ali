import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../src/services/firebaseConfig";
import * as Location from "expo-location";
import { router } from "expo-router";

export default function PlacesList() {
    const [places, setPlaces] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserLocation();
        subscribeToPlaces();
    }, []);

    function subscribeToPlaces() {
        const unsubscribe = onSnapshot(collection(db, "places"), (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPlaces(list);
        });

        return () => unsubscribe();
    }

    async function getUserLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
        setLoading(false);
    }

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) ** 2;

        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    function renderItem({ item }) {
        let distanceText = "—";

        if (userLocation) {
            const dist = getDistance(
                userLocation.latitude,
                userLocation.longitude,
                item.latitude,
                item.longitude
            );

            distanceText = `${dist.toFixed(1)} km`;
        }

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/places/${item.id}`)}
            >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={styles.cardDistance}>{distanceText}</Text>
            </TouchableOpacity>
        );
    }

    if (loading)
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Locais Cadastrados</Text>

            {places.length === 0 ? (
                <Text style={styles.empty}>Nenhum local cadastrado.</Text>
            ) : (
                <FlatList
                    data={places}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", padding: 15 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold" },
    cardType: { fontSize: 14, color: "#555", marginTop: 5 },
    cardDistance: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: "bold",
        color: "#007bff",
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#777",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
