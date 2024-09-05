import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons"; // Import icons from expo/vector-icons

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken"); // Remove JWT token from AsyncStorage
      navigation.replace("Login"); // Navigate to Login screen
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#e63946" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icon.png")}
          style={{ width: 200, height: 200, objectFit: "contain" }}
        />
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            navigation.navigate("Add New User");
          }}
        >
          <Text style={styles.boxText}>NEW</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            navigation.navigate("Gymee screen");
          }}
        >
          <Text style={styles.boxText}>GYMEE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
        >
          <Text style={styles.boxText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            navigation.navigate("Help");
          }}
        >
          <Text style={styles.boxText}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcd23e",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    position: "absolute",
    top: 60,
    right: 20,
    color: "red",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  logoSubText: {
    fontSize: 14,
    fontWeight: "300",
    color: "black",
  },
  gridContainer: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    width: "45%",
    height: 130,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  boxText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
