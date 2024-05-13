import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const EntryCreate = () => {
    console.log("EntryCreate");
    return(
        <View style={styles.container}>
            <Text>Entry Create</Text>
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

export default EntryCreate;