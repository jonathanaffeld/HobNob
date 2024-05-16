import React, { useState } from 'react';
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
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import BottomBar from './BottomBar';
import { supabase } from '../supabase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Account = ({ route, navigation }) => {
    const user_id = route.params.user_id;

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.accountContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }
    
    return(
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.accountContainer}>
            <Text>Account</Text>
            <BottomBar user_id={user_id} navigation={navigation} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    accountContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: screenHeight * 0.1,
    }
});

export default Account;