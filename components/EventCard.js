import React from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCard = ({ event, navigation }) => {
	const handleClick = () => {
		navigation.navigate("Event", { event_id: event.event_id });
	};

	const [fontsLoaded] = useFonts({
		"Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
		"Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
		"Dongle-Light": require("../assets/fonts/Dongle-Light.ttf")
	});

	if (!fontsLoaded) {
		return (
			<LinearGradient
				colors={["#A8D0F5", "#D0B4F4"]}
				style={styles.eventCardContainer}
			>
				<ActivityIndicator size="large" />
			</LinearGradient>
		);
	}

	return (
		<Pressable
			style={styles.eventCardContainer}
			onPress={handleClick}
		>
            <Image
                source={{ uri: event.image_url }}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{event.title}</Text>
			    <Text style={styles.description}>{event.description}</Text>
            </View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	eventCardContainer: {
		width: screenWidth * 0.75,
		padding: screenWidth * 0.05,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		marginBottom: screenHeight * 0.025,
        flex: 2,
        flexDirection: "row"
	},
	image: {
        flex: 1,
        width: "100%",
        height: "100%",
        marginRight: screenWidth * 0.05,
        borderColor: "#000000",
		borderWidth: 1,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
	},
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
	title: {
		fontFamily: "Dongle-Bold",
		fontSize: screenHeight * 0.03,
		lineHeight: screenHeight * 0.03,
		textAlign: "center"
	},
	description: {
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.02,
        lineHeight: screenHeight * 0.02,
		textAlign: "center"
	}
});

export default EventCard;