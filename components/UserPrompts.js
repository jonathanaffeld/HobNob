import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, Pressable, Alert, ActivityIndicator, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFonts } from "expo-font";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../supabase'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Prompts = ({ route, navigation }) => {
    const user_id = route.params.user_id;
    const [prompt1, setPrompt1] = useState(null);
    const [prompt2, setPrompt2] = useState(null);
    const [response1, setResponse1] = useState("");
    const [response2, setResponse2] = useState("");
    const [finished_sign_up, setFinishedSignUp] = useState(false);
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);
    const prompts = [
        "My go-to song for a road trip is...",
        "A thing I cannot live without is...",
        "The last hobby I picked up was...",
        "One place I want to explore is...",
        "A moment in history I wish I could have witnessed is...",
        "A local spot I love visiting is...",
        "An unusual skill I possess is...",
        "An unusual fear I have is...",
        "The best live performance I have ever seen was...",
        "A new skill I want to learn is...",
        "A subject I could talk about for hours is...",
        "A movie/show I can watch over and over is...",
        "An invention that I think is underrated is...",
        "The strangest job I ever had was...",
        "My favorite annual event/holiday is...",
        "A guilty pleasure of mine is...",
        "The most spontaneous thing I have ever done is...",
        "My favorite childhood memory is...",
        "A life-changing event I experienced was...",
        "The weirdest food combination I enjoy is..."
    ];
    
    

    useEffect(() => {
        async function fetchData() {
            setMounting(true);
            const { data, error } = await supabase
            .from('users')
            .select('prompt1, response1, prompt2, response2, finished_sign_up')
            .eq('user_id', user_id);
            
            if (error) {
                console.log(error);
                return;
            }

            const result = data[0];
            const p1 = result.prompt1;
            const r1 = result.response1;
            const p2 = result.prompt2;
            const r2 = result.response2;
            const fsu = result.finished_sign_up;
            
            if (p1) {
                setPrompt1(p1);
            }
            if (r1) {
                setResponse1(r1);
            }
            if (p2) {
                setPrompt2(p2);
            }
            if (r2) {
                setResponse2(r2);
            }
            setFinishedSignUp(fsu);
            setMounting(false);
        }
        fetchData();
    }, [user_id]);

    const handleBack = async () => {
        if (finished_sign_up) {
            navigation.navigate("Account", { user_id: user_id });
        }
        else {
            navigation.navigate("UserPhoto", { user_id: user_id })
        }
    }

    const handlePrompt1Refresh = async () => {
        let prompt = prompts[Math.floor(Math.random() * prompts.length)];
        while (prompt === prompt2 || prompt === prompt1) {
            prompt = prompts[Math.floor(Math.random() * prompts.length)];
        }
        setPrompt1(prompt);
    }

    const handlePrompt2Refresh = async () => {
        let prompt = prompts[Math.floor(Math.random() * prompts.length)];
        while (prompt === prompt2 || prompt === prompt1) {
            prompt = prompts[Math.floor(Math.random() * prompts.length)];
        }
        setPrompt2(prompt);
    }

    const handleResponse1Change = async (inputText) => {
        setResponse1(inputText.substring(0, 250)); 
    }

    const handleResponse2Change = async () => {
        setResponse2(inputText.substring(0, 250)); 
    }

    const handleClick = async () => {
        if (!prompt1 || !prompt2) {
            Alert.alert("Uhoh", "Please select two prompts!");
            return;
        }
        if (!response1 || !response2) {
            Alert.alert("Uhoh", "Please write two responses!");
            return;
        }

        setLoading(true);
        
        const { error } = await supabase
        .from('users')
        .update({ prompt1: prompt1, response1: response1, prompt2: prompt2, response2: response2, finished_sign_up: true })
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
            navigation.navigate("Home", { user_id: user_id })
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
            <Pressable style={styles.backButton} onPress={handleBack}>
                <Ionicons 
                    name='caret-back-circle' 
                    size={screenWidth * 0.1}
                    color='#77678C'
                />
            </Pressable>
            <Text style={styles.titleText}>Tell us about yourself!</Text>
            <View style={styles.promptContainer}>
                <Text style={styles.promptText}>{prompt1 ? prompt1: "Prompt #1"}</Text>
                <Pressable onPress={handlePrompt1Refresh}>
                    <FontAwesome
                        name='refresh'
                        size={screenWidth*0.1}
                        color='#77678C'
                        style={styles.refresh}
                    />
                </Pressable>
            </View>
            <TextInput
                style={styles.input}
                onChangeText={setResponse1}
                value={response1}
                placeholder="Response #1"
                maxLength={250}
            />
            <View style={styles.promptContainer}>
                <Text style={styles.promptText}>{prompt2 ? prompt2: "Prompt #2"}</Text>
                <Pressable onPress={handlePrompt2Refresh}>
                    <FontAwesome
                        name='refresh'
                        size={screenWidth*0.1}
                        color='#77678C'
                        style={styles.refresh}
                    />
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setResponse2}
                    value={response2}
                    placeholder="Response #1"
                    maxLength={250}
                />
                <Text style={styles.charCount}>Characters left: {250 - response2.length}</Text>
            </View>
            <View style={styles.lowerContainer}>
                {
                    loading ? 
                    <ActivityIndicator style={styles.loading} /> :
                    <Pressable style={styles.button} onPress={handleClick}>
                        <Text style={styles.buttonText}>{finished_sign_up ? "Save" : "Continue"}</Text>
                    </Pressable>
                }
            </View>
        </LinearGradient>
      )
}

const styles = StyleSheet.create({
    namesContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: 'absolute',
        top: screenHeight * 0.05,
        left: screenWidth * 0.05
    },
    titleText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.06
    },
    promptContainer: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.1,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        margin: screenWidth * 0.025,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    promptText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        flex: 1,
        paddingLeft: screenWidth * 0.05,
        lineHeight: screenHeight * 0.04,
    },
    refresh: {
        marginRight: screenWidth * 0.05,
        marginLeft: screenWidth * 0.05
    },
    container: {
        flex: 1,
    },
    input: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.18,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        margin: screenWidth * 0.025,
        padding: screenWidth * 0.05,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.03,
        lineHeight: screenHeight * 0.04,
    },
    charCount: {
        color: '#888',
    },
    lowerContainer: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    button: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
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

export default Prompts;