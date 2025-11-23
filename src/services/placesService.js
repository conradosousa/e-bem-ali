// src/services/placesService.js
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

const placesCol = collection(db, "places");

export async function addPlace({ name, type, latitude, longitude, note }) {
  return await addDoc(placesCol, {
    name,
    type,
    latitude,
    longitude,
    note: note || "",
    createdAt: new Date(),
    confirms: 0
  });
}

export async function getAllPlaces() {
  const q = query(placesCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
