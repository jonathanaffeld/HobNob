import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dropdown } from "react-native-element-dropdown";
import { useFonts } from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Prompts = ({ route, navigation }) => {
  const user_id = route.params.user_id;
  const [prompt1, setPrompt1] = useState("");
  const [response1, setResponse1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [response2, setResponse2] = useState("");
  const [finished_sign_up, setFinishedSignUp] = useState(false);
  const [mounting, setMounting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setMounting(true);
      const { data, error } = await supabase
        .from("users")
        .select("prompt1, response1, prompt2, response2, finished_sign_up")
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
        return;
      }

      const result = data[0];
      const p1 = result.prompt1;
      const r1 = result.response1;
      const p2 = result.prompt2;
      const r2 = result.response2;
      const fsu = result.finished_sign_up;

      if (p1) {
        setPrompt1(p1);
      }
      if (r1) {
        setResponse1(r1);
      }
      if (p2) {
        setPrompt2(p2);
      }
      if (r2) {
        setResponse2(r2);
      }
      setFinishedSignUp(fsu);
      setMounting(false);
    }
    fetchData();
  }, [user_id]);

  const handleBack = async () => {
    if (finished_sign_up) {
      navigation.navigate("Account", { user_id: user_id });
    } else {
      navigation.navigate("Photo", { user_id: user_id });
    }
  };

  const handleClick = async () => {
    if (!prompt1 || !prompt2) {
      Alert.alert("Uhoh", "Please select two prompts!");
      return;
    }
    if (!response1 || !response2) {
      Alert.alert("Uhoh", "Please write two responses!");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        prompt1: prompt1,
        response1: response1,
        prompt2: prompt2,
        response2: response2,
        finished_sign_up: true,
      })
      .eq("user_id", user_id);

    setLoading(false);

    if (error) {
      Alert.alert("Uhoh", error.message);
      return;
    }

    if (finished_sign_up) {
      Alert.alert("Updated Successfully");
      navigation.navigate("Account", { user_id: user_id });
    } else {
      navigation.navigate("Home", { user_id: user_id });
    }
  };

  const [fontsLoaded] = useFonts({
    "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
    "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
    "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
  });

  if (!fontsLoaded || mounting) {
    return (
      <LinearGradient
        colors={["#A8D0F5", "#D0B4F4"]}
        style={styles.namesContainer}
      >
        <ActivityIndicator size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#A8D0F5", "#D0B4F4"]}
      style={styles.namesContainer}
    >
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons
          name="caret-back-circle"
          size={screenWidth * 0.1}
          color="#77678C"
        />
      </Pressable>
      <Text style={styles.titleText}>Tell us about yourself!</Text>
      <View style={styles.lowerContainer}>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <Pressable style={styles.button} onPress={handleClick}>
            <Text style={styles.buttonText}>
              {finished_sign_up ? "Save" : "Continue"}
            </Text>
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  namesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 75,
    left: 25,
  },
  titleText: {
    fontFamily: "Dongle-Regular",
    fontSize: screenHeight * 0.06,
  },
  input: {
    width: screenWidth * 0.75,
    height: screenHeight * 0.06,
    backgroundColor: "#FFFFFF",
    opacity: 0.75,
    margin: screenWidth * 0.025,
    paddingLeft: screenWidth * 0.05,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    fontFamily: "Dongle-Regular",
    fontSize: screenHeight * 0.05,
    resizeMode: "contain",
  },
  lowerContainer: {
    width: screenWidth * 0.3,
    height: screenHeight * 0.05,
    alignItems: "center",
    justifyContent: "center",
    marginTop: screenHeight * 0.025,
  },
  button: {
    width: screenWidth * 0.3,
    height: screenHeight * 0.05,
    backgroundColor: "#77678C",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Dongle-Light",
    fontSize: screenHeight * 0.04,
  },
  loading: {
    size: "large",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Prompts;
