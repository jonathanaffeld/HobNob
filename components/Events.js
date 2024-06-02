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
import EventCard from "./EventCard"; // Assuming EventCard is the component to render each event
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Events = ({ navigation }) => {
  const [user_id, setUserID] = useState("");
  const [mounting, setMounting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
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
  }, [user_id, selectedTab]);

  const fetchEvents = async () => {
    setMounting(true);
    try {
      let query = supabase
        .from("events") // Assuming 'events' is the table name
        .select("*");

      const now = new Date().toISOString();

      if (selectedTab === "upcoming") {
        query = query.contains("participants", [user_id]).gt("end_time", now);
      } else if (selectedTab === "my") {
        query = query.eq("owner", user_id).gt("end_time", now);
      } else if (selectedTab === "past") {
        query = query
          .or(`participants.cs.{${user_id}},owner.eq.${user_id}`)
          .lt("end_time", now);
      }
      const { data, error } = await query;
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
      <LinearGradient
        colors={["#A8D0F5", "#D0B4F4"]}
        style={styles.eventsContainer}
      >
        <ActivityIndicator size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#A8D0F5", "#D0B4F4"]} style={styles.BigContainer}>
      <Text style={styles.title}>EVENT CALENDAR</Text>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab("upcoming")}
          style={[
            styles.tabBox,
            selectedTab === "upcoming" && styles.activeTabBox,
          ]}
        >
          <Text
            style={
              selectedTab === "upcoming" ? styles.activeTab : styles.inactiveTab
            }
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("my")}
          style={[styles.tabBox, selectedTab === "my" && styles.activeTabBox]}
        >
          <Text
            style={selectedTab === "my" ? styles.activeTab : styles.inactiveTab}
          >
            My Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("past")}
          style={[styles.tabBox, selectedTab === "past" && styles.activeTabBox]}
        >
          <Text
            style={
              selectedTab === "past" ? styles.activeTab : styles.inactiveTab
            }
          >
            History{" "}
          </Text>
        </TouchableOpacity>
      </View>
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
  eventsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  BigContainer: {
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
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.9,
    marginBottom: 20,
  },
  tabBox: {
    backgroundColor: "#fff",
    opacity: 0.7,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.3, // Adds shadow for iOS
    shadowRadius: 3, // Adds shadow for iOS
    marginHorizontal: 5,
  },
  activeTabBox: {
    backgroundColor: "#ddd",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
  inactiveTab: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
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

export default Events;
