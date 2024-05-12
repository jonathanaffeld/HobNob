import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View, Image, Pressable, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import HobNobLogo from "../assets/images/HobNobLogo.png"
import LoginText from "../assets/images/LoginText.png"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Login = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submit = () => {
        if (username == '' || password == '') {
            Alert.alert(
                "Error",
                "Incorrect Username or Password",
                [
                    {
                        text: "Back",
                        style: "cancel",
                    },
                ]
            );
        }
        else {
            navigation.navigate("Home", {
                username: username
            })
        }
    }

    const signup = () => {
        navigation.navigate("SignUp")
    }

    return(
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.loginContainer}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={HobNobLogo} />
                <View style={styles.logoTextContainer}>
                    <Text style={styles.logoLetter}>H</Text>
                    <Text style={styles.logoSpace}> </Text>
                    <Text style={styles.logoLetter}>o</Text>
                    <Text style={styles.logoSpace}> </Text>
                    <Text style={styles.logoLetter}>b</Text>
                    <Text style={styles.logoSpace}> </Text>
                    <Text style={styles.logoLetter}>N</Text>
                    <Text style={styles.logoSpace}> </Text>
                    <Text style={styles.logoLetter}>o</Text>
                    <Text style={styles.logoSpace}> </Text>
                    <Text style={styles.logoLetter}>b</Text>
                    <Text style={styles.logoSpace}> </Text>
                    <Text style={styles.logoLetter}>.</Text>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Image style={styles.loginText} source={LoginText} />
                <TextInput style={styles.input} onChangeText={setUsername} value={username} placeholder='Username' />
                <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder='Password' />
                <Pressable style={styles.loginButton} onPress={submit}>
                    <Text style={styles.submit}>Submit</Text>
                </Pressable>
                <Pressable style={styles.signupContainer} onPress={signup}>
                    <Text style={styles.signupText}>New? Create your HobNob account here.</Text>
                </Pressable>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 3,
        alignItems: "center",
        backgroundColor: "#A8D0F5"
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    logoTextContainer: {
        flexDirection: "row"
    },
    logo: {
        width: screenWidth * 0.5,
        resizeMode: "contain",
        marginTop: screenHeight * 0.05
    },
    logoLetter: {
        fontSize: screenHeight * 0.028,
        fontWeight: "bold"
    },
    logoSpace: {
        fontSize: screenHeight * 0.007,
    },
    textContainer: {
        flex: 2,
        alignItems: "center",
    },
    loginText: {
        width: screenWidth * 0.3,
        resizeMode: "contain",
        marginTop: screenHeight * 0.025,
        marginBottom: screenHeight * 0.05
    },
    input: {
        width: screenWidth * 0.75,
        height: screenHeight * 0.06,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        margin: screenWidth * 0.05,
        paddingLeft: screenWidth * 0.05,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        fontSize: screenHeight * 0.032,
        fontWeight: "light"
    },
    loginButton: {
        width: screenWidth * 0.3,
        height: screenWidth * 0.08,
        fontWeight: "light",
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    submit: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
    },
    signupContainer: {
        marginTop: screenHeight * 0.05,
    }
});

export default Login;