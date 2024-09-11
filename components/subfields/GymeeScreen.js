import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export default function GymeeScreen({ navigation }) {
  const [gymId, setGymId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [attendance, setAttendance] = useState(null); // To store attendance status
  const [todayMarked, setTodayMarked] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [additionalDays, setAdditionalDays] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const fetchGymUser = async () => {
    const numericGymId = Number(gymId);

    if (!numericGymId || isNaN(numericGymId)) {
      Alert.alert("Error", "Please enter a valid numeric Gym ID.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Error", "Token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://192.168.0.103:1337/api/gymee/user/getgymuser/${numericGymId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        const todayDate = moment().format("DD-MM-YYYY");
        const todayAttendance = data.user.attendance[todayDate];

        const subscriptionEndDate = moment(
          data.user.subscriptionEndDate,
          "YYYY-MM-DD"
        );

        const isSubscriptionExpired = moment().isAfter(
          subscriptionEndDate,
          "day"
        );

        if (isSubscriptionExpired) {
          setSubscriptionExpired(true);
        } else {
          setTodayMarked(todayAttendance === "yes");
        }
      } else {
        Alert.alert("Error", "User not found.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    const numericGymId = Number(gymId);

    if (!numericGymId || isNaN(numericGymId)) {
      Alert.alert("Error", "Please enter a valid numeric Gym ID.");
      return;
    }

    if (!attendance) {
      Alert.alert("Error", "Please select attendance status.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Error", "Token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://192.168.0.103:1337/api/gymee/user/getgymuser/${numericGymId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: moment().format("DD-MM-YYYY"),
            attendance,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Attendance marked successfully.");
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Error", "Failed to mark attendance.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit attendance.");
    } finally {
      setLoading(false);
    }
  };

  const upgradeSubscription = async () => {
    // const numericGymId = Number(gymId);

    // if (!numericGymId || isNaN(numericGymId)) {
    //   Alert.alert("Error", "Please enter a valid numeric Gym ID.");
    //   return;
    // }

    if (!additionalDays || isNaN(additionalDays)) {
      Alert.alert("Error", "Please enter a valid number of days.");
      return;
    }

    setLoading(true);
    setModalVisible(false);

    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Error", "Token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://192.168.0.103:1337/api/gymee/user/updateuser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: userData._id, // User ID
            days: Number(additionalDays), // Number of additional days
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Subscription upgraded successfully.");
        setModalVisible(false);
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Error", "Failed to upgrade subscription.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upgrade subscription.");
    } finally {
      setLoading(false);
    }
  };
  const calculateRemainingDays = (startDate, daysValid) => {
    const subscriptionStart = moment(startDate, "YYYY-MM-DD");
    const subscriptionEnd = subscriptionStart.add(daysValid, "days");
    const diffDays = subscriptionEnd.diff(moment(), "days");
    return diffDays;
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: "30%",
          backgroundColor: "#F2C94C",
          padding: 20,
        }}
      >
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {!userData && !loading && (
          <View style={{ width: "80%", alignItems: "center" }}>
            {/* <View > */}

            <Image
              source={require("../../assets/icon.png")}
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
            {/* </View> */}

            <Text style={{ fontSize: 22, fontWeight: "600" }}>Gyme ID</Text>
            <TextInput
              style={{
                borderColor: "#fff",
                borderWidth: 1,
                padding: 10,
                marginVertical: 10,
                width: "100%",
                backgroundColor: "#fff",
                textAlign: "center",
                borderRadius: 10,
                fontSize: 20,
              }}
              placeholder="Enter Gym ID"
              keyboardType="number-pad"
              value={gymId}
              onChangeText={setGymId}
            />

            <TouchableOpacity
              style={{
                backgroundColor: "#000",
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 10,
                marginTop: 20,
                alignItems: "center",
              }}
              onPress={fetchGymUser}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {userData && !loading && (
          <View
            style={{
              width: "100%",
              padding: 20,
              borderRadius: 15,
              borderWidth: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 10,
              marginTop: 50,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
                color: "#000",
                textAlign: "center",
              }}
            >
              User Details
            </Text>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, marginBottom: 5, color: "#000" }}>
                ID:{" "}
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  {userData.gymid}
                </Text>
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 5, color: "#000" }}>
                Name:{" "}
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  {userData.name}
                </Text>
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 5, color: "#000" }}>
                Number:{" "}
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  {userData.number.toString()}
                </Text>
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 5, color: "#000" }}>
                Sex:{" "}
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  {userData.gender}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 5,
                  color: "#000",
                  fontWeight: "500",
                }}
              >
                Subscription End Date:
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  {moment(userData.subscriptionEndDate).format("DD-MM-YYY")}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 5,
                  color: "#000",
                  fontWeight: "500",
                }}
              >
                Subscription start Date:{" "}
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  {moment(userData.subscriptionStartDate).format("DD-MM-YYY")}
                </Text>
              </Text>
            </View>

            {subscriptionExpired ? (
              <>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: "#000",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Membership is over. Please renew your membership.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#444",
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                  onPress={() => {
                    // Handle upgrade subscription logic here
                    setModalVisible(true);
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Upgrade subscription
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {todayMarked ? (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        marginBottom: 10,
                        color: "#000",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Attendance Already Marked
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        marginBottom: 10,
                        color: "#000",
                        fontWeight: "bold",
                      }}
                    >
                      Attendance:
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 20,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            attendance === "yes" ? "#444" : "transparent",
                          borderColor: "#555",
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingVertical: 12,
                          paddingHorizontal: 20,
                          width: "45%",
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 5,
                          elevation: 5,
                        }}
                        onPress={() => setAttendance("yes")}
                      >
                        <Text
                          style={{
                            color: attendance === "yes" ? "#fff" : "#ddd",
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            attendance === "no" ? "#444" : "transparent",
                          borderColor: "#555",
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingVertical: 12,
                          paddingHorizontal: 20,
                          width: "45%",
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 5,
                          elevation: 5,
                        }}
                        onPress={() => setAttendance("no")}
                      >
                        <Text
                          style={{
                            color: attendance === "no" ? "#fff" : "#ddd",
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#444",
                        paddingVertical: 14,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                      }}
                      onPress={markAttendance}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Upgrade Subscription for {userData?.name}
              </Text>

              <TextInput
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 20,
                  fontSize: 18,
                  textAlign: "center",
                }}
                placeholder="Enter number of days"
                keyboardType="number-pad"
                value={additionalDays}
                onChangeText={setAdditionalDays}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#27AE60",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                  onPress={upgradeSubscription}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>Upgrade</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#E74C3C",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
