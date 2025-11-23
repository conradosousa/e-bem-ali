// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./src/screens/MapScreen";
import PlacesListScreen from "./src/screens/PlacesListScreen";
import InfoScreen from "./src/screens/InfoScreen";
import AddLocal from "./src/screens/AddLocal"; // <-- ADICIONADO

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Mapa">
        <Stack.Screen
          name="Mapa"
          component={MapScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Locais"
          component={PlacesListScreen}
          options={{ title: "Locais Próximos" }}
        />

        <Stack.Screen
          name="AdicionarLocal"
          component={AddLocal}
          options={{ title: "Adicionar Local" }}
        />

        <Stack.Screen
          name="Info"
          component={InfoScreen}
          options={{ title: "Sobre" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
