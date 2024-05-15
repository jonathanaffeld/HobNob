import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { React, useState, useEffect } from "react"; // Correct import for useState and useEffect
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/EvilIcons"; // Import EvilIcons
import upcomingEvents from "../assets/images/Group 3.png";
import barpic from "../assets/images/Bar.png";
import BottomBar from "./BottomBar.js"; // Import the BottomBar component
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const Event = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        let { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", 1) // You should replace '1' with the event ID you want to query
          .single();

        if (error) {
          throw error;
        }
        setEventData(data);
      } catch (error) {
        console.error("Error fetching event data:", error.message);
      }
    };

    fetchEventData();
  }, []);
  const initials = [
    "AB",
    "CD",
    "EF",
    "LM",
    "JR",
    "JA",
    "AM",
    "NJ",
    "ES",
    "LB",
    "MR",
    "MD",
    "AC",
    "+34",
  ];
  const navigation = useNavigation();
  const handleProfile = () => {
    navigation.navigate("Profile");
  };
  const handleDiscover = () => {
    navigation.navigate("Discover");
  };
  const handlePrompts = () => {
    navigation.navigate("Prompts");
  };
  const handleEventEdit = () => {
    navigation.navigate("EventEdit");
  };
  const handleHome = () => {
    navigation.navigate("Home");
  };
  return (
    <LinearGradient
      colors={["#A8D0F5", "#D0B4F4"]}
      style={styles.loginContainer}
    >
      <View style={styles.topContainer}>
        <View style={styles.leftGroup}>
          <Pressable onPress={handleHome}>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoLetter}>H</Text>
              <Text style={styles.logoSpace}> </Text>
              <Text style={styles.logoLetter}>o</Text>
              <Text style={styles.logoSpace}> </Text>
              <Text style={styles.logoLetter}>b</Text>
              <Text style={styles.logoSpace}> </Text>
              <Text style={styles.logoLetter}>N</Text>
              <Text style={styles.logoSpace}> </Text>
              <Text style={styles.logoLetter}>o</Text>
              <Text style={styles.logoSpace}> </Text>
              <Text style={styles.logoLetter}>b</Text>
              <Text style={styles.logoSpace}> </Text>
              <Text style={styles.logoLetter}>.</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.spacer}></View>
      </View>

      <View style={styles.eventContainer}>
        <LinearGradient colors={["#FFFFFF", "#A9DFBF"]} style={styles.event}>
          <ScrollView>
            <View style={styles.parentContainer}>
              <Text style={styles.fontBold}>HAPPY HOUR AND POOL</Text>
              {/* {eventData.title}*/}
              <View style={styles.info}>
                <View style={styles.eventTopLeft}>
                  <Image source={barpic} style={styles.barpic}></Image>
                  {/* {eventData.image}*/}
                </View>
                <View style={styles.eventTopRight}>
                  <View style={styles.nestedChild}>
                    <Text style={styles.fontNormal}>
                      <Icon
                        name="location"
                        size={15}
                        color="black"
                        fill="true"
                      />
                      St. Stephen's Green, Mt. View, California
                    </Text>
                    {/* {eventData.location}*/}
                  </View>
                  <View style={styles.nestedChild1}>
                    <Text style={styles.fontSmall}>
                      May 18th, 8:30-10:30 pm
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.going}>
                <Text style={styles.label}>Attendees:</Text>
              </View>

              <View style={styles.parentContainer2}>
                <View style={styles.circleContainer}>
                  {initials.map((initial, index) => (
                    <View key={index} style={styles.circle}>
                      <Text style={styles.initials}>{initial}</Text>
                    </View>
                  ))}
                  {/* {eventData && eventData.attendeesInitials && 
      eventData.attendeesInitials.slice(0, 13).map((initial, index) => (
        <View key={index} style={styles.circle}>
          <Text style={styles.initials}>{initial}</Text>
        </View>
      ))
    }*/}
                </View>
              </View>
            </View>

            <View style={styles.parentContainer3}>
              <Text style={styles.fontNormal1}>
                Discounted drinks and free pool, all are very welcome to partake
                and mingle! Discounted drinks include Guinness, VB and Great
                Northerns. This event was created by the owner who will be
                fascillitating the event.
              </Text>
              {/* {eventData.description}*/}
            </View>
            <View style={styles.parentContainer4}>
              <Icon name="exclamation" size={45} color="brown" fill="true" />

              <Text style={styles.fontAlert}>
                4 other attendees are also from Boise!
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>

      <BottomBar
        handleEventEdit={handleEventEdit}
        handlePrompts={handlePrompts}
        handleDiscover={handleDiscover}
        handleProfile={handleProfile}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    flex: 3,
    alignItems: "center",
    backgroundColor: "#A8D0F5",
  },
  upcomingEventsContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "flex-end", // Centers the image vertically
    width: "90%",
    height: "6%",
  },
  eventContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "center", // Centers the image vertically
    width: "90%",
    height: "70%",
  },
  info: {
    width: "100%",
    height: "50%",

    flexDirection: "row",
  },
  event: {
    backgroundColor: "#fff", // White background
    padding: "5%", // Padding around the content inside the container
    borderRadius: "30%", // Rounded edges
    alignItems: "center", // Aligns children to the center horizontally
    justifyContent: "top", // Aligns children to the center vertically
    flexDirection: "column", // Arranges children in a column
    shadowColor: "#000", // Shadow color
    width: "95%",
    height: "90%",
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
  },
  parentContainer: {
    flexDirection: "column",
    width: "100%", // Align children horizontally
    height: "60%",
    justifyContent: "flex-start",
    alignItems: "center", // Centers children vertically in the container
  },
  parentContainer2: {
    flexDirection: "row",
    width: "100%", // Align children horizontally
    height: "30%",
    padding: "0%",
    // justifyContent: "space-between",
    alignItems: "flex-s", // Centers children vertically in the container
  },
  circleContainer: {
    flexDirection: "row", // Keeps children inline
    flexWrap: "wrap", // Enable wrapping of circles
    justifyContent: "flex-start", // Aligns children to the start
    alignItems: "flex-start", // Centers items vertically within the container
    width: "100%", // Ensures the container takes full width of its parent
    height: "100%",
    padding: 0, // Adds a little padding around the circles
  },

  circle: {
    width: screenWidth * 0.08, // Adjusted to a percentage of screen width for responsiveness
    height: screenWidth * 0.08, // Keep width and height the same for perfect circles
    borderRadius: (screenWidth * 0.08) / 2, // Half of width/height to make perfect circle
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5, // Adds spacing between circles and ensures they don't touch
    marginVertical: 3,
  },
  initials: {
    color: "#333",
    fontSize: "8%",
  },
  going: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: "10%",
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginHorizontal: "1%", // Adds spacing between the label and the circles
  },
  parentContainer3: {
    flexDirection: "row",
    width: "100%", // Align children horizontally
    height: "22%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "2%",
    marginBottom: "1%",
  },
  parentContainer4: {
    flexDirection: "row",
    padding: "2%",
    width: "100%",
    height: "15%",
    backgroundColor: "#F4F1DE", // A soft beige color that stands out but complements clover green
    borderRadius: "30%", // Rounded edges
    justifyContent: "flex-start", // Center the content inside vertically
    alignItems: "center", // Center the content inside horizontally
    borderColor: "#B22222",
    borderWidth: 0.5,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 2, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
  },
  eventTopLeft: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
  },
  barpic: {
    resizeMode: "contain",
    width: "90%",
  },
  eventTopRight: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
  },
  nestedChild: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  nestedChild1: {
    height: "50%",
    width: "100%",
  },
  profilePic: {
    width: "40%", // Specify the width
    height: "65%", // Specify the height
    borderRadius: "100%", // Half the width/height to make the image circular
    borderWidth: 1.5, // Optional, adds a border
    borderColor: "#000", // Optional, sets the border color
  },
  upcomingEvents: {
    width: "70%", // Specify the width
    height: "70%", // Specify the height
    resizeMode: "contain",
  },
  topContainer: {
    width: "90%",
    height: "6%",
    marginTop: "15%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  leftGroup: {
    flexDirection: "row", // Stack children vertically within the group
    alignItems: "center",
    width: "40%",
  },
  rightChild: {
    flexDirection: "row", // Stack children vertically within the group
    alignItems: "center",
    width: "10%",
    height: "90%",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  spacer: {
    flex: 1, // Takes all available space, pushing the right child to the border
  },
  logoTextContainer: {
    flexDirection: "row",
  },
  logoLetter: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.04,
    fontWeight: "bold",
  },
  fontBold: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.035,
    fontWeight: "bold",
  },
  fontNormal: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.019,
  },
  fontNormal1: {
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.019,
    color: "black",
  },
  fontAlert: {
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.023,
    color: "brown",
  },
  fontSmall: {
    justifyContent: "center",
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.02,
  },
  usernameFont: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.024,
    fontWeight: "bold",
    color: "white",
  },
  logoSpace: {
    fontSize: screenHeight * 0.006,
  },
  bottomBar: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "60%", // 15% of total screen height
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "black",
  },
});

export default Event;
