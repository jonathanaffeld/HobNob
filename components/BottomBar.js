import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, useColorScheme, Pressable, ActivityIndicator, Image } from "react-native";
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { supabase } from '../supabase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const BottomBar = ({ user_id, navigation }) => {
    const colorScheme = useColorScheme();
    const route = useRoute();
    const [image, setImage] = useState(null);
    const [mounting, setMounting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setMounting(true);
            const { data, error } = await supabase
            .from('users')
            .select('image_url')
            .eq('user_id', user_id);
            
            if (error) {
                console.log(error);
                return;
            }

            const result = data[0];
            const img = result.image_url;
            
            if (img) {
                setImage(img);
            }
            setMounting(false);
        }
        fetchData();
    }, [user_id]);

    const goHome = () => {
        navigation.navigate("Home", { user_id: user_id });
    }

    const goDiscover = () => {
        navigation.navigate("Discover", { user_id: user_id });
    }

    const goEventCreate = () => {
        navigation.navigate("EventCreate", { user_id: user_id });
    }

    const goEvents = () => {
        navigation.navigate("Events", { user_id: user_id });
    }

    const goAccount = () => {
        navigation.navigate("Account", { user_id: user_id });
    }

    const iconColor = (iconLink) => {
        if (iconLink === route.name) return '#77678C';
        if (colorScheme === 'dark') return '#FFFFFF';
        return '#000000';
    }

    if (mounting) {
        return (
            <View style={[styles.bottomBarContainer, {backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF'}]}>
                <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}/>
            </View>
        );
    }

    return (
        <View style={[styles.bottomBarContainer, {backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF'}]}>
            <Pressable style={styles.icon} onPress={goHome}>
                <FontAwesome
                    name='home'
                    size={screenWidth*0.1}
                    color={iconColor("Home")}
                />
                {
                    route.name === "Home" &&
                    <View style={styles.highlight}/>
                }
            </Pressable>
            <Pressable style={styles.icon} onPress={goDiscover}>
                <FontAwesome
                    name='globe'
                    size={screenWidth*0.1}
                    color={iconColor("Discover")}
                />
                {
                    route.name === "Discover" &&
                    <View style={styles.highlight}/>
                }
            </Pressable>
            <Pressable style={styles.icon} onPress={goEventCreate}>
                <Feather
                    name='plus-square'
                    size={screenWidth*0.1}
                    color={iconColor("EventCreate")}
                />
                {
                    route.name === "EventCreate" &&
                    <View style={styles.highlight}/>
                }
            </Pressable>
            <Pressable style={styles.icon} onPress={goEvents}>
                <Entypo
                    name='ticket'
                    size={screenWidth*0.1}
                    color={iconColor("Events")}
                />
                {
                    route.name === "Events" &&
                    <View style={styles.highlight}/>
                }
            </Pressable>
            <Pressable style={styles.icon} onPress={goAccount}>
                <Image source={{ uri: image }} style={[styles.image, {borderColor: iconColor("Account")}]} />
                {
                    route.name === "Account" &&
                    <View style={styles.highlight}/>
                }
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBarContainer: {
        flex: 5,
        alignItems: "center",
        flexDirection: "row",
        width: screenWidth,
        height: screenHeight * 0.1,
        position: "absolute",
        bottom: 0,
        paddingBottom: 0.025 * screenHeight,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        borderRadius: 100,
        borderWidth: 2,
    },
    highlight: {
        backgroundColor: '#77678C',
        position: "absolute",
        bottom: screenHeight * -0.02,
        width: screenHeight * 0.01,
        height: screenHeight * 0.01,
        borderRadius: 100,
    }
});

export default BottomBar;