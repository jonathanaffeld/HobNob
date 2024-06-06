// Discover.js
import React, { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import BottomBar from "./BottomBar";
import EventCard from "./EventCard";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Discover = ({ navigation }) => {
  const [user_id, setUserID] = useState("");
  const [mounting, setMounting] = useState(false);
  const [events, setEvents] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setMounting(true);
        try {
          const auth_response = await supabase.auth.getUser();
          if (auth_response.error) throw auth_response.error;

          const id = auth_response.data.user.id;
          setUserID(id);
        } catch (auth_error) {
          console.log(auth_error);
        } finally {
          setMounting(false);
        }
      }
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (user_id) {
      fetchEvents();
    }
  }, [user_id]);

  const fetchEvents = async () => {
    setMounting(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .not("participants", "cs", [user_id])
        .not("owner", "eq", user_id)
        .gt("end_time", now)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setMounting(false);
    }
  };

  const [fontsLoaded] = useFonts({
    "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
    "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
    "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <LinearGradient colors={["#A8D0F5", "#D0B4F4"]} style={styles.container}>
        <ActivityIndicator size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#A8D0F5", "#D0B4F4"]} style={styles.container}>
      <Text style={styles.title}>DISCOVER EVENTS</Text>
      {mounting ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.eventsList}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCardContainer}>
              <EventCard event={event} navigation={navigation} />
            </View>
          ))}
        </ScrollView>
      )}
      <BottomBar navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: screenHeight * 0.1,
    width: screenWidth,
    height: screenHeight,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  eventsList: {
    alignItems: "center",
    paddingVertical: 10,
  },
  eventCardContainer: {
    width: screenWidth * 0.9,
    alignItems: "center",
    marginBottom: 10,
  },
});

export default Discover;
