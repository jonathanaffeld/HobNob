import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EventEdit = () => {
  return (
    <View style={styles.container}>
      <Text>Your events and Edit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EventEdit;
