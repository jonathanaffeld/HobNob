import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const AccountPreview = () => {
    return(
        <View style={styles.container}>
            <Text>Account Preview</Text>
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

export default AccountPreview;