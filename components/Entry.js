import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const Entry = () => {
    console.log("Entry");
    return(
        <View style={styles.container}>
            <Text>Entry</Text>
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

export default Entry;