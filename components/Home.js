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
import EventCard from "./EventCard";
import UpcomingEventsText from "../assets/images/UpcomingEventsText.png";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Home = ({ navigation }) => {
	const [user, setUser] = useState({});
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [mounting, setMounting] = useState(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				setMounting(true);

				try {
					const authResponse = await supabase.auth.getUser();
					if (authResponse.error) throw authResponse.error;

					const id = authResponse.data.user.id;
					const userResponse = await supabase
						.from("users")
						.select("first_name, last_name, image_url")
						.eq("user_id", id);

					if (userResponse.error) throw userResponse.error;

					const userResult = userResponse.data[0];
					setUser(userResult);

					const currentDateTime = new Date().toISOString();

					const eventResponse = await supabase
						.from("events")
						.select("event_id, title, description, image_url")
						.contains("participants", [id])
						.gte("end_time", currentDateTime)
						.order("start_time", { ascending: true });

					if (eventResponse.error) throw eventResponse.error;

					setUpcomingEvents(eventResponse.data);
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
				style={styles.homeContainer}
			>
				<ActivityIndicator
					size="large"
					style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
				/>
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={["#A8D0F5", "#D0B4F4"]}
			style={styles.homeContainer}
		>
			<Text style={styles.hobNob}>HobNob.</Text>
			<Image
				source={{ uri: user.image_url }}
				style={styles.image}
			/>
			<Text style={styles.welcomeText}>
				{`Welcome ${user.first_name} ${user.last_name}!`}
			</Text>
			<Image
				source={UpcomingEventsText}
				style={styles.upcomingEventsText}
			/>
			{upcomingEvents.length !== 0 ? (
				<ScrollView style={styles.upcomingEventsContainer} showsVerticalScrollIndicator={false}>
					{upcomingEvents.map((event) => (
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
					onPress={() => navigation.navigate("Discover")}
				>
					<Text style={styles.noEventsTitle}>No Upcoming Events!</Text>
					<Text style={styles.noEventsText}>Discover Events on the Discover Page!</Text>
				</Pressable>
			)}
			<BottomBar navigation={navigation} />
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	homeContainer: {
		flexDirection: "column",
		alignItems: "center",
		paddingBottom: screenHeight * 0.1,
		width: screenWidth,
		height: screenHeight
	},
	hobNob: {
		fontFamily: "Dongle-Bold",
		fontSize: screenHeight * 0.05,
		marginTop: screenHeight * 0.05,
		marginLeft: screenWidth * 0.05,
		textAlign: "left",
		alignSelf: "flex-start"
	},
	image: {
		width: screenWidth * 0.4,
		height: screenWidth * 0.4,
		borderRadius: screenWidth * 0.25,
		borderColor: "#000000",
		borderWidth: 2,
		marginBottom: screenHeight * 0.025,
	},
	welcomeText: {
		fontFamily: "Dongle-Bold",
		fontSize: screenHeight * 0.04
	},
	upcomingEventsText: {
		height: screenHeight * 0.125,
		resizeMode: "contain",
		marginTop: screenHeight * -0.01
	},
	upcomingEventsContainer: {
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

export default Home;
