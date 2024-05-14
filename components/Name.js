import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import { supabase } from '../supabase'
import HobNobLogo from "../assets/images/HobNobLogo.png"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Name = ({ navigation }) => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchNames() {
            setMounting(true);
            const { data: { user } } = await supabase.auth.getUser()
            setMounting(false);

            if (user.user_metadata.first_name) {
                setFirstName(user.user_metadata.first_name);
            }
            if (user.user_metadata.last_name) {
                setLastName(user.user_metadata.last_name);
            }
        }
        fetchNames();
    }, [setFirstName, setLastName]);

    const handleContinue = async () => {
        if (!first_name) {
            Alert.alert("Uhoh", "Please enter a first name!")
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.updateUser({
            data: { 
                first_name: first_name,
                last_name: last_name
            }
          })
        setLoading(false);

        if (error) {
            Alert.alert("Uhoh", error.message);
            return;
        }

        navigation.navigate("Photo")
    }

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.namesContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.namesContainer}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={HobNobLogo} />
                <Text style={styles.logoText}>HobNob.</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>What's your name?</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setFirstName} 
                    value={first_name} 
                    placeholder='First Name (Required)'
                    autoCapitalize='words'
                    autoCorrect={false}
                />
                <TextInput 
                    style={styles.input} 
                    onChangeText={setLastName} 
                    value={last_name} 
                    placeholder='Last Name'
                    autoCapitalize='words'
                    autoCorrect={false}
                />
                {loading ? 
                <ActivityIndicator style={styles.loading} /> :
                <Pressable style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continue}>Continue</Text>
                </Pressable>
                }
            </View>
        </LinearGradient>
      )
}

const styles = StyleSheet.create({
    namesContainer: {
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
    titleText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.06
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
    continueButton: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    continue: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.04
    },
    loading: {
        size: "large",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Name;