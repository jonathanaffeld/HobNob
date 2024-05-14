import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import {supabase} from '../supabase';
import HobNobLogo from "../assets/images/HobNobLogo.png"
import LoginText from "../assets/images/LoginText.png"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert("Uhoh", "Email cannot be empty!")
            return;
        }
        if (!password) {
            Alert.alert("Uhoh", "Password cannot be empty!")
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        setLoading(false);
        
        if (error) {
            Alert.alert("Uhoh", error.message);
            return;
        }

        if (data.user.user_metadata.finishedSignUp) {
            navigation.navigate("Home");
        }
        else {
            navigation.navigate("Name");
        }
    }

    const handleSignup = () => {
        navigation.navigate("SignUp")
    }

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />;
    }

    return(
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.loginContainer}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={HobNobLogo} />
                <Text style={styles.logoText}>HobNob.</Text>
            </View>
            <View style={styles.textContainer}>
                <Image style={styles.loginText} source={LoginText} />
                <TextInput 
                    style={styles.input} 
                    onChangeText={setEmail} 
                    value={email} 
                    placeholder='Email'
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <TextInput 
                    style={styles.input} 
                    onChangeText={setPassword} 
                    value={password} 
                    placeholder='Password' 
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                />
                {loading ? 
                <ActivityIndicator /> :
                <Pressable style={styles.loginButton} onPress={handleSubmit}>
                    <Text style={styles.submit}>Submit</Text>
                </Pressable>
                }
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>New? Create your HobNob account </Text>
                    <Pressable onPress={handleSignup}>
                        <Text style={styles.signupLink}>here</Text>
                    </Pressable>
                    <Text style={styles.signupText}>.</Text>
                </View>
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
    logo: {
        width: screenWidth * 0.5,
        resizeMode: "contain",
        marginTop: screenHeight * 0.1
    },
    logoText: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.05,
    },
    textContainer: {
        flex: 2,
        alignItems: "center",
    },
    loginText: {
        height: screenHeight * 0.125,
        resizeMode: "contain",
    },
    input: {
        width: screenWidth * 0.75,
        height: screenHeight * 0.06,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        margin: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.05,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.05,
        resizeMode: "contain",
    },
    loginButton: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    submit: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.04
    },
    signupContainer: {
        marginTop: screenHeight * 0.05,
        flexDirection: "row"
    },
    signupText: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.03,
    },
    signupLink: {
        color: "#e74c3c",
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.03,
    }
});

export default Login;