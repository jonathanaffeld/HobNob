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

const Event = ({ route, navigation }) => {
    const event_id = route.params.event_id;
    const [event, setEvent] = useState({});
    const [mounting, setMounting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);
                
                const { data, error } = await supabase
                    .from('events')
                    .select()
                    .eq('event_id', event_id);
                
                if (error) {
                    console.log(error);
                    return;
                }

                const result = data[0];
                setEvent(result);
                setMounting(false);
            }
            fetchData();
        }, [event_id])
    );

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.eventContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }
    
    return(
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.eventContainer}>
            <Text>{event.title}</Text>
            <BottomBar navigation={navigation} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    eventContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: screenHeight * 0.1,
    }
});

export default Event;