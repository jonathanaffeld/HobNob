import React, { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	Pressable
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import BottomBar from "./BottomBar";
import DiscoverText from "../assets/images/DiscoverText.png";
import EventCard from "./EventCard";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Discover = ({ navigation }) => {
  const [discoverEvents, setDiscoverEvents] = useState([]);
	const [mounting, setMounting] = useState(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				setMounting(true);
				try {
					const authResponse = await supabase.auth.getUser();
					if (authResponse.error) throw authResponse.error;

					const id = authResponse.data.user.id;
					const currentDateTime = new Date().toISOString();

					const eventResponse = await supabase
						.from("events")
						.select("event_id, title, description, image_url")
						.not("participants", "cs", `{${id}}`)
                        .not("owner", "eq", id)
						.gt("end_time", currentDateTime)
						.order("start_time", { ascending: true });

					if (eventResponse.error) throw eventResponse.error;

					setDiscoverEvents(eventResponse.data);
					setMounting(false);
				} catch (error) {
					console.log(error);
					setMounting(false);
				}
			}
			fetchData();
		}, [])
	);

	const [fontsLoaded] = useFonts({
		"Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
		"Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
		"Dongle-Light": require("../assets/fonts/Dongle-Light.ttf")
	});

	if (!fontsLoaded || mounting) {
		return (
			<LinearGradient
				colors={["#A8D0F5", "#D0B4F4"]}
				style={styles.discoverContainer}
			>
				<ActivityIndicator
					size="large"
					style={{
						alignItems: "center",
						justifyContent: "center",
						flex: 1
					}}
				/>
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={["#A8D0F5", "#D0B4F4"]}
			style={styles.discoverContainer}
		>
			<Image
				source={DiscoverText}
				style={styles.discoverText}
			/>
			{discoverEvents.length !== 0 ? (
				<ScrollView style={styles.discoverEventsContainer} showsVerticalScrollIndicator={false}>
					{discoverEvents.map((event) => (
						<EventCard
							key={event.event_id}
							event={event}
							navigation={navigation}
						/>
					))}
				</ScrollView>
			) : (
				<Pressable
					style={styles.noEventsContainer}
					onPress={() => navigation.navigate("EventCreate")}
				>
					<Text style={styles.noEventsTitle}>No Discoverable Events!</Text>
					<Text style={styles.noEventsText}>Create an Event and Get HobNob-ing!</Text>
				</Pressable>
			)}
			<BottomBar navigation={navigation} />
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	discoverContainer: {
		flexDirection: "column",
		alignItems: "center",
		paddingBottom: screenHeight * 0.1,
		width: screenWidth,
		height: screenHeight
	},
	discoverText: {
		height: screenHeight * 0.125,
		resizeMode: "contain",
		marginTop: screenHeight * 0.05
	},
	discoverEventsContainer: {
		paddingHorizontal: screenWidth * 0.05,
		paddingVertical: screenWidth * 0.025
	},
	noEventsContainer: {
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
		shadowRadius: 5
	},
	noEventsTitle: {
		fontFamily: "Dongle-Bold",
		fontSize: screenHeight * 0.03,
		textAlign: "center"
	},
	noEventsText: {
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.02,
		textAlign: "center"
	}
});

export default Discover;
