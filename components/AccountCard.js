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

const AccountCard = ({ user, event_id, navigation }) => {
	const handleClick = () => {
		navigation.navigate("Account", { user_id: user.user_id, event_id });
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
		<Pressable style={styles.accountCardContainer} onPress={handleClick}>
			<Image source={{ uri: user.image_url }} style={styles.image} />
			<Text style={styles.name}>
				{`${user.first_name} ${user.last_name ? user.last_name.substring(0, 1) : ""}`}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	accountCardContainer: {
		alignItems: "center",
		flexDirection: "row",
		marginBottom: screenHeight * 0.025
	},
	image: {
		width: screenWidth * 0.1,
		height: screenWidth * 0.1,
		marginRight: screenWidth * 0.05,
		borderColor: "#000000",
		borderWidth: 1,
		borderRadius: screenWidth * 0.25,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5
	},
	name: {
		fontFamily: "Dongle-Regular",
		fontSize: screenHeight * 0.03,
		textAlign: "center"
	}
});

export default AccountCard;