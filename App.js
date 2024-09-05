import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Auth/Login";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "./components/HomeScreen";
import { enableScreens } from "react-native-screens";
import Help from "./components/subfields/Help";
import DashBoard from "./components/subfields/Dashboard/DashBoard";
import GymeeScreen from "./components/subfields/GymeeScreen";
import AddNewUser from "./components/subfields/addusers/AddNewUser";
enableScreens();
const Stack = createNativeStackNavigator();
const USE_REACT_NAVIGATION = true;

export default function App() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add New User"
          component={AddNewUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gymee screen"
          component={GymeeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashBoard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
