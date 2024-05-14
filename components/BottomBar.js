import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const BottomBar = () => {
    console.log("BottomBar");
    return (
        <View style={styles.container}>
            <Text>Bottom Bar</Text>
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

export default BottomBar;