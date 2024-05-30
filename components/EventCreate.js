import React, { useState, useCallback } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from "../supabase";
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomBar from "./BottomBar";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCreate = ({ navigation }) => {
    const [user_id, setUserID] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [loc, setLoc] = useState('');
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [timeStart, setTimeStart] = useState(new Date());
    const [timeEnd, setTimeEnd] = useState(new Date());
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);

                supabase.auth.getUser()
                .then((auth_response) => {
                    if (auth_response.error) throw auth_response.error;

                    const id = auth_response.data.user.id;
                    setUserID(id);
                    setMounting(false);
                }).catch((auth_error) => {
                    console.log(auth_error);
                })
            }
            fetchData();
        }, [])
    );

    const pickImage = async () => {
        const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraRollPermission.status !== 'granted') {
            alert('Permission for camera roll access needed.');
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            console.log(result);
    
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("ImagePicker Error", error.message);
        }
    };
    
    const takeImage = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            alert('Permission for camera access needed.');
            return;
        }
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            console.log(result);
    
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
                    const base64data = reader.result.split(',')[1];
                    const arrayBuffer = decode(base64data);
                    resolve(arrayBuffer);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(new Error('Error reading blob.'));
            };
        });
    }

    const handleSubmit = async () => {
        if (!description) {
            Alert.alert("Uh-oh", "Description cannot be empty!");
            return;
        }
        if (!title) {
            Alert.alert("Uh-oh", "Title cannot be empty!");
            return;
        }
        if (!loc) {
            Alert.alert("Uh-oh", "Location cannot be empty!");
            return;
        }
        if (!image) {
            Alert.alert("Uh-oh", "Please Upload an Image!");
            return;
        }

        const startDateTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), timeStart.getHours(), timeStart.getMinutes());
        const endDateTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate(), timeEnd.getHours(), timeEnd.getMinutes());

        if (startDateTime >= endDateTime) {
            Alert.alert("Uh-oh", "Start date/time must be before end date/time!");
            return;
        }

        const startDateTimeTz = startDateTime.toISOString();
        const endDateTimeTz = endDateTime.toISOString();

        setLoading(true);

        try {
            const base64Response = await fetch(image);
            const blob = await base64Response.blob();
            const arrayBuffer = await convertImageToBuffer(blob);

            supabase
            .from('events')
            .insert(
                {
                    start_time: startDateTimeTz,
                    end_time: endDateTimeTz,
                    title: title,
                    description: description,
                    location: loc,
                    participants: [user_id],
                    owner: user_id,
                },
            ).select('event_id')
            .then((event_response) => {
                if (event_response.error) throw event_response.error;

                const event_id = event_response.data[0].event_id;

                supabase
                .storage
                .from('event-photos')
                .upload(`${user_id}/events/${event_id}.png`, arrayBuffer, {
                    contentType: 'image/png',
                    upsert: true
                })
                .then((upload_response) => {
                    if (upload_response.error) throw upload_response.error;
                    const publicUrlResponse = supabase.storage.from('event-photos').getPublicUrl(`${user_id}/events/${event_id}.png`);
                    const url = publicUrlResponse.data.publicUrl;
                    supabase
                    .from('events')
                    .update({ image_url: url })
                    .eq('event_id', event_id)
                    .then((response) => {
                        if (response.error) throw response.error;
                        setLoading(false);
                        Alert.alert("Event Created Successfully");
                        navigation.navigate("Home");
                    }).catch((error) => {
                        setLoading(false);
                        Alert.alert("Uhoh", error.message);
                    });
                }).catch((upload_error) => {
                    setLoading(false);
                    Alert.alert("Uhoh", upload_error.message);
                });
            }).catch((event_error) => {
                setLoading(false);
                Alert.alert("Uhoh", event_error.message);
            });
        } catch (image_error) {
            setLoading(false);
            Alert.alert("Uhoh", image_error.message);
        }
    };

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || dateStart;
        setDateStart(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
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
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.createEventContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={["#A8D0F5", "#D0B4F4"]}
            style={styles.createEventContainer}
        >
            <View style={styles.topContainer}>
                <View style={styles.leftGroup}>
                    <View style={styles.logoTextContainer}>
                        <Text style={styles.logoLetter}>HobNob.</Text>
                    </View>
                </View>
                <View style={styles.spacer}></View>
            </View>
            <View style={styles.upcomingEventsContainer}>
                <Text style={styles.titleText}>Create Event</Text>
            </View>
            <View style={styles.uploadImage}>
                {
                    image ?
                    <Image source={{ uri: image }} style={styles.image} /> :
                    <View style={styles.image} />
                }
                <View style={styles.iconContainer}>
                    <Pressable onPress={pickImage} style={styles.icon1}>
                        <FontAwesome 
                            name='image' 
                            size={screenWidth * 0.1} 
                            color='#000000'
                        />
                        <Text style={styles.iconText}>Upload Photo</Text>
                    </Pressable>
                    <Pressable onPress={takeImage} style={styles.icon2} >
                        <FontAwesome 
                            name='camera' 
                            size={screenWidth * 0.1}
                            color='#000000'
                        />
                        <Text style={styles.iconText}>Take Photo</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.textContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setTitle}
                    value={title}
                    placeholder='Give your event a title!'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor="gray"
                />
                <TextInput
                    style={styles.desc}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={setDescription}
                    value={description}
                    placeholder="Type your description here..."
                    placeholderTextColor="gray"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setLoc}
                    value={loc}
                    placeholder='Where is your event?'
                    autoCapitalize='none'
                    placeholderTextColor="gray"
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.dateTitle}>Start Date:</Text>
                    <DateTimePicker
                        value={dateStart}
                        mode="date"
                        display="default"
                        onChange={onChangeStart}
                    />
                    <DateTimePicker
                        value={timeStart}
                        mode="time"
                        display="default"
                        onChange={onChangeStartTime}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.dateTitle}>End Date:</Text>
                    <DateTimePicker
                        value={dateEnd}
                        mode="date"
                        display="default"
                        onChange={onChangeEnd}
                        minimumDate={dateStart}
                    />
                    <DateTimePicker
                        value={timeEnd}
                        mode="time"
                        display="default"
                        onChange={onChangeEndTime}
                    />
                </View>
                {loading ?
                    <ActivityIndicator /> :
                    <Pressable style={styles.loginButton} onPress={handleSubmit}>
                        <Text style={styles.submit}>Submit</Text>
                    </Pressable>
                }
            </View>
            <BottomBar navigation={navigation} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    uploadImage: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: screenWidth * 0.4,
        height: screenWidth * 0.4,
        marginRight: screenWidth * 0.125,
        borderWidth: 2,
        borderColor: "#000000"
    },
    iconContainer: {
        flexDirection: "column",
        justifyContent: "space-center",
        alignItems: "center",
    },
    icon1: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: screenHeight * 0.02
    },
    icon2: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: screenHeight * 0.02
    },
    iconText: {
        size: screenWidth * 0.1,
        resizeMode: "contain",
        color: '#000000',
        fontFamily: "Dongle-Regular"
    },
    dateTitle: {
        marginRight: 10,
        fontSize: screenHeight * 0.04,
        fontFamily: "Dongle-Bold",
    },
    input: {
        width: screenWidth * 0.90,
        height: screenHeight * 0.035,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        margin: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.05,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        resizeMode: "contain",
    },
    desc: {
        width: screenWidth * 0.90,
        height: screenHeight * 0.1,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        margin: screenWidth * 0.025,
        paddingLeft: screenWidth * 0.05,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.02,
        resizeMode: "contain",
        textAlignVertical: 'top',
        color: 'black',
    },
    loginButton: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    textContainer: {
        flex: 2,
        alignItems: "center",
    },
    loginText: {
        height: screenHeight * 0.125,
        resizeMode: "contain",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    createEventContainer: {
        flex: 1,
        alignItems: "center",
    },
    profilebutton: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    profileContainer: {
        alignItems: "center", // Centers the image horizontally
        justifyContent: "center", // Centers the image vertically
        width: "90%",
        height: "25%",
    },
    submit: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.04
    },
    upcomingEventsContainer: {
        alignItems: "center", // Centers the image horizontally
        justifyContent: "flex-end", // Centers the image vertically
        width: "90%",
        height: "6%",
        marginBottom: "2%",
    },
    eventContainer: {
        alignItems: "center", // Centers the image horizontally
        justifyContent: "center", // Centers the image vertically
        width: "90%",
        height: "35%",
        marginBottom: "1%",
    },
    event: {
        backgroundColor: "#fff", // White background
        padding: "5%", // Padding around the content inside the container
        borderRadius: "30%", // Rounded edges
        alignItems: "center", // Aligns children to the center horizontally
        justifyContent: "top", // Aligns children to the center vertically
        flexDirection: "column", // Arranges children in a column
        shadowColor: "#000", // Shadow color
        width: "95%",
        height: "90%",
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow blur radius
    },
    parentContainer: {
        flexDirection: "row",
        width: "100%", // Align children horizontally
        height: "55%",
        padding: "2%",
        justifyContent: "space-between",
        alignItems: "center", // Centers children vertically in the container
    },
    parentContainer2: {
        flexDirection: "row",
        width: "100%", // Align children horizontally
        height: "18%",
        padding: "0%",
        // justifyContent: "space-between",
        alignItems: "center", // Centers children vertically in the container
    },
    circleContainer: {
        flexDirection: "row", // Aligns circles horizontally
        height: "100%",
    },
    circle: {
        width: "15.5%", // Diameter of the circle
        height: "97%", // Diameter of the circle
        borderRadius: "20%", // Half of width/height to make perfect circle
        backgroundColor: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5, // Adds spacing between circles
    },
    initials: {
        color: "#333",
        fontSize: "8%",
    },
    label: {
        fontWeight: "bold",
        marginHorizontal: "1%", // Adds spacing between the label and the circles
    },
    parentContainer3: {
        flexDirection: "row",
        width: "100%", // Align children horizontally
        height: "30%",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "2%",
    },
    eventTopLeft: {
        height: "80%",
        width: "30%",
        justifyContent: "center", // Center content vertically
        alignItems: "center", // Center content horizontally
        marginRight: 20, // Adds space between the left and right child
    },
    barpic: {
        resizeMode: "contain",
        width: "120%",
    },
    eventTopRight: {
        height: "85%",
        width: "63%",
        padding: "1%",
        flexDirection: "column", // Aligns its children vertically
        justifyContent: "flex-start", // Center content vertically
        alignItems: "flex-start",
    },
    nestedChild: {
        height: "55%",
        width: "100%",
        justifyContent: "space-evenly", // Center content vertically
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    nestedChild1: {
        height: "45%",
        width: "100%",
        justifyContent: "space-evenly", // Center content vertically
    },
    profilePic: {
        width: "40%", // Specify the width
        height: "65%", // Specify the height
        borderRadius: "100%", // Half the width/height to make the image circular
        borderWidth: 1.5, // Optional, adds a border
        borderColor: "#000", // Optional, sets the border color
    },
    upcomingEvents: {
        width: "70%", // Specify the width
        height: "70%", // Specify the height
        resizeMode: "contain",
    },
    topContainer: {
        width: "90%",
        height: "6%",
        marginTop: "15%",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    leftGroup: {
        flexDirection: "row", // Stack children vertically within the group
        alignItems: "center",
        width: "40%",
    },
    rightChild: {
        flexDirection: "row", // Stack children vertically within the group
        alignItems: "center",
        width: "10%",
        height: "90%",
        margin: "0%",
        justifyContent: "center", // Center content vertically
        alignItems: "center", // Center content horizontally
    },
    spacer: {
        flex: 1, // Takes all available space, pushing the right child to the border
    },
    logoTextContainer: {
        flexDirection: "row",
    },
    logoLetter: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.04,
        fontWeight: "bold",
    },
    titleText: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.06,
        fontWeight: "bold",
    },
    fontBold: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.025,
        fontWeight: "bold",
    },
    fontNormal: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.019,
    },
    fontNormal1: {
        fontFamily: "Dongle",
        fontSize: screenHeight * 0.025,
        color: "black",
    },
    fontSmall: {
        justifyContent: "center",
        fontFamily: "Dongle",
        fontSize: screenHeight * 0.02,
    },
    usernameFont: {
        marginTop: "1.5%",
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.024,
        fontWeight: "bold",
        color: "white",
    },
    logoSpace: {
        fontSize: screenHeight * 0.006,
    },
    bottomBar: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: screenHeight * 0.1,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "black",
    },
});

export default EventCreate;