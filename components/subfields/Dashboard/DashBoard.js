import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import moment from "moment";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function DashBoard() {
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [attendance, setAttendance] = useState({});
  const screenWidth = Dimensions.get("window").width;

  const fetchData = async () => {
    setLoading(true);
    try {
      const isNumber = /^\d+$/.test(emailOrNumber);
      const payload = isNumber
        ? { gymnumber: parseInt(emailOrNumber, 10), password }
        : { gymemail: emailOrNumber, password };

      const jwtToken = await AsyncStorage.getItem("jwtToken");
      console.log(payload);
      const response = await axios.post(
        "http://192.168.0.103:1337/api/gymee/gym-admin",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Data fetched successfully!");
        setData(response.data.data);
        setAttendance(response.data.data.attendance);

        setLoading(false);
      } else {
        Alert.alert("Error", "Failed to fetch data!");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
      setLoading(false);
    }
  };
  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
    if (endDate && currentDate > endDate) {
      Alert.alert("Error", "Start date cannot be later than end date.");
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
    if (startDate && currentDate < startDate) {
      Alert.alert("Error", "End date cannot be earlier than start date.");
    }
  };
  const submitDateRange = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://192.168.0.103:1337/api/gymee/admin-details",
        {
          startDate: moment(startDate).format("DD-MM-YYYY"),
          endDate: moment(endDate).format("DD-MM-YYYY"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // charankosari.ck@gmail.com Charan@1729

      if (response.data.success) {
        Alert.alert("Success", "Attendance data fetched successfully!");
        setAttendance(response.data.data.attendance);
      } else {
        Alert.alert("Error", "Failed to fetch attendance data!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  const renderGenderChart = () => {
    if (!data) return null;
    const pieData = [
      {
        name: "Male",
        population: data.gender.male,
        color: "#2ecc71",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "Female",
        population: data.gender.female,
        color: "pink",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
    ];

    return (
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={180}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f5f5f5",
          backgroundGradientTo: "#f5f5f5",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />
    );
  };

  const renderAttendanceChart = () => {
    if (!attendance) return null;
    const entries = Object.entries(attendance).map(([date, value]) => ({
      date: moment(date, "DD-MM-YYYY").format("DD-MM"),
      value,
    }));
    if (entries.length > 1) {
      const firstDate = moment(entries[0].date, "DD-MM");
      const secondDate = moment(entries[1].date, "DD-MM");
      if (firstDate.isAfter(secondDate)) {
        entries.reverse();
      }
    }

    const labels = entries.map((entry) => entry.date);
    const attendanceData = entries.map((entry) => entry.value);

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels,
              datasets: [{ data: attendanceData }],
            }}
            width={Math.max(labels.length * 60, screenWidth)}
            height={280}
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              style: { borderRadius: 16 },
              barPercentage: 0.7,
            }}
            style={{ marginVertical: 8, borderRadius: 16, paddingLeft: 10 }}
          />
        </ScrollView>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: "#f5f5f5",
      }}
    >
      {!data ? (
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
            }}
          >
            Dashboard
          </Text>
          <TextInput
            placeholder="Enter email or number"
            value={emailOrNumber}
            onChangeText={setEmailOrNumber}
            style={{
              borderBottomWidth: 1,
              marginVertical: 10,
              padding: 8,
              fontSize: 16,
              borderColor: "#ccc",
            }}
          />
          <TextInput
            placeholder="Enter password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={{
              borderBottomWidth: 1,
              marginVertical: 10,
              padding: 8,
              fontSize: 16,
              borderColor: "#ccc",
            }}
          />
          <TouchableOpacity
            onPress={fetchData}
            style={{
              backgroundColor: loading ? "#ccc" : "#fcd23e",
              paddingVertical: 12,
              paddingHorizontal: 12,
              justifyContent: "center",
              borderRadius: 4,
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
      ) : (
        <ScrollView>
          <View style={{ display: "flex", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 20,
                color: "#333",
              }}
            >
              Dashboard
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 20,
              color: "#333",
            }}
          >
            Gender Distribution
          </Text>
          {renderGenderChart()}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 20,
              color: "#333",
            }}
          >
            Attendance Data
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text>Start Date: {moment(startDate).format("DD/MM/YYYY")}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text>End Date: {moment(endDate).format("DD/MM/YYYY")}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
              />
            )}
            <TouchableOpacity
              onPress={submitDateRange}
              style={{
                backgroundColor: "#fcd23e",
                padding: 10,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          </View>
          {renderAttendanceChart()}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
