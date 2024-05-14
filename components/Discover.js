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
import upcomingEvents from "/Users/leonmacalister/HobNob-1/assets/images/Group 3.png";
import barpic from "/Users/leonmacalister/HobNob-1/assets/images/Bar.png";
import BottomBar from "/Users/leonmacalister/HobNob-1/components/BottomBar.js"; // Import the BottomBar component
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const Discover = () => {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        let { data, error } = await supabase
          .from("events")
          .select("*")
          // .near('location_column', userLocation) // You might add filtering logic based on location here
          .order("date", { ascending: true });

        if (error) {
          throw error;
        }
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching events data:", error.message);
      }
    };

    fetchEventsData();
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
      <View style={styles.container}>
        <Text style={styles.text}>
          {" "}
          Events Near You
          <Icon name="location" size={30} color="black" fill="true" />
        </Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentStyle}
      >
        {eventsData.map((event, index) => (
          <LinearGradient
            key={index}
            colors={["blue", "red"]}
            style={styles.event}
          >
            <View style={styles.parentContainer}>
              <Text style={styles.fontBold}>
                {/*{event.title || "Default Event Title"}*/}
              </Text>
              <View style={styles.info}>
                <View style={styles.eventTopLeft}>
                  {/*<Image
                    source={event.image ? { uri: event.image } : barpic}
                    style={styles.barpic}
                  />*/}
                </View>
                <View style={styles.eventTopRight}>
                  <Text style={styles.fontNormal}>
                    {/*<Icon name="location" size={15} color="black" />
                    {event.location || "Default Location"}*/}
                  </Text>
                  <Text style={styles.fontSmall}>
                    {/*{event.date || "Default Date"}*/}
                  </Text>
                </View>
              </View>
              <Text style={styles.fontNormal1}>
                {/*{event.description || "Default Description"}*/}
              </Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
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
  container: {
    height: "6%",
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    padding: 10, // Optional padding to increase the container size
  },
  text: {
    fontSize: 24, // Large text size
    fontFamily: "Dongle-Bold", // Custom font
    color: "Black", // Dark grey text color
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
    width: "100%",
    height: "100%",
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
    borderwidth: 1,
    borderBottomColor: "blue",
  },
  parentContainer: {
    flexDirection: "column",
    width: "100%", // Align children horizontally
    height: "60%",
    justifyContent: "center",
    alignItems: "flex-start", // Centers children vertically in the container
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
  scrollView: {
    flex: 1, // Take up all available space
    width: "80%",
  },
  scrollViewContentStyle: {
    alignItems: "center", // Center children horizontally
    justifyContent: "flex-start", // Align items from the start vertically
    padding: 0, // Optional padding for better spacing
    height: "60%",
    borderWidth: 1,
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
    paddingVertical: "5%",
    justifyContent: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  nestedChild1: {
    height: "50%",
    width: "100%",
    paddingTop: "3%",
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
    fontSize: screenHeight * 0.025,
    fontWeight: "bold",
  },
  fontNormal: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.019,
  },
  fontNormal1: {
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.016,
    color: "black",
  },
  fontAlert: {
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.016,
    color: "brown",
  },
  fontSmall: {
    justifyContent: "center",
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.018,
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

export default Discover;
