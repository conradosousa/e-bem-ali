// src/components/AddPlaceModal.js
import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker"; // se não tiver, use um select simples ou substitua
import { addPlace } from "../services/placesService";

export default function AddPlaceModal({ visible, onClose, userLocation, onSaved }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("borracharia");
  const [note, setNote] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return alert("Informe o nome do local");
    await addPlace({
      name: name.trim(),
      type,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      note
    });
    setName(""); setNote(""); setType("borracharia");
    onSaved && onSaved();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Adicionar Local</Text>
          <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
          {/* Se preferir, substitua Picker por botões */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setType("borracharia")} style={[styles.typeBtn, type==="borracharia" && styles.typeActive]}>
              <Text>Borracharia</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType("oficina")} style={[styles.typeBtn, type==="oficina" && styles.typeActive]}>
              <Text>Oficina</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType("posto")} style={[styles.typeBtn, type==="posto" && styles.typeActive]}>
              <Text>Posto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType("guincho")} style={[styles.typeBtn, type==="guincho" && styles.typeActive]}>
              <Text>Guincho</Text>
            </TouchableOpacity>
          </View>
          <TextInput placeholder="Observação (opcional)" value={note} onChangeText={setNote} style={[styles.input, {height:80}]} multiline />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={{color:'#fff'}}>Salvar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  container:{ width:'92%', backgroundColor:'#fff', borderRadius:12, padding:16 },
  title:{ fontSize:18, fontWeight:'600', color:'#00796B', marginBottom:8 },
  input:{ borderWidth:1, borderColor:'#e0e0e0', borderRadius:8, padding:8, marginBottom:8 },
  row:{ flexDirection:'row', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap' },
  typeBtn:{ padding:10, borderRadius:8, backgroundColor:'#f2f2f2', margin:4 },
  typeActive:{ backgroundColor:'#e0f2f1' },
  actions:{ flexDirection:'row', justifyContent:'space-between', marginTop:8 },
  cancelBtn:{ padding:12, backgroundColor:'#eee', borderRadius:8, width:'48%', alignItems:'center' },
  saveBtn:{ padding:12, backgroundColor:'#00796B', borderRadius:8, width:'48%', alignItems:'center' }
});
