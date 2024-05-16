import React, { useState, useCallback } from 'react';
import { 
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import BottomBar from './BottomBar';
import { supabase } from '../supabase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Events = ({ navigation }) => {
    const [user_id, setUserID]= useState("");
    const [mounting, setMounting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);

                supabase.auth.getUser()
                .then((auth_response) => {
                    if (auth_response.error) throw auth_response.error;

                    const id = auth_response.data.user.id;
                    setUserID(id);
                    setMounting(false);
                }).catch((auth_error) => {
                    console.log(auth_error);
                })
            }
            fetchData();
        }, [])
    );

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.eventsContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }
    
    return(
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.eventsContainer}>
            <Text>Events</Text>
            <BottomBar navigation={navigation} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    eventsContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: screenHeight * 0.1,
    }
});

export default Events;