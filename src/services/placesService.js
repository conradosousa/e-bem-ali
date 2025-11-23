// src/services/placesService.js
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const placesCol = collection(db, "places");

export async function addPlace({ name, type, latitude, longitude, note }) {
  return await addDoc(placesCol, {
    name,
    type,
    latitude,
    longitude,
    note: note || "",
    createdAt: serverTimestamp(),
    confirms: 0
  });
}

export async function getAllPlaces() {
  const q = query(placesCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    // Converter Firestore Timestamp para Date, se aplicável
    const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
      ? data.createdAt.toDate()
      : data.createdAt;
    return { id: d.id, ...data, createdAt };
  });
}
