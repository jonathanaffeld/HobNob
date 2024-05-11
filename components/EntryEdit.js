import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const EntryEdit = () => {
    return(
        <View style={styles.container}>
            <Text>Entry Edit</Text>
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

export default EntryEdit;