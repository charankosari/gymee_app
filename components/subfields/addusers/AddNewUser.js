import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import moment from "moment";

export default function AddNewUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [subendsin, setSubendsin] = useState("");
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const handleSubmit = async () => {
    if (
      !name ||
      !email ||
      !number ||
      !gender ||
      !height ||
      !weight ||
      !subendsin
    ) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    const formattedHeight = `${parseInt(height)}cm`;
    const formattedWeight = `${parseInt(weight)}kg`;
    const userData = {
      name,
      email,
      number,
      gender,
      height: formattedHeight,
      weight: formattedWeight,
      subendsin: parseInt(subendsin),
      subscriptionStartDate,
    };

    try {
      const response = await fetch(
        "http://192.168.0.103/api/gymee/user/adduser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "User added successfully");
        setName("");
        setEmail("");
        setNumber("");
        setGender("");
        setHeight("");
        setWeight("");
        setSubendsin("");
        setSubscriptionStartDate(moment().format("YYYY-MM-DD"));
      } else {
        Alert.alert("Error", result.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      Alert.alert("Error", "An error occurred while adding the user");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Add New User</Text>
        <View style={styles.formRow}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Gender:</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Enter gender"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Mobile No.:</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Height (cm):</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Enter height"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Sub-Type:</Text>
          <TextInput
            style={styles.input}
            value={subendsin}
            onChangeText={setSubendsin}
            placeholder="Enter subscription type"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Sub-Start Date:</Text>
          <TextInput
            style={styles.input}
            value={subscriptionStartDate}
            onChangeText={setSubscriptionStartDate}
            placeholder="Enter subscription start date"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fcd24f",
  },
  card: {
    backgroundColor: "#fcd23e",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    width: "40%",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
