import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Keyboard,
	Image,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
	KeyboardAvoidingView,
	Platform
} from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import HobNobLogo from "../assets/images/HobNobLogo.png";
import CreateAccountText from "../assets/images/CreateAccountText.png";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SignUp = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleContinue = async () => {
		if (!email) {
			Alert.alert("Uhoh", "Email cannot be empty!");
			return;
		}
		if (!password) {
			Alert.alert("Uhoh", "Password cannot be empty!");
			return;
		}
		if (!confirmPassword) {
			Alert.alert("Uhoh", "Please confirm your password!");
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert("Uhoh", "Passwords do not match!");
			return;
		}

		setLoading(true);
		try {
			const authResponse = await supabase.auth.signUp({
				email: email,
				password: password
			});
			if (authResponse.error) throw authResponse.error;
			const userId = authResponse.data.user.id;
			const response = await supabase
				.from("users")
				.insert({ user_id: userId });
			if (response.error) throw response.error;
			setLoading(false);
			navigation.navigate("UserName");
		} catch (error) {
			setLoading(false);
			Alert.alert("Uhoh", error.message);
		}
	};

	const handleLogin = () => {
		navigation.navigate("Login");
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
				style={styles.loginContainer}
			>
				<ActivityIndicator
					size="large"
					style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
				/>
			</LinearGradient>
		);
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<LinearGradient
				colors={["#A8D0F5", "#D0B4F4"]}
				style={styles.signUpContainer}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<View style={styles.logoContainer}>
						<Image
							style={styles.logo}
							source={HobNobLogo}
						/>
						<Text style={styles.logoText}>HobNob.</Text>
					</View>
					<View style={styles.textContainer}>
						<Image
							style={styles.createAccountText}
							source={CreateAccountText}
						/>
						<TextInput
							style={styles.input}
							onChangeText={setEmail}
							value={email}
							placeholder="Email"
							placeholderTextColor="#888888"
							autoCapitalize="none"
							autoCorrect={false}
						/>
						<TextInput
							style={styles.input}
							onChangeText={setPassword}
							value={password}
							placeholder="Password"
							placeholderTextColor="#888888"
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry
						/>
						<TextInput
							style={styles.input}
							onChangeText={setConfirmPassword}
							value={confirmPassword}
							placeholder="Confirm Password"
							placeholderTextColor="#888888"
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry
						/>
						<View style={styles.lowerContainer}>
							{loading ? (
								<ActivityIndicator style={styles.loading} />
							) : (
								<Pressable
									style={styles.continueButton}
									onPress={handleContinue}
								>
									<Text style={styles.continue}>Continue</Text>
								</Pressable>
							)}
						</View>
						<View style={styles.loginContainer}>
							<Text style={styles.loginText}>Already have an account?</Text>
							<Pressable onPress={handleLogin}>
								<Text style={styles.loginLink}> Log In</Text>
							</Pressable>
							<Text style={styles.loginText}>.</Text>
						</View>
					</View>
				</KeyboardAvoidingView>
			</LinearGradient>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	signUpContainer: {
		flex: 1,
		alignItems: "center",
		width: screenWidth,
		height: screenHeight
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: screenWidth * 0.5,
		resizeMode: "contain"
	},
	logoText: {
		fontFamily: "Dongle-Bold",
		fontSize: screenHeight * 0.05
	},
	textContainer: {
		alignItems: "center",
		width: screenWidth,
		paddingHorizontal: screenWidth * 0.1
	},
	createAccountText: {
		height: screenHeight * 0.125,
		resizeMode: "contain",
	},
	input: {
		width: screenWidth * 0.75,
		height: screenHeight * 0.06,
		backgroundColor: "#FFFFFF",
		opacity: 0.8,
		marginVertical: screenWidth * 0.025,
		paddingLeft: screenWidth * 0.05,
		borderRadius: screenWidth * 0.05,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		fontFamily: "Dongle-Regular",
		fontSize: screenHeight * 0.03
	},
	lowerContainer: {
		height: screenHeight * 0.05,
		alignItems: "center",
		justifyContent: "center",
		marginTop: screenHeight * 0.025
	},
	continueButton: {
		width: screenWidth * 0.3,
		height: screenHeight * 0.05,
		backgroundColor: "#77678C",
		borderRadius: screenWidth * 0.05,
		alignItems: "center",
		justifyContent: "center"
	},
	continue: {
		color: "#FFFFFF",
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.04
	},
	loginContainer: {
		marginTop: screenHeight * 0.025,
		flexDirection: "row"
	},
	loginText: {
		fontFamily: "Dongle-Light",
		fontSize: screenHeight * 0.03
	},
	loginLink: {
		color: "#e74c3c",
		fontFamily: "Dongle-Bold",
		fontSize: screenHeight * 0.03
	},
	loading: {
		size: "large",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default SignUp;