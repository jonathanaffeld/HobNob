import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const EventCreate = () => {
    return(
        <View style={styles.container}>
            <Text>Event Create</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default EventCreate;