// src/screens/InfoScreen.js
import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>É Bem Ali</Text>
      <Text style={styles.text}>Encontre borracharias, oficinas, postos e guinchos próximos — cadastrado pela comunidade.</Text>
      <TouchableOpacity onPress={()=>Linking.openURL("mailto:seu-email@exemplo.com")} style={styles.btn}>
        <Text style={{color:'#fff'}}>Enviar sugestão</Text>
      </TouchableOpacity>
      <Text style={styles.small}>Versão 1.0</Text>
      <Text style={styles.small}>Desenvolvido por Conrado Sousa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center', alignItems:'center' },
  title:{ fontSize:28, fontWeight:'700', color:'#00796B', marginBottom:8 },
  text:{ textAlign:'center', marginBottom:16, color:'#333' },
  btn:{ backgroundColor:'#00796B', padding:12, borderRadius:8, marginBottom:12 },
  small:{ color:'#888', marginTop:6 }
});
