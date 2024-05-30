import React, { useCallback, useState } from 'react';
import { 
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabase';
import Prompts from './Prompts';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const UserPrompt2 = ({ navigation }) => {
    const [user_id, setUserID]= useState("");
    const [prompt1, setPrompt1] = useState(null);
    const [prompt2, setPrompt2] = useState(null);
    const [response2, setResponse2] = useState("");
    const [finished_sign_up, setFinishedSignUp] = useState(false);
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);

                supabase.auth.getUser()
                .then((auth_response) => {
                    if (auth_response.error) throw auth_response.error;

                    const id = auth_response.data.user.id;
                    setUserID(id);

                    supabase
                    .from('users')
                    .select('prompt1, prompt2, response2, finished_sign_up')
                    .eq('user_id', id)
                    .then((response) => {
                        if (response.error) throw response.error;
                        
                        const result = response.data[0];
                        const p1 = result.prompt1;
                        const p2 = result.prompt2;
                        const r2 = result.response2;
                        const fsu = result.finished_sign_up;
                        
                        if (p1) {
                            setPrompt1(p1);
                        }
                        if (p2) {
                            setPrompt2(p2);
                        }
                        if (r2) {
                            setResponse2(r2);
                        }
                        setFinishedSignUp(fsu);
                        setMounting(false);
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((auth_error) => {
                    console.log(auth_error);
                })
            }
            fetchData();
        }, [])
    );

    const handleBack = async () => {
        if (finished_sign_up) {
            navigation.navigate("Account", { user_id: user_id });
        }
        else {
            navigation.navigate("UserPrompt1")
        }
    }

    const handlePromptRefresh = async () => {
        let prompt = Prompts[Math.floor(Math.random() * Prompts.length)];
        while (prompt === prompt1 || prompt === prompt2) {
            prompt = Prompts[Math.floor(Math.random() * Prompts.length)];
        }
        setPrompt2(prompt);
    }

    const handleClick = async () => {
        if (!prompt2) {
            Alert.alert("Uhoh", "Please select a prompt!");
            return;
        }
        if (!response2) {
            Alert.alert("Uhoh", "Please write a response!");
            return;
        }

        setLoading(true);
        
        const { error } = await supabase
        .from('users')
        .update({ prompt2: prompt2, response2: response2, finished_sign_up: true })
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
            navigation.navigate("Home")
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
            <Text style={styles.titleText}>Select your second prompt!</Text>
            <View style={styles.promptContainer}>
                <Text style={styles.promptText} multiline={true}>{prompt2 ? prompt2: "Prompt #2"}</Text>
                <Pressable onPress={handlePromptRefresh} style={styles.refresh}>
                    <FontAwesome
                        name='refresh'
                        size={screenWidth*0.1}
                        color='#77678C'
                    />
                    <Text style={styles.refreshText}>New Prompt</Text>
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setResponse2}
                    value={response2}
                    placeholder="Type your response here..."
                    placeholderTextColor={'#888888'}
                    maxLength={100}
                    multiline={true}
                />
                <View style={styles.charactersLeftContainer}>
                    <Text style={[styles.charactersLeft, 100 - response2.length < 20 && {color: '#e74c3c'}]}>Characters left: {100 - response2.length}</Text>
                </View>
            </View>
            <View style={styles.lowerContainer}>
                {
                    loading ? 
                    <ActivityIndicator style={styles.loading} /> :
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.backButton} onPress={handleBack}>
                            <Text style={styles.buttonText}>Back</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={handleClick}>
                            <Text style={styles.buttonText}>{finished_sign_up ? "Save" : "Continue"}</Text>
                        </Pressable>
                    </View>
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
    titleText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.05
    },
    promptContainer: {
        width: screenWidth * 0.75,
        height: screenHeight * 0.1,
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        margin: screenWidth * 0.025,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    promptText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        flex: 1,
        paddingLeft: screenWidth * 0.05,
    },
    refresh: {
        marginRight: screenWidth * 0.025,
        marginLeft: screenWidth * 0.025,
        justifyContent: "center",
        alignItems: "center"
    },
    refreshText: {
        size: screenWidth * 0.1,
        resizeMode: "contain",
        color: '#77678C',
        fontFamily: "Dongle-Regular"
    },
    inputContainer: {
        width: screenWidth * 0.75,
        height: screenHeight * 0.15,
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        margin: screenWidth * 0.025,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        flexDirection: "column"
    },
    input: {   
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.03,
        lineHeight: screenHeight * 0.03,
        flex: 1,
        padding: screenWidth * 0.05,
    },
    charactersLeftContainer: {
        flexDirection: "row-reverse"
    },
    charactersLeft: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.02,
        color: '#888888',
        paddingRight: screenWidth * 0.025
    },
    lowerContainer: {
        height: screenHeight * 0.05,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: screenWidth * 0.025
    },
    button: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: screenWidth * 0.025
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

export default UserPrompt2;
