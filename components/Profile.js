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
import neelroy from "/Users/leonmacalister/HobNob-1/assets/images/NeelRoy.jpeg";
import BottomBar from "/Users/leonmacalister/HobNob-1/components/BottomBar.js"; // Import the BottomBar component
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const Discover = () => {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let { data, error } = await supabase
          .from("profiles") // Assuming your table name is 'profiles'
          .select("username, name, profile_picture, location") // Selecting specific fields
          .eq("id", 1) // Replace '1' with the profile ID you want to query
          .single();

        if (error) {
          throw error;
        }
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchProfileData();
  }, []);
  const items = [
    {
      prompt: "What do you like to do in your free time?",
      answer: "Collecting invisible stamps.",
    },
    {
      prompt: "What's your favorite hobby?",
      answer: "Training my pet rock to do tricks.",
    },
    {
      prompt: "What is your dream job?",
      answer: "Professional sleeper.",
    },
    {
      prompt: "What do you usually have for breakfast?",
      answer: "Unicorn pancakes with a side of dragon fruit.",
    },
    {
      prompt: "What's your hidden talent?",
      answer: "Communicating with garden gnomes.",
    },
    {
      prompt: "What's your favorite book?",
      answer: "The Invisible Book of Transparent Stories.",
    },
    {
      prompt: "What's your favorite movie?",
      answer: "The Adventures of the Couch Potato and the Lost Remote.",
    },
    {
      prompt: "If you could have any superpower, what would it be?",
      answer: "The ability to speak fluent dolphin.",
    },
    {
      prompt: "What's your go-to karaoke song?",
      answer: "The Sound of Silence, but only the silent parts.",
    },
    {
      prompt: "What’s the weirdest food you’ve ever eaten?",
      answer: "Spaghetti made from moon dust.",
    },

    // Add more items as needed
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
      </View>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.4)"]} // white to orange gradient
        style={styles.card}
      >
        <View style={styles.profileSection}>
          <Image
            source={neelroy} // replace with your image source
            style={styles.profilePic}
          />
          <View style={styles.info}>
            <Text style={styles.infotext1}>Neel Roy</Text>
            <Text style={styles.infotext}>Age: 29</Text>
            <Text style={styles.infotext}>Location: New York</Text>
            <Text style={styles.infotext}>Occupation: Developer</Text>
          </View>
        </View>
        {/* Additional content can go here */}
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.card1}>
              <Text style={styles.prompt}>{item.prompt}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

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
  profileSection: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center", // Center items vertically in the row
    marginBottom: "2%",
  },
  scrollView: {
    alignItems: "center",
  },

  card1: {
    width: "98%",
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 3, // For iOS shadow
  },
  prompt: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: "#555",
  },
  topContainer: {
    width: "90%",
    height: "6%",
    marginTop: "15%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  card: {
    width: "90%",
    height: screenHeight * 0.7, // 70% of the screen height
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start", // Align children to the start of the flex-direction
    justifyContent: "flex-start",
    flexDirection: "column",
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
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular image
    marginRight: 20,
  },
  info: {
    flex: 1, // Take up remaining space
  },
  infotext: {
    fontSize: 16,
    font: "Dongle",
    color: "#333",
  },
  infotext1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
