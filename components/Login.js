import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import HobNobLogo from "../assets/images/HobNobLogo.png"

const Login = ({ navigation }) => {
    console.log("Login");
    return(
        <View style={styles.container}>
            <Text style={styles.loginText}>Login</Text>
            <Image style={styles.logo} source={HobNobLogo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#A8D0F5"
    },
    loginText: {
        color: "black",
        fontFamily: "Dongle-Regular",
        fontSize: 30,
    },
    logo: {
        width: 100,
        height: 100,
    }
});

export default Login;