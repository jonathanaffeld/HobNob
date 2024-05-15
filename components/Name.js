import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import { supabase } from '../supabase'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Name = ({ route, navigation }) => {
    const user_id = route.params.user_id;
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [finished_sign_up, setFinishedSignUp] = useState(false);
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setMounting(true);
            const { data, error } = await supabase
            .from('users')
            .select('first_name, last_name, finished_sign_up')
            .eq('user_id', user_id);
            
            if (error) {
                console.log(error);
                return;
            }

            const result = data[0];
            const fname = result.first_name;
            const lname = result.last_name;
            const fsu = result.finished_sign_up;
            
            if (fname) {
                setFirstName(fname);
            }
            if (lname) {
                setLastName(lname);
            }
            setFinishedSignUp(fsu);
            setMounting(false);
        }
        fetchData();
    }, [user_id]);

    const handleClick = async () => {
        if (!first_name) {
            Alert.alert("Uhoh", "Please enter a first name!");
            return;
        }

        setLoading(true);
        
        const { error } = await supabase
        .from('users')
        .update({ first_name: first_name, last_name: last_name })
        .eq('user_id', user_id);
        
        setLoading(false);

        if (error) {
            Alert.alert("Uhoh", error.message);
            return;
        }

        if (finished_sign_up) {
            Alert.alert("Updated Successfully");
            navigation.navigate("Account", { user_id: user_id });
        }
        else {
            navigation.navigate("Photo", { user_id: user_id })
        }
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
            {
                loading ? 
                <ActivityIndicator style={styles.loading} /> :
                <Pressable style={styles.button} onPress={handleClick}>
                    <Text style={styles.buttonText}>{finished_sign_up ? "Save" : "Continue"}</Text>
                </Pressable>
            }
        </LinearGradient>
      )
}

const styles = StyleSheet.create({
    namesContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
    button: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    buttonText: {
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