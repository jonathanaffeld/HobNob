import React, { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Pressable,
	StyleSheet,
	useColorScheme,
	View
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const BottomBar = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const route = useRoute();
	const [userId, setUserId] = useState("");
	const [image, setImage] = useState("");
	const [mounting, setMounting] = useState(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				setMounting(true);

				try {
					const authResponse = await supabase.auth.getUser();
					if (authResponse.error) throw authResponse.error;

					const id = authResponse.data.user.id;
					setUserId(id);

					const response = await supabase
						.from("users")
						.select("image_url")
						.eq("user_id", id);

					if (response.error) throw response.error;

					const img = response.data[0].image_url;

					setImage(img);
				} catch (error) {
					console.log(error);
				}
				setMounting(false);
			}
			fetchData();
		}, [])
	);

	const goHome = () => {
		navigation.navigate("Home");
	};

	const goDiscover = () => {
		navigation.navigate("Discover");
	};

	const goEventCreate = () => {
		navigation.navigate("EventCreate");
	};

	const goEvents = () => {
		navigation.navigate("Events");
	};

	const goAccount = () => {
		navigation.navigate("Account", { user_id: userId });
	};

	const iconColor = (iconLink) => {
		if (iconLink === route.name) return "#77678C";
		if (colorScheme === "dark") return "#FFFFFF";
		return "#000000";
	};

	if (mounting) {
		return (
			<View
				style={[
					styles.bottomBarContainer,
					{ backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF" }
				]}
			>
				<ActivityIndicator
					size="large"
					color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
				/>
			</View>
		);
	}

	return (
		<View
			style={[
				styles.bottomBarContainer,
				{ backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF" }
			]}
		>
			<Pressable style={styles.icon} onPress={goHome}>
				<FontAwesome
					name="home"
					size={screenWidth * 0.1}
					color={iconColor("Home")}
				/>
				{route.name === "Home" && <View style={styles.highlight} />}
			</Pressable>
			<Pressable style={styles.icon} onPress={goDiscover}>
				<FontAwesome
					name="globe"
					size={screenWidth * 0.1}
					color={iconColor("Discover")}
				/>
				{route.name === "Discover" && <View style={styles.highlight} />}
			</Pressable>
			<Pressable style={styles.icon} onPress={goEventCreate}>
				<Feather
					name="plus-square"
					size={screenWidth * 0.1}
					color={iconColor("EventCreate")}
				/>
				{route.name === "EventCreate" && <View style={styles.highlight} />}
			</Pressable>
			<Pressable style={styles.icon} onPress={goEvents}>
				<MaterialIcons
					name="event"
					size={screenWidth * 0.1}
					color={iconColor("Events")}
				/>
				{route.name === "Events" && <View style={styles.highlight} />}
			</Pressable>
			<Pressable style={styles.icon} onPress={goAccount}>
				{image ? (
					<Image
						source={{ uri: image }}
						style={[
							styles.image,
							{ borderColor: iconColor("Account") },
							{ borderWidth: route.name === "Account" ? screenWidth * 0.0075 : screenWidth * 0.005 }
						]}
					/>
				) : (
					<ActivityIndicator
						style={[
							styles.image,
							{ borderColor: iconColor("Account") },
							{ borderWidth: route.name === "Account" ? screenWidth * 0.0075 : screenWidth * 0.005 }
						]}
					/>
				)}
				{route.name === "Account" && <View style={styles.highlight} />}
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	bottomBarContainer: {
		flex: 5,
		alignItems: "center",
		flexDirection: "row",
		width: screenWidth,
		height: screenHeight * 0.1,
		position: "absolute",
		bottom: 0,
		paddingBottom: screenHeight * 0.025,
		justifyContent: "center"
	},
	icon: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	image: {
		width: screenWidth * 0.1,
		height: screenWidth * 0.1,
		borderRadius: screenWidth * 0.25
	},
	highlight: {
		backgroundColor: "#77678C",
		position: "absolute",
		bottom: screenHeight * -0.015,
		width: screenHeight * 0.01,
		height: screenHeight * 0.01,
		borderRadius: screenWidth * 0.25
	}
});

export default BottomBar;