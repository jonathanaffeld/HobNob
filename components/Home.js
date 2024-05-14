import React from "react";
import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HobNobLogo from "../assets/images/HobNobLogo.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Icon from "react-native-vector-icons/EvilIcons"; // Import EvilIcons
import neelroy from "/Users/leonmacalister/HobNob/assets/images/NeelRoy.jpeg";
import upcomingEvents from "/Users/leonmacalister/HobNob/assets/images/Group 3.png";
import barpic from "/Users/leonmacalister/HobNob/assets/images/Bar.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Home = () => {
  console.log("Preview");
  const initials = ["AB", "CD", "EF", "LM", "+34"];
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
          <Icon name="plus" size={35} color="#000" fill="#000" />
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Image source={neelroy} style={styles.profilePic}></Image>
        <Text style={styles.usernameFont}>@neelroy</Text>
      </View>
      <View style={styles.upcomingEventsContainer}>
        <Image source={upcomingEvents} style={styles.upcomingEvents}></Image>
      </View>
      <View style={styles.eventContainer}>
        <View style={styles.event}>
          <View style={styles.parentContainer}>
            <View style={styles.eventTopLeft}>
              <Image source={barpic} style={styles.barpic}></Image>
            </View>
            <View style={styles.eventTopRight}>
              <View style={styles.nestedChild}>
                <Text style={styles.fontBold}>Happy Hour and Pool</Text>
                <Text style={styles.fontNormal}>St. Stephen's Green</Text>
              </View>
              <View style={styles.nestedChild}>
                <Text style={styles.fontSmall}>
                  <Icon name="location" size={10} color="#000" fill="#000" />
                  223 Castro St, Mountain View, CA
                </Text>
                <Text style={styles.fontSmall}>
                  May 18th, 2024; 8:30-10:30 pm
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
            </View>
          </View>
          <View style={styles.parentContainer3}>
            <Text style={styles.fontNormal}>
              Discounted drinks and free pool, all are very welcome to partake
              and mingle!
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.scroller}>
        <Text style={styles.fontNormal}> 1 of 4 </Text>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.bar}>
          <Icon name="sc-telegram" size={40} color="#000" />
          <Icon name="bell" size={40} color="#000" />
          <Icon name="location" size={40} color="#000" />
          <Icon name="user" size={40} color="#000" />
        </View>
      </View>
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
  profileContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "center", // Centers the image vertically
    width: "90%",
    height: "25%",
  },
  upcomingEventsContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "flex-end", // Centers the image vertically
    width: "90%",
    height: "8%",
  },
  eventContainer: {
    alignItems: "center", // Centers the image horizontally
    justifyContent: "center", // Centers the image vertically
    width: "90%",
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
    width: "95%",
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
    justifyContent: "center",
    alignItems: "center",
    padding: "1%",
  },
  eventTopLeft: {
    height: "80%",
    width: "30%",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    marginRight: 20, // Adds space between the left and right child
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
    flex: 1, // Each child takes equal part of their parent's height
    justifyContent: "center", // Center content vertically
    alignItems: "flex-start", // Center content horizontally
    marginBottom: 10, // Adds bottom margin to the first nested child
  },
  profilePic: {
    width: "40%", // Specify the width
    height: "65%", // Specify the height
    borderRadius: "100%", // Half the width/height to make the image circular
    borderWidth: 0.5, // Optional, adds a border
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
    fontSize: screenHeight * 0.03,
    fontWeight: "bold",
  },
  fontBold: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.015,
    fontWeight: "bold",
  },
  fontNormal: {
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.015,
    width: "100%",
  },
  fontSmall: {
    justifyContent: "center",
    fontFamily: "Dongle-Bold",
    fontSize: screenHeight * 0.01,
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
