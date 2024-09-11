import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginComponent = ({ navigation }) => {
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const url = "http://192.168.0.103:1337/api/gymee";

  useEffect(() => {
    const checkToken = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (jwtToken) {
          const response = await fetch(`${url}/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            navigation.replace("HomeScreen");
          } else {
            await AsyncStorage.removeItem("jwtToken");
          }
        }
      } catch (error) {
        console.error("Error retrieving JWT token:", error);
      }
    };

    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    const isNumber = /^\d+$/.test(emailOrNumber);
    const u = `http://192.168.0.103:1337/api/gymee/login`;

    const body = isNumber
      ? { gymnumber: parseInt(emailOrNumber, 10), password }
      : { gymemail: emailOrNumber, password };

    try {
      const response = await fetch(u, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        const jwtToken = data.jwtToken;
        await AsyncStorage.setItem("jwtToken", jwtToken);
        await AsyncStorage.setItem(
          isNumber ? "number" : "email",
          emailOrNumber
        );
        navigation.replace("HomeScreen");
      } else {
        Alert.alert("Error", data.error || "Login failed");
      }
    } catch (error) {
      console.log(error, u, process.env.EXPO_PUBLIC_API_URL);

      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fcd23e" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ width: "80%", alignItems: "center" }}>
          <Text style={{ fontSize: 36, marginBottom: 24 }}>Login</Text>
          <TextInput
            placeholder="Enter your email or mobile number..."
            style={{
              height: 40,
              borderColor: "#ccc",
              borderBottomWidth: 1,
              marginBottom: 12,
              paddingHorizontal: 8,
              fontSize: 16,
              width: "100%",
            }}
            textContentType="oneTimeCode"
            value={emailOrNumber}
            onChangeText={setEmailOrNumber}
            editable={!loading}
          />
          <TextInput
            placeholder="Enter your password..."
            secureTextEntry
            style={{
              height: 40,
              borderColor: "#ccc",
              borderBottomWidth: 1,
              marginBottom: 24,
              paddingHorizontal: 8,
              fontSize: 16,
              width: "100%",
            }}
            value={password}
            textContentType="oneTimeCode"
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: loading ? "#ccc" : "#fcd23e",

              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 4,
              width: "60%",
              alignItems: "center",
              marginBottom: 24,
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
                Login
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginComponent;
