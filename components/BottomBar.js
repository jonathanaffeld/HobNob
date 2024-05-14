import React from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;

const BottomBar = () => {
  const navigation = useNavigation();

  const handleDiscover = () => {
    navigation.navigate("Discover");
  };
  const handlePrompts = () => {
    navigation.navigate("Prompts");
  };
  const handleProfile = () => {
    navigation.navigate("Profile");
  };
  const handleEventEdit = () => {
    navigation.navigate("EventEdit");
  };

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bar}>
        <Pressable onPress={handleEventEdit}>
          <Icon name="archive" size={40} color="#000" />
        </Pressable>
        <Pressable onPress={handlePrompts}>
          <Icon name="bell" size={40} color="#000" />
        </Pressable>
        <Pressable onPress={handleDiscover}>
          <Icon name="location" size={40} color="#000" />
        </Pressable>
        <Pressable onPress={handleProfile}>
          <Icon name="user" size={40} color="#000" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    width: "100%",
    height: screenHeight * 0.13,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "black",
  },
});

export default BottomBar;
