import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {supabase} from '../supabase';
import Icon from "react-native-vector-icons/EvilIcons"; // Import EvilIcons
import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// inputs: photo, desc, loc, date&time start, date&time end, title
// store later: eventid, attendees, owner


const EventCreate = ({navigation}) => {

    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [loc, setLoc] = useState('');

    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [timeStart, setTimeStart] = useState(new Date());
    const [timeEnd, setTimeEnd] = useState(new Date());
    

    const handleSubmit = async () => {
        if (!description) {
            Alert.alert("Uhoh", "Description cannot be empty!")
            return;
        }
        if (!title) {
            Alert.alert("Uhoh", "Title cannot be empty!")
            return;
        }
        if (!loc) {
            Alert.alert("Uhoh", "Location cannot be empty!")
            return;
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            Alert.alert("Uhoh", "You need to be signed in to create an event!");
            return;
        }


        const startDateTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), 
        dateStart.getDate(), timeStart.getHours(), timeStart.getMinutes());
        const endDateTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), 
        dateEnd.getDate(), timeEnd.getHours(), timeEnd.getMinutes());

        if (startDateTime >= endDateTime) {
            Alert.alert("Uhoh", "Start date/time must be before end date/time!");
            return;
        }

        const startDateTimeTz = startDateTime.toISOString();
        const endDateTimeTz = endDateTime.toISOString();

        setLoading(true);
       

        const { data, error } = await supabase
        .from('events')
        .insert([
            { start_time: startDateTimeTz, end_time: endDateTimeTz, title: title, 
                description: description, location:loc , image_url: null, participants: [], owner: user.id},
        ]);
        setLoading(false);
        
        if (error) {
            Alert.alert("Uhoh", error.message);
            return;
        }

        // If there's no error go to... Discover page? idk can change later
        navigation.navigate("Discover");

    }

    const handleProfile = () => {
        navigation.navigate("Profile");
      };
    const handleDiscover = () => {
        navigation.navigate("Discover");
    };
    const handlePrompts = () => {
        navigation.navigate("Prompts");
    };
    const handleEventEdit = () => {
        navigation.navigate("EventEdit");
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




    return(
        <LinearGradient
      colors={["#A8D0F5", "#D0B4F4"]}
      style={styles.loginContainer}
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
      
      
        
        <View style={styles.bottomBar}>
        <View style={styles.bar}>
          <Pressable onPress={handleEventEdit}>
            <Icon name="sc-telegram" size={40} color="#000" />
          </Pressable>
          <Pressable onPress={handlePrompts}>
            <Icon name="bell" size={40} color="#000" />
          </Pressable>
          <Pressable onPress={handleDiscover}>
            <Icon name="location" size={40} color="#000" />
          </Pressable>
          <Pressable onPress={handleProfile}>
            <Icon name="user" size={40} color="#000" />
          </Pressable>
        </View>
      </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    dateTitle: {
        marginRight: 10,
        fontSize: screenHeight * 0.04,
        fontFamily: "Dongle-Bold",
    },
    imageContainer: {
        width: screenWidth * 0.75,
        margin: screenWidth * 0.05,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        zIndexL: "-1000"
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
    loginContainer: {
        flex: 3,
        alignItems: "center",
        backgroundColor: "#A8D0F5",
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