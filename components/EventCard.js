import React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Image } from "react-native";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useFonts } from "expo-font";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const EventPreview = ({ event, navigation }) => {
    const handleClick = () => {
        navigation.navigate("Event", { event_id: event.event_id })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${month}/${day}/${year} ${hours}:${strMinutes} ${ampm}`;
    }

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.homeContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }

    return(
        <Pressable style={styles.eventCardContainer} onPress={handleClick}>
            <View style={styles.topContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: event.image_url}} style={styles.image} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.titleText}>{event.title}</Text>
                    <View style={styles.locationContainer}>
                        <FontAwesome6
                            name='location-dot'
                            size={screenHeight*0.02}
                            color={"#000000"}
                            style={styles.locationIcon}
                        />
                        <Text style={styles.otherText}>{`${event.location}`}</Text>
                    </View>
                    <Text style={styles.otherText}>{`People Going: ${event.participants.length}`}</Text>
                    <Text style={styles.otherText}>{`${formatDate(event.start_time)} to ${formatDate(event.end_time)}`}</Text>
                </View>
            </View>
            <Text style={styles.otherText}>{event.description}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    eventCardContainer: {
        width: screenWidth * 0.75,
        padding: screenWidth * 0.05,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        borderRadius: screenWidth * 0.05,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        marginBottom: screenHeight * 0.025
    },
    topContainer: {
        flexDirection: "row",
        flex: 3,
        marginBottom: screenHeight * 0.025,
        alignItems: "center"
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: screenWidth * 0.25,
        marginRight: screenWidth * 0.05
    },
    image: {
        width: "100%",
        borderRadius: screenWidth * 0.05,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        flex: 1,
    },
    infoContainer: {
        flexDirection: "column",
        flex: 2,
        justifyContent: "center",
    },
    titleText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        lineHeight: screenHeight * 0.03,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    locationIcon: {
        marginRight: screenWidth * 0.02,
    },
    otherText: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.02,
    }
});

export default EventPreview;