import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const Prompts = () => {
    return(
        <View style={styles.container}>
            <Text>Home</Text>
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

export default Prompts;