import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

export default function Help() {
  const handleEmailPress = () => {
    Linking.openURL("mailto:support@example.com");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+11234567890");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/icon.png")} // Replace with your local logo path
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Help & Support</Text>

      {/* Email */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Text style={styles.label}>Email Us:</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={{ fontSize: 20 }}>support@example.com</Text>
        </TouchableOpacity>
      </View>

      {/* Phone Number */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Text style={styles.label}>Call Us:</Text>
        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={{ fontSize: 20 }}>+1 (123) 456-7890</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcd24f", // Background color
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  contactButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 40,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
