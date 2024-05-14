import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const EventPreview = () => {
    return(
        <View style={styles.container}>
            <Text>Event Preview</Text>
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

export default EventPreview;