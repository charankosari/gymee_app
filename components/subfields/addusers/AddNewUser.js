import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddNewUser({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [subendsin, setSubendsin] = useState("");
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(
    new Date()
  );
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || subscriptionStartDate;
    setShowDatePicker(Platform.OS === "ios");
    setSubscriptionStartDate(currentDate);
  };
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

    const formatDate = (date) => {
      return moment(date).format("YYYY-MM-DD");
    };

    const formattedHeight = `${parseInt(height)}cm`;
    const formattedWeight = `${parseInt(weight)}kg`;

    const userData = {
      name,
      email,
      number: parseInt(number),
      gender,
      height: formattedHeight,
      weight: formattedWeight,
      subendsin: parseInt(subendsin),
      subscriptionStartDate: formatDate(subscriptionStartDate),
    };

    const jwtToken = await AsyncStorage.getItem("jwtToken");
    setLoading(true);

    try {
      const response = await fetch(
        "http://192.168.0.103:1337/api/gymee/user/adduser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "User added successfully");
        setName("");
        setEmail("");
        setNumber("");
        setGender("male");
        setHeight("");
        setWeight("");
        setSubendsin("");
        setSubscriptionStartDate(new Date());
        navigation.navigate("HomeScreen");
      } else {
        const result = await response.json();
        Alert.alert("Error", result.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      Alert.alert("Error", "An error occurred while adding the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            <View style={styles.radioGroup}>
              <View style={styles.radioOutline}>
                <RadioButton
                  value="male"
                  status={gender === "male" ? "checked" : "unchecked"}
                  onPress={() => setGender("male")}
                  color="#333"
                />
              </View>
              <Text>Male</Text>
              <View style={styles.radioOutline}>
                <RadioButton
                  value="female"
                  status={gender === "female" ? "checked" : "unchecked"}
                  onPress={() => setGender("female")}
                  color="#333"
                />
              </View>
              <Text>Female</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Mobile No.:</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={(text) => {
                let formattedNumber = text.replace(/\s+/g, "");
                if (formattedNumber.startsWith("+91")) {
                  formattedNumber = formattedNumber.slice(3);
                }
                setNumber(formattedNumber);
              }}
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
            <Text style={styles.label}>Sub Ends In (Days):</Text>
            <TextInput
              style={styles.input}
              value={subendsin}
              onChangeText={setSubendsin}
              placeholder="Enter subscription duration in days"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Sub-Start Date:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "#333" }}>
                {moment(subscriptionStartDate).format("YYYY-MM-DD")}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={subscriptionStartDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add User</Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={loading}
            animationType="none"
            onRequestClose={() => setLoading(false)}
          >
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Adding User...</Text>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    display: "flex",
    backgroundColor: "#fcd24f",
  },
  card: {
    backgroundColor: "#fcd23e",
    marginTop: "20%",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "center",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOutline: {
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingText: {
    color: "#000",
    marginTop: 10,
    fontSize: 16,
  },
});
