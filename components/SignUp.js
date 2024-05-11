import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const SignUp = () => {
    console.log("SignUp");
    return(
        <View style={styles.container}>
            <Text>Sign Up</Text>
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

export default SignUp;