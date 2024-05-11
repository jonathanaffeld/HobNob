import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const Account = () => {
    console.log("Account");
    return(
        <View style={styles.container}>
            <Text>Account</Text>
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

export default Account;