import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { React, useState, useEffect } from "react"; // Correct import for useState and useEffect
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/EvilIcons"; // Import EvilIcons
import upcomingEvents from "../assets/images/Group 3.png";
import barpic from "../assets/images/Bar.png";
import BottomBar from "../components/BottomBar.js"; // Import the BottomBar component
import { supabase } from "../supabase.js";
const screenHeight = Dimensions.get("window").height;
const initials = ["AB", "CD", "EF", "LM", "+34"];

const Home = ({ route, navigation }) => {
  const [eventData, setEventData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const profile_id =
        route.params?.user_id || "50664c52-d080-45e2-aefd-3f74af4cf6de";
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", profile_id) // Ensure that 'user_id' is the correct column name for user ID
          .single();

        if (error) {
          throw error;
        }
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        let event_id = null;
        if (route.params?.user_id) {
          // Fetch event IDs associated with the user_id
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("event_id")
            .eq("user_id", route.params.user_id);

          if (userError) {
            console.error("Error fetching user data:", userError.message);
          } else if (userData?.length) {
            // Use the first event ID in the list
            event_id = userData[0].event_id;
          }
        }

        if (!event_id) {
          // Use default event ID if no event ID is found
          event_id = "9fbcc4b9-dc0d-45bc-a0f4-8fd44c2a8583";
        }

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("event_id", event_id)
          .single();

        console.log("Fetched data:", data);

        if (error) {
          throw error;
        }

        setEventData(data);
      } catch (error) {
        console.error("Error fetching event data:", error.message);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEventData();
  }, [route.params?.user_id]);

  const handleEventPreview = () => {
    navigation.navigate("Event");
  };
  const handleProfile = () => {
    navigation.navigate("Profile");
  };
  const handleEventCreate = () => {
    navigation.navigate("EventCreate");
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

  return (
    <LinearGradient
      colors={["#A8D0F5", "#D0B4F4"]}
      style={styles.loginContainer}
    >
      <View style={styles.topContainer}>
        <View style={styles.leftGroup}>
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
        </View>
        <View style={styles.spacer}></View>
        <View style={styles.rightChild}>
          <Pressable onPress={handleEventCreate}>
            <Icon name="plus" size={35} color="#000" fill="#000" />
          </Pressable>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Pressable onPress={handleProfile} style={styles.profilebutton}>
          {loadingProfile ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Image
              source={{ uri: profileData?.image_url }}
              style={styles.profilePic}
            />
          )}
          <Text style={styles.usernameFont}>
            {profileData ? (
              <Text style={styles.text}>
                {profileData.first_name} {profileData.last_name}
              </Text>
            ) : (
              <Text style={styles.text}>Loading...</Text>
            )}
          </Text>
        </Pressable>
      </View>
      <View style={styles.upcomingEventsContainer}>
        <Image source={upcomingEvents}></Image>
      </View>
      <View style={styles.eventContainer}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={{ height: "100%" }}
        >
          <Pressable onPress={handleEventPreview}>
            <LinearGradient
              colors={["#FFFFFF", "#A9DFBF"]}
              style={styles.event}
            >
              <View style={styles.parentContainer}>
                <View style={styles.eventTopLeft}>
                  <View style={styles.eventTopLeft}>
                    {eventData?.image_url && (
                      <Image
                        source={{ uri: eventData.image_url }}
                        style={{ width: 85, height: 100 }}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.eventTopRight}>
                  <View style={styles.nestedChild}>
                    <Text style={styles.fontBold}>
                      {eventData ? (
                        <Text style={styles.text}>{eventData.title}</Text>
                      ) : (
                        <Text style={styles.text}>Loading...</Text>
                      )}
                    </Text>
                    <Text style={styles.fontNormal}>
                      <Icon
                        name="location"
                        size={15}
                        color="black"
                        fill="true"
                      />
                      {eventData ? (
                        <Text style={styles.text}>{eventData.location}</Text>
                      ) : (
                        <Text style={styles.text}>Loading...</Text>
                      )}
                    </Text>
                  </View>
                  <View style={styles.nestedChild1}>
                    <Text style={styles.fontSmall}>
                      {eventData ? (
                        <Text style={styles.text}>{eventData.start_time}</Text>
                      ) : (
                        <Text style={styles.text}>Loading...</Text>
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.parentContainer2}>
                <Text style={styles.label}>Going:</Text>
                <View style={styles.circleContainer}>
                  {initials.map((initial, index) => (
                    <View key={index} style={styles.circle}>
                      <Text style={styles.initials}>{initial}</Text>
                    </View>
                  ))}
                  {/* {eventData && eventData.attendeesInitial && 
      eventData.attendeesInitial.slice(0, 4).map((initial, index) => (
        <View key={index} style={styles.circle}>
          <Text style={styles.initials}>{initial}</Text>
        </View>
      ))
    } */}
                </View>
              </View>
              <View style={styles.parentContainer3}>
                <Text style={styles.fontNormal}>
                  {eventData ? (
                    <Text style={styles.text}>{eventData.description}</Text>
                  ) : (
                    <Text style={styles.text}>Loading...</Text>
                  )}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
          {/* Event 2 */}
          <LinearGradient
            colors={["#FFFFFF", "#D4AF37"]}
            style={styles.event}
          ></LinearGradient>
          {/* Event 3 */}
          <LinearGradient
            colors={["#FFFFFF", "#E5E4E2"]}
            style={styles.event}
          ></LinearGradient>
          {/* Event 4 */}
          <LinearGradient
            colors={["#FFFFFF", "#A9DFBF"]}
            style={styles.event}
          ></LinearGradient>
        </ScrollView>
      </View>
      <View style={styles.scroller}>
        <Text style={styles.fontNormal1}> You have 4 logged events! </Text>
      </View>
      <BottomBar />
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
  profilebutton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "center", // Centers the image vertically
    width: "90%",
    height: "25%",
  },
  upcomingEventsContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "flex-end", // Centers the image vertically
    width: "80%",
    height: "6.5%",
    marginBottom: "2%",
  },
  eventContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "center", // Centers the image vertically
    width: "100%",
    height: "35%",
    marginBottom: "1%",
  },
  event: {
    backgroundColor: "#fff", // White background
    padding: "5%", // Padding around the content inside the container
    borderRadius: "30%", // Rounded edges
    alignItems: "center", // Aligns children to the center horizontally
    justifyContent: "top", // Aligns children to the center vertically
    flexDirection: "column", // Arranges children in a column
    shadowColor: "#000", // Shadow color
    width: "85%",
    height: "90%",
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
  },
  parentContainer: {
    flexDirection: "row",
    width: "100%", // Align children horizontally
    height: "55%",
    padding: "2%",
    justifyContent: "space-between",
    alignItems: "center", // Centers children vertically in the container
  },
  parentContainer2: {
    flexDirection: "row",
    width: "100%", // Align children horizontally
    height: "18%",
    padding: "0%",
    // justifyContent: "space-between",
    alignItems: "center", // Centers children vertically in the container
  },
  circleContainer: {
    flexDirection: "row", // Aligns circles horizontally
    height: "100%",
  },
  circle: {
    width: "15.5%", // Diameter of the circle
    height: "97%", // Diameter of the circle
    borderRadius: "20%", // Half of width/height to make perfect circle
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5, // Adds spacing between circles
  },
  initials: {
    color: "#333",
    fontSize: "8%",
  },
  label: {
    fontWeight: "bold",
    marginHorizontal: "1%", // Adds spacing between the label and the circles
  },
  parentContainer3: {
    flexDirection: "row",
    width: "100%", // Align children horizontally
    height: "30%",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "2%",
  },
  eventTopLeft: {
    height: "80%",
    width: "30%",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    marginRight: 20, // Adds space between the left and right child
    marginLeft: 5,
  },
  barpic: {
    resizeMode: "contain",
    width: "120%",
  },
  eventTopRight: {
    height: "85%",
    width: "63%",
    padding: "1%",
    flexDirection: "column", // Aligns its children vertically
    justifyContent: "flex-start", // Center content vertically
    alignItems: "flex-start",
  },
  nestedChild: {
    height: "55%",
    width: "100%",
    justifyContent: "space-evenly", // Center content vertically
  },
  nestedChild1: {
    height: "45%",
    width: "100%",
    justifyContent: "space-evenly", // Center content vertically
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
    height: "100%", // Specify the height
    resizeMode: "contain",
    borderWidth: 1,
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
    margin: "0%",
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
    fontSize: screenHeight * 0.035,
    fontWeight: "bold",
  },
  fontBold: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.016,
    fontWeight: "bold",
    marginBottom: "4%",
  },
  fontNormal: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.014,
  },
  fontNormal1: {
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.014,
    color: "black",
  },
  fontSmall: {
    justifyContent: "center",
    fontFamily: "Dongle",
    fontSize: screenHeight * 0.015,
  },
  usernameFont: {
    marginTop: "1.5%",
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

export default Home;
