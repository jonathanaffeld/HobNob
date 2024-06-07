import React, { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { decode } from "base64-arraybuffer";

import BottomBar from "./BottomBar";
import CreateEventText from "../assets/images/CreateEventText.png";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCreate = ({ navigation }) => {
	const [userId, setUserId] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState(null);
	const [location, setLocation] = useState("");
	const [dateStart, setDateStart] = useState(new Date());
	const [dateEnd, setDateEnd] = useState(new Date());
	const [timeStart, setTimeStart] = useState(new Date());
	const [timeEnd, setTimeEnd] = useState(new Date(new Date().getTime() + 60000));
	const [prompt, setPrompt] = useState("");
	const [mounting, setMounting] = useState(false);
	const [loading, setLoading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			async function fetchData() {
				setMounting(true);
				try {
					const authResponse = await supabase.auth.getUser();
					if (authResponse.error) throw authResponse.error;

					const id = authResponse.data.user.id;
					setUserId(id);
					setMounting(false);
				} catch (error) {
					console.log(error);
					setMounting(false);
				}
			}
			fetchData();
		}, [])
	);

	const pickImage = async () => {
		const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (cameraRollPermission.status !== "granted") {
			alert("Permission for camera roll access needed.");
			return;
		}
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} catch (error) {
			console.error("ImagePicker Error", error.message);
		}
	};

	const takeImage = async () => {
		const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
		if (cameraPermission.status !== "granted") {
			alert("Permission for camera access needed.");
			return;
		}
		try {
			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} catch (error) {
			console.error("Camera Error", error.message);
		}
	};

	async function convertImageToBuffer(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				try {
					const base64data = reader.result.split(",")[1];
					const arrayBuffer = decode(base64data);
					resolve(arrayBuffer);
				} catch (error) {
					reject(error);
				}
			};
			reader.onerror = () => {
				reject(new Error("Error reading blob."));
			};
		});
	}

	const handleSubmit = async () => {
		if (!title) {
			Alert.alert("Uh-oh", "Title cannot be empty!");
			return;
		}
		if (!description) {
			Alert.alert("Uh-oh", "Description cannot be empty!");
			return;
		}
		if (!image) {
			Alert.alert("Uh-oh", "Please Upload an Image!");
			return;
		}
		if (!location) {
			Alert.alert("Uh-oh", "Location cannot be empty!");
			return;
		}
		if (!prompt) {
			Alert.alert("Uh-oh", "Prompt cannot be empty!");
			return;
		}

		const startDateTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), timeStart.getHours(), timeStart.getMinutes());
		const endDateTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate(), timeEnd.getHours(), timeEnd.getMinutes());

		if (startDateTime >= endDateTime) {
			Alert.alert("Uh-oh", "End date/time must be after Start date/time!");
			return;
		}

		const startDateTimeTz = startDateTime.toISOString();
		const endDateTimeTz = endDateTime.toISOString();

		setLoading(true);

		try {
			const base64Response = await fetch(image);
			const blob = await base64Response.blob();
			const arrayBuffer = await convertImageToBuffer(blob);

			const { data: eventData, error: eventError } = await supabase
				.from("events")
				.insert({
					title: title,
					description: description,
					location: location,
					start_time: startDateTimeTz,
					end_time: endDateTimeTz,
					owner: userId,
					participants: [],
					prompt: prompt,
					participant_responses: {}
				})
				.select("event_id")
				.single();

			if (eventError) throw eventError;

			const event_id = eventData.event_id;

			const { error: uploadError } = await supabase
				.storage
				.from("event-photos")
				.upload(`${userId}/events/${event_id}.png`, arrayBuffer, {
					contentType: "image/png",
					upsert: true
				});

			if (uploadError) throw uploadError;

			const { data: publicUrlData, error: urlError } = supabase.storage
				.from("event-photos")
				.getPublicUrl(`${userId}/events/${event_id}.png`);

			if (urlError) throw urlError;

			const imageUrl = publicUrlData.publicUrl;

			const { error: updateError } = await supabase
				.from("events")
				.update({ image_url: imageUrl })
				.eq("event_id", event_id);

			if (updateError) throw updateError;

			setLoading(false);
			Alert.alert("Event Created!");
			navigation.navigate("Home");
		} catch (error) {
			setLoading(false);
			Alert.alert("Uh-oh", error.message);
		}
	};

	const onChangeStartDate = (event, selectedDate) => {
		const currentDate = selectedDate || dateStart;
		setDateStart(currentDate);
	};

	const onChangeEndDate = (event, selectedDate) => {
		const currentDate = selectedDate || dateEnd;
		setDateEnd(currentDate);
	};

	const onChangeStartTime = (event, selectedTime) => {
		const currentTime = selectedTime || timeStart;
		setTimeStart(currentTime);
	};

	const onChangeEndTime = (event, selectedTime) => {
		const currentTime = selectedTime || timeEnd;
		setTimeEnd(currentTime);
	};

	const [fontsLoaded] = useFonts({
		"Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
		"Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
		"Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
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
			style={styles.eventCreateContainer}
		>
			<ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
            >
				<Image
					source={CreateEventText}
					style={styles.createEventText}
				/>
				<View style={styles.titleContainer}>
					<TextInput
						style={styles.title}
						onChangeText={setTitle}
						value={title}
						placeholder="Name your Event!"
						autoCorrect={false}
						placeholderTextColor="#888888"
						maxLength={30}
					/>
					<View style={styles.charactersLeftContainer}>
						<Text
							style={[
								styles.charactersLeft,
								30 - title.length < 10 && { color: "#e74c3c" }
							]}
						>
							Characters left: {30 - title.length}
						</Text>
					</View>
				</View>
				<View style={styles.descriptionContainer}>
					<TextInput
						style={styles.description}
						onChangeText={setDescription}
						value={description}
						placeholder="Tell us a little bit about your event!"
						placeholderTextColor="#888888"
						maxLength={250}
						multiline={true}
					/>
					<View style={styles.charactersLeftContainer}>
						<Text
							style={[
								styles.charactersLeft,
								250 - description.length < 50 && { color: "#e74c3c" }
							]}
						>
							Characters left: {250 - description.length}
						</Text>
					</View>
				</View>
				<View style={styles.imageContainer}>
					{image ? (
						<Image source={{ uri: image }} style={styles.image} />
					) : (
						<View style={styles.image}>
							<Text style={styles.imagePlaceholder}>Select an Image!</Text>
						</View>
					)}
					<View style={styles.iconContainer}>
						<Pressable onPress={pickImage} style={styles.icon1}>
							<FontAwesome
								name="image"
								size={screenWidth * 0.1}
								color="#000000"
							/>
							<Text style={styles.iconText}>Upload Photo</Text>
						</Pressable>
						<Pressable onPress={takeImage} style={styles.icon2}>
							<FontAwesome
								name="camera"
								size={screenWidth * 0.1}
								color="#000000"
							/>
							<Text style={styles.iconText}>Take Photo</Text>
						</Pressable>
					</View>
				</View>
				<TextInput
					style={styles.location}
					onChangeText={setLocation}
					value={location}
					placeholder="Where is your event?"
					autoCorrect={false}
					placeholderTextColor="#888888"
				/>
				<View style={styles.dateTimeContainer}>
					<Text style={styles.dateTimeTitle}>Start Date:</Text>
					<DateTimePicker style={styles.dateTimeDropdown} value={dateStart} mode="date" display="default" onChange={onChangeStartDate} />
					<DateTimePicker style={styles.dateTimeDropdown} value={timeStart} mode="time" display="default" onChange={onChangeStartTime} />
				</View>
				<View style={styles.dateTimeContainer}>
					<Text style={styles.dateTimeTitle}>End Date:</Text>
					<DateTimePicker style={styles.dateTimeDropdown} value={dateEnd} mode="date" display="default" onChange={onChangeEndDate} minimumDate={dateStart} />
					<DateTimePicker style={styles.dateTimeDropdown} value={timeEnd} mode="time" display="default" onChange={onChangeEndTime} />
				</View>
				<TextInput
					style={styles.prompt}
					onChangeText={setPrompt}
					value={prompt}
					multiline={true}
					placeholder="Break the Ice with a Prompt!"
					placeholderTextColor="#888888"
				/>
				{loading ? (
					<ActivityIndicator />
				) : (
					<Pressable style={styles.submitButton} onPress={handleSubmit}>
						<Text style={styles.submitText}>Submit</Text>
					</Pressable>
				)}
			</ScrollView>
			<BottomBar navigation={navigation} />
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	eventCreateContainer: {
		flexDirection: "column",
		alignItems: "center",
		paddingBottom: screenHeight * 0.1,
		width: screenWidth,
		height: screenHeight
	},
	scrollContainer: {
		alignItems: "center",
		paddingBottom: screenHeight * 0.1,
		width: screenWidth
	},
	createEventText: {
		height: screenHeight * 0.125,
		resizeMode: "contain",
		marginTop: screenHeight * 0.05
	},
	titleContainer: {
		width: screenWidth * 0.8,
		height: screenHeight * 0.08,
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		margin: screenWidth * 0.025,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
	},
	title: {
		fontFamily: "Dongle-Regular",
		fontSize: screenHeight * 0.04,
		padding: screenWidth * 0.05,
		flex: 1
	},
	descriptionContainer: {
		width: screenWidth * 0.8,
		height: screenHeight * 0.2,
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		margin: screenWidth * 0.025,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		flexDirection: "column"
	},
	description: {
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.03,
		lineHeight: screenHeight * 0.03,
		padding: screenWidth * 0.05,
		flex: 1
	},
	charactersLeftContainer: {
		flexDirection: "row-reverse"
	},
	charactersLeft: {
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.02,
		color: "#888888",
		paddingRight: screenWidth * 0.025
	},
	imageContainer: {
		width: screenWidth * 0.8,
		margin: screenWidth * 0.025,
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		justifyContent: "center",
		alignItems: "center"
	},
	image: {
		width: screenWidth * 0.5,
		height: screenWidth * 0.5,
		borderRadius: screenWidth * 0.05,
		borderColor: "#000000",
		borderWidth: 2,
		margin: screenHeight * 0.025,
		justifyContent: "center",
		alignItems: "center",
	},
	imagePlaceholder: {
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.03,
		color: "#888888",
		opacity: 0.8
	},
	iconContainer: {
		flexDirection: "row"
	},
	icon1: {
		marginRight: screenHeight * 0.05,
		marginBottom: screenHeight * 0.025,
		justifyContent: "center",
		alignItems: "center"
	},
	icon2: {
		marginLeft: screenHeight * 0.05,
		marginBottom: screenHeight * 0.025,
		justifyContent: "center",
		alignItems: "center"
	},
	iconText: {
		size: screenWidth * 0.1,
		resizeMode: "contain",
		color: "#000000",
		fontFamily: "Dongle-Regular"
	},
	location: {
		width: screenWidth * 0.8,
		height: screenHeight * 0.05,
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		margin: screenWidth * 0.025,
		paddingLeft: screenWidth * 0.05,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		fontFamily: "Dongle-Regular",
		fontSize: screenHeight * 0.03
	},
	dateTimeContainer: {
		flex: 3,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: screenWidth * 0.8,
		marginVertical: screenHeight * 0.0125
	},
	dateTimeTitle: {
		fontSize: screenHeight * 0.03,
		fontFamily: "Dongle-Regular",
		flex: 1,
		textAlign: "right",
		marginHorizontal: screenWidth * 0.0125
	},
	dateTimeDropdown: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: screenWidth * 0.0125,
	},
	prompt: {
		width: screenWidth * 0.8,
		height: screenHeight * 0.1,
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		margin: screenWidth * 0.025,
		paddingLeft: screenWidth * 0.05,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		fontFamily: "Dongle-Regular",
		fontSize: screenHeight * 0.03
	},
	submitButton: {
		width: screenWidth * 0.3,
		height: screenHeight * 0.05,
		backgroundColor: "#77678C",
		borderRadius: screenWidth * 0.05,
		alignItems: "center",
		justifyContent: "center",
		marginTop: screenHeight * 0.025
	},
	submitText: {
		color: "#FFFFFF",
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.04
	}
});

export default EventCreate;