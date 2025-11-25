import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Linking, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/services/firebaseConfig";
import * as Location from "expo-location";

export default function PlaceDetails() {
    const { id } = useLocalSearchParams();
    const [place, setPlace] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const docRef = doc(db, "places", id);
            const snap = await getDoc(docRef);

            if (snap.exists()) setPlace(snap.data());

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const loc = await Location.getCurrentPositionAsync({});
                setUserLocation(loc.coords);
            }

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
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

    if (loading || !place)
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );

    let distance = null;

    if (userLocation) {
        distance = getDistance(
            userLocation.latitude,
            userLocation.longitude,
            place.latitude,
            place.longitude
        ).toFixed(2);
    }

    function openInMaps() {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
        Linking.openURL(url);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{place.name}</Text>
            <Text style={styles.type}>{place.type}</Text>

            {place.note ? (
                <Text style={styles.note}>Observação: {place.note}</Text>
            ) : null}

            <Text style={styles.distance}>
                Distância: {distance ? `${distance} km` : "calculando..."}
            </Text>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                    title={place.name}
                    description={place.type}
                />
            </MapView>

            <TouchableOpacity style={styles.navBtn} onPress={openInMaps}>
                <Text style={styles.navText}>Navegar até aqui</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
    type: {
        fontSize: 18,
        color: "#555",
        marginBottom: 10,
        fontStyle: "italic",
    },
    note: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    distance: { marginVertical: 10, fontSize: 16, fontWeight: "bold" },
    map: {
        width: "100%",
        height: 300,
        borderRadius: 12,
        marginTop: 10,
    },
    navBtn: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
        alignItems: "center",
    },
    navText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
