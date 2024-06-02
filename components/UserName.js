import React, { useState, useCallback } from 'react';
import { 
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const UserName = ({ navigation }) => {
    const [user_id, setUserID]= useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
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
                    .select('first_name, last_name, finished_sign_up')
                    .eq('user_id', id)
                    .then((response) => {
                        if (response.error) throw response.error;
                        
                        const result = response.data[0];
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
        navigation.navigate("Account", { user_id: user_id });
    }

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
            navigation.navigate("UserPhoto")
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
                placeholderTextColor={'#888888'}
                autoCapitalize='words'
                autoCorrect={false}
            />
            <TextInput 
                style={styles.input} 
                onChangeText={setLastName} 
                value={last_name} 
                placeholder='Last Name'
                placeholderTextColor={'#888888'}
                autoCapitalize='words'
                autoCorrect={false}
            />
            <View style={styles.lowerContainer}>
                {
                    loading ? 
                    <ActivityIndicator style={styles.loading} /> :
                    <View style={styles.buttonContainer}>
                        {
                            finished_sign_up &&
                            <Pressable style={styles.backButton} onPress={handleBack}>
                                <Text style={styles.buttonText}>Back</Text>
                            </Pressable>
                        }
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
        fontSize: screenHeight * 0.06
    },
    input: {
        width: screenWidth * 0.75,
        height: screenHeight * 0.06,
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        margin: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.05,
        borderRadius: screenWidth * 0.05,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
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
        borderRadius: screenWidth * 0.05,
        alignItems: "center",
        justifyContent: "center",
        marginRight: screenWidth * 0.025
    },
    button: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: screenWidth * 0.05,
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

export default UserName;